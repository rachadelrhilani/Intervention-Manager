<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commentaire extends Model{
    protected $fillable = ['contenu', 'ticket_id', 'user_id'];

    // Retour au parent
    public function ticket(){
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }

    // Auteur du commentaire
    public function auteur(){
        return $this->belongsTo(User::class, 'user_id');
    }
}