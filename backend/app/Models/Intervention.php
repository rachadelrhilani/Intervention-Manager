<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Intervention extends Model
{
    use HasFactory;

    protected $table = 'interventions';

    protected $fillable = [
        'demande_id', 'assignee_par', 'debut_prevue', 'fin_prevue',
        'debut_reelle', 'fin_reelle', 'statut'
    ];

    protected $casts = [
        'debut_prevue' => 'datetime',
        'fin_prevue' => 'datetime',
        'debut_reelle' => 'datetime',
        'fin_reelle' => 'datetime',
    ];

    // Relations
    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }

    public function assignePar()
    {
        return $this->belongsTo(User::class, 'assignee_par');
    }

    public function techniciens()
    {
        return $this->belongsToMany(Technicien::class, 'intervention_technicien', 'intervention_id', 'technicien_id')
                    ->withPivot('role', 'heures_travaillees', 'statut_participation', 'motif_refus', 'date_refus', 'date_affectation')
                    ->withTimestamps();
    }

    public function participations()
    {
        return $this->hasMany(InterventionTechnicien::class, 'intervention_id');
    }

    public function rapport()
    {
        return $this->hasOne(Rapport::class, 'intervention_id');
    }

    public function evaluation()
    {
        return $this->hasOne(Evaluation::class);
    }

    public function facture()
    {
        return $this->hasOne(Facture::class);
    }
}