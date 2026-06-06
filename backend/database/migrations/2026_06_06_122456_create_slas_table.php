<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('slas', function (Blueprint $table) {
            $table->id();
            $table->enum('priorite', ['P1', 'P2', 'P3', 'P4']);
            $table->integer('delai_heures')->default(0);
            $table->integer('delai_minutes')->default(0);
            $table->enum('unite', ['Heures', 'Minutes']);
            $table->boolean('est_par_defaut')->default(false);
            $table->integer('seuil_notification'); // Pourcentage (ex: 80%)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slas');
    }
};
