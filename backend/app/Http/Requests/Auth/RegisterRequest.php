<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête.
     */
    public function authorize(): bool
    {
        return true; // Autoriser tout le monde à s'inscrire publiquement
    }

    /**
     * Obtenir les règles de validation qui s'appliquent à la requête.
     */
    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed', // Requiert 'password_confirmation' côté React
            
            // Validation des champs spécifiques au Demandeur
            'service' => 'required|string|max:255',
            'type_demandeur' => 'required|string|in:Interne,Externe,CentreAppel',
            'telephone' => 'nullable|string|max:20',
        ];
    }

    /**
     * Personnalisation des messages d'erreur en français.
     */
    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom est obligatoire.',
            'email.required' => "L'adresse email est obligatoire.",
            'email.email' => "L'adresse email doit être valide.",
            'email.unique' => 'Cette adresse email est déjà utilisée.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins 6 caractères.',
            'password.confirmed' => 'Les deux mots de passe ne correspondent pas.',
            'service.required' => 'Le service de rattachement est obligatoire.',
            'type_demandeur.required' => 'Le type de demandeur est obligatoire.',
            'type_demandeur.in' => 'Le type doit être : Interne, Externe ou CentreAppel.',
        ];
    }

    /**
     * Formater les erreurs de validation en JSON propre pour votre Frontend React.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => 'error',
            'errors' => $validator->errors()
        ], 422));
    }
}