<?php
// app/Http/Requests/Auth/RegisterRequest.php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'telephone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6|confirmed',
            'nom_entreprise' => 'nullable|string|max:255',
            'numero_tva' => 'nullable|string|max:50',
            'contact_prefere' => 'nullable|in:email,telephone'
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom est requis',
            'email.required' => 'L\'adresse email est requise',
            'email.email' => 'Format d\'email invalide',
            'email.unique' => 'Cet email est déjà utilisé',
            'password.required' => 'Le mot de passe est requis',
            'password.min' => 'Le mot de passe doit contenir au moins 6 caractères',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas'
        ];
    }
}