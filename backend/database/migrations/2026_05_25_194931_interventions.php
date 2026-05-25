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
         Schema::create('interventions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('demande_id')->constrained()->onDelete('cascade');
            $table->foreignId('assignee_par')->constrained('users')->onDelete('set null');
            $table->datetime('debut_prevue');
            $table->datetime('fin_prevue');
            $table->datetime('debut_reelle')->nullable();
            $table->datetime('fin_reelle')->nullable();
            $table->enum('statut', ['planifiee', 'en_cours', 'en_attente_validation', 'terminee', 'annulee'])->default('planifiee');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interventions');
    }
};
