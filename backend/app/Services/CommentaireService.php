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

        return $comments->map(function ($comment) {
            return [
                'id' => $comment->id,
                'texte' => $comment->contenu, 
                'auteur_nom' => $comment->auteur ? $comment->auteur->nom : 'Anonyme',
                'auteur_role' => $comment->auteur ? $comment->auteur->role : 'Client',
                'est_moi' => $comment->user_id === auth('api')->id(), 
                'created_at' => $comment->created_at->format('Y-m-d H:i')
            ];
        })->toArray();
    }

    public function addMessage(string $texte, int $ticketId, int $userId): Commentaire
    {
        return $this->commentaireRepository->create([
            // 💡 CORRECTION : On envoie la clé 'contenu' à la base de données
            'contenu' => $texte, 
            'ticket_id' => $ticketId,
            'user_id' => $userId
        ]);
    }
}