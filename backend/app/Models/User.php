<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable{
    use HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'nom',
        'email',
        'password',
        'est_actif',
        'role', // 'demandeur', 'traiteur', 'administrateur'

        // Champs Spécifiques : Demandeur
        'service',
        'type_demandeur', // Interne, Externe, CentreAppel
        'telephone',

        // Champs Spécifiques : Traiteur
        'specialite',
        'niveau_traiteur', // 1, 2, 3
        'tickets_traites',
        'temps_moyen_resolution',
        'est_disponible',

        // Champs Spécifiques : Administrateur
        'niveau_acces', // 1=Super, 2=Standard, 3=Lecture
        'droits',
        'logs_actions',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'est_actif' => 'boolean',
        'est_disponible' => 'boolean',
        'droits' => 'array',
        'logs_actions' => 'array',
        'dernier_connexion' => 'datetime',
    ];

    public function getJWTIdentifier() {
        return $this->getKey();
    }

    public function getJWTCustomClaims() {
        return ['role' => $this->role]; // On ajoute le rôle dans le token !
    }

    // --- RELATIONS ---

    // Association (1 à 0..*) : Un demandeur a plusieurs tickets
    public function ticketsCrees(){
        return $this->hasMany(Ticket::class, 'demandeur_id');
    }

    // Association (0..1 à 0..*) : Un traiteur s'occupe de plusieurs tickets
    public function ticketsAssignes(){
        return $this->hasMany(Ticket::class, 'traiteur_id');
    }

    // Dépendance (Admin crée des règles d'automatisation)
    public function reglesCrees(){
        return $this->hasMany(RegleAutomatisation::class, 'createur_id');
    }

    // --- SCOPES POUR SIMULER L'HÉRITAGE ---

    public function scopeDemandeurs($query){
        return $query->where('role', 'demandeur');
    }

    public function scopeTraiteurs($query){
        return $query->where('role', 'traiteur');
    }

    public function scopeAdministrateurs($query){
        return $query->where('role', 'administrateur');
    }
}
