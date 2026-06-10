<?php

namespace App\Services;

use App\Repositories\TicketRepository;

class DashboardService
{
    protected TicketRepository $ticketRepository;

    public function __construct(TicketRepository $ticketRepository)
    {
        $this->ticketRepository = $ticketRepository;
    }

    /**
     * Prepare toutes les données du tableau de bord d'un client.
     */
    public function getClientDashboardData(int $demandeurId): array
    {
        // recuperation des compteurs via le Repository
        $ouverts = $this->ticketRepository->countByEtat($demandeurId, 'Ouvert');
        $enCours = $this->ticketRepository->countByEtat($demandeurId, 'EnCours');
        $resolus = $this->ticketRepository->countTermines($demandeurId);

        // recuperation des tickets récents
        $tickets = $this->ticketRepository->getRecentByDemandeur($demandeurId, 5);

        // transformation et formatage des donnees
        $formattedTickets = $tickets->map(function ($ticket) {
            return [
                'id' => $ticket->id,
                'titre' => $ticket->titre,
                'priorite' => $ticket->priorite,
                'etat' => $ticket->etat,
                'created_at' => $ticket->created_at->format('Y-m-d H:i'),
            ];
        });

        return [
            'stats' => [
                'ouverts' => $ouverts,
                'enCours' => $enCours,
                'resolus' => $resolus
            ],
            'recentTickets' => $formattedTickets
        ];
    }
}