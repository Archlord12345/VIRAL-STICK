Viral Stick — Plan de travail d'équipe (4 jours)	KERNEL FORGE

**PLAN DE TRAVAIL D****'****ÉQUIPE**

**VIRAL STICK**

*TP ICT202 — Générateur de Mèmes Multimodal — Sprint d**'**équipe compressé (4 jours)*

Chef d'équipe : NGHOMSI FEUKOUO Ravel (« Archlord »)

Équipe : 8 membres — Université de Yaoundé I, ICT202

Date : 20 juin 2026

*Version 2.0 — Sprint compressé en 4 jours, à diffuser à l**'**équipe*

# Table des matières

# 1. Objet du document

Ce document définit l'organisation de l'équipe de 8 personnes pour le sprint TP ICT202 (Générateur de Mèmes Multimodal — Viral Stick), ramené à 4 jours. Il précise pour chaque membre : son rôle, les pages/écrans sur lesquels il intervient, le ou les fichiers exacts qu'il doit créer ou modifier, et la tâche attendue chaque jour.

Le périmètre couvert reste celui du Lot 1 (MVP académique) défini dans le cahier des charges : Context Reader, Voice-to-Meme, Status Remixer (Core). Les fonctionnalités étendues (forum, classement, panel admin, etc.) restent hors périmètre.

| **Point de vigilance — délai compressé** Faire tenir l'ensemble du périmètre Core + Bonus en 4 jours (au lieu de 7) laisse très peu de marge. Le contrat d'API (§10) doit être figé dès les premières heures du J1, sans quoi le mobile et le backend risquent de devoir refaire du travail en cours de sprint. Si l'équipe prend du retard, la priorité est : 1) les 3 modules Core fonctionnels, 2) la stabilisation, 3) la vidéo de démo. Le bonus Share Intent (Mobile Dev 2, J3) est la première chose à reporter si le temps manque. |
| --- |

# 2. Organisation de l'équipe (8 membres)

| **#** | **Rôle** | **Périmètre** |
| --- | --- | --- |
| 1 | Chef d'équipe / Lead Technique (toi) | Architecture backend, orchestration IA, clés/API, intégration finale, revue de code, déploiement. |
| 2 | Designer UI/UX | Wireframes, maquettes, charte graphique, thème, intégration visuelle du compagnon. |
| 3 | Mobile Dev 1 | Écrans Context Reader + Voice-to-Meme (interface) + connexion API. |
| 4 | Mobile Dev 2 | Écran Status Remixer + Accueil/navigation + bonus Share Intent. |
| 5 | Backend Dev 1 | Endpoints Context Reader + Voice-to-Meme côté API. |
| 6 | Backend Dev 2 | Endpoint Status Remixer + middleware d'upload (Multer). |
| 7 | Dev Audio/Image | Speech-to-Text (Voice-to-Meme) + traitement image (Status Remixer). |
| 8 | QA / Documentation | Tests sur device, plan de test, README, vidéo de démonstration finale. |

# 3. Tâches sensibles réservées au chef d'équipe

Avec un délai de 4 jours, ces tâches doivent être traitées dès les premières heures, sans attendre :

- Architecture globale du backend : orchestration des appels IA et logique de bascule (fallback) entre fournisseurs (Gemini → Mistral → OpenRouter).

- Gestion des clés/API et des variables d'environnement : jamais exposées dans le code partagé avec l'équipe, centralisées dans un fichier .env non commité.

- Figer le contrat d'API (§10) avec les deux Backend Dev dès le J1, avant que le mobile ne commence à coder ses appels réseau.

- Intégration finale et résolution des conflits Git sur la branche principale (main).

- Revue de code (Pull Request) avant chaque fusion d'une branche de membre.

- Déploiement final et vérification de la configuration avant la démonstration.

# 4. Arborescence du dossier de travail (annotée par responsable)

