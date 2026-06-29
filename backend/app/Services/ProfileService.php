<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Exception;

class ProfileService
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Traite et met à jour les informations du profil.
     */
    public function updateProfile(int $userId, array $data)
    {
        $user = $this->userRepository->find($userId);

        if (!$user) {
            throw new Exception("Utilisateur introuvable.");
        }

        // 1. Gestion sécurisée du changement de mot de passe
        if (!empty($data['new_password'])) {
            if (!Hash::check($data['current_password'], $user->password)) {
                throw new Exception("Le mot de passe actuel est incorrect.");
            }
            $user->password = Hash::make($data['new_password']);
        }

        // 2. Mise à jour des champs communs
        $user->nom = $data['nom'];
        $user->email = $data['email'];

        // 3. Gestion des champs spécifiques selon le rôle
        if ($user->role === 'demandeur') {
            $user->telephone = $data['telephone'] ?? $user->telephone;
        }

        // 4. Persistance via le Repository
        $this->userRepository->save($user);

        return $user;
    }
    public function getAuthenticatedUser(int $userId)
    {
        $user = $this->userRepository->getUserFreshProfile($userId);

        if (!$user) {
            throw new Exception("Session utilisateur introuvable ou expirée.");
        }

        return $user;
    }
}