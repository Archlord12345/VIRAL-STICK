**KERNEL FORGE**

by Archlord

**VIRAL STICK**

**ROADMAP ****&**** PLAN DE TRAVAIL D****'****ÉQUIPE**

TP ICT202 — Générateur de Mèmes Multimodal — Sprint 5 jours

**Chef d****'****équipe : NGHOMSI FEUKOUO Ravel (« Archlord »)**

Équipe : 8 membres — Université de Yaoundé I, ICT202

Date : 20 juin 2026  |  Version 3.0

# **1. Objet du document**

Ce document définit l'organisation et le planning de l'équipe de 8 personnes pour le sprint TP ICT202 (Générateur de Mèmes Multimodal — Viral Stick) en 5 jours. Il précise : qui fait quoi, quels fichiers chaque personne touche, le planning jour par jour, les 2 meets d'équipe, et les règles de suivi design/frontend.

Périmètre : Lot 1 (MVP académique) — Context Reader, Voice-to-Meme, Status Remixer (Core). Fonctionnalités étendues (forum, classement, admin) hors périmètre.

**Structure du sprint :**

- J1 à J4 : Phase de développement (4 jours)

- J3 fin de journée : Meet #1 — point de mi-sprint après 2 jours de dev

- J5 fin de journée J4 / début J5 : Meet #2 — point avant la vidéo

- J5 : Journée dédiée à la vidéo de présentation + livraison finale

| **⚠️  RÈGLE DESIGNER — SUIVI FRONTEND OBLIGATOIRE** Le Designer doit suivre en temps réel le travail de Mobile Dev 1 et Mobile Dev 2. À chaque écran intégré, le Designer vérifie que les couleurs, typographies, espacements et composants visuels correspondent exactement aux maquettes livrées. Tout écart doit être signalé immédiatement au chef d'équipe. |
| --- |

# **2. Organisation de l****'****équipe (8 membres)**

| **#** | **Rôle** | **Périmètre** |
| --- | --- | --- |
| 1 | **Chef d****'****équipe / Lead Technique** | Architecture backend, orchestration IA, clés/API, intégration finale, revue de code, déploiement. |
| 2 | **Designer UI/UX ⚠️ Suivi Frontend** | Maquettes, charte graphique, palette, compagnons. DOIT suivre en temps réel Mobile Dev 1 & 2 pour garantir le respect du design. |
| 3 | **Mobile Dev 1** | Écrans Context Reader + Voice-to-Meme (UI + connexion API). |
| 4 | **Mobile Dev 2** | Écran Status Remixer + Home/navigation + bonus Share Intent. |
| 5 | **Backend Dev 1** | Endpoints Context Reader + Voice-to-Meme. |
| 6 | **Backend Dev 2** | Endpoint Status Remixer + middleware upload Multer. |
| 7 | **Dev Audio/Image** | Speech-to-Text (Voice-to-Meme) + traitement image (Status Remixer). |
| 8 | **QA / Documentation** | Tests device, plan de test, README, vidéo de démo J5. |

# **3. Vue d****'****ensemble — Roadmap 5 jours**

Légende couleurs : 

| J1–J2 : Dev initial | J3 ★ MEET #1 | J4 : Stabilisation | J5 ★ MEET #2 🎬 | Règle Designer |
| --- | --- | --- | --- | --- |

| **Jour** | **🎨 Designer** | **📱 Mobile (1+2)** | **⚙️ Backend (1+2)** | **🔊 Audio/Image** | **🧪 QA/Doc** | **👑 Chef d****'****équipe** |
| --- | --- | --- | --- | --- | --- | --- |
| **J1** | Wireframes 4 écrans + palette | Setup RN + stubs 3 écrans | Setup Express + Multer + contrat API figé | Choix solution STT | Setup repo + plan de test | Architecture + 1er appel Gemini |
| **J2** | Maquettes hi-fi + thème livré à MD2 | UI Context Reader + Voice-to-Meme | Endpoints Context Reader + Voice-to-Meme | Module STT complet | Tests Context Reader | Fallback Gemini→Mistral→OpenRouter |
| **J3 ★ MEET 1** | Intégration visuelle + compagnon + suivi frontend actif | UI Status Remixer + connexion API 3 écrans | Endpoint Status Remixer + finitions | Traitement image + STT branché | Tests Voice-to-Meme + Status Remixer | Intégration de tous les endpoints + coordination |
| **J4** | Contrôle qualité visuelle sur app assemblée | Corrections bugs + polish + tests device | Corrections bugs + gestion quotas | Corrections + robustesse formats | README final + préparation soumission | Merge final + build + revue de code + soumission |
| **J5 ★ MEET 2 🎬 VIDEO** | Support visuels pour la vidéo | Tests finaux device + support vidéo | Disponible pour tests bout-en-bout | Disponible pour tests bout-en-bout | Tournage + montage vidéo de démo (3-5 min) | Vérif clés/config + livraison finale |