| **Rappel impératif** Les dossiers mobile/, web/, asset/ et docs/ existent déjà dans le dépôt et ont été initialisés par le chef d'équipe : ils ne doivent jamais être supprimés ni recréés depuis zéro. Chaque membre ajoute ses fichiers à l'intérieur de cette arborescence existante. |
| --- |

*Légende : MD1/MD2 = Mobile Dev 1/2 · BD1/BD2 = Backend Dev 1/2 · AUD = Dev Audio/Image · DES = Designer · QA = QA/Doc · LEAD = Chef d**'**équipe.*

| viral-stick/                                  [racine — existant] ├── mobile/                                   [existant] │   └── src/ │       ├── screens/ │       │   ├── HomeScreen.js            — MD2 │       │   ├── ContextReaderScreen.js   — MD1 │       │   ├── VoiceToMemeScreen.js     — MD1 │       │   └── StatusRemixerScreen.js   — MD2 │       ├── navigation/AppNavigator.js   — MD2 │       ├── components/ │       │   ├── MemeCard.js              — MD1 │       │   └── AudioRecorderButton.js   — MD1 │       ├── utils/shareIntent.js         — MD2 (bonus) │       ├── theme/theme.js               — DES (spec) + MD2 (intégration) │       └── services/api.js              — MD1 + MD2 (contrat §10) ├── web/                                  [existant — hors sprint] ├── backend/                                   [nouveau] │   ├── server.js, app.js                — LEAD │   ├── routes/ │   │   ├── index.js                     — BD1 │   │   ├── contextReader.js             — BD1 │   │   ├── voiceToMeme.js               — BD1 │   │   └── statusRemixer.js             — BD2 │   ├── controllers/ │   │   ├── contextReaderController.js   — BD1 │   │   ├── voiceToMemeController.js     — BD1 │   │   └── statusRemixerController.js   — BD2 │   ├── middlewares/upload.js (Multer)   — BD2 │   └── services-ia/ │       ├── geminiService.js             — LEAD │       ├── mistralService.js            — LEAD │       └── fallbackOrchestrator.js      — LEAD [sensible] ├── media-ia/                                  [nouveau] │   ├── speechToText.js                  — AUD │   └── imageProcessing.js               — AUD ├── asset/                                     [existant] │   ├── logo/                            — DES │   ├── compagnons/                      — DES │   └── design/ (wireframes, maquettes)  — DES [nouveau sous-dossier] ├── docs/                                      [existant] │   ├── README.md                        — QA │   ├── plan-de-test.md                  — QA │   ├── bugs.md                          — QA │   └── contrat-api.md                   — LEAD + BD1 + BD2 (figé J1) └── .env                                 — LEAD seul (jamais commité) |
| --- |

# 5. Cartographie des pages/écrans et responsables

| **Écran / Page** | **Module** | **Responsable principal** | **Description** |
| --- | --- | --- | --- |
| Accueil (Home) | Mobile | Mobile Dev 2 | Point d'entrée, accès aux 3 modules Core, navigation. |
| Context Reader | Mobile + Backend | Mobile Dev 1 (UI) / Backend Dev 1 (API) | Saisie d'un extrait de discussion → mème généré par IA texte. |
| Voice-to-Meme | Mobile + Backend + Audio | Mobile Dev 1 (UI) / Backend Dev 1 (API) / Dev Audio (STT) | Note vocale → transcription → mème avec sous-titre. |
| Status Remixer | Mobile + Backend + Image | Mobile Dev 2 (UI) / Backend Dev 2 (API) / Dev Audio-Image (traitement) | Import d'image → texte IA et/ou retouche → mème. |
| Partage (bonus Share Intent) | Mobile | Mobile Dev 2 | Réception de texte/image depuis une autre app. Bonus — à reporter en premier si retard (cf. §1). |

# 6. Planning de sprint — vue d'ensemble (4 jours)

*Vue synthétique ; le détail complet par personne, par page et par fichier est donné au §7.*

