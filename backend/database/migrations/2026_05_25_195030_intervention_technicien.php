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
        Schema::create('intervention_technicien', function (Blueprint $table) {
            $table->id();
            $table->foreignId('intervention_id')->constrained()->onDelete('cascade');
            $table->foreignId('technicien_id')->constrained('users')->onDelete('cascade');
            $table->enum('role', ['principal', 'secondaire', 'suppleant'])->default('principal');
            $table->decimal('heures_travaillees', 5, 2)->nullable();
            $table->enum('statut_participation', ['confirme', 'absent', 'remplace'])->default('confirme');
            $table->string('motif_refus')->nullable(); // motif si refus
            $table->datetime('date_refus')->nullable();
            $table->datetime('date_affectation');
            $table->timestamps();
            $table->unique(['intervention_id', 'technicien_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('intervention_technicien');
    }
};
