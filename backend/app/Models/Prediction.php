<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prediction extends Model{
    protected $fillable = [
        'cible_prediction', // 'SLA', 'Traiteur', 'Priorite'
        'valeur_predite',
        'score_confiance',
        'ticket_id'
    ];

    public function ticket(){
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }
}