# **4. Points de synchronisation (2 Meets)**

## **Meet #1 — Fin de J3 (après 2 jours de dev)**

| **📅  MEET D****'****ÉQUIPE  — **Organisé par le Chef d'équipe à la fin du Jour 3, durée : 30 min |
| --- |

**Ordre du jour :**

- Tour de table : ce qui est done vs bloqué sur les 3 modules Core (Context Reader / Voice-to-Meme / Status Remixer)

- Vérification que le contrat API (§10) est bien respecté côté mobile et backend — aucun écart toléré

- Point Designer → Mobile Dev 1 & 2 : revue rapide de l'intégration visuelle en cours, signalement des écarts

- Décision : le bonus Share Intent continue ou est reporté selon l'avancement

- Attribution des corrections prioritaires pour J4

- Vérification des quotas Gemini/Mistral — fallback opérationnel ?

## **Meet #2 — Fin de J4 / Début de J5 (avant la vidéo)**

| **📅  MEET D****'****ÉQUIPE  — **Organisé par le Chef d'équipe juste avant le J5, durée : 20 min |
| --- |

**Ordre du jour :**

- Bilan final du build : l'app tourne-t-elle de bout en bout sur device réel ?

- QA : liste des bugs encore ouverts — lesquels sont critiques pour la vidéo ?

- Préparation du scénario de la vidéo de démo : qui parle, dans quel ordre, quels écrans montrer

- Designer confirme que les visuels pour la vidéo (captures, assets) sont prêts

- Chef d'équipe : vérification des clés .env avant le build final

- Répartition des rôles pour le tournage/montage de J5

# **5. Règle Designer — Suivi Frontend**

La règle suivante est non-négociable pour toute la durée du sprint.

| **⚠️  RÈGLE DESIGNER — SUIVI FRONTEND OBLIGATOIRE** Le Designer doit suivre en temps réel le travail de Mobile Dev 1 et Mobile Dev 2. À chaque écran intégré, le Designer vérifie que les couleurs, typographies, espacements et composants visuels correspondent exactement aux maquettes livrées. Tout écart doit être signalé immédiatement au chef d'équipe. |
| --- |

**Modalités concrètes :**

- Dès J2 (livraison des maquettes hi-fi), le Designer est en communication permanente avec Mobile Dev 1 et Mobile Dev 2.

- À chaque nouvel écran intégré ou modifié, le Developer envoie une capture au Designer (WhatsApp/Telegram ou partage direct) avant de pousser sur Git.

- Le Designer répond avec un verdict : ✅ Conforme ou ❌ Écart + description précise à corriger.

- Les écarts sont signalés immédiatement au Chef d'équipe pour décision rapide.

- Pendant le Meet #1 (J3), le Designer présente un bilan visuel : écrans validés vs écarts encore ouverts.

- Aucun écran ne peut être considéré comme 'terminé' sans la validation visuelle du Designer.

# **6. Tâches détaillées par membre**

## **🎨 Designer UI/UX**

*Référent : Mobile Dev 1 **&** 2 (suivi visuel permanent dès J2)*

