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
        Schema::create('equipements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->string('code')->unique();
            $table->string('type');
            $table->string('marque')->nullable();
            $table->string('modele')->nullable();
            $table->date('date_achat')->nullable();
            $table->date('derniere_maintenance')->nullable();
            $table->enum('statut', ['operationnel', 'en_maintenance', 'en_panne'])->default('operationnel');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::dropIfExists('equipements');
    }
};
