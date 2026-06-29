<?php

use App\Http\Controllers\CommentaireController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientDashboardController;
use App\Http\Controllers\GestionnaireController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TraiteurTicketController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['jwt.auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile/update', [AuthController::class, 'updateProfile']);
    Route::middleware(['role:demandeur'])->group(function () {
        // les routes des clients
        Route::get('/client/dashboard', ClientDashboardController::class);
        Route::get('/client/tickets', [TicketController::class, 'index']);
        Route::post('/client/tickets', [TicketController::class, 'store']);
        // Récupérer les détails d'un ticket spécifique (bloc de gauche de l'écran React)
        Route::get('/client/tickets/{id}', [TicketController::class, 'show']);
        Route::get('/client/tickets/{id}/commentaires', [CommentaireController::class, 'index']);
        Route::post('/client/tickets/{id}/commentaires', [CommentaireController::class, 'store']);
    });
    // les routes de traiteur

    Route::middleware(['role:traiteur'])->group(function () {
        Route::get('/traiteur/dashboard-stats', [TicketController::class, 'getTechDashboardStats']);
        Route::get('/traiteur/inbox', [TicketController::class, 'myInbox']);

        Route::get('/traiteur/tickets/{id}', [TicketController::class, 'getTicketForResolution']);
        Route::post('/traiteur/tickets/{id}/messages', [TicketController::class, 'sendTicketMessage']);
        Route::post('/traiteur/tickets/{id}/resolve', [TicketController::class, 'resolveTicket']);
        Route::put('/traiteur/tickets/{id}', [TicketController::class, 'updateTicket']);
        Route::delete('/traiteur/tickets/{id}', [TicketController::class, 'deleteTicket']);

        Route::get('/traiteur/mes-tickets', [TraiteurTicketController::class, 'getMesTickets']);
        Route::get('/traiteur/liste-collegues', [TraiteurTicketController::class, 'getListeCollegues']);
        Route::post('/traiteur/escalader', [TraiteurTicketController::class, 'escalader']);
    });

    Route::middleware(['role:gestionnaire'])->prefix('gestionnaire')->group(function () {
        // Route pour les statistiques du Dashboard (KPIs)
        Route::get('/dashboard-stats', [GestionnaireController::class, 'getDashboardStats']);

        // Route pour l'aperçu global des tickets
        Route::get('/tickets', [TicketController::class, 'getAllTickets']);

        Route::get('/utilisateurs', [GestionnaireController::class, 'getAllUsers']);
        Route::patch('/utilisateurs/{id}/toggle-status', [GestionnaireController::class, 'toggleStatus']);
        Route::post('/utilisateurs/traiteurs', [GestionnaireController::class, 'createTraiteur']);

        Route::get('/sla', [GestionnaireController::class, 'getSlaConfigs']);
        Route::put('/sla', [GestionnaireController::class, 'updateSlaConfigs']);
    });
});
