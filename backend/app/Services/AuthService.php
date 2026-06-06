<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Exception;

class AuthService
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(array $data): array
    {
        $data['password'] = Hash::make($data['password']);
        
        $data['role'] = 'demandeur';
        $data['est_actif'] = true;

        $user = $this->userRepository->create($data);

        $token = Auth::guard('api')->login($user);

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    public function login(array $credentials): array
    {
        if (!$token = Auth::guard('api')->attempt($credentials)) {
            throw new Exception("Identifiants incorrects", 401);
        }

        $user = Auth::guard('api')->user();

        if (!$user->est_actif) {
            throw new Exception("Votre compte est désactivé", 403);
        }

        return [
            'user' => $user,
            'token' => $token
        ];
    }
}