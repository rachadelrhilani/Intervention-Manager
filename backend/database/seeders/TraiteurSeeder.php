<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TraiteurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $traiteurs = [
            // --- TRAITEURS INFORMATIQUES (ITSM) ---
            [
                'nom' => 'Ahmed Alami',
                'email' => 'ahmed.alami@support.ma',
                'password' => Hash::make('password'),
                'est_actif' => true,
                'role' => 'traiteur',
                'specialite' => 'Support Client', // Fallback par défaut
                'niveau_traiteur' => 1,
                'tickets_traites' => 5,
                'temps_moyen_resolution' => 45,
                'est_disponible' => true,
            ],
            [
                'nom' => 'Youssef Benani',
                'email' => 'youssef.benani@support.ma',
                'password' => Hash::make('password'),
                'est_actif' => true,
                'role' => 'traiteur',
                'specialite' => 'Réseau',
                'niveau_traiteur' => 2,
                'tickets_traites' => 12,
                'temps_moyen_resolution' => 60,
                'est_disponible' => true,
            ],
            [
                'nom' => 'Sara Mansouri',
                'email' => 'sara.mansouri@support.ma',
                'password' => Hash::make('password'),
                'est_actif' => true,
                'role' => 'traiteur',
                'specialite' => 'Sécurité',
                'niveau_traiteur' => 3,
                'tickets_traites' => 3,
                'temps_moyen_resolution' => 120,
                'est_disponible' => true,
            ],
            [
                'nom' => 'Amine Tazi',
                'email' => 'amine.tazi@support.ma',
                'password' => Hash::make('password'),
                'est_actif' => true,
                'role' => 'traiteur',
                'specialite' => 'Infrastructure',
                'niveau_traiteur' => 2,
                'tickets_traites' => 8,
                'temps_moyen_resolution' => 90,
                'est_disponible' => true,
            ],

            // --- TRAITEURS INDUSTRIELS (OCP) ---
            [
                'nom' => 'Karim El Idrissi',
                'email' => 'k.elidrissi@ocp.ma',
                'password' => Hash::make('password'),
                'est_actif' => true,
                'role' => 'traiteur',
                'specialite' => 'Électrique', // Matchera avec "Électrique (OCP)"
                'niveau_traiteur' => 2,
                'tickets_traites' => 2,
                'temps_moyen_resolution' => 30,
                'est_disponible' => true,
            ],
            [
                'nom' => 'Rachid Amrani',
                'email' => 'r.amrani@ocp.ma',
                'password' => Hash::make('password'),
                'est_actif' => true,
                'role' => 'traiteur',
                'specialite' => 'Mécanique', // Matchera avec "Mécanique (OCP)"
                'niveau_traiteur' => 1,
                'tickets_traites' => 14,
                'temps_moyen_resolution' => 85,
                'est_disponible' => true,
            ],
            [
                'nom' => 'Khadija El Jafari',
                'email' => 'k.eljafari@ocp.ma',
                'password' => Hash::make('password'),
                'est_actif' => true,
                'role' => 'traiteur',
                'specialite' => 'Instrumentation & Contrôle', // Matchera avec "Instrumentation & Contrôle (OCP)"
                'niveau_traiteur' => 3,
                'tickets_traites' => 0, // Idéal pour recevoir le prochain ticket !
                'temps_moyen_resolution' => 40,
                'est_disponible' => true,
            ],
            [
                'nom' => 'Omar Chraibi',
                'email' => 'o.chraibi@ocp.ma',
                'password' => Hash::make('password'),
                'est_actif' => true,
                'role' => 'traiteur',
                'specialite' => 'Procédés & Production',
                'niveau_traiteur' => 2,
                'tickets_traites' => 9,
                'temps_moyen_resolution' => 110,
                'est_disponible' => true,
            ],
        ];

        foreach ($traiteurs as $traiteurData) {
            User::updateOrCreate(
                ['email' => $traiteurData['email']], // Évite les doublons sur l'email
                $traiteurData
            );
        }
    }
}