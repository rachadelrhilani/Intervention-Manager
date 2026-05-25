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
         Schema::create('factures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('intervention_id')->constrained()->onDelete('cascade');
            $table->foreignId('demandeur_id')->constrained('users')->onDelete('cascade');
            $table->decimal('montant_ht', 10, 2);
            $table->decimal('tva', 5, 2)->default(20);
            $table->decimal('montant_ttc', 10, 2);
            $table->enum('statut', ['en_attente', 'payee', 'annulee'])->default('en_attente');
            $table->string('url_pdf')->nullable();
            $table->date('date_echeance');
            $table->datetime('date_paiement')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('factures');
    }
};
