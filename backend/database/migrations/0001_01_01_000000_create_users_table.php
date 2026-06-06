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
         Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('email')->unique();
            $table->string('password');
            $table->boolean('est_actif')->default(true);
            $table->enum('role', ['demandeur', 'traiteur', 'administrateur']);
            $table->timestamp('dernier_connexion')->nullable();

            // Champs spécifiques : Demandeur
            $table->string('service')->nullable();
            $table->enum('type_demandeur', ['Interne', 'Externe', 'CentreAppel'])->nullable();
            $table->string('telephone')->nullable();

            // Champs spécifiques : Traiteur
            $table->string('specialite')->nullable();
            $table->integer('niveau_traiteur')->nullable(); // 1, 2, 3
            $table->integer('tickets_traites')->default(0);
            $table->integer('temps_moyen_resolution')->default(0); // En minutes
            $table->boolean('est_disponible')->default(true);

            // Champs spécifiques : Administrateur
            $table->integer('niveau_acces')->nullable(); // 1, 2, 3
            $table->json('droits')->nullable();
            $table->json('logs_actions')->nullable();

            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
