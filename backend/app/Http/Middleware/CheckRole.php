<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Gère la sécurité des requêtes entrantes en filtrant par rôle.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!auth('api')->check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Non authentifié. Session expirée ou invalide.'
            ], 401);
        }

        $userRole = auth('api')->user()->role;

        if (!in_array($userRole, $roles)) {
            return response()->json([
                'status' => 'error',
                'message' => "Accès interdit. Votre rôle [{$userRole}] n'a pas les privilèges requis."
            ], 403);
        }

        return $next($request);
    }
}