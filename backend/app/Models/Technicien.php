<?php
// app/Models/Technicien.php

namespace App\Models;

class Technicien extends User
{
    protected $table = 'users';

    protected static function booted()
    {
        static::addGlobalScope('technicien', function ($query) {
            $query->where('role', 'technicien');
        });
    }

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->attributes['role'] = 'technicien';
    }

    // Relations spécifiques
    public function interventions()
    {
        return $this->belongsToMany(Intervention::class, 'intervention_technicien', 'technicien_id', 'intervention_id')
                    ->withPivot('role', 'heures_travaillees', 'statut_participation', 'motif_refus', 'date_refus', 'date_affectation')
                    ->withTimestamps();
    }

    public function participations()
    {
        return $this->hasMany(InterventionTechnicien::class, 'technicien_id');
    }
}