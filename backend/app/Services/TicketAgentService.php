<?php

namespace App\Services;

use App\Models\Ticket;
use App\Services\LLMService;
use Illuminate\Support\Facades\Log;

class TicketAgentService
{
    protected LLMService $llmService;

    public function __construct(LLMService $llmService)
    {
        $this->llmService = $llmService;
    }

    /**
     * Exécute l'agent de triage IA pour qualifier finement le ticket.
     */
    public function exécuterTriageAgent(Ticket $ticket): array
    {
        // 📜 Le Prompt Système de l'Agent
        $prompt = "
        Tu es un Agent IA expert en triage et dispatching de tickets de support informatique (ITSM Helpdesk).
        Ton rôle est d'analyser le ticket soumis et de générer une qualification technique précise sous format JSON.

        Voici le ticket à analyser :
        - Titre : {$ticket->titre}
        - Description : {$ticket->description}

        ---
        CONSIGNES DE SÉCURITÉ ET DE FORMATAGE :
        Tu dois répondre UNIQUEMENT avec un objet JSON respectant exactement la structure demandée.
        Pas de texte avant, pas de texte après, pas de balises markdown de type ```json. Juste le JSON brut.

        Structure attendue du JSON :
        {
            \"priorite\": \"Une valeur strictement restreinte à : Basse, Moyenne, Haute, Critique\",
            \"specialite_traiteur\": \"Une valeur strictement restreinte à : Infrastructure, Support Client, Réseau, Sécurité, Applications Métiers, Matériel\",
            \"explication\": \"Une phrase concise en français expliquant pourquoi tu as choisi cette priorité et ce traiteur.\"
        }

        ---
        RÈGLES MÉTIERS POUR LE CHOIX DE LA PRIORITÉ :
        - Critique : Incident majeur bloquant toute l'entreprise, un service de production critique ou un VIP.
        - Haute : Bloque un utilisateur dans son travail quotidien sans solution de contournement immédiate.
        - Moyenne : Problème gênant un utilisateur mais un contournement ou une solution alternative existe.
        - Basse : Demande d'information, suggestion d'amélioration, question ou bug cosmétique non bloquant.

        ---
        RÈGLES MÉTIERS POUR LA SPÉCIALITÉ DU TRAITEUR :
        - Infrastructure : Serveurs, Cloud, Virtualisation, Sauvegardes, Active Directory.
        - Support Client : Problème de poste utilisateur, configuration logicielle de base, messagerie Outlook.
        - Réseau : Wi-Fi, VPN, Commutateurs (Switches), Pare-feu (Firewall), lenteurs de connexion internet.
        - Sécurité : Suspicion de virus, Phishing, perte de mot de passe suspecte, gestion des droits sensibles.
        - Applications Métiers : ERP, Logiciel de Paie/Compta (Sage, Cegid), CRM.
        - Matériel : Imprimante en panne, écran cassé, problème physique de PC/Téléphone.
        - Électrique (OCP) : Problèmes sur armoires électriques, disjoncteurs, alimentations industrielles, variateurs de vitesse, moteurs électriques.
        - Mécanique (OCP) : Panne sur convoyeurs, broyeurs, pompes, réducteurs, maintenance préventive ou corrective d'équipements mécaniques.
        - Instrumentation & Contrôle (OCP) : Capteurs, régulateurs, automates (PLC), systèmes de contrôle-commande (SCADA), vannes automatiques.
        - Procédés & Production (OCP) : Anomalies sur chaîne de production, qualité produit, paramètres fours, ateliers de traitement du phosphate.
        - Logistique & Manutention (OCP) : Problèmes sur chariots élévateurs, quais de chargement, stockeurs, bandes transporteuses, gestion des stocks.
        ";

        // Appel du LLM configuré en mode JSON strict
        $reponseBrute = $this->llmService->genererJson($prompt);

        if (!$reponseBrute) {
            return $this->fallbackDefault();
        }

        // Nettoyage initial
        $reponseBrute = trim($reponseBrute);

        // Décodage du JSON
        $resultat = json_decode($reponseBrute, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            if (str_contains($reponseBrute, '"explication"')) {
                $reponseReparee = $reponseBrute . '"}"'; // Tente de fermer proprement la string et le JSON
                $resultat = json_decode($reponseReparee, true);
            }
        }

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($resultat)) {
            Log::error("Échec du décodage du JSON de l'Agent Triage. Réponse brute : " . $reponseBrute);
            return $this->fallbackDefault();
        }

        return [
            'priorite' => $resultat['priorite'] ?? 'Moyenne',
            'specialite_traiteur' => $resultat['specialite_traiteur'] ?? 'Support Client',
            'explication' => $resultat['explication'] ?? 'Analyse automatique par défaut.'
        ];
    }

    /**
     * Valeurs de secours sécurisées si l'IA échoue
     */
    private function fallbackDefault(): array
    {
        return [
            'priorite' => 'Moyenne',
            'specialite_traiteur' => 'Support Client',
            'explication' => 'Impossible de générer l\'analyse de l\'agent (Erreur de communication IA).'
        ];
    }
}
