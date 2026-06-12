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
        return Commentaire::with('auteur')
        ->where('ticket_id', $ticketId)
        ->orderBy('created_at', 'asc')
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