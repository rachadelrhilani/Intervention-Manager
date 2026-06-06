<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Procedure extends Model{
    protected $fillable = [
        'nom',
        'description',
        'etapes',
        'duree_estimee',
        'est_active'
    ];

    protected $casts = [
        'etapes' => 'array', // Convertit le tableau PHP en JSON en BDD automatiquement
        'est_active' => 'boolean',
        'duree_estimee' => 'integer'
    ];

    public function tickets(){
        return $this->hasMany(Ticket::class, 'procedure_id');
    }
}