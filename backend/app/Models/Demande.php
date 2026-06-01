<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    use HasFactory;

    protected $table = 'demandes';

    protected $fillable = [
        'demandeur_id', 'categorie_id', 'equipement_id', 'site_id',
        'titre', 'description', 'priorite', 'statut', 'date_souhaitee'
    ];

    protected $casts = [
        'date_souhaitee' => 'datetime',
    ];

    // Relations
    public function demandeur()
    {
        return $this->belongsTo(User::class, 'demandeur_id');
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function equipement()
    {
        return $this->belongsTo(Equipement::class);
    }

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function intervention()
    {
        return $this->hasOne(Intervention::class, 'demande_id');
    }
}