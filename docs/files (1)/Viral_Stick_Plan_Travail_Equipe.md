Viral Stick — Plan de travail d'équipe	KERNEL FORGE

**PLAN DE TRAVAIL D****'****ÉQUIPE**

**VIRAL STICK**

*TP ICT202 — Générateur de Mèmes Multimodal — Sprint d**'**équipe (7 jours)*

Chef d'équipe : NGHOMSI FEUKOUO Ravel (« Archlord »)

Équipe : 8 membres — Université de Yaoundé I, ICT202

Date : 20 juin 2026

*Version 1.0 — Document de répartition des rôles, à diffuser à l**'**équipe*

# Table des matières

# 1. Objet du document

Ce document définit l'organisation de l'équipe de 8 personnes pour le sprint TP ICT202 (Générateur de Mèmes Multimodal — Viral Stick), conformément au cahier des charges déjà validé. Il précise : qui fait quoi, quel fichier/dossier chaque personne touche dans l'arborescence du projet, et le planning jour par jour sur la durée du TP (1 semaine).

Le périmètre couvert correspond au Lot 1 (MVP académique) défini dans le cahier des charges : Context Reader, Voice-to-Meme, Status Remixer (fonctionnalités Core), plus les bonus si le temps le permet. Les fonctionnalités étendues (forum, classement, panel admin, etc.) restent hors du périmètre de ce sprint.

# 2. Organisation de l'équipe (8 membres)

| **#** | **Rôle** | **Périmètre** |
| --- | --- | --- |
| 1 | Chef d'équipe / Lead Technique (toi) | Architecture backend, orchestration IA, clés/API, intégration finale, revue de code, déploiement. |
| 2 | Designer UI/UX | Maquettes, charte graphique, palette des thèmes, déclinaison visuelle des compagnons. |
| 3 | Mobile Dev 1 | Écrans Context Reader + Voice-to-Meme (interface). |
| 4 | Mobile Dev 2 | Écran Status Remixer + navigation/Home + intégration du design sur l'app. |
| 5 | Backend Dev 1 | Endpoints Context Reader + Voice-to-Meme côté API. |
| 6 | Backend Dev 2 | Endpoint Status Remixer + routes + middlewares (upload fichiers). |
| 7 | Dev Audio/Image | Speech-to-Text (Voice-to-Meme) + traitement image (Status Remixer). |
| 8 | QA / Documentation | Tests sur device, plan de test, README, vidéo de démonstration finale. |

# 3. Tâches sensibles réservées au chef d'équipe

En tant que chef d'équipe, tu conserves personnellement les tâches qui touchent à la sécurité, à la cohérence globale du projet et à l'intégration finale :

- Architecture globale du backend : orchestration des appels IA et logique de bascule (fallback) entre fournisseurs (Gemini → Mistral → OpenRouter).

- Gestion des clés/API et des variables d'environnement : jamais exposées dans le code partagé avec l'équipe, centralisées dans un fichier .env non commité.

- Intégration finale et résolution des conflits Git sur la branche principale (main).

- Revue de code (Pull Request) avant chaque fusion d'une branche de membre.

- Déploiement final et vérification de la configuration avant la démonstration.

# 4. Arborescence du dossier de travail (annotée par responsable)

| **Rappel impératif** Les dossiers mobile/, web/, asset/ et docs/ existent déjà dans le dépôt et ont été initialisés par le chef d'équipe : ils ne doivent jamais être supprimés ni recréés depuis zéro. Chaque membre ajoute ses fichiers à l'intérieur de cette arborescence existante. |
| --- |

*Légende : MD1/MD2 = Mobile Dev 1/2 · BD1/BD2 = Backend Dev 1/2 · AUD = Dev Audio/Image · DES = Designer · QA = QA/Doc · LEAD = Chef d**'**équipe.*

