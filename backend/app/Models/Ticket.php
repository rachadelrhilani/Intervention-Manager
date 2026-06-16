<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ticket extends Model{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'type_demande', // AvecProcedure, SansProcedure
        'origine', // CentreAppel, UtilisateurDirect
        'impact',
        'urgence',
        'priorite', // P1, P2, P3, P4
        'etat', // Ouvert, EnCours, Escalade, Resolu, Ferme
        'date_resolution_sla',
        'date_resolution_reelle',
        'demandeur_id',
        'traiteur_id',
        'procedure_id',
        'sla_id'
    ];

    protected $casts = [
        'date_resolution_sla' => 'datetime',
        'date_resolution_reelle' => 'datetime',
        'impact' => 'integer',
        'urgence' => 'integer',
    ];

    // --- RELATIONS ---

    // Association (1) : Appartient à un Demandeur
    public function demandeur(){
        return $this->belongsTo(User::class, 'demandeur_id')->where('role', 'demandeur');
    }

    // Association (0..1) : Peut être assigné à un Traiteur
    public function traiteur(){
        return $this->belongsTo(User::class, 'traiteur_id')->where('role', 'traiteur');
    }

    // Composition (1 à 1..*) : Un ticket possède ses commentaires (Suppression en cascade requise)
    public function commentaires(){
        return $this->hasMany(Commentaire::class, 'ticket_id');
    }

    // Association (1 à 1) : Lié à un SLA
    public function sla(){
        return $this->belongsTo(SLA::class, 'sla_id');
    }

    // Agrégation (1 à 0..1) : Peut contenir une procédure préétablie
    public function procedure(){
        return $this->belongsTo(Procedure::class, 'procedure_id');
    }
    public function predictions()
    {
        return $this->hasMany(Prediction::class, 'ticket_id');
    }

    // Association N:M (0..* à 0..*) : Lié à plusieurs règles d'automatisation
    public function reglesAutomatisation(){
        return $this->belongsToMany(RegleAutomatisation::class, 'regle_ticket', 'ticket_id', 'regle_id')
                    ->withTimestamps();
    }
}