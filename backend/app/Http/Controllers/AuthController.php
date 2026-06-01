<?php
// app/Http/Controllers/AuthController.php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LogoutRequest;
use App\Services\Interfaces\AuthServiceInterface;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    protected AuthServiceInterface $authService;

    public function __construct(AuthServiceInterface $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $ip = $request->ip();
        $credentials = $request->validated();

        $result = $this->authService->login($credentials, $ip);

        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'data' => $result
        ]);
    }


    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $result = $this->authService->register($data);

        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie',
            'data' => $result
        ], 201);
    }


    public function logout(LogoutRequest $request): JsonResponse
    {
        $user = $request->user();
        
        $this->authService->logout($user);

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    public function refresh(): JsonResponse
    {
        $user = auth()->guard('api')->user();
        
        $result = $this->authService->refresh($user);

        return response()->json([
            'success' => true,
            'message' => 'Token rafraîchi avec succès',
            'data' => $result
        ]);
    }

    public function me(): JsonResponse
    {
        $user = auth()->guard('api')->user();
        
        $result = $this->authService->me($user);

        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }
}