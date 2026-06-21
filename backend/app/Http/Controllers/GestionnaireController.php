<?php

namespace App\Http\Controllers;

use App\Services\GestionnaireService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class GestionnaireController extends Controller
{
    protected GestionnaireService $gestionnaireService;

    public function __construct(GestionnaireService $gestionnaireService)
    {
        $this->gestionnaireService = $gestionnaireService;
    }

    /**
     * GET /api/gestionnaire/dashboard-stats
     */
    public function getDashboardStats(): JsonResponse
    {
        Log::info("--- API Gestionnaire : Chargement des statistiques globales ---");
        try {
            // Optionnel : Tu peux revérifier ici si l'user connecté est bien un 'gestionnaire'
            if (auth('api')->user()->role !== 'gestionnaire') {
                return response()->json(['status' => 'error', 'message' => 'Action non autorisée pour ce rôle.'], 403);
            }

            $stats = $this->gestionnaireService->getDashboardData();

            return response()->json([
                'status' => 'success',
                'data'   => $stats
            ], 200);

        } catch (Exception $e) {
            Log::error("Erreur critique GestionnaireController : " . $e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => 'Impossible de compiler les données du rapport.'
            ], 500);
        }
    }
    public function getAllUsers(): JsonResponse
    {
        try {
            $users = $this->gestionnaireService->getUserList();
            
            return response()->json([
                'status' => 'success',
                'data'   => $users
            ], 200);
        } catch (\Exception $e) {
            Log::error("Erreur lister utilisateurs: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Impossible de récupérer les comptes.'], 500);
        }
    }

    /**
     * PATCH /api/gestionnaire/utilisateurs/{id}/toggle-status
     * Active ou désactive un profil.
     */
    public function toggleStatus(int $id): JsonResponse
    {
        try {
            // Sécurité : Empêcher le gestionnaire de se désactiver lui-même
            if (auth('api')->id() == $id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Opération interdite : vous ne pouvez pas suspendre votre propre compte.'
                ], 400);
            }

            $user = $this->gestionnaireService->toggleUserActivation($id);

            return response()->json([
                'status'  => 'success',
                'message' => 'Statut du compte mis à jour avec succès.',
                'data'    => ['id' => $user->id, 'est_actif' => $user->est_actif]
            ], 200);
        } catch (\Exception $e) {
            Log::error("Erreur modification statut utilisateur [{$id}]: " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Erreur lors du changement de statut.'], 500);
        }
    }

    /**
     * POST /api/gestionnaire/utilisateurs/traiteurs
     * Crée un compte Technicien après validation des contraintes.
     */
    public function createTraiteur(Request $request): JsonResponse
    {
        try {
            // Règles de validation strictes
            $validatedData = $request->validate([
                'nom'               => 'required|string|max:255',
                'email'             => 'required|string|email|max:255|unique:users,email',
                'password'          => 'required|string|min:6',
                'specialite'        => 'required|string',
                'niveau_competence' => ['required', Rule::in(['L1', 'L2', 'L3'])],
            ]);

            $traiteur = $this->gestionnaireService->registerTraiteur($validatedData);

            return response()->json([
                'status'  => 'success',
                'message' => 'Compte Technicien configuré et enregistré avec succès.',
                'data'    => [
                    'id'    => $traiteur->id,
                    'nom'   => $traiteur->nom,
                    'email' => $traiteur->email
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Données invalides ou email déjà utilisé.',
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error("Erreur création technicien : " . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Échec de l\'insertion en base de données.'], 500);
        }
    }
}
