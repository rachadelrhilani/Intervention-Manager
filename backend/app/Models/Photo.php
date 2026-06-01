<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    use HasFactory;

    protected $table = 'photos';

    protected $fillable = [
        'rapport_id', 'url', 'legende', 'type'
    ];

    // Relations
    public function rapport()
    {
        return $this->belongsTo(Rapport::class);
    }
}