<?php

namespace App\Repositories;

use App\Models\Commentaire;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TicketRepository
{

    public function getTechStats(int $techId): array
    {
        $ticketsResolus = Ticket::where('traiteur_id', $techId)
            ->where('etat', 'Resolu')
            ->count();

        $tempsMoyen = Ticket::where('traiteur_id', $techId)
            ->where('etat', 'Resolu')
            ->select(DB::raw('AVG(TIMESTAMPDIFF(MINUTE, created_at, updated_at)) as moyenne'))
            ->first()
            ->moyenne ?? 0;

        $ticketsAtemps = Ticket::where('traiteur_id', $techId)
            ->where('etat', 'Resolu')
            ->whereRaw('updated_at <= date_resolution_sla')
            ->count();

        $tauxSla = $ticketsResolus > 0
            ? round(($ticketsAtemps / $ticketsResolus) * 100, 1)
            : 100.0;

        $urgencesActives = Ticket::where('traiteur_id', $techId)
            ->where('priorite', 'P1')
            ->whereIn('etat', ['Ouvert', 'EnCours'])
            ->count();

        return [
            'tickets_resolus' => $ticketsResolus,
            'temps_moyen_resolution' => round($tempsMoyen),
            'taux_respect_sla' => $tauxSla,
            'urgents_actifs' => $urgencesActives,
        ];
    }

    public function getRecentResolvedTickets(int $techId, int $limit = 5)
    {
        return Ticket::where('traiteur_id', $techId)
            ->where('etat', 'Resolu')
            ->orderBy('updated_at', 'desc')
            ->limit($limit)
            ->get(['id', 'titre', 'priorite', 'updated_at']);
    }
    public function countByEtat(int $demandeurId, string $etat): int
    {
        return Ticket::where('demandeur_id', $demandeurId)
            ->where('etat', $etat)
            ->count();
    }


    public function countTermines(int $demandeurId): int
    {
        return Ticket::where('demandeur_id', $demandeurId)
            ->whereIn('etat', ['Resolu', 'Ferme'])
            ->count();
    }


    public function getAllByDemandeur(int $demandeurId): Collection
    {
        return Ticket::where('demandeur_id', $demandeurId)
            ->orderBy('created_at', 'desc')
            ->get(['id', 'titre', 'priorite', 'etat', 'created_at']);
    }


    public function getRecentByDemandeur(int $demandeurId, int $limit = 5): Collection
    {
        return Ticket::where('demandeur_id', $demandeurId)
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get(['id', 'titre', 'priorite', 'etat', 'created_at']);
    }

    public function findById(int $id): ?Ticket
    {
        return Ticket::with('traiteur:id,nom')->find($id);
    }

    public function create(array $data): Ticket
    {
        return Ticket::create($data);
    }


    public function getAssignedTicketsForTech(int $techId)
    {
        return Ticket::where('traiteur_id', $techId)
            ->whereIn('etat', ['Ouvert', 'EnCours', 'Escalade'])
            ->orderBy('priorite', 'asc')
            ->orderBy('date_resolution_sla', 'asc')
            ->get();
    }


    public function findtickById(int $id): Ticket
    {
        return Ticket::with(['procedure', 'predictions'])->findOrFail($id);
    }

    /**
     * Récupère le fil de discussion (commentaires) d'un incident.
     */
    public function getMessagesByTicketId(int $ticketId): array
    {
        $currentUserId = Auth::guard('api')->id();

        return Commentaire::with('auteur')
            ->where('ticket_id', $ticketId)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($com) use ($currentUserId) {
                return [
                    'id'          => $com->id,
                    'sender'      => $com->user_id === $currentUserId ? 'tech' : 'client',
                    'sender_name' => $com->auteur->nom ?? 'Utilisateur',
                    'text'        => $com->contenu,
                    'time'        => $com->created_at->format('H:i')
                ];
            })
            ->toArray();
    }

    /**
     * Génère la structure de la checklist depuis la colonne JSON 'etapes' du modèle Procedure.
     */
    public function getChecklistByTicketId(int $ticketId): array
    {
        $ticket = Ticket::with('procedure')->findOrFail($ticketId);

        if (!$ticket->procedure || !$ticket->procedure->etapes) {
            return [];
        }

        // 'etapes' est automatiquement converti en array PHP grâce au cast du modèle Procedure
        return collect($ticket->procedure->etapes)->map(function ($etapeText, $index) {
            return [
                'id'          => $index + 1,
                'text'        => $etapeText,
                'checked'     => false,
                'obligatoire' => true
            ];
        })->values()->all();
    }

    /**
     * Crée un nouveau commentaire en base de données.
     */
    public function createMessage(int $ticketId, int $userId, string $text): array
    {
        $com = Commentaire::create([
            'ticket_id' => $ticketId,
            'user_id'   => $userId,
            'contenu'   => $text
        ]);

        return [
            'id'     => $com->id,
            'sender' => 'tech',
            'text'   => $com->contenu,
            'time'   => $com->created_at->format('H:i')
        ];
    }

    /**
     * Fige le statut de l'incident et met à jour l'horodatage de résolution.
     */
    public function updateStatusToResolved(int $id): Ticket
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->etat = 'Resolu'; // Ajuste 'Resolu' ou 'Closed' selon l'enum de ta migration
        $ticket->date_resolution_reelle = now();
        $ticket->save();

        return $ticket;
    }

    public function getAllTicketsWithRelations($perPage = 15)
    {
        return Ticket::with(['procedure', 'predictions'])
            ->select('id', 'titre', 'type_demande', 'origine', 'priorite', 'etat', 'created_at', 'demandeur_id', 'traiteur_id')
            ->with([
                'demandeur' => function ($query) {
                    $query->select('id', 'nom');
                },
                'traiteur'  => function ($query) {
                    $query->select('id', 'nom');
                }
            ])
            ->withCount('commentaires')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
}
