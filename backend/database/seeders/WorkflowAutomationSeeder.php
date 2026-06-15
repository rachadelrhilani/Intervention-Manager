<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Procedure;
use App\Models\RegleAutomatisation;
use App\Models\User;

class WorkflowAutomationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Récupération ou création de l'administrateur créateur
        $admin = User::where('role', 'administrateur')->first() ?? User::create([
            'nom' => 'Admin Système',
            'email' => 'admin.workflow@ocp.ma',
            'password' => bcrypt('password'),
            'role' => 'administrateur',
            'est_actif' => true,
            'niveau_acces' => 1
        ]);

        // ========================================================
        // 2. CONFIGURATION DES COUPLES (PROCÉDURES & RÈGLES)
        // ========================================================

        $catalogues = [
            // --- 1. INFRASTRUCTURE ---
            'infrastructure' => [
                'proc' => [
                    'nom' => 'Maintenance Infrastructure & Serveurs',
                    'desc' => 'Procédure d\'incident sur les serveurs, le cloud, la virtualisation ou Active Directory.',
                    'etapes' => ['Vérifier le statut de la machine virtuelle sur l\'hyperviseur', 'Inspecter les logs d\'événements système (Event Viewer / Syslog)', 'Vérifier l\'espace disque et l\'état de la RAM', 'Contrôler l\'état de la dernière sauvegarde'],
                    'duree' => 60
                ],
                'rules' => [
                    ['nom' => 'Détection Incident Serveur', 'cond' => 'serveur'],
                    ['nom' => 'Détection Incident Cloud/VM', 'cond' => 'cloud'],
                    ['nom' => 'Détection Incident Sauvegarde', 'cond' => 'sauvegarde']
                ]
            ],

            // --- 2. SUPPORT CLIENT ---
            'support_client' => [
                'proc' => [
                    'nom' => 'Assistance Support Client & Logiciel',
                    'desc' => 'Dépannage des applications bureautiques, messagerie Outlook et configuration poste de travail.',
                    'etapes' => ['Prendre la main à distance sur le poste utilisateur', 'Vérifier la configuration du profil de messagerie', 'Vider le cache de l\'application concernée', 'Tester l\'accès webmail de secours'],
                    'duree' => 20
                ],
                'rules' => [
                    ['nom' => 'Détection Problème Outlook', 'cond' => 'outlook'],
                    ['nom' => 'Détection Problème Messagerie', 'cond' => 'email'],
                    ['nom' => 'Détection Problème Logiciel', 'cond' => 'logiciel']
                ]
            ],

            // --- 3. RÉSEAU ---
            'reseau' => [
                'proc' => [
                    'nom' => 'Diagnostic Connectivité & Réseau',
                    'desc' => 'Résolution des pannes Wi-Fi, VPN, lenteurs ou déconnexions commutateurs/firewall.',
                    'etapes' => ['Lancer un ping et un traceroute vers la passerelle', 'Vérifier le statut du port sur le commutateur (Switch)', 'Analyser les règles de blocage sur le Pare-feu', 'Vérifier la session VPN de l\'utilisateur dans les logs'],
                    'duree' => 30
                ],
                'rules' => [
                    ['nom' => 'Détection Problème Wi-Fi', 'cond' => 'wi-fi'],
                    ['nom' => 'Détection Problème VPN', 'cond' => 'vpn'],
                    ['nom' => 'Détection Lenteur Réseau', 'cond' => 'connexion internet']
                ]
            ],

            // --- 4. SÉCURITÉ ---
            'securite' => [
                'proc' => [
                    'nom' => 'Isolation et Réponse Incident Sécurité',
                    'desc' => 'Mesures immédiates face à un virus, phishing ou compromission de compte.',
                    'etapes' => ['Isoler la machine suspecte du réseau', 'Forcer le changement de mot de passe Active Directory', 'Lancer un scan EDR/Antivirus approfondi', 'Analyser et bloquer l\'expéditeur du phishing'],
                    'duree' => 45
                ],
                'rules' => [
                    ['nom' => 'Alerte Virus / Malware', 'cond' => 'virus'],
                    ['nom' => 'Suspicion de Phishing', 'cond' => 'phishing'],
                    ['nom' => 'Compte Suspect / Bloqué', 'cond' => 'mot de passe']
                ]
            ],

            // --- 5. APPLICATIONS MÉTIERS ---
            'apps_metiers' => [
                'proc' => [
                    'nom' => 'Support Applications Métiers (ERP/CRM)',
                    'desc' => 'Dépannage sur les logiciels de gestion d\'entreprise (Sage, Cegid, ERP interne).',
                    'etapes' => ['Vérifier l\'état des services de la base de données de l\'ERP', 'Contrôler les droits d\'accès spécifiques de l\'utilisateur', 'Vérifier si le problème impacte un ou plusieurs utilisateurs', 'Contacter l\'éditeur/intégrateur si bug applicatif bloquant'],
                    'duree' => 40
                ],
                'rules' => [
                    ['nom' => 'Incident ERP', 'cond' => 'erp'],
                    ['nom' => 'Incident Sage/Cegid', 'cond' => 'sage'],
                    ['nom' => 'Problème CRM', 'cond' => 'crm']
                ]
            ],

            // --- 6. MATÉRIEL ---
            'materiel' => [
                'proc' => [
                    'nom' => 'Dépannage et Remplacement Matériel IT',
                    'desc' => 'Intervention physique sur les PC, écrans, téléphones ou imprimantes.',
                    'etapes' => ['Tester le matériel avec un autre câble d\'alimentation/vidéo', 'Vérifier l\'état de la garantie constructeur', 'Préparer un équipement de prêt pour l\'utilisateur', 'Créer un ticket de retour RMA pour réparation'],
                    'duree' => 30
                ],
                'rules' => [
                    ['nom' => 'Panne Imprimante', 'cond' => 'imprimante'],
                    ['nom' => 'Écran Cassé / HS', 'cond' => 'écran'],
                    ['nom' => 'Problème Physique PC', 'cond' => 'ordinateur']
                ]
            ],

            // --- 7. ÉLECTRIQUE (OCP) ---
            'electrique_ocp' => [
                'proc' => [
                    'nom' => 'Maintenance Électrique Industrielle OCP',
                    'desc' => 'Intervention sur les armoires électriques, disjoncteurs, variateurs et moteurs.',
                    'etapes' => ['Consigner l\'armoire électrique (Lockout/Tagout) pour sécurité', 'Prendre les mesures de tension et vérifier l\'absence de court-circuit', 'Contrôler l\'état des disjoncteurs et des fusibles', 'Inspecter les paramètres et codes défauts du variateur de vitesse'],
                    'duree' => 60
                ],
                'rules' => [
                    ['nom' => 'Panne Armoire Électrique', 'cond' => 'armoire électrique'],
                    ['nom' => 'Défaut Variateur de Vitesse', 'cond' => 'variateur'],
                    ['nom' => 'Surchauffe Moteur Électrique', 'cond' => 'moteur électrique']
                ]
            ],

            // --- 8. MÉCANIQUE (OCP) ---
            'mecanique_ocp' => [
                'proc' => [
                    'nom' => 'Maintenance Mécanique Équipements OCP',
                    'desc' => 'Dépannage des convoyeurs, broyeurs, pompes et réducteurs mécaniques.',
                    'etapes' => ['Sécuriser la zone d\'intervention autour de la machine', 'Vérifier l\'alignement et la tension des bandes/courroies', 'Inspecter les niveaux de lubrification et déceler d\'éventuelles fuites d\'huile', 'Contrôler l\'état d\'usure des roulements et engrenages'],
                    'duree' => 90
                ],
                'rules' => [
                    ['nom' => 'Blocage Convoyeur / Bande', 'cond' => 'convoyeur'],
                    ['nom' => 'Anomalie Broyeur', 'cond' => 'broyeur'],
                    ['nom' => 'Fuite / Panne Pompe', 'cond' => 'pompe']
                ]
            ],

            // --- 9. INSTRUMENTATION & CONTRÔLE (OCP) ---
            'instrumentation_ocp' => [
                'proc' => [
                    'nom' => 'Dépannage Instrumentation & Automatismes OCP',
                    'desc' => 'Intervention sur les capteurs, automates PLC, et systèmes SCADA.',
                    'etapes' => ['Vérifier la boucle de courant 4-20mA du capteur', 'Se connecter au programme de l\'automate (PLC) pour lire les défauts', 'Vérifier la communication réseau industriel (Modbus, Profinet)', 'Calibrer ou remplacer l\'instrumentation défaillante'],
                    'duree' => 45
                ],
                'rules' => [
                    ['nom' => 'Défaut Capteur', 'cond' => 'capteur'],
                    ['nom' => 'Arrêt Automate PLC', 'cond' => 'automate'],
                    ['nom' => 'Perte Supervision SCADA', 'cond' => 'scada']
                ]
            ],

            // --- 10. PROCÉDÉS & PRODUCTION (OCP) ---
            'procedes_ocp' => [
                'proc' => [
                    'nom' => 'Optimisation et Anomalie Procédés OCP',
                    'desc' => 'Analyse des dérives sur la chaîne de traitement du phosphate ou paramètres fours.',
                    'etapes' => ['Extraire les données de tendance (Trends) de l\'historien du procédé', 'Vérifier la conformité des paramètres thermiques du four', 'Effectuer un prélèvement pour analyse qualité en laboratoire', 'Ajuster les consignes de débit ou de température'],
                    'duree' => 120
                ],
                'rules' => [
                    ['nom' => 'Anomalie Chaîne Production', 'cond' => 'chaîne de production'],
                    ['nom' => 'Dérive Paramètres Four', 'cond' => 'four'],
                    ['nom' => 'Défaut Traitement Phosphate', 'cond' => 'phosphate']
                ]
            ],

            // --- 11. LOGISTIQUE & MANUTENTION (OCP) ---
            'logistique_ocp' => [
                'proc' => [
                    'nom' => 'Maintenance Logistique & Manutention OCP',
                    'desc' => 'Dépannage des chariots, quais de chargement et gestion physique des stocks.',
                    'etapes' => ['Vérifier l\'alimentation hydraulique ou électrique de l\'équipement', 'Contrôler les organes de sécurité et fins de course', 'Inspecter le système de guidage et les moteurs de translation', 'Valider la remise en service avec l\'opérateur logistique'],
                    'duree' => 50
                ],
                'rules' => [
                    ['nom' => 'Panne Chariot Élévateur', 'cond' => 'chariot'],
                    ['nom' => 'Dysfonctionnement Quai Chargement', 'cond' => 'quai'],
                    ['nom' => 'Blocage Bande Transporteuse', 'cond' => 'bande transporteuse']
                ]
            ],
        ];

        // ========================================================
        // 3. ENREGISTREMENT EN BASE DE DONNÉES
        // ========================================================
        
        $prioriteExecution = 1;

        foreach ($catalogues as $cle => $item) {
            // A. Création ou mise à jour de la Procédure
            $procedure = Procedure::updateOrCreate(
                ['nom' => $item['proc']['nom']],
                [
                    'description' => $item['proc']['desc'],
                    'etapes' => $item['proc']['etapes'],
                    'duree_estimee' => $item['proc']['duree'],
                    'est_active' => true,
                ]
            );

            // B. Création des Règles associées à cette procédure
            foreach ($item['rules'] as $ruleData) {
                RegleAutomatisation::updateOrCreate(
                    ['condition' => $ruleData['cond']], // Clé unique pour éviter les doublons
                    [
                        'nom' => $ruleData['nom'],
                        'action' => 'injecter_checklist',
                        'parametres' => ['procedure_id' => $procedure->id],
                        'est_active' => true,
                        'priorite_execution' => $prioriteExecution++,
                        'createur_id' => $admin->id,
                    ]
                );
            }
        }
    }
}