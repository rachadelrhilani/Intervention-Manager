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

    public function storeTicket(array $data, int $demandeurId): Ticket
    {
        // Preparation des données obligatoires
        $data['demandeur_id'] = $demandeurId;
        $data['etat'] = 'Ouvert';
        $data['origine'] = 'UtilisateurDirect';

        // etape de base : enregistrement en BDD
        $ticket = $this->ticketRepository->create($data);

        // PHASE 4 EN AVANCE :
        // $this->automationEngine->applyRules($ticket);
        // $this->llmAgentService->analyzeAndRoute($ticket);

        return $ticket;
    }
}