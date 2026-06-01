<?php

namespace App\Services\Interfaces;

interface AuthServiceInterface
{
    public function login(array $credentials, string $ip);
    public function register(array $data);
    public function logout($user);
    public function refresh($user);
    public function me($user);
}