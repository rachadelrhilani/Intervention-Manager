<?php

namespace App\Repositories;

use App\Models\SLA;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class GestionnaireRepository 
{
    /**
     * Compte global des tickets selon leur état actuel.
     */
    public function getTicketsCountByEtat(): array
    {
        return Ticket::select('etat', DB::raw('count(*) as total'))
            ->groupBy('etat')
            ->pluck('total', 'etat')
            ->toArray();
    }

    /**
     * Calcule le temps de résolution moyen en heures.
     */
    public function getAverageResolutionTime(): float
    {
        // Calcule la différence entre la création et la résolution réelle en heures
        $averageMinutes = Ticket::where('etat', 'Resolu')
            ->whereNotNull('date_resolution_reelle')
            ->select(DB::raw('AVG(TIMESTAMPDIFF(MINUTE, created_at, date_resolution_reelle)) as avg_time'))
            ->first()
            ->avg_time;

        return $averageMinutes ? round($averageMinutes / 60, 1) : 0.0;
    }

    /**
     * Récupère les derniers incidents triés par urgence.
     */
    public function getRecentCriticalTickets($limit = 5)
    {
        return Ticket::with(['procedure'])
            ->whereIn('etat', ['Ouvert', 'EnCours', 'Escalade'])
            ->orderBy('urgence', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }


   public function getAllUsers()
    {
        return User::select(
            'id', 
            'nom', 
            'email', 
            'role', 
            'specialite', 
            'niveau_traiteur', // Modifié
            'est_actif',  // Modifié (remplace ou s'ajoute à est_actif selon ton modèle)
            'tickets_traites',
            'temps_moyen_resolution'
        )
        ->where("role","!=","Gestionnaire")
        ->orderBy('created_at', 'desc')
        ->get();
    }

    public function getAllUsersPaginated(int $perPage = 10, string $search = '')
    {
        $query = User::select(
            'id', 
            'nom', 
            'email', 
            'role', 
            'specialite', 
            'niveau_traiteur',
            'est_actif',
            'tickets_traites',
            'temps_moyen_resolution',
            'created_at'
        )
        ->where('role', '!=', 'gestionnaire');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('specialite', 'like', '%' . $search . '%');
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Trouve un utilisateur spécifique par son identifiant.
     */
    public function findUserById(int $userId)
    {
        return User::findOrFail($userId);
    }

    /**
     * Insère un nouvel utilisateur dans la base de données.
     */
    public function createUser(array $data)
    {
        return User::create($data);
    }

    public function getSlaConfigurations()
    {
        return SLA::orderBy('priorite', 'asc')->get();
    }

    /**
     * Met à jour une règle selon la priorité
     */
    public function updateOrCreateSla(string $priorite, array $data)
    {
        return SLA::updateOrCreate(
            ['priorite' => $priorite],
            $data
        );
    }
}