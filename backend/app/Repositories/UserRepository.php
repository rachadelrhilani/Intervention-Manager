<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function create(array $data): User
    {
        return User::create($data);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }


    public function find(int $id): ?User
    {
        return User::find($id);
    }

    public function save(User $user): bool
    {
        return $user->save();
    }
    public function getUserFreshProfile(int $id): ?User
    {
        return User::select(
            'id', 'nom', 'email', 'role', 'est_actif', 'dernier_connexion',
            // Champs demandeur
            'service', 'type_demandeur', 'telephone',
            // Champs traiteur
            'specialite', 'niveau_traiteur', 'tickets_traites', 'temps_moyen_resolution', 'est_disponible',
            // Champs gestionnaire
            'niveau_acces', 'droits'
        )->find($id);
    }

    public function getAvailableTraiteursExcluding(INT $currentUserId)
    {
        return User::where('role', 'traiteur')
                   ->where('est_actif', true)
                   ->where('id', '!=', $currentUserId)
                   ->select('id', 'nom', 'specialite', 'niveau_traiteur')
                   ->get();
    }
}