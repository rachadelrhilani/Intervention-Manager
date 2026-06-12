<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\CommentaireService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CommentaireController extends Controller
{
    protected CommentaireService $commentaireService;

    public function __construct(CommentaireService $commentaireService)
    {
        $this->commentaireService = $commentaireService;
    }

    // GET /api/tickets/{id}/commentaires
    public function index(int $ticketId): JsonResponse
    {
        try {
            $messages = $this->commentaireService->getConversations($ticketId);
            return response()->json($messages, 200);
        } catch (\Throwable $e) {
            // 💡 On capture TOUTES les erreurs (SQL, PHP, syntaxe) et on les renvoie au Frontend
            return response()->json([
                'error' => true,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => array_slice($e->getTrace(), 0, 3) // Les 3 premières étapes du crash
            ], 500);
        }
    }

    // POST /api/tickets/{id}/commentaires
    public function store(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'texte' => 'required|string' // Ce que React envoie dans le corps de la requête
        ]);

        try {
            // auth('api')->id() garantit de récupérer l'ID utilisateur via le JWT
            $userId = auth('api')->id();

            $commentaire = $this->commentaireService->addMessage(
                $request->texte,
                $id,
                $userId
            );

            return response()->json([
                'status' => 'success',
                'commentaire' => $commentaire
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
