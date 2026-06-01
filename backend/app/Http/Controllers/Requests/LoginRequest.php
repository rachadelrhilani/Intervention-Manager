<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'mot_de_passe' => 'required|string|min:6'
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'L\'adresse email est requise',
            'email.email' => 'Format d\'email invalide',
            'mot_de_passe.required' => 'Le mot de passe est requis',
            'mot_de_passe.min' => 'Le mot de passe doit contenir au moins 6 caractères'
        ];
    }
}