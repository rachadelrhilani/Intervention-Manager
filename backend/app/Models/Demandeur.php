<?php
// app/Models/Demandeur.php

namespace App\Models;

class Demandeur extends User
{
    protected $table = 'users';

    protected static function booted()
    {
        static::addGlobalScope('demandeur', function ($query) {
            $query->where('role', 'demandeur');
        });
    }

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->attributes['role'] = 'demandeur';
    }

    // Relations spécifiques
    public function demandes()
    {
        return $this->hasMany(Demande::class, 'demandeur_id');
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'demandeur_id');
    }

    public function factures()
    {
        return $this->hasMany(Facture::class, 'demandeur_id');
    }
}