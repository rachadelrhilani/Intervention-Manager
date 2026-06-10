<?php

namespace App\Repositories;

use App\Models\Commentaire;
use Illuminate\Database\Eloquent\Collection;

class CommentaireRepository
{
    /**
     * Récupérer tous les commentaires d'un ticket avec les infos de l'auteur.
     */
    public function getByTicketId(int $ticketId): Collection
    {
        return Commentaire::where('ticket_id', $ticketId)
            ->with('user:id,nom,role') // Charge uniquement les colonnes nécessaires
            ->orderBy('created_at', 'asc') // Chronologique
            ->get();
    }

    /**
     * Inserer un nouveau commentaire.
     */
    public function create(array $data): Commentaire
    {
        return Commentaire::create($data);
    }
}