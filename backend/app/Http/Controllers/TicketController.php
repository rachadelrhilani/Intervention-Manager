<?php

namespace App\Http\Controllers;

use App\Services\TicketService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TicketController extends Controller
{
    protected TicketService $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    // GET /api/client/tickets
    public function index(): JsonResponse
    {
        try {
            $user = Auth::guard('api')->user();
            $tickets = $this->ticketService->getClientTicketsList($user->id);

            return response()->json($tickets, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors du chargement des tickets.'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {


        // Validation rapide des entrées utilisateur
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'urgence_declaree' => 'required|integer|between:1,4',
        ]);

        try {
            $user = Auth::guard('api')->user();

            $ticket = $this->ticketService->storeTicket($validated, $user->id);

            return response()->json([
                'status' => 'success',
                'message' => 'Votre incident a été déclaré avec succès.',
                'ticket' => $ticket
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la création du ticket.'], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $ticketDetails = $this->ticketService->getTicketDetails($id);
            return response()->json($ticketDetails, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    public function myInbox(): JsonResponse
    {
        // Récupère l'ID du traiteur connecté via le token Sanctum / JWT
        $user = Auth::guard('api')->user();
        $techId = $user->id;

        $tickets = $this->ticketService->getTechInbox($techId);

        return response()->json([
            'status' => 'success',
            'data' => $tickets
        ]);
    }

    public function getTechDashboardStats(): JsonResponse
    {

        try {
            $user = Auth::guard('api')->user();

            // Sécurité : Vérifier si le token a bien fourni un utilisateur valide
            if (!$user) {
                Log::warning('Tentative d\'accès aux KPI traiteur sans utilisateur authentifié (User NULL)');
                return response()->json([
                    'status' => 'error',
                    'message' => 'Non authentifié ou jeton invalide.'
                ], 401);
            }

            $techId = $user->id;
            Log::info("Utilisateur authentifié identifié : ID #{$techId}, Nom: {$user->nom}, Rôle: {$user->role}");

            // 3. Appel de la couche Service (qui appelle le Repository)
            $data = $this->ticketService->getTechDashboardData($techId);

            Log::info("Statistiques calculées avec succès pour le traiteur #{$techId}");

            return response()->json([
                'status' => 'success',
                'data' => $data
            ], 200);
        } catch (Exception $e) {

            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur interne est survenue lors de la compilation des statistiques.',
                'error_debug' => $e->getMessage() // Optionnel : à retirer en production pour la sécurité
            ], 500);
        }
    }


    public function getTicketForResolution(int $id): JsonResponse
    {
        Log::info("--- Début de requête : getTicketForResolution pour l'ID #{$id} ---");
        try {
            $user = Auth::guard('api')->user();
            if (!$user) {
                Log::warning("Tentative d'accès anonyme au ticket #{$id}");
                return response()->json(['status' => 'error', 'message' => 'Accès refusé. Non authentifié.'], 401);
            }

            $data = $this->ticketService->getTicketDetailsForResolution($id);

            return response()->json([
                'status' => 'success',
                'data'   => $data
            ], 200);

        } catch (Exception $e) {
            Log::error("Erreur critique getTicketForResolution pour l'ID #{$id} : " . $e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => 'Une erreur interne est survenue lors de la récupération de l\'incident.'
            ], 500);
        }
    }

    /**
     * POST /api/traiteur/tickets/{id}/messages
     */
    public function sendTicketMessage(Request $request, $id): JsonResponse
    {
        Log::info("--- Début de requête : sendTicketMessage pour l'ID #{$id} ---");
        try {
            $user = Auth::guard('api')->user();
            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'Session expirée.'], 401);
            }

            $request->validate([
                'message' => 'required|string|max:1500'
            ]);

            $newMessage = $this->ticketService->storeTicketMessage(
                $id, 
                $user->id, 
                $request->input('message')
            );

            return response()->json([
                'status' => 'success',
                'data'   => ['message' => $newMessage]
            ], 201);

        } catch (Exception $e) {
            Log::error("Erreur critique sendTicketMessage sur l'ID #{$id} : " . $e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => 'Impossible de publier votre commentaire actuellement.'
            ], 500);
        }
    }

    /**
     * POST /api/traiteur/tickets/{id}/resolve
     */
    public function resolveTicket(Request $request, $id): JsonResponse
    {
        Log::info("--- Début de requête : resolveTicket pour l'ID #{$id} ---");
        try {
            $request->validate([
                'checklist' => 'required|array'
            ]);

            $this->ticketService->markTicketAsResolved($id, $request->input('checklist'));

            return response()->json([
                'status'  => 'success',
                'message' => 'L\'incident a été résolu et archivé avec succès.'
            ], 200);

        } catch (Exception $e) {
            Log::error("Erreur critique resolveTicket sur l'ID #{$id} : " . $e->getMessage());
            return response()->json([
                'status'  => 'error',
                'message' => 'Le système n\'a pas pu valider la clôture du dossier.'
            ], 500);
        }
    }
}
