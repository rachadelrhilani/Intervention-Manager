<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Exception;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
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
}