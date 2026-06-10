<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CommentaireService;
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
        $messages = $this->commentaireService->getConversations($ticketId);
        return response()->json($messages, 200);
    }

    // POST /api/tickets/{id}/commentaires
    public function store(Request $request, int $ticketId): JsonResponse
    {
        $request->validate(['texte' => 'required|string']);

        $commentaire = $this->commentaireService->addMessage(
            $request->texte,
            $ticketId,
            auth('api')->id()
        );

        return response()->json(['status' => 'success', 'commentaire' => $commentaire], 201);
    }
}