| **Jour** | **Designer** | **Mobile (1+2)** | **Backend (1+2)** | **Audio/Image** | **QA/Doc** | **Chef d****'****équipe** |
| --- | --- | --- | --- | --- | --- | --- |
| J1 | Wireframes 4 écrans + palette | Setup RN + stubs des 3 écrans Core | Setup Express + Multer | Choix de l'API STT | Setup repo + plan de test | Architecture + 1er appel Gemini + contrat API figé |
| J2 | Maquettes hi-fi + thème | UI Context Reader + Voice-to-Meme | Endpoints Context Reader + Voice-to-Meme | Transcription STT complète | Tests Context Reader | Fallback multi-IA (Mistral/OpenRouter) |
| J3 | Intégration visuelle + compagnon | UI Status Remixer + connexion API (3 écrans) | Endpoint Status Remixer + finitions | Traitement image | Tests Voice-to-Meme + Status Remixer | Intégration de tous les endpoints, coordination |
| J4 | Contrôle qualité visuelle | Corrections de bugs + tests device | Corrections de bugs + tests device | Corrections de bugs + tests device | README final + vidéo de démo | Merge final, build, vérif clés, soumission |

# 7. Détail des tâches par membre : pages, fichiers et rôle du jour

### Designer UI/UX

| **Jour** | **Page(s) travaillée(s)** | **Fichier(s) à créer / modifier** | **Tâche du jour** |
| --- | --- | --- | --- |
| J1 | Les 4 écrans (Home, Context Reader, Voice-to-Meme, Status Remixer) | asset/design/wireframes/*.png asset/design/palette.json | Wireframes basse fidélité des 4 écrans + proposition de palette de couleurs. |
| J2 | Context Reader, Voice-to-Meme, Status Remixer | asset/design/maquettes-hifi/*.png mobile/src/theme/theme.js (spec remise à MD2) | Maquettes haute fidélité des 3 écrans Core + spécification du thème (couleurs, typographie). |
| J3 | Écran de chargement, Compagnon (overlay sur les 3 écrans) | asset/design/loading-screen.png asset/compagnons/ (vérif. intégration) | Charte de l'écran de chargement + validation de l'intégration visuelle du compagnon choisi pour ce sprint. |
| J4 | Les 4 écrans | — (aucun nouveau fichier) | Contrôle qualité visuelle final sur l'app assemblée + support pour les visuels de la vidéo de démo. |

### Mobile Dev 1

| **Jour** | **Page(s) travaillée(s)** | **Fichier(s) à créer / modifier** | **Tâche du jour** |
| --- | --- | --- | --- |
| J1 | Accueil (en support), Navigation | mobile/src/navigation/AppNavigator.js mobile/src/screens/HomeScreen.js (stub, avec MD2) | Setup du projet React Native CLI + structure de dossiers src/screens, src/components. |
| J2 | Context Reader | mobile/src/screens/ContextReaderScreen.js mobile/src/components/MemeCard.js | UI complète de l'écran Context Reader (saisie de texte, affichage du mème généré). |
| J3 | Context Reader, Voice-to-Meme | mobile/src/screens/VoiceToMemeScreen.js mobile/src/components/AudioRecorderButton.js mobile/src/services/api.js (avec MD2) | UI de Voice-to-Meme (+ permission micro) et connexion des deux écrans à l'API backend. |
| J4 | Context Reader, Voice-to-Meme | — (corrections sur les fichiers existants) | Corrections de bugs identifiés par la QA, tests sur device réel. |

### Mobile Dev 2

| **Jour** | **Page(s) travaillée(s)** | **Fichier(s) à créer / modifier** | **Tâche du jour** |
| --- | --- | --- | --- |
| J1 | Accueil (Home), Status Remixer (stub) | mobile/src/screens/HomeScreen.js (avec MD1) mobile/src/screens/StatusRemixerScreen.js (stub) | Mise en place de la navigation et de l'écran d'accueil, préparation de Status Remixer. |
| J2 | Status Remixer, intégration du thème | mobile/src/theme/theme.js (intégration de la spec du Designer) | Intégration du thème livré par le Designer sur les écrans déjà existants. |
| J3 | Status Remixer | mobile/src/screens/StatusRemixerScreen.js (complet) mobile/src/utils/shareIntent.js (bonus) mobile/src/services/api.js (avec MD1) | UI complète de Status Remixer (import image + galerie), connexion à l'API, bonus Share Intent si le temps le permet. |
| J4 | Status Remixer, Accueil | — (corrections sur les fichiers existants) | Corrections de bugs identifiés par la QA, tests sur device réel. |

### Backend Dev 1

| **Jour** | **Page(s) travaillée(s)** | **Fichier(s) à créer / modifier** | **Tâche du jour** |
| --- | --- | --- | --- |
| J1 | — (infrastructure, toutes pages à venir) | backend/server.js backend/app.js backend/routes/index.js | Setup du serveur Express et de la structure de routage de base. |
| J2 | Context Reader | backend/controllers/contextReaderController.js backend/routes/contextReader.js | Développement de l'endpoint Context Reader (texte → appel service IA → réponse). |
| J3 | Voice-to-Meme | backend/controllers/voiceToMemeController.js backend/routes/voiceToMeme.js | Développement de l'endpoint Voice-to-Meme (audio/texte transcrit → appel service IA). |
| J4 | Context Reader, Voice-to-Meme | — (corrections sur les fichiers existants) | Gestion des erreurs et cas limites, tests d'intégration avec Mobile Dev 1. |

### Backend Dev 2

| **Jour** | **Page(s) travaillée(s)** | **Fichier(s) à créer / modifier** | **Tâche du jour** |
| --- | --- | --- | --- |
| J1 | — (infrastructure, Status Remixer à venir) | backend/middlewares/upload.js (Multer) | Mise en place du middleware d'upload de fichiers (images). |
| J2 | Status Remixer (préparation) | backend/routes/statusRemixer.js backend/controllers/statusRemixerController.js (stub) | Préparation de la structure de l'endpoint Status Remixer. |
| J3 | Status Remixer | backend/controllers/statusRemixerController.js (complet) | Développement complet de l'endpoint Status Remixer (image → appel service IA). |
| J4 | Status Remixer | — (corrections sur les fichiers existants) | Gestion des erreurs/quotas, tests d'intégration avec Mobile Dev 2. |

### Dev Audio/Image

| **Jour** | **Page(s) travaillée(s)** | **Fichier(s) à créer / modifier** | **Tâche du jour** |
| --- | --- | --- | --- |
| J1 | Voice-to-Meme (préparation) | media-ia/speechToText.js (squelette) | Choix de la solution Speech-to-Text (Gemini audio ou Whisper) et structure du module. |
| J2 | Voice-to-Meme | media-ia/speechToText.js (complet) | Implémentation complète de la transcription audio, prête à être branchée au backend. |
| J3 | Status Remixer | media-ia/imageProcessing.js | Traitement d'image basique (recadrage/filtre) pour Status Remixer + branchement du STT avec Backend Dev 1. |
| J4 | Voice-to-Meme, Status Remixer | — (corrections sur les fichiers existants) | Tests de robustesse (formats audio/image variés), corrections de bugs. |

### QA / Documentation

| **Jour** | **Page(s) travaillée(s)** | **Fichier(s) à créer / modifier** | **Tâche du jour** |
| --- | --- | --- | --- |
| J1 | — (mise en place transverse) | docs/README.md (squelette) docs/plan-de-test.md | Mise en place du dépôt et rédaction du plan de test (cas à couvrir pour les 3 modules Core). |
| J2 | Context Reader | docs/plan-de-test.md (mise à jour) | Premiers tests manuels sur Context Reader dès qu'il est connecté à l'API. |
| J3 | Voice-to-Meme, Status Remixer | docs/bugs.md | Tests manuels sur les deux écrans restants, journal des bugs identifiés. |
| J4 | Les 4 écrans | docs/README.md (complet) docs/demo-video.mp4 | Rédaction du README final (installation, lancement, clés) + tournage et montage de la vidéo de démo (3-5 min). |

### Chef d'équipe (toi)

| **Jour** | **Page(s) travaillée(s)** | **Fichier(s) à créer / modifier** | **Tâche du jour** |
| --- | --- | --- | --- |
| J1 | — (architecture transverse) | backend/services-ia/geminiService.js .env docs/contrat-api.md (figé) | Architecture backend, premier appel IA fonctionnel, et contrat d'API figé avec les deux Backend Dev. |
| J2 | — (architecture transverse) | backend/services-ia/mistralService.js backend/services-ia/fallbackOrchestrator.js | Mise en place de la logique de bascule (fallback) Gemini → Mistral → OpenRouter. |
| J3 | Les 3 écrans Core | — (intégration, pas de nouveau fichier) | Intégration de tous les endpoints disponibles côté mobile, coordination des équipes, premiers tests bout-en-bout. |
| J4 | Les 4 écrans | — (build et vérification finale) | Revue de code générale, merge final, build, vérification des clés/variables d'environnement, soumission du livrable. |

# 8. Rituels d'équipe et workflow Git

## 8.1 Stand-up renforcé

Avec un délai de 4 jours, prévoir 2 points courts par jour plutôt qu'un seul : 10 minutes le matin (objectifs du jour) et 10 minutes en fin d'après-midi (blocages, ajustements pour le lendemain), animés par le chef d'équipe.

## 8.2 Workflow Git

- Une branche par personne ou par module (ex. feature/context-reader-ui, feature/voice-to-meme-api).

- Pull Request vers main, validée par le chef d'équipe avant fusion.

- Aucune clé d'API ou secret ne doit être commité (fichier .env dans le .gitignore).

## 8.3 Points de synchronisation

- Sync fin de J2 : vérifier que les 3 modules Core avancent en parallèle sans se bloquer mutuellement.

- Sync milieu de J3 : premier test bout-en-bout des 3 parcours utilisateurs avant la phase de stabilisation du J4.

# 9. Risques à surveiller

- **Délai très serré : 4 jours pour 3 modules Core + bonus + vidéo de démo laisse peu de marge. Le contrat d****'****API (§10) doit être figé dans les premières heures du J1.**

- **Le pôle Backend/IA et le pôle Mobile travaillent en parallèle sur des interfaces qui doivent correspondre : aucun développement d****'****appel réseau ne doit commencer avant que le contrat d****'****API soit validé par tous.**

- **Les quotas gratuits (Gemini/Mistral/OpenRouter) peuvent bloquer toute l****'****équipe en pleine intégration : la clé Gemini et la logique de fallback doivent être validées dès le J1-J2.**

- **La vidéo de démonstration (J4) dépend de l****'****avancement de tous les modules : si un module est en retard à la fin du J3, le bonus Share Intent doit être abandonné pour préserver du temps de stabilisation.**

- **Les dossiers mobile/, web/, asset/ et docs/ existent déjà : veiller à ce qu****'****aucun membre ne les supprime ou ne les régénère par erreur lors d****'****un setup local.**

# 10. Annexe — Contrat d'API à figer dès J1

Avant que les pôles Mobile et Backend ne commencent à coder en parallèle, le chef d'équipe et les deux Backend Dev doivent figer le format exact des requêtes/réponses de chaque endpoint dans les premières heures du J1, vu le délai très court.

| **Endpoint** | **Méthode** | **Entrée (body)** | **Sortie attendue** |
| --- | --- | --- | --- |
| /api/context-reader | POST | { texte: string } | { memeTexte: string, imageUrl?: string } |
| /api/voice-to-meme | POST | { audio: file } | { transcription: string, memeTexte: string, imageUrl?: string } |
| /api/status-remixer | POST | { image: file } | { memeTexte: string, imageUrl: string } |

Ce contrat est une proposition de départ : à valider et ajuster en équipe dès les premières heures du J1, puis à documenter dans docs/contrat-api.md.

Page