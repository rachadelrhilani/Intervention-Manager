<?php

namespace App\Services;

use App\Repositories\TicketRepository;
use App\Repositories\UserRepository;
use Exception;

class TicketEscaladeService
{
    protected TicketRepository $ticketRepository;
    protected UserRepository $userRepository;

    public function __construct(TicketRepository $ticketRepository, UserRepository $userRepository)
    {
        $this->ticketRepository = $ticketRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * Récupérer les données nécessaires à la page d'escalade.
     */
    public function getEscaladeFormData(int $currentUserId)
    {
        return [
            'tickets'   => $this->ticketRepository->getOpenTicketsByTraiteur($currentUserId),
            'collegues' => $this->userRepository->getAvailableTraiteursExcluding($currentUserId)
        ];
    }

    public function escaladerIncident($ticketId, $nouveauTraiteurId, $motif, $currentUserId)
    {
        // 1. Récupérer les tickets du traiteur actuel pour validation
        $tickets = $this->ticketRepository->getOpenTicketsByTraiteur($currentUserId);
        
        if (!$tickets->contains('id', $ticketId)) {
            throw new Exception("Action non autorisée : Ce ticket ne figure pas dans votre file d'attente.");
        }

        // 2. Récupérer l'instance du ticket pour modifier son état et son assignation
        $ticket = \App\Models\Ticket::find($ticketId);
        
        if (!$ticket) {
            throw new Exception("Le ticket ciblé est introuvable.");
        }

        // 3. Mise à jour des données (Assignation + Nouvel État Enum)
        $ticket->traiteur_id = $nouveauTraiteurId;
        $ticket->etat = 'Escalade'; // <-- Aligné sur ton nouvel enum !
        $ticket->save();

        // 4. Enregistrement de la trace d'audit / Commentaire
        $ticket->commentaires()->create([
            'user_id' => $currentUserId,
            'contenu' => "[ESCALADE] Ticket réassigné. État passé à 'Escalade'. Motif : " . $motif
        ]);

        return $ticket;
    }

    
}