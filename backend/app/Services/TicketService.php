<?php

namespace App\Services;

use App\Models\Prediction;
use App\Models\SLA;
use App\Repositories\TicketRepository;
use App\Models\Ticket;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TicketService
{
    protected TicketRepository $ticketRepository;
    protected TicketAgentService $agentService;
    protected AutomationService $automationService;

    public function __construct(TicketRepository $ticketRepository, TicketAgentService $agentService, AutomationService $automationService)
    {
        $this->ticketRepository = $ticketRepository;
        $this->agentService = $agentService;
        $this->automationService = $automationService;
    }

    public function getClientTicketsList(int $demandeurId): array
    {
        $tickets = $this->ticketRepository->getAllByDemandeur($demandeurId);

        return $tickets->map(function ($ticket) {
            return [
                'id' => $ticket->id,
                'titre' => $ticket->titre,
                'priorite' => $ticket->priorite,
                'etat' => $ticket->etat,
                'created_at' => $ticket->created_at->format('Y-m-d H:i'),
            ];
        })->toArray();
    }


    public function getTicketDetails(int $ticketId): array
    {
        $ticket = $this->ticketRepository->findById($ticketId);

        if (!$ticket) {
            throw new \Exception("Ticket introuvable", 404);
        }

        return [
            'id' => $ticket->id,
            'titre' => $ticket->titre,
            'description' => $ticket->description,
            'etat' => $ticket->etat,
            'priorite' => $ticket->priorite, // Sera calculé en Phase 4
            'traiteur_nom' => $ticket->traiteur ? $ticket->traiteur->nom : "Recherche d'agent..."
        ];
    }

    public function storeTicket(array $data, int $demandeurId): Ticket
    {
        return DB::transaction(function () use ($data, $demandeurId) {

            // 1. Assignation des valeurs initiales conformes aux types de la BDD
            $ticketData = [
                'titre' => $data['titre'],
                'description' => $data['description'],
                'demandeur_id' => $demandeurId,
                'origine' => 'UtilisateurDirect',
                'etat' => 'Ouvert',
                'urgence' => (int)$data['urgence_declaree'], // Attend un entier de 1 à 4
                'impact' => (int)$data['urgence_declaree'],  // Valeur temporaire (entier)
                'type_demande' => 'SansProcedure',           // Valeur par défaut de l'enum
            ];

            // 2. Insertion initiale pour obtenir l'ID
            /** @var Ticket $ticket */
            $ticket = $this->ticketRepository->create($ticketData);

            try {
                $qualificationIA = $this->agentService->exécuterTriageAgent($ticket);

                $this->logPrediction($ticket->id, 'Priorite', $qualificationIA['priorite']);
                $this->logPrediction($ticket->id, 'Traiteur', $qualificationIA['specialite_traiteur']);

                $codeSla = $this->mapperTexteVersCodeSla($qualificationIA['priorite']);

                $sla = SLA::where('priorite', $codeSla)->first();
                if (!$sla) {
                    $sla = SLA::where('est_par_defaut', true)->first();
                }

                $dateLimite = Carbon::now();
                if ($sla) {
                    $dateLimite->addHours($sla->delai_heures)->addMinutes($sla->delai_minutes);
                    $ticket->sla_id = $sla->id;
                } else {
                    $dateLimite->addDays(2); 
                }

                $ticket->priorite = $codeSla; 
                $ticket->impact = $this->mapperPrioriteVersInt($qualificationIA['priorite']); // Convertit en entier (1 à 4)
                $ticket->date_resolution_sla = $dateLimite;
                $traiteurId = $this->trouverTraiteurDisponible($qualificationIA['specialite_traiteur']);
                if ($traiteurId) {
                    $ticket->traiteur_id = $traiteurId;
                    $ticket->etat = 'EnCours';
                } else {
                    Log::warning("Aucun traiteur disponible immédiatement pour la spécialité : " . $qualificationIA['specialite_traiteur']);
                }

                $ticket->save();

                $this->automationService->lancerAutomatisation($ticket);

                $ticket->refresh();
                if ($ticket->procedure_id !== null) {
                    $ticket->update([
                        'type_demande' => 'AvecProcedure'
                    ]);
                }

                /* $this->injecterProceduresAutomatiques($ticket); */
            } catch (\Exception $e) {
                Log::error("Échec de l'automatisation globale pour le ticket #{$ticket->id} : " . $e->getMessage());
            }

            return $ticket;
        });
    }



    /**
     * Recherche le meilleur traiteur disponible selon la spécialité fournie par l'IA.
     * Gère les approximations de texte et les variantes d'écriture.
     */
    private function trouverTraiteurDisponible(string $specialiteIa): ?int
    {
        $specialiteNettoyee = trim(str_replace('(OCP)', '', $specialiteIa));
        $specialiteLower = mb_strtolower($specialiteNettoyee, 'UTF-8');

        $traiteur = User::where('role', 'traiteur')
            ->where('est_actif', true)
            ->where('est_disponible', true)
            ->where(function ($query) use ($specialiteLower) {
                $query->where('specialite', 'LIKE', '%' . $specialiteLower . '%')
                    ->orWhereRaw('LOWER(specialite) LIKE ?', ['%' . $specialiteLower . '%']);
            })
            ->orderBy('tickets_traites', 'asc') // Le moins chargé d'abord
            ->orderBy('temps_moyen_resolution', 'asc') // Le plus rapide ensuite
            ->first();

        if (!$traiteur) {
            $traiteur = User::where('role', 'traiteur')
                ->where('est_actif', true)
                ->where('est_disponible', true)
                ->whereIn('specialite', ['Support Client', 'Généraliste', 'Support'])
                ->orderBy('tickets_traites', 'asc')
                ->first();
        }

        return $traiteur ? $traiteur->id : null;
    }
    /**
     * Convertit le texte de l'IA ("Critique", "Haute"...) en code Enum BDD ('P1', 'P2'...)
     */
    private function mapperTexteVersCodeSla(string $prioriteIa): string
    {
        return match ($prioriteIa) {
            'Critique' => 'P1',
            'Haute'    => 'P2',
            'Moyenne'  => 'P3',
            'Basse'    => 'P4',
            default    => 'P3',
        };
    }

    /**
     * Convertit le texte de l'IA en entier (1 à 4) pour la colonne `impact`
     */
    private function mapperPrioriteVersInt(string $prioriteIa): int
    {
        return match ($prioriteIa) {
            'Critique' => 1,
            'Haute'    => 2,
            'Moyenne'  => 3,
            'Basse'    => 4,
            default    => 3,
        };
    }

    private function logPrediction(int $ticketId, string $cible, string $valeur, float $confiance = 0.90): void
    {
        Prediction::create([
            'ticket_id'        => $ticketId,
            'cible_prediction' => $cible,
            'valeur_predite'   => $valeur,
            'score_confiance'  => $confiance,
        ]);
    }


    /*   private function injecterProceduresAutomatiques(Ticket $ticket): void
    {
        if ($ticket->specialite_requise === 'Sécurité') {
            // $ticket->taches()->create(['titre' => 'Isoler le poste du réseau', 'statut' => 'À faire']);
            // $ticket->taches()->create(['titre' => 'Lancer une analyse antivirus approfondie', 'statut' => 'À faire']);
        }
    } */
}
