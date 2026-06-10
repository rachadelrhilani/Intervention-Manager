<?php

namespace App\Services;

use App\Repositories\CommentaireRepository;
use App\Models\Commentaire;

class CommentaireService
{
    protected CommentaireRepository $commentaireRepository;

    public function __construct(CommentaireRepository $commentaireRepository)
    {
        $this->commentaireRepository = $commentaireRepository;
    }

    public function getConversations(int $ticketId): array
    {
        $comments = $this->commentaireRepository->getByTicketId($ticketId);

        // Formatage pour le frontend React
        return $comments->map(function ($comment) {
            return [
                'id' => $comment->id,
                'texte' => $comment->texte,
                'auteur_nom' => $comment->user->nom,
                'auteur_role' => $comment->user->role,
                'est_moi' => $comment->user_id === auth('api')->id(), // Permet à React d'aligner le message à droite ou à gauche
                'created_at' => $comment->created_at->format('Y-m-d H:i')
            ];
        })->toArray();
    }

    public function addMessage(string $texte, int $ticketId, int $userId): Commentaire
    {
        return $this->commentaireRepository->create([
            'texte' => $texte,
            'ticket_id' => $ticketId,
            'user_id' => $userId
        ]);
    }
}