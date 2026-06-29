<?php

namespace App\Services;

use App\Repositories\GestionnaireRepository;
use Illuminate\Support\Facades\Hash;

class GestionnaireService 
{
    protected GestionnaireRepository $gestionnaireRepository;

    public function __construct(GestionnaireRepository $gestionnaireRepository)
    {
        $this->gestionnaireRepository = $gestionnaireRepository;
    }

    /**
     * Structure les données clés pour le Dashboard du Gestionnaire.
     */
    public function getDashboardData(): array
    {
        $counts = $this->gestionnaireRepository->getTicketsCountByEtat();
        
        // Sécurité pour éviter les index indéfinis si un état n'existe pas encore en BDD
        $ouvert    = $counts['Ouvert'] ?? 0;
        $enCours   = $counts['EnCours'] ?? 0;
        $escalade  = $counts['Escalade'] ?? 0;
        $resolu    = $counts['Resolu'] ?? 0;
        $ferme     = $counts['Ferme'] ?? 0;

        $totalActifs = $ouvert + $enCours + $escalade;

        return [
            'kpis' => [
                'tickets_actifs'            => $totalActifs,
                'tickets_en_attente'        => $ouvert,
                'tickets_escalades'         => $escalade,
                'temps_resolution_moyen_h'  => $this->gestionnaireRepository->getAverageResolutionTime(),
            ],
            'repartition' => [
                'ouvert'   => $ouvert,
                'en_cours' => $enCours,
                'escalade' => $escalade,
                'resolu'   => $resolu,
                'ferme'    => $ferme
            ],
            'alertes' => $this->gestionnaireRepository->getRecentCriticalTickets(5)->map(function($ticket) {
                return [
                    'id'         => $ticket->id,
                    'titre'      => $ticket->titre,
                    'priorite'   => $ticket->priorite ?? 'P4',
                    'etat'       => $ticket->etat,
                    'procedure'  => $ticket->procedure->nom ?? 'Sans procédure réglementaire',
                    'cree_le'    => $ticket->created_at->format('d/m H:i')
                ];
            })
        ];
    }

    public function getUserList()
    {
        return $this->gestionnaireRepository->getAllUsers();
    }

    /**
     * Alterne le statut d'activation d'un utilisateur.
     */
    public function toggleUserActivation(int $userId)
    {
        $user = $this->gestionnaireRepository->findUserById($userId);
        
        // Inversion du booléen
        $user->est_actif = !$user->est_actif;
        $user->save();

        return $user;
    }

    /**
     * Valide et crée un profil Technicien (Traiteur).
     */
    public function registerTraiteur(array $data)
    {
        // Conversion du niveau string (L1, L2, L3) en entier (1, 2, 3)
        $niveauMapping = [
            'L1' => 1,
            'L2' => 2,
            'L3' => 3
        ];
        
        $niveauEntier = $niveauMapping[$data['niveau_competence']] ?? 1;

        $payload = [
            'nom'                     => $data['nom'],
            'email'                   => $data['email'],
            'password'                => Hash::make($data['password']),
            'role'                    => 'traiteur',
            'specialite'              => $data['specialite'],
            'niveau_traiteur'         => $niveauEntier, // Ton champ réel
            'est_disponible'          => true,          // Ton champ réel
            'tickets_traites'         => 0,             // Valeur par défaut explicite
            'temps_moyen_resolution'  => 0,             // Valeur par défaut explicite
        ];

        return $this->gestionnaireRepository->createUser($payload);
    }
    public function getSlaList()
    {
        return $this->gestionnaireRepository->getSlaConfigurations();
    }

    /**
     * Sauvegarde en adaptant les données à ton modèle Sla
     */
    public function saveSlaSettings(array $slaArray)
    {
        foreach ($slaArray as $slaItem) {
            // Exemple de calcul : si React envoie un temps de résolution global en minutes
            $totalMinutes = $slaItem['temps_resolution_minutes'] ?? 60;
            
            $heures = floor($totalMinutes / 60);
            $minutesRestantes = $totalMinutes % 60;

            $this->gestionnaireRepository->updateOrCreateSla($slaItem['priorite'], [
                'delai_heures'       => $heures,
                'delai_minutes'      => $minutesRestantes,
                'unite'              => $heures > 0 ? 'Heures' : 'Minutes',
                'seuil_notification' => $slaItem['seuil_notification'] ?? 15, // Seuil d'alerte avant retard
            ]);
        }

        return $this->getSlaList();
    }
}