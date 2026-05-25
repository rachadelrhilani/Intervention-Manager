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
            $table->string('telephone')->nullable();
            $table->string('mot_de_passe');
            $table->enum('role', ['demandeur', 'technicien', 'administrateur']);
            $table->boolean('est_actif')->default(true);
            
            // Champs spécifiques selon le rôle
            $table->string('nom_entreprise')->nullable(); // pour demandeur
            $table->string('numero_tva')->nullable(); // pour demandeur
            $table->enum('contact_prefere', ['email', 'telephone'])->nullable(); // pour demandeur
            
            $table->string('specialite')->nullable(); // pour technicien
            $table->date('date_embauche')->nullable(); // pour technicien
            $table->decimal('salaire', 10, 2)->nullable(); // pour technicien
            $table->boolean('est_disponible')->default(true); // pour technicien
            $table->decimal('latitude', 10, 8)->nullable(); // pour technicien
            $table->decimal('longitude', 11, 8)->nullable(); // pour technicien
            
            $table->boolean('est_super_admin')->default(false); // pour administrateur
            $table->string('derniere_ip_connexion')->nullable(); // pour administrateur
            
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
