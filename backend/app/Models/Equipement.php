<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipement extends Model
{
    use HasFactory;

    protected $table = 'equipements';

    protected $fillable = [
        'site_id', 'nom', 'code', 'type', 'marque', 'modele',
        'date_achat', 'derniere_maintenance', 'statut'
    ];

    protected $casts = [
        'date_achat' => 'date',
        'derniere_maintenance' => 'date',
    ];

    // Relations
    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function demandes()
    {
        return $this->hasMany(Demande::class);
    }
}