| viral-stick/                                  [racine — existant] ├── mobile/                                   [existant] │   └── src/ │       ├── screens/ │       │   ├── ContextReaderScreen.js   — MD1 │       │   ├── VoiceToMemeScreen.js     — MD1 │       │   ├── StatusRemixerScreen.js   — MD2 │       │   └── HomeScreen.js            — MD2 │       ├── navigation/AppNavigator.js   — MD2 │       ├── components/                  — MD1 + MD2 │       ├── theme/ (palette, styles)     — DES + MD2 │       └── services/api.js              — MD2 (contrat §10) ├── web/                                  [existant — hors sprint] ├── backend/                                   [nouveau] │   ├── controllers/ │   │   ├── contextReaderController.js   — BD1 │   │   ├── voiceToMemeController.js     — BD1 │   │   └── statusRemixerController.js   — BD2 │   ├── routes/                          — BD2 │   ├── middlewares/upload.js (Multer)   — BD2 │   └── services-ia/ │       ├── geminiService.js             — LEAD │       ├── mistralService.js            — LEAD │       └── fallbackOrchestrator.js      — LEAD [sensible] ├── media-ia/                                  [nouveau] │   ├── speechToText.js                  — AUD │   └── imageProcessing.js               — AUD ├── asset/                                     [existant] │   ├── logo/                            — DES │   └── compagnons/                      — DES ├── docs/                                      [existant] │   ├── README.md                        — QA │   ├── plan-de-test.md                  — QA │   └── contrat-api.md                   — LEAD + BD1 + BD2 (J1) └── .env                                 — LEAD seul (jamais commité) |
| --- |

# 5. Cartographie des pages/écrans et responsables

| **Écran / Page** | **Module** | **Responsable principal** | **Description** |
| --- | --- | --- | --- |
| Écran d'accueil (Home) | Mobile | Mobile Dev 2 | Point d'entrée, accès aux 3 modules Core, navigation. |
| Context Reader | Mobile + Backend | Mobile Dev 1 (UI) / Backend Dev 1 (API) | Saisie d'un extrait de discussion → mème généré par IA texte. |
| Voice-to-Meme | Mobile + Backend + Audio | Mobile Dev 1 (UI) / Backend Dev 1 (API) / Dev Audio (STT) | Note vocale → transcription → mème avec sous-titre. |
| Status Remixer | Mobile + Backend + Image | Mobile Dev 2 (UI) / Backend Dev 2 (API) / Dev Audio-Image (traitement) | Import d'image → texte IA et/ou retouche → mème. |
| Partage (bonus Share Intent) | Mobile | Mobile Dev 2 | Réception de texte/image depuis une autre app (ex. WhatsApp). |
| Écrans de chargement / erreurs | Mobile | Mobile Dev 1 + Designer (specs visuelles) | Retour visuel pendant les appels IA, gestion des erreurs de quota. |

Cette cartographie correspond au périmètre Core/Bonus du sprint. Les pages additionnelles décrites dans le cahier des charges (Forum, Classement, Panel admin, Paramètres, Sécurité, etc.) ne sont pas dans ce sprint et seront traitées dans les lots suivants (V1/V2).

# 6. Planning de sprint — vue d'ensemble (7 jours)

*Vue synthétique ; le détail complet de chaque tâche par personne est donné au §7.*

| **Jour** | **Designer** | **Mobile (1+2)** | **Backend (1+2)** | **Audio/Image** | **QA/Doc** | **Chef d****'****équipe** |
| --- | --- | --- | --- | --- | --- | --- |
| J1 | Wireframes + palette | Setup RN + navigation | Setup Express + Multer | Choix de l'API STT | Setup repo + README | Architecture backend + .env |
| J2 | Maquettes des 3 écrans | UI Context Reader | Endpoint Context Reader | Endpoint STT | Plan de test | Intégration Gemini (1er appel) |
| J3 | Charte loading + compagnon | UI Voice-to-Meme | Endpoint Voice-to-Meme | Lien STT ↔ backend | Tests Context Reader | Fallback multi-IA |
| J4 | Assets finaux | UI Status Remixer | Endpoint Status Remixer | Traitement image | Tests Voice-to-Meme | Intégration mobile complète |
| J5 | Polish visuel | Intégration du design | Gestion erreurs/quotas | Finitions audio/image | Tests Status Remixer | Merge + tests E2E |
| J6 | Support vidéo | Corrections UI | Corrections backend | Corrections de bugs | README complet | Revue de code générale |
| J7 | — | Tests sur device | Tests sur device | Tests sur device | Vidéo de démo (3-5 min) | Build final + soumission |

