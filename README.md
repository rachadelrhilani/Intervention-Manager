# 🛠️ Intervention Manager (IntervManager)

Application complète de gestion et de suivi des interventions techniques et tickets de support, conçue avec une architecture découplée **Backend (Laravel)** et **Frontend (React + Vite)**.

---

## 📌 Sommaire

- [Présentation](#-présentation)
- [Fonctionnalités Principales](#-fonctionnalités-principales)
- [Architecture & Structure du Projet](#-architecture--structure-du-projet)
- [Stack Technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation & Démarrage](#-installation--démarrage)
  - [1. Backend (Laravel)](#1-backend-laravel)
  - [2. Frontend (React + Vite)](#2-frontend-react--vite)
- [Commandes Utiles](#-commandes-utiles)
- [Aperçu de l'API](#-aperçu-de-lapi)
- [Licence](#-licence)

---

## 📖 Présentation

**Intervention Manager** permet de fluidifier la gestion du support technique et des interventions d'une organisation à travers trois profils d'utilisateurs distincts :

1. **Demandeur (Client)** : Déclare et suit ses incidents ou demandes d'intervention.
2. **Traiteur (Technicien)** : Reçoit les tickets assignés, communique avec le demandeur, résout l'intervention ou l'escalade à un confrère.
3. **Gestionnaire (Administrateur)** : Supervise les KPIs, gère les utilisateurs et techniciens, et configure les règles et accords de niveau de service (**SLA**).

---

## ✨ Fonctionnalités Principales

### 👤 Espace Demandeur
- Tableau de bord personnalisé avec indicateurs clés (tickets en cours, résolus, en attente).
- Création et soumission simplifiée de tickets d'intervention.
- Consultation de l'historique et suivi du statut des demandes.
- Fil de discussion / commentaires en temps réel sur les tickets.

### 🔧 Espace Traiteur (Technicien)
- Boîte de réception personnelle (`Inbox`) des tickets à traiter.
- Interface de résolution dédiée : ajout de notes techniques, clôture du ticket, envoi de messages.
- Système d'**escalade** de tickets vers d'autres collègues techniciens.
- Statistiques personnelles de traitement et performance technique.

### 📊 Espace Gestionnaire (Manager / Admin)
- Dashboard global avec KPIs opérationnels (taux de résolution, respect SLA, charge de travail).
- Supervision globale de l'ensemble des tickets du système.
- Gestion des utilisateurs : activation/désactivation de comptes, création de comptes techniciens.
- Configuration et personnalisation des politiques **SLA** (délais de prise en charge et de résolution).

---

## 📁 Architecture & Structure du Projet

```text
IntervManager/
├── backend/                  # Application Backend (API REST Laravel)
│   ├── app/
│   │   ├── Http/Controllers/ # Contrôleurs (Auth, Ticket, Gestionnaire, Traiteur...)
│   │   ├── Models/           # Modèles Eloquent (Ticket, User, Sla, Commentaire...)
│   │   └── Middleware/       # Middlewares d'autorisation et rôles
│   ├── config/               # Fichiers de configuration
│   ├── database/
│   │   ├── migrations/       # Schémas et structures de la base de données
│   │   └── seeders/          # Données initiales (SLA, Traiteurs, Workflow...)
│   ├── routes/
│   │   └── api.php           # Définition des endpoints REST sécurisés par JWT
│   └── composer.json         # Dépendances et scripts PHP
│
├── Front-end/                # Application Frontend (SPA React)
│   ├── public/               # Ressources statiques (favicon, icônes SVG)
│   ├── src/
│   │   ├── components/       # Composants réutilisables (Navbar, Sidebar, Modals...)
│   │   ├── contexts/         # Contextes React (AuthContext, etc.)
│   │   ├── layouts/          # Gabarits de mise en page (DashboardLayout...)
│   │   ├── pages/            # Vues organisées par profil
│   │   │   ├── demandeur/    # ClientDashboard, CreateTicket, TicketsList, TicketDetail
│   │   │   ├── Traiteur/     # TechDashboard, TicketInbox, TicketResolve, EscaladeTicket
│   │   │   ├── gestionnaire/ # GestionnaireDashboard, UserManagement, SlaConfig...
│   │   │   ├── public/       # Home, Login, SignUp
│   │   │   └── shared/       # Profile, etc.
│   │   ├── services/         # Clients API HTTP (Axios)
│   │   ├── App.jsx           # Définition des routes et protections par rôle
│   │   └── main.jsx          # Point d'entrée de l'application React
│   ├── package.json          # Dépendances et scripts Node.js
│   └── vite.config.js        # Configuration du bundler Vite
│
└── README.md                 # Documentation du projet
```

---

## 💻 Stack Technique

| Domaine | Technologies |
| :--- | :--- |
| **Backend** | PHP 8.3+, Laravel 12, Authentification JWT (`php-open-source-saver/jwt-auth`), Laravel Sanctum |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React (icônes), React Router DOM v7 |
| **Visualisation** | Recharts (graphiques et statistiques des tableaux de bord) |
| **Base de données** | MySQL / MariaDB (ou SQLite pour les tests rapides) |
| **Environnement** | Laragon / XAMPP / Serveur Web local |

---

## ⚙️ Prérequis

Assurez-vous d'avoir installé sur votre machine :
- **PHP** >= 8.3 avec les extensions courantes (pdo_mysql, mbstring, openssl, tokenizer, etc.)
- **Composer** (gestionnaire de paquets PHP)
- **Node.js** >= 18.x & **npm**
- Un serveur MySQL (par exemple via **Laragon**)

---

## 🚀 Installation & Démarrage

### 1. Backend (Laravel)

1. Rendez-vous dans le dossier backend :
   ```bash
   cd backend
   ```

2. Installez les dépendances Composer :
   ```bash
   composer install
   ```

3. Configurez les variables d'environnement :
   ```bash
   cp .env.example .env
   ```
   *Éditez le fichier `.env` pour y renseigner vos identifiants de base de données (nom de la base, utilisateur, mot de passe).*

4. Générez la clé de l'application :
   ```bash
   php artisan key:generate
   ```

5. Générez la clé secrète JWT :
   ```bash
   php artisan jwt:secret
   ```

6. Exécutez les migrations et les seeders (données de test et rôles) :
   ```bash
   php artisan migrate --seed
   ```

7. Démarrez le serveur de développement :
   ```bash
   php artisan serve
   ```
   *L'API est accessible par défaut sur `http://127.0.0.1:8000`.*

---

### 2. Frontend (React + Vite)

1. Rendez-vous dans le dossier frontend :
   ```bash
   cd Front-end
   ```

2. Installez les dépendances npm :
   ```bash
   npm install
   ```

3. Démarrez le serveur de développement Vite :
   ```bash
   npm run dev
   ```
   *L'application web est accessible sur `http://localhost:5173`.*

---

## ⚡ Commandes Utiles

### Backend

| Commande | Description |
| :--- | :--- |
| `php artisan serve` | Lance le serveur local Laravel |
| `php artisan migrate` | Applique les migrations |
| `php artisan migrate:fresh --seed` | Réinitialise la base et charge les seeders |
| `php artisan route:list` | Affiche toutes les routes déclarées |
| `php artisan test` | Exécute la suite de tests unitaires et fonctionnels |

### Frontend

| Commande | Description |
| :--- | :--- |
| `npm run dev` | Lance le serveur de développement local avec rechargement à chaud (HMR) |
| `npm run build` | Compile l'application pour la production dans le dossier `dist/` |
| `npm run preview` | Prévisualise localement le build de production |
| `npm run lint` | Lance la vérification ESLint du code |

---

## 🔌 Aperçu de l'API

### Authentification publique
- `POST /api/register` : Inscription d'un nouvel utilisateur
- `POST /api/login` : Connexion et récupération du JWT
- `POST /api/logout` : Déconnexion
- `GET /api/me` : Données de l'utilisateur connecté

### Espace Demandeur (`role:demandeur`)
- `GET /api/client/dashboard` : Données agrégées du dashboard client
- `GET /api/client/tickets` : Liste des tickets créés par le client
- `POST /api/client/tickets` : Création d'un nouveau ticket
- `GET /api/client/tickets/{id}` : Consultation détaillée d'un ticket
- `GET|POST /api/client/tickets/{id}/commentaires` : Liste et ajout de commentaires

### Espace Traiteur (`role:traiteur`)
- `GET /api/traiteur/dashboard-stats` : Métriques du tableau de bord technicien
- `GET /api/traiteur/inbox` : Tickets assignés en attente
- `GET /api/traiteur/tickets/{id}` : Détails pour résolution
- `POST /api/traiteur/tickets/{id}/resolve` : Clôture et résolution du ticket
- `POST /api/traiteur/escalader` : Escalade du ticket à un autre technicien

### Espace Gestionnaire (`role:gestionnaire`)
- `GET /api/gestionnaire/dashboard-stats` : KPIs d'ensemble du centre de support
- `GET /api/gestionnaire/tickets` : Vue exhaustive de tous les tickets
- `GET /api/gestionnaire/utilisateurs` : Liste des utilisateurs
- `PATCH /api/gestionnaire/utilisateurs/{id}/toggle-status` : Activer/Désactiver un compte
- `POST /api/gestionnaire/utilisateurs/traiteurs` : Créer un compte technicien
- `GET|PUT /api/gestionnaire/sla` : Consultation et modification des règles SLA

---

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).
