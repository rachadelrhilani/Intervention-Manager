<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rapport extends Model
{
    use HasFactory;

    protected $table = 'rapports';

    protected $fillable = [
        'intervention_id', 'description', 'travaux_effectues',
        'pieces_utilisees', 'duree_minutes', 'valide_par',
        'valide_le', 'motif_rejet'
    ];

    protected $casts = [
        'pieces_utilisees' => 'array',
        'valide_le' => 'datetime',
    ];

    // Relations
    public function intervention()
    {
        return $this->belongsTo(Intervention::class);
    }

    public function validePar()
    {
        return $this->belongsTo(User::class, 'valide_par');
    }

    public function photos()
    {
        return $this->hasMany(Photo::class, 'rapport_id');
    }
}