# 7. Détail des tâches par membre

### Designer UI/UX

**J1 — **Wireframes basse fidélité des 4 écrans (Home, Context Reader, Voice-to-Meme, Status Remixer) + proposition de palette.

**J2 — **Maquettes haute fidélité détaillées des 3 écrans Core, validées avec le chef d'équipe.

**J3 — **Charte de l'écran de chargement et déclinaison visuelle d'un compagnon pour ce sprint.

**J4 — **Livraison des assets finaux exportés (logo, icônes, couleurs en variables) pour intégration par Mobile Dev 2.

**J5 — **Vérification de la cohérence visuelle une fois le design intégré dans l'app (polish).

**J6 — **Préparation des supports visuels (écrans clés) pour la vidéo de démonstration.

**J7 — **Disponible en support si besoin de retouches de dernière minute.

### Mobile Dev 1

**J1 — **Setup du projet React Native CLI, structure de dossiers src/screens, src/components.

**J2 — **Développement de l'écran Context Reader (UI statique + état local).

**J3 — **Développement de l'écran Voice-to-Meme (UI + gestion des permissions micro).

**J4 — **Connexion de Context Reader et Voice-to-Meme à l'API backend (via services/api.js).

**J5 — **Intégration des retours de design (couleurs, composants partagés) sur ses deux écrans.

**J6 — **Correction des bugs UI identifiés par la QA.

**J7 — **Tests finaux sur device réel avec Mobile Dev 2.

### Mobile Dev 2

**J1 — **Mise en place de la navigation (AppNavigator) et de l'écran Home.

**J2 — **Poursuite de la navigation, préparation de la structure de l'écran Status Remixer.

**J3 — **Développement de l'écran Status Remixer (UI + import d'image depuis la galerie).

**J4 — **Connexion de Status Remixer à l'API + implémentation du bonus Share Intent.

**J5 — **Intégration du design final sur l'ensemble des écrans de l'application.

**J6 — **Correction des bugs UI identifiés par la QA.

**J7 — **Tests finaux sur device réel avec Mobile Dev 1.

### Backend Dev 1

**J1 — **Setup du serveur Express, structure controllers/routes, configuration Multer.

**J2 — **Développement de l'endpoint Context Reader (réception texte → appel service IA → réponse).

**J3 — **Développement de l'endpoint Voice-to-Meme (réception audio/texte transcrit → appel service IA).

**J4 — **Tests d'intégration avec Mobile Dev 1 sur ses deux endpoints.

**J5 — **Gestion des erreurs et cas limites (texte vide, audio trop long, etc.).

**J6 — **Correction des bugs backend identifiés par la QA.

**J7 — **Disponible pour les tests finaux bout-en-bout.

### Backend Dev 2

**J1 — **Mise en place des routes Express et du middleware d'upload (Multer) pour les images.

**J2 — **Poursuite des routes, préparation de la structure de l'endpoint Status Remixer.

**J3 — **Développement de l'endpoint Status Remixer (réception image → appel service IA).

**J4 — **Tests d'intégration avec Mobile Dev 2 sur l'upload et le traitement d'image.

**J5 — **Gestion des erreurs et quotas API en lien avec le chef d'équipe.

**J6 — **Correction des bugs backend identifiés par la QA.

**J7 — **Disponible pour les tests finaux bout-en-bout.

### Dev Audio/Image

**J1 — **Recherche et choix de la solution Speech-to-Text (Gemini audio ou Whisper).

**J2 — **Implémentation du module de transcription audio (speechToText.js).

**J3 — **Branchement du module STT avec l'endpoint Voice-to-Meme de Backend Dev 1.

**J4 — **Implémentation du traitement d'image basique (recadrage/filtre) pour Status Remixer.

**J5 — **Finitions et tests de robustesse (formats audio/image variés).

**J6 — **Correction des bugs identifiés par la QA sur ses deux modules.

**J7 — **Disponible pour les tests finaux bout-en-bout.

### QA / Documentation

**J1 — **Création du dépôt (si besoin), mise en place du template README.

**J2 — **Rédaction du plan de test (cas à couvrir pour les 3 modules Core).

**J3 — **Premiers tests manuels sur l'écran Context Reader dès qu'il est connecté à l'API.

**J4 — **Tests manuels sur Voice-to-Meme.

**J5 — **Tests manuels sur Status Remixer et sur le bonus Share Intent.

**J6 — **Rédaction du README complet (installation, lancement, configuration des clés).

**J7 — **Tournage et montage de la vidéo de démonstration (3 à 5 minutes).

### Chef d'équipe (toi)

**J1 — **Définition de l'architecture backend, schéma des appels IA, mise en place du .env.

**J2 — **Intégration de la clé Gemini et premier appel IA fonctionnel de bout en bout.

**J3 — **Mise en place de la logique de bascule (fallback) Gemini → Mistral → OpenRouter.

**J4 — **Intégration de tous les endpoints disponibles côté mobile, coordination des équipes.

**J5 — **Fusion des branches, résolution des conflits, premiers tests bout-en-bout.

**J6 — **Revue de code générale sur l'ensemble des modules, stabilisation.

**J7 — **Build final, vérification des clés/variables d'environnement, soumission du livrable.

# 8. Rituels d'équipe et workflow Git

## 8.1 Stand-up quotidien

10 minutes chaque matin, animées par le chef d'équipe : chacun annonce ce qu'il a fait la veille, ce qu'il fait aujourd'hui, et les blocages éventuels.

## 8.2 Workflow Git

- Une branche par personne ou par module (ex. feature/context-reader-ui, feature/voice-to-meme-api).

- Pull Request vers main, validée par le chef d'équipe avant fusion.

- Aucune clé d'API ou secret ne doit être commité (fichier .env dans le .gitignore).

## 8.3 Points de synchronisation

- Sync J3 : vérifier que les 3 modules Core avancent en parallèle sans se bloquer mutuellement.

- Sync J5 : premier test bout-en-bout des 3 parcours utilisateurs avant la phase de stabilisation.

# 9. Risques à surveiller

- **Le pôle Backend/IA et le pôle Mobile travaillent en parallèle sur des interfaces qui doivent correspondre : le contrat d****'****API (§10) doit être figé dès J1, avant que chacun ne code de son côté.**

- **Les quotas gratuits (Gemini/Mistral/OpenRouter) peuvent bloquer toute l****'****équipe en pleine intégration : la clé Gemini et la logique de fallback doivent être validées en priorité dès J2-J3.**

- **La vidéo de démonstration (J7) dépend de l****'****avancement de tous les modules : prévoir une marge si un module prend du retard.**

- **Les dossiers mobile/, web/, asset/ et docs/ existent déjà : veiller à ce qu****'****aucun membre ne les supprime ou ne les régénère par erreur lors d****'****un setup local.**

# 10. Annexe — Contrat d'API à figer dès J1

Avant que les pôles Mobile et Backend ne commencent à coder en parallèle, le chef d'équipe et les deux Backend Dev doivent figer le format exact des requêtes/réponses de chaque endpoint, afin d'éviter les écarts d'intégration plus tard dans le sprint.

| **Endpoint** | **Méthode** | **Entrée (body)** | **Sortie attendue** |
| --- | --- | --- | --- |
| /api/context-reader | POST | { texte: string } | { memeTexte: string, imageUrl?: string } |
| /api/voice-to-meme | POST | { audio: file } | { transcription: string, memeTexte: string, imageUrl?: string } |
| /api/status-remixer | POST | { image: file } | { memeTexte: string, imageUrl: string } |

Ce contrat est une proposition de départ : à valider et ajuster en équipe dès le J1, puis à documenter dans docs/contrat-api.md.

Page