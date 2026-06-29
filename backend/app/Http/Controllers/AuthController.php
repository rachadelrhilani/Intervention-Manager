<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use App\Services\ProfileService;
use Illuminate\Http\JsonResponse;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    protected AuthService $authService;
    protected ProfileService $profileService;

    public function __construct(AuthService $authService,ProfileService $profileService)
    {
        $this->authService = $authService;
        $this->profileService = $profileService;
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->register($request->validated());
            
            return response()->json([
                'status' => 'success',
                'message' => 'Inscription réussie',
                'user' => $result['user'],
                'access_token' => $result['token'],
                'token_type' => 'bearer'
            ], 201);
            
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login($request->validated());
            
            return response()->json([
                'status' => 'success',
                'user' => $result['user'],
                'access_token' => $result['token'],
                'token_type' => 'bearer'
            ], 200);
            
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }


    public function logout(): JsonResponse
    {
        try {
            // Déconnexion selon ton guard par défaut (marche pour Sanctum et JWT)
            if (Auth::check()) {
                // Si tu utilises Sanctum :
                // Auth::user()->currentAccessToken()->delete();
                
                // Si tu utilises JWT ou session classique :
                Auth::logout();
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Déconnexion réussie côté serveur'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la déconnexion : ' . $e->getMessage()
            ], 500);
        }
    }

    public function me(): JsonResponse
    {
        try {
            // Récupération de l'ID contenu dans le payload du token JWT
            $userId = auth('api')->id();

            // Appel de la couche Service
            $user = $this->profileService->getAuthenticatedUser($userId);

            return response()->json([
                'status' => 'success',
                'data'   => $user
            ], 200);

        } catch (\Exception $e) {
            Log::error("Erreur d'authentification sur /me : " . $e->getMessage());

            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 401); // 401 Unauthorized si le profil est introuvable
        }
    }


    public function updateProfile(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        // Validation des données entrantes
        $validated = $request->validate([
            'nom'              => 'required|string|max:255',
            'email'            => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'current_password' => 'nullable|string|required_with:new_password',
            'new_password'     => 'nullable|string|min:6|confirmed',
            'telephone'        => 'nullable|string|max:20', // Spécifique demandeur
        ]);

        try {
            // Appel de la couche Service
            $updatedUser = $this->profileService->updateProfile($user->id, $validated);

            return response()->json([
                'status'  => 'success',
                'message' => 'Profil mis à jour avec succès via la couche Service.',
                'data'    => $updatedUser
            ], 200);

        } catch (\Exception $e) {
            Log::error("Échec de la mise à jour du profil [ID: {$user->id}] : " . $e->getMessage());

            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 422); // Code 422 pour les erreurs métiers (ex: mauvais mot de passe actuel)
        }
    }
}