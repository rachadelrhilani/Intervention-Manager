<?php

namespace App\Http\Controllers;

use App\Services\AutomationService;
use App\Services\TicketService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    protected TicketService $ticketService;
    protected AutomationService $automationService;

    public function __construct(TicketService $ticketService,AutomationService $automationService)
    {
        $this->ticketService = $ticketService;
        $this->automationService = $automationService;
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


            $this->automationService->lancerAutomatisation($ticket);

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
}
