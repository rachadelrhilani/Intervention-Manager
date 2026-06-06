<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tache extends Model{
    protected $fillable = ['nom', 'description', 'ordre', 'regle_id'];

    public function regle(){
        return $this->belongsTo(RegleAutomatisation::class, 'regle_id');
    }
}