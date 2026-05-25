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
        Schema::create('demandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demandeur_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('categorie_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('equipement_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('site_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('titre');
            $table->text('description');
            $table->enum('priorite', ['basse', 'moyenne', 'haute', 'urgente'])->default('moyenne');
            $table->enum('statut', ['en_attente', 'affectee', 'en_cours', 'terminee', 'annulee', 'rejetee'])->default('en_attente');
            $table->datetime('date_souhaitee')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demandes');
    }
};
