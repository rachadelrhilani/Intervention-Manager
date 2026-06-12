<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\RegleAutomatisation;
use Illuminate\Support\Str;

class AutomationService
{
    /**
     * Analyse un ticket créé pour lui assigner automatiquement sa procédure / checklist.
     */
    public function lancerAutomatisation(Ticket $ticket): void
    {
        // 1. On récupère les règles d'automatisation actives
        $regles = RegleAutomatisation::where('est_active', true)
            ->orderBy('priorite_execution', 'asc')
            ->get();

        // Chaîne de recherche cumulative (Titre + Description)
        $contenuTicket = Str::lower($ticket->titre . ' ' . $ticket->description);

        foreach ($regles as $regle) {
            $motCle = Str::lower($regle->condition);

            // 2. Moteur déterministe : Correspondance par mot-clé
            if (Str::contains($contenuTicket, $motCle)) {

                // 3. Si l'action demande d'injecter une checklist/procédure
                if ($regle->action === 'injecter_checklist' && is_array($regle->parametres)) {
                    
                    // On extrait l'ID de la procédure depuis le JSON de la règle
                    $procedureId = $regle->parametres['procedure_id'] ?? null;

                    if ($procedureId) {
                        // On associe directement la procédure au ticket
                        $ticket->update([
                            'procedure_id' => $procedureId
                        ]);
                    }
                }

                // 4. On écrit dans la table pivot 'regle_ticket' pour l'historique du cycle de vie
                $ticket->reglesAutomatisation()->attach($regle->id);

                // On stoppe l'exécution si on ne souhaite appliquer qu'une seule procédure par ticket
                break; 
            }
        }
    }
}