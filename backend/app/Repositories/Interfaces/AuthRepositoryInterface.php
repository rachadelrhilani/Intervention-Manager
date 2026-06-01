<?php

namespace App\Repositories\Interfaces;

interface AuthRepositoryInterface
{
    public function findByEmail(string $email);
    public function createUser(array $data);
    public function updateLastLogin(int $userId, string $ip);
}