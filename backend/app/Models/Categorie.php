<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $fillable = [
        'nom', 'description', 'icone', 'priorite_par_defaut', 'duree_estimee', 'est_active'
    ];

    protected $casts = [
        'est_active' => 'boolean',
        'duree_estimee' => 'integer',
    ];

    // Relations
    public function demandes()
    {
        return $this->hasMany(Demande::class);
    }

    public function interventions()
    {
        return $this->hasManyThrough(Intervention::class, Demande::class);
    }
}