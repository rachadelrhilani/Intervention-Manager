<?php

namespace App\Services;

use App\Repositories\Interfaces\AuthRepositoryInterface;
use App\Services\Interfaces\AuthServiceInterface;
use Illuminate\Support\Facades\Auth;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthService implements AuthServiceInterface
{
    protected AuthRepositoryInterface $authRepository;

    public function __construct(AuthRepositoryInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    /**
     * Connexion utilisateur
     */
    public function login(array $credentials, string $ip): ?array
    {
        // Vérifier les identifiants
        if (!$token = Auth::guard('api')->attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password']
        ])) {
            return null;
        }

        // Récupérer l'utilisateur
        $user = Auth::guard('api')->user();

        // Vérifier si le compte est actif
        if (!$user->est_actif) {
            return null;
        }

        // Mettre à jour la dernière connexion
        $this->authRepository->updateLastLogin($user->id, $ip);

        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'email' => $user->email,
                'role' => $user->role,
                'telephone' => $user->telephone,
                'est_actif' => $user->est_actif
            ]
        ];
    }

    /**
     * Inscription d'un nouveau demandeur
     */
    public function register(array $data)
    {
        $userData = [
            'nom' => $data['nom'],
            'email' => $data['email'],
            'telephone' => $data['telephone'] ?? null,
            'password' => $data['password'],
            'role' => 'demandeur',
            'est_actif' => true,
            'nom_entreprise' => $data['nom_entreprise'] ?? null,
            'numero_tva' => $data['numero_tva'] ?? null,
            'contact_prefere' => $data['contact_prefere'] ?? 'email'
        ];

        $user = $this->authRepository->createUser($userData);

        // Générer un token pour l'utilisateur
        $token = JWTAuth::fromUser($user);

        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'email' => $user->email,
                'role' => $user->role,
                'telephone' => $user->telephone
            ]
        ];
    }

    /**
     * Déconnexion utilisateur
     */
    public function logout($user): bool
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Rafraîchir le token
     */
    public function refresh($user): array
    {
        $newToken = JWTAuth::refresh(JWTAuth::getToken());

        return [
            'access_token' => $newToken,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'email' => $user->email,
                'role' => $user->role
            ]
        ];
    }

    /**
     * Récupérer l'utilisateur connecté
     */
    public function me($user): array
    {
        return [
            'id' => $user->id,
            'nom' => $user->nom,
            'email' => $user->email,
            'telephone' => $user->telephone,
            'role' => $user->role,
            'est_actif' => $user->est_actif,
            'specialite' => $user->specialite,
            'est_disponible' => $user->est_disponible
        ];
    }
}