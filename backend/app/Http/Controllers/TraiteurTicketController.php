<?php

namespace App\Http\Controllers;

use App\Services\TicketEscaladeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class TraiteurTicketController extends Controller
{
    protected TicketEscaladeService $escaladeService;

    public function __construct(TicketEscaladeService $escaladeService)
    {
        $this->escaladeService = $escaladeService;
    }

    /**
     * GET /api/traiteur/mes-tickets
     */
    public function getMesTickets(): JsonResponse
    {
        $data = $this->escaladeService->getEscaladeFormData(auth('api')->id());
        return response()->json([
            'status' => 'success',
            'data'   => $data['tickets']
        ]);
    }

    /**
     * GET /api/traiteur/liste-collegues
     */
    public function getListeCollegues(): JsonResponse
    {
        $data = $this->escaladeService->getEscaladeFormData(auth('api')->id());
        return response()->json([
            'status' => 'success',
            'data'   => $data['collegues']
        ]);
    }

    /**
     * POST /api/traiteur/escalader
     */
    public function escalader(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ticket_id'           => 'required|integer',
            'nouveau_traiteur_id' => 'required|integer',
            'motif'               => 'required|string|min:10|max:1000'
        ]);

        try {
            $this->escaladeService->escaladerIncident(
                $validated['ticket_id'],
                $validated['nouveau_traiteur_id'],
                $validated['motif'],
                auth('api')->id()
            );

            return response()->json([
                'status'  => 'success',
                'message' => 'L\'incident a été réorienté vers votre collaborateur avec succès.'
            ], 200);

        } catch (\Exception $e) {
            Log::warning("Échec d'escalade par l'utilisateur " . auth('api')->id() . " : " . $e->getMessage());
            
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 422);
        }
    }
}