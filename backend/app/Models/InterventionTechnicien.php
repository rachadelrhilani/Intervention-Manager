<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InterventionTechnicien extends Model
{
    use HasFactory;

    protected $table = 'intervention_technicien';

    protected $fillable = [
        'intervention_id', 'technicien_id', 'role', 'heures_travaillees',
        'statut_participation', 'motif_refus', 'date_refus', 'date_affectation'
    ];

    protected $casts = [
        'heures_travaillees' => 'decimal:2',
        'date_affectation' => 'datetime',
        'date_refus' => 'datetime',
    ];

    // Relations
    public function intervention()
    {
        return $this->belongsTo(Intervention::class);
    }

    public function technicien()
    {
        return $this->belongsTo(User::class, 'technicien_id');
    }
}