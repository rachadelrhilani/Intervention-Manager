<?php

use App\Http\Controllers\CommentaireController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientDashboardController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['jwt.auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);
    // les routes des clients
    Route::get('/client/dashboard', ClientDashboardController::class);
    Route::get('/client/tickets', [TicketController::class, 'index']);
    Route::post('/client/tickets', [TicketController::class, 'store']);
    // Récupérer les détails d'un ticket spécifique (bloc de gauche de l'écran React)
    Route::get('/client/tickets/{id}', [TicketController::class, 'show']);
    Route::get('/client/tickets/{id}/commentaires', [CommentaireController::class, 'index']);
    Route::post('/client/tickets/{id}/commentaires', [CommentaireController::class, 'store']);
});
