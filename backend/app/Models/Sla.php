<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SLA extends Model{
    protected $table = 'slas';

    protected $fillable = [
        'priorite', // P1, P2, P3, P4
        'delai_heures',
        'delai_minutes',
        'unite', // Heures, Minutes
        'est_par_defaut',
        'seuil_notification'
    ];

    protected $casts = [
        'est_par_defaut' => 'boolean',
        'delai_heures' => 'integer',
        'delai_minutes' => 'integer',
        'seuil_notification' => 'integer',
    ];

    public function tickets(){
        return $this->hasMany(Ticket::class, 'sla_id');
    }
}