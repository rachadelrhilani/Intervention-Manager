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
        // Préparation des données obligatoires
        $data['demandeur_id'] = $demandeurId;
        $data['etat'] = 'Ouvert';
        $data['origine'] = 'UtilisateurDirect';

        // Étape de base : Enregistrement en BDD
        $ticket = $this->ticketRepository->create($data);

        // 💡 PHASE 4 EN AVANCE :
        // $this->automationEngine->applyRules($ticket);
        // $this->llmAgentService->analyzeAndRoute($ticket);

        return $ticket;
    }
}