<?php

namespace App\Http\Controllers;

use App\Services\TicketService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    protected TicketService $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
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
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
