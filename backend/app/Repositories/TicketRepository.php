<?php

namespace App\Repositories;

use App\Models\Ticket;
use Illuminate\Database\Eloquent\Collection;

class TicketRepository
{
    /**
     * Compter les tickets d'un utilisateur selon un état précis.
     */
    public function countByEtat(int $demandeurId, string $etat): int
    {
        return Ticket::where('demandeur_id', $demandeurId)
            ->where('etat', $etat)
            ->count();
    }

    /**
     * Compter les tickets terminés (Résolus ou Fermés).
     */
    public function countTermines(int $demandeurId): int
    {
        return Ticket::where('demandeur_id', $demandeurId)
            ->whereIn('etat', ['Resolu', 'Ferme'])
            ->count();
    }

    /**
     * Récupérer les derniers tickets d'un demandeur.
     */
    public function getRecentByDemandeur(int $demandeurId, int $limit = 5): Collection
    {
        return Ticket::where('demandeur_id', $demandeurId)
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get(['id', 'titre', 'priorite', 'etat', 'created_at']);
    }
}