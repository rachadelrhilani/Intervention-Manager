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
        Schema::create('regle_automatisations', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('condition');
            $table->string('action');
            $table->json('parametres')->nullable();
            $table->boolean('est_active')->default(true);
            $table->integer('priorite_execution')->default(1);

            $table->foreignId('createur_id')->constrained('users'); // Administrateur
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('regle_automatisations');
    }
};
