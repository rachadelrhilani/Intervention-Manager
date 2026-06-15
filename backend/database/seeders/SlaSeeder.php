<?php

namespace Database\Seeders;

use App\Models\SLA;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SlaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $slas = [
            [
                'priorite' => 'P1', // Critique
                'delai_heures' => 2,
                'delai_minutes' => 0,
                'unite' => 'Heures',
                'est_par_defaut' => false,
                'seuil_notification' => 30, // Alerte 30 min avant échéance
            ],
            [
                'priorite' => 'P2', // Haute
                'delai_heures' => 8,
                'delai_minutes' => 0,
                'unite' => 'Heures',
                'est_par_defaut' => false,
                'seuil_notification' => 60, // Alerte 1 heure avant
            ],
            [
                'priorite' => 'P3', // Moyenne
                'delai_heures' => 24, // 1 jour
                'delai_minutes' => 0,
                'unite' => 'Heures',
                'est_par_defaut' => true, // C'est le SLA appliqué par défaut en cas d'imprévu
                'seuil_notification' => 120, // Alerte 2 heures avant
            ],
            [
                'priorite' => 'P4', // Basse
                'delai_heures' => 72, // 3 jours
                'delai_minutes' => 0,
                'unite' => 'Heures',
                'est_par_defaut' => false,
                'seuil_notification' => 240,
            ],
        ];

        foreach ($slas as $slaData) {
            // updateOrCreate évite les doublons si vous réexécutez le seeder
            SLA::updateOrCreate(
                ['priorite' => $slaData['priorite']], 
                $slaData
            );
        }
    }
}
