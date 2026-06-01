<?php
// app/Repositories/AuthRepository.php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\AuthRepositoryInterface;

class AuthRepository implements AuthRepositoryInterface
{
    public function findByEmail(string $email)
    {
        return User::where('email', $email)->first();
    }

    public function createUser(array $data)
    {
        return User::create($data);
    }

    public function updateLastLogin(int $userId, string $ip)
    {
        return User::where('id', $userId)->update([
            'derniere_ip_connexion' => $ip,
            'last_login_at' => now()
        ]);
    }
}