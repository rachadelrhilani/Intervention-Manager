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
        Schema::create('tickets', function (Blueprint $table) {
             $table->id();
            $table->string('titre');
            $table->text('description');
            $table->enum('type_demande', ['AvecProcedure', 'SansProcedure']);
            $table->enum('origine', ['CentreAppel', 'UtilisateurDirect']);
            $table->integer('impact'); // 1 à 4
            $table->integer('urgence'); // 1 à 4
            $table->enum('priorite', ['P1', 'P2', 'P3', 'P4'])->nullable();
            $table->enum('etat', ['Ouvert', 'EnCours', 'Escalade', 'Resolu', 'Ferme'])->default('Ouvert');

            $table->dateTime('date_resolution_sla')->nullable();
            $table->dateTime('date_resolution_reelle')->nullable();

            // Clés Étrangères (Associations)
            $table->foreignId('demandeur_id')->constrained('users');
            $table->foreignId('traiteur_id')->nullable()->constrained('users');
            $table->foreignId('sla_id')->nullable()->constrained('slas');
            $table->foreignId('procedure_id')->nullable()->constrained('procedures')->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
