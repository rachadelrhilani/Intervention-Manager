<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    use HasFactory;

    protected $table = 'sites';

    protected $fillable = [
        'nom', 'adresse', 'ville', 'code_postal', 'latitude', 'longitude', 'telephone'
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    // Relations
    public function equipements()
    {
        return $this->hasMany(Equipement::class);
    }

    public function demandes()
    {
        return $this->hasMany(Demande::class);
    }
}