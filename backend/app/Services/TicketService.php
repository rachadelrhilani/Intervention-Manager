<?php

namespace App\Services;

use App\Repositories\TicketRepository;
use App\Models\Ticket;

class TicketService
{
    protected TicketRepository $ticketRepository;

    public function __construct(TicketRepository $ticketRepository)
    {
        $this->ticketRepository = $ticketRepository;
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

    public function storeTicket(array $data, int $demandeurId): Ticket
    {
        // 1. Assignation des valeurs fixes du workflow
        $ticketData = [
            'titre' => $data['titre'],
            'description' => $data['description'],
            'demandeur_id' => $demandeurId,
            'origine' => 'UtilisateurDirect',
            'etat' => 'Ouvert',
        ];

        // 2. Mapping du champ Urgence provenant de React vers la BDD
        $ticketData['urgence'] = $data['urgence_declaree'];

        // 3. Valeurs temporaires pour satisfaire les contraintes NOT NULL de la BDD
        // (Ces valeurs seront écrasées intelligemment par l'IA en Phase 4)
        $ticketData['impact'] = $data['urgence_declaree']; // Par défaut, on aligne l'impact initial sur l'urgence
        $ticketData['type_demande'] = 'SansProcedure'; // Initialisé sans procédure avant l'analyse de l'IA

        // 4. Envoi au Repository pour insertion sans erreur
        return $this->ticketRepository->create($ticketData);
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
}
