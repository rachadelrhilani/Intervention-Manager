<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientDashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function __invoke(): JsonResponse
    {
        try {
            // recuperation de l'utilisateur connecté via JWT
            $user = Auth::guard('api')->user();

            // Appel de la logique métier via le Service
            $data = $this->dashboardService->getClientDashboardData($user->id);

            return response()->json([
                'status' => 'success',
                'stats' => $data['stats'],
                'recentTickets' => $data['recentTickets']
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors du chargement des données du tableau de bord.'
            ], 500);
        }
    }
}
