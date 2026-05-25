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
        Schema::create('rapports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('intervention_id')->constrained()->onDelete('cascade');
            $table->text('description');
            $table->text('travaux_effectues');
            $table->json('pieces_utilisees')->nullable();
            $table->integer('duree_minutes')->nullable();
            $table->foreignId('valide_par')->nullable()->constrained('users')->onDelete('set null');
            $table->datetime('valide_le')->nullable();
            $table->text('motif_rejet')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rapports');
    }
};