| **Jour** | **Page(s)** | **Fichier(s)** | **Tâche détaillée** |
| --- | --- | --- | --- |
| **J1** | Les 4 écrans (Home, Context Reader, Voice-to-Meme, Status Remixer) | asset/design/wireframes/*.png asset/design/palette.json | Wireframes basse fidélité des 4 écrans Core. Proposition de palette (couleurs primaire/secondaire, dark/light). Validation avec le Chef d'équipe avant fin de journée. |
| **J2** | Context Reader, Voice-to-Meme, Status Remixer | asset/design/maquettes-hifi/*.png mobile/src/theme/theme.js (spec livrée à MD2) | Maquettes haute fidélité des 3 écrans Core. Livraison du fichier theme.js (couleurs, typographies, espacements) à Mobile Dev 2. Début du suivi actif du frontend : toute intégration de MD1 ou MD2 est vérifiée. |
| **J3 ★ MEET 1** | Écran de chargement, Compagnon (overlay 3 écrans) | asset/design/loading-screen.png asset/compagnons/ (validation intégration) | Charte écran de chargement + déclinaison compagnon. Suivi frontend intensif : vérification de chaque écran intégré par MD1 & MD2. Présentation bilan visuel au Meet #1 (écrans validés / écarts ouverts). |
| **J4** | Les 4 écrans (validation finale) | — (aucun nouveau fichier) | Contrôle qualité visuelle complet sur l'app assemblée. Préparation des captures d'écran et assets pour la vidéo de démo J5. Support aux corrections UI des Mobile Devs si écarts détectés. |
| **J5 🎬 VIDEO** | Tous les écrans (support vidéo) | — (support) | Disponible pour retouches de dernière minute. Support au QA pour le tournage : fourniture des assets visuels, validation du rendu à l'écran pendant le tournage. |

## **📱 Mobile Dev 1**

*Écrans : Context Reader + Voice-to-Meme*

| **Jour** | **Page(s)** | **Fichier(s)** | **Tâche détaillée** |
| --- | --- | --- | --- |
| **J1** | Navigation, Home (support MD2) | mobile/src/navigation/AppNavigator.js mobile/src/screens/ (structure) mobile/src/components/ (structure) | Setup React Native CLI. Création de la structure src/screens et src/components. Mise en place de la navigation de base avec Mobile Dev 2. Stub vide des écrans à venir. |
| **J2** | Context Reader | mobile/src/screens/ContextReaderScreen.js mobile/src/components/MemeCard.js | UI complète de l'écran Context Reader : champ de saisie texte, bouton de génération, affichage du mème généré (MemeCard). Envoi d'une capture au Designer pour validation visuelle. |
| **J3 ★ MEET 1** | Voice-to-Meme + connexion API Context Reader | mobile/src/screens/VoiceToMemeScreen.js mobile/src/components/AudioRecorderButton.js mobile/src/services/api.js (avec MD2) | UI Voice-to-Meme (gestion permission micro + bouton enregistrement + affichage transcription + mème). Connexion de Context Reader à l'API via api.js. Envoi captures au Designer. Participation au Meet #1. |
| **J4** | Context Reader, Voice-to-Meme (finitions) | — (corrections fichiers existants) | Connexion de Voice-to-Meme à l'API. Corrections bugs remontés par QA. Tests sur device réel. Préparation pour la vidéo. |
| **J5 🎬 VIDEO** | Tous les écrans (support) | — (support) | Tests finaux sur device. Support au tournage de la vidéo de démo si besoin. |

## **📱 Mobile Dev 2**

*Écrans : Status Remixer + Home + Navigation + bonus Share Intent*

| **Jour** | **Page(s)** | **Fichier(s)** | **Tâche détaillée** |
| --- | --- | --- | --- |
| **J1** | Home, Navigation, Status Remixer (stub) | mobile/src/screens/HomeScreen.js (avec MD1) mobile/src/screens/StatusRemixerScreen.js (stub) mobile/src/navigation/AppNavigator.js (avec MD1) | Mise en place de la navigation (AppNavigator) et de l'écran Home (point d'entrée, 3 boutons vers les modules Core). Stub vide de StatusRemixerScreen. |
| **J2** | Intégration thème + Status Remixer (structure) | mobile/src/theme/theme.js (intégration spec Designer) mobile/src/screens/StatusRemixerScreen.js (structure) | Intégration du fichier theme.js livré par le Designer sur tous les écrans existants. Début de la structure de l'écran Status Remixer. Envoi captures au Designer pour validation. |
| **J3 ★ MEET 1** | Status Remixer + Share Intent (bonus) | mobile/src/screens/StatusRemixerScreen.js (complet) mobile/src/utils/shareIntent.js (bonus) mobile/src/services/api.js (avec MD1) | UI complète Status Remixer (import image galerie + affichage mème). Bonus Share Intent si le temps le permet. Connexion à l'API. Envoi captures au Designer. Participation au Meet #1. |
| **J4** | Status Remixer, Home (finitions) | — (corrections fichiers existants) | Corrections bugs remontés par QA. Polish visuel avec validation Designer. Tests sur device réel. |
| **J5 🎬 VIDEO** | Tous les écrans (support) | — (support) | Tests finaux sur device. Support au tournage de la vidéo de démo. |

## **⚙️ Backend Dev 1**

*Modules : Context Reader + Voice-to-Meme (API)*

| **Jour** | **Page(s)** | **Fichier(s)** | **Tâche détaillée** |
| --- | --- | --- | --- |
| **J1** | Infrastructure (tous modules à venir) | backend/server.js backend/app.js backend/routes/index.js docs/contrat-api.md (avec LEAD + BD2) | Setup du serveur Express et de la structure de routage. Participation à la session de finalisation du contrat API avec le Chef d'équipe et Backend Dev 2 (obligatoire avant tout codage parallèle). |
| **J2** | Context Reader | backend/controllers/contextReaderController.js backend/routes/contextReader.js | Développement complet de l'endpoint Context Reader : réception du texte, appel au service IA (via geminiService), renvoi du mème généré. Tests unitaires basiques. |
| **J3 ★ MEET 1** | Voice-to-Meme | backend/controllers/voiceToMemeController.js backend/routes/voiceToMeme.js | Développement de l'endpoint Voice-to-Meme : réception audio/texte transcrit, appel service IA. Coordination avec Dev Audio pour le branchement STT. Participation au Meet #1. |
| **J4** | Context Reader, Voice-to-Meme (finitions) | — (corrections fichiers existants) | Gestion des erreurs et cas limites (texte vide, audio trop long, quota dépassé). Tests d'intégration avec Mobile Dev 1. Support pour tests bout-en-bout. |
| **J5 🎬 VIDEO** | — (support) | — (support) | Disponible pour les tests finaux bout-en-bout et corrections de dernière minute. |

## **⚙️ Backend Dev 2**

*Modules : Status Remixer + middleware upload Multer*

| **Jour** | **Page(s)** | **Fichier(s)** | **Tâche détaillée** |
| --- | --- | --- | --- |
| **J1** | Infrastructure upload (Status Remixer à venir) | backend/middlewares/upload.js (Multer) docs/contrat-api.md (avec LEAD + BD1) | Mise en place du middleware Multer pour l'upload de fichiers images. Participation à la finalisation du contrat API. |
| **J2** | Status Remixer (préparation) | backend/routes/statusRemixer.js backend/controllers/statusRemixerController.js (stub) | Mise en place de la structure de route et du stub de contrôleur Status Remixer. |
| **J3 ★ MEET 1** | Status Remixer | backend/controllers/statusRemixerController.js (complet) | Développement complet de l'endpoint Status Remixer : réception image, appel service IA, renvoi mème. Coordination avec Dev Audio/Image. Participation au Meet #1. |
| **J4** | Status Remixer (finitions) | — (corrections fichiers existants) | Gestion des erreurs, quotas API, cas limites (image trop lourde, format non supporté). Tests d'intégration avec Mobile Dev 2. |
| **J5 🎬 VIDEO** | — (support) | — (support) | Disponible pour les tests finaux bout-en-bout. |

## **🔊 Dev Audio/Image**

*Modules : Speech-to-Text + traitement image*

| **Jour** | **Page(s)** | **Fichier(s)** | **Tâche détaillée** |
| --- | --- | --- | --- |
| **J1** | Voice-to-Meme (préparation STT) | media-ia/speechToText.js (squelette) | Recherche et choix de la solution Speech-to-Text (Gemini audio ou Whisper). Création du squelette du module speechToText.js. |
| **J2** | Voice-to-Meme | media-ia/speechToText.js (complet) | Implémentation complète du module de transcription audio, prête à être branchée à l'endpoint Voice-to-Meme de Backend Dev 1. |
| **J3 ★ MEET 1** | Status Remixer + branchement STT | media-ia/imageProcessing.js | Implémentation du traitement d'image basique (recadrage/filtre) pour Status Remixer. Branchement du module STT avec Backend Dev 1. Participation au Meet #1. |
| **J4** | Voice-to-Meme, Status Remixer (finitions) | — (corrections fichiers existants) | Tests de robustesse (formats audio et image variés). Corrections de bugs identifiés par la QA. |
| **J5 🎬 VIDEO** | — (support) | — (support) | Disponible pour les tests finaux bout-en-bout. |

## **🧪 QA / Documentation**

*Responsable de la vidéo de présentation au J5*

| **Jour** | **Page(s)** | **Fichier(s)** | **Tâche détaillée** |
| --- | --- | --- | --- |
| **J1** | Transverse (tous modules) | docs/README.md (squelette) docs/plan-de-test.md | Mise en place du squelette README. Rédaction du plan de test complet (cas de test pour les 3 modules Core : saisies valides, invalides, cas limites). |
| **J2** | Context Reader | docs/plan-de-test.md (mise à jour) | Premiers tests manuels sur Context Reader dès qu'il est connecté à l'API. Remontée des bugs à Backend Dev 1 et Mobile Dev 1. |
| **J3 ★ MEET 1** | Voice-to-Meme, Status Remixer | docs/bugs.md | Tests manuels sur Voice-to-Meme et Status Remixer. Journal des bugs ouverts (bugs.md). Participation au Meet #1 : présentation de l'état des tests. |
| **J4** | Les 4 écrans (validation finale) | docs/README.md (complet) docs/demo-script.md | Rédaction du README final (installation, lancement, configuration des clés). Préparation du script détaillé de la vidéo de démo pour J5. Vérification que tous les bugs critiques sont résolus. |
| **J5 🎬 VIDEO** | Tous les écrans (démonstration) | docs/demo-video.mp4 docs/README.md (finalisation) | Tournage et montage de la vidéo de démonstration (3 à 5 minutes). Scénario : présentation de l'équipe → Context Reader → Voice-to-Meme → Status Remixer → conclusion. |

## **👑 Chef d****'****équipe — NGHOMSI FEUKOUO Ravel**

*Tâches sensibles réservées (clés, fallback, merge, déploiement)*

| **Jour** | **Page(s)** | **Fichier(s)** | **Tâche détaillée** |
| --- | --- | --- | --- |
| **J1** | Architecture transverse | backend/services-ia/geminiService.js .env (LEAD seul, jamais commité) docs/contrat-api.md (figé avec BD1 + BD2) | Architecture backend complète. Premier appel IA Gemini fonctionnel de bout en bout. Contrat API figé avec les deux Backend Dev dans les premières heures — AUCUN développement d'appel réseau ne commence avant. |
| **J2** | Architecture transverse | backend/services-ia/mistralService.js backend/services-ia/fallbackOrchestrator.js | Mise en place de la logique de bascule (fallback) Gemini → Mistral → OpenRouter. Vérification que les quotas sont opérationnels. |
| **J3 ★ MEET 1** | Les 3 modules Core (coordination) | — (intégration, pas de nouveau fichier) | Intégration de tous les endpoints disponibles côté mobile. Coordination des équipes. Premiers tests bout-en-bout. Animation du Meet #1. |
| **J4** | Les 4 écrans + merge | — (build et merge final) | Revue de code générale (Pull Requests). Merge de toutes les branches sur main. Résolution des conflits Git. Build de vérification. Tests E2E finaux. |
| **J5 ★ MEET 2 🎬 VIDEO** | Livraison finale | — (vérification et soumission) | Animation du Meet #2. Vérification finale des clés et variables d'environnement. Build final propre. Soumission du livrable. Support au tournage de la vidéo. |

# **7. Journée J5 — Vidéo de Présentation (détail)**

| **🎬  JOURNÉE DÉDIÉE À LA VIDÉO DE PRÉSENTATION** |
| --- |

La journée J5 est entièrement dédiée à la réalisation de la vidéo de démonstration et à la livraison finale. Après le Meet #2 (point de préparation), toute l'équipe se coordonne pour produire une vidéo de 3 à 5 minutes.

## **Scénario recommandé de la vidéo**

| **Temps** | **Segment** | **Contenu** |
| --- | --- | --- |
| **0:00–0:30** | **Introduction équipe** | Présentation rapide de l'équipe et du projet (nom, UY1, ICT202, objectif de Viral Stick). |
| **0:30–1:30** | **Demo Context Reader** | Saisie d'un extrait de texte/discussion → génération du mème par IA → affichage du résultat. |
| **1:30–2:30** | **Demo Voice-to-Meme** | Enregistrement d'une note vocale → transcription → génération du mème avec sous-titre. |
| **2:30–3:30** | **Demo Status Remixer** | Import d'une image depuis la galerie → texte IA généré → mème final affiché. |
| **3:30–4:00** | **Architecture ****&**** Tech** | Rapide aperçu de l'architecture : Flutter/RN + Express + Gemini/Mistral fallback. |
| **4:00–4:30** | **Conclusion** | Remerciements, lien GitHub, ouverture sur les prochaines fonctionnalités. |

## **Responsabilités J5**

- QA/Doc : pilote le tournage et le montage de la vidéo (responsable principal)

- Designer : valide le rendu visuel à l'écran pendant le tournage, fournit les assets

- Chef d'équipe : anime le Meet #2, vérifie le build final, supervise la soumission

- Mobile Dev 1 & 2 + Backend Dev 1 & 2 + Dev Audio : disponibles pour les tests finaux et pour apparaître dans la vidéo si nécessaire

# **8. Workflow Git ****&**** Rituels d****'****équipe**

## **8.1 Workflow Git**

- Une branche par personne ou module (ex. feature/context-reader-ui, feature/voice-to-meme-api).

- Pull Request vers main, validée par le Chef d'équipe avant toute fusion.

- Aucune clé API ou secret commité — fichier .env dans .gitignore, géré exclusivement par le LEAD.

- Les dossiers mobile/, web/, asset/ et docs/ existent déjà : ne jamais les supprimer ni recréer.

## **8.2 Stand-up quotidien**

10 min le matin, animé par le Chef d'équipe : chacun annonce (1) ce qu'il a fait hier, (2) ce qu'il fait aujourd'hui, (3) ses blocages. En soirée : 5 min de check rapide sur les blocages.

## **8.3 Points de synchronisation (Meets)**

| **Meet** | **Quand** | **Objectif principal** |
| --- | --- | --- |
| **Meet #1** | Fin de J3 (après 2 jours de dev) | Vérification avancement 3 modules Core, revue visuelle Designer→Frontend, décision sur le bonus Share Intent, attribution des corrections J4. |
| **Meet #2** | Fin de J4 / Début J5 (avant la vidéo) | Bilan build final, validation état de l'app sur device, préparation du scénario vidéo, répartition des rôles pour le tournage. |

# **9. Risques à surveiller**

| **!** | **Risque** | **Impact** | **Mitigation** |
| --- | --- | --- | --- |
| 🔴 | **Contrat API non figé au J1** | Mobile et Backend codent des interfaces incompatibles → refactoring massif J3-J4 | LEAD + BD1 + BD2 figent le contrat dans les 2 premières heures de J1 — AUCUNE exception |
| 🔴 | **Quotas Gemini/Mistral épuisés** | L'app ne peut plus générer de mèmes en phase d'intégration | Fallback Gemini→Mistral→OpenRouter validé dès J2 par le LEAD |
| 🟠 | **Designer non synchronisé avec le Frontend** | Écarts visuels découverts à J4 → trop tard pour corriger proprement | Règle de suivi Designer obligatoire dès J2, validation par capture à chaque écran |
| 🟠 | **Retard sur un module Core** | La vidéo J5 ne peut pas montrer toutes les fonctionnalités | Priorité : 1) 3 modules Core fonctionnels, 2) Stabilisation, 3) Bonus Share Intent (reporté en premier) |
| 🟡 | **Conflit Git sur main** | Perte de code ou régression juste avant la soumission | Merge uniquement via Pull Request validée par le LEAD — pas de push direct sur main |
| 🟡 | **Dossiers existants supprimés/recréés** | Perte de la structure de dépôt initialisée | Rappel à chaque membre : jamais de rm -rf sur mobile/, web/, asset/, docs/ |

# **10. Annexe — Contrat API (à figer J1)**

| **⚠️  Ce contrat doit être finalisé dans les 2 premières heures de J1 par : LEAD + BD1 + BD2** |
| --- |

| **Endpoint** | **Méthode** | **Entrée (body)** | **Sortie attendue** |
| --- | --- | --- | --- |
| **/api/context-reader** | POST | { texte: string } | { memeTexte: string, imageUrl?: string } |
| **/api/voice-to-meme** | POST | { audio: file } | { transcription: string, memeTexte: string, imageUrl?: string } |
| **/api/status-remixer** | POST | { image: file } | { memeTexte: string, imageUrl: string } |

*Ce contrat est une proposition de départ. À valider et ajuster en équipe dans les premières heures du J1, puis à documenter dans docs/contrat-api.md. Aucun appel réseau côté mobile ne doit commencer avant la validation de ce contrat.*

KERNEL FORGE — Université de Yaoundé I — ICT202 — 2026

Document préparé par Archlord · Version 3.0