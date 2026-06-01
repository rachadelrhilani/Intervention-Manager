<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'nom', 'email', 'telephone', 'mot_de_passe', 'role',
        'est_actif', 'nom_entreprise', 'numero_tva', 'contact_prefere',
        'specialite', 'date_embauche', 'salaire', 'est_disponible',
        'latitude', 'longitude', 'est_super_admin', 'derniere_ip_connexion'
    ];

    protected $hidden = [
        'mot_de_passe', 'remember_token',
    ];

    protected $casts = [
        'est_actif' => 'boolean',
        'est_disponible' => 'boolean',
        'est_super_admin' => 'boolean',
        'date_embauche' => 'date',
    ];

    // Relations
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'utilisateur_id');
    }

    public function demandes()
    {
        return $this->hasMany(Demande::class, 'demandeur_id');
    }

    public function interventionsTechnicien()
    {
        return $this->hasMany(InterventionTechnicien::class, 'technicien_id');
    }

    public function interventionsAssignee()
    {
        return $this->hasMany(Intervention::class, 'assignee_par');
    }

    public function validationsRapport()
    {
        return $this->hasMany(Rapport::class, 'valide_par');
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