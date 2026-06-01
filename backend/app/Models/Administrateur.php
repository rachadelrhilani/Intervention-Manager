<?php

namespace App\Models;

class Administrateur extends User
{
    protected $table = 'users';

    protected static function booted()
    {
        static::addGlobalScope('administrateur', function ($query) {
            $query->where('role', 'administrateur');
        });
    }

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->attributes['role'] = 'administrateur';
    }

    public function interventionsAssignees()
    {
        return $this->hasMany(Intervention::class, 'assignee_par');
    }

    public function rapportsValides()
    {
        return $this->hasMany(Rapport::class, 'valide_par');
    }
}