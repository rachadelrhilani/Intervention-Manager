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
        $regles = RegleAutomatisation::where('est_active', true)
            ->orderBy('priorite_execution', 'asc')
            ->get();

        $contenuTicket = Str::lower($ticket->titre . ' ' . $ticket->description);

        foreach ($regles as $regle) {
            $motCle = Str::lower($regle->condition);

            if (Str::contains($contenuTicket, $motCle)) {

                if ($regle->action === 'injecter_checklist' && is_array($regle->parametres)) {
                    
                    // On extrait l'ID de la procédure depuis le JSON de la règle
                    $procedureId = $regle->parametres['procedure_id'] ?? null;

                    if ($procedureId) {
                        $ticket->update([
                            'procedure_id' => $procedureId
                        ]);
                    }
                }

                $ticket->reglesAutomatisation()->attach($regle->id);

                break; 
            }
        }
    }
}