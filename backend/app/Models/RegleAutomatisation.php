<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegleAutomatisation extends Model{
    protected $table = 'regle_automatisations';

    protected $fillable = [
        'nom',
        'condition',
        'action',
        'parametres',
        'est_active',
        'priorite_execution',
        'createur_id'
    ];

    protected $casts = [
        'parametres' => 'array',
        'est_active' => 'boolean',
        'priorite_execution' => 'integer'
    ];

    public function createur(){
        return $this->belongsTo(User::class, 'createur_id')->where('role', 'administrateur');
    }

    public function taches(){
        return $this->hasMany(Tache::class, 'regle_id');
    }

    public function tickets(){
        return $this->belongsToMany(Ticket::class, 'regle_ticket', 'regle_id', 'ticket_id')
                    ->withTimestamps();
    }
}