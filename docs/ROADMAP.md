# ROADMAP — freeCodeCamp FR Local

> Plan vivant du fork local francophone. La première version datait du
> 29 mai 2026 ; cette version est réordonnée depuis
> [l'audit navigateur du 26 juillet 2026](../AUDIT_COMPLET_APPLICATION.md),
> réalisé sur `main` au commit `8fa33f421b`.

L'objectif prioritaire reste une application locale fiable, privée, accessible
et cohérente en français. Les quatre vagues correctives de l'audit sont
terminées. Les fonctions décoratives ou de rétention restent dans la vague 5 et
ne doivent pas affaiblir les garanties acquises.

Le suivi détaillé des 29 constats vit dans
[AUDIT-FIX-TRACKER.md](AUDIT-FIX-TRACKER.md). Cette roadmap indique l'ordre de
travail ; le tracker indique l'état de chaque défaut et
[AUDIT-FIX-REPORT.md](AUDIT-FIX-REPORT.md) rassemble les validations finales.

## Hiérarchie De Confiance

En cas de contradiction :

1. comportement réellement observé dans le navigateur ;
2. tests fiables, console et traces réseau ;
3. code actuel ;
4. audit du 26 juillet 2026 ;
5. documentation ;
6. ancienne roadmap.

Un statut n'est jamais considéré comme vrai uniquement parce qu'il est écrit
dans ce document.

## Diagnostic Vérifié

### Résultat de l'audit

- L'audit initial compte **29 problèmes** : 4 élevés, 17 moyens et 8 faibles.
- État final : **28 corrigés**, **1 non reproduit en production**, aucun
  partiellement corrigé, reporté ou encore ouvert.
- Le détail par constat est dans
  [AUDIT-FIX-TRACKER.md](AUDIT-FIX-TRACKER.md), la synthèse dans
  [AUDIT-FIX-REPORT.md](AUDIT-FIX-REPORT.md).
- Le parcours principal reste local, sans compte et sans backend obligatoire.
- Chromium, Firefox et WebKit couvrent sept routes avec zéro télémétrie,
  zéro Stripe, zéro port 3000, zéro erreur console et zéro warning audité.
- Axe strict a chargé et scanné 10/10 pages ou états, sans page ignorée,
  échec ou violation sérieuse.

### Tests et QA

L'ancienne affirmation « 0 test sur le code custom » était fausse. Les tests
d'intégration et end-to-end existaient déjà. La campagne ajoute des tests
unitaires pour les modes d'exécution, filtres catalogue, statut de traduction,
navigation, sessions et historique d'examen, snapshot, certifications et
groupes FR, plus des régressions navigateur, réseau, console, Axe et production.

La CI du fork et les contrôles locaux restent deux sujets distincts :

- **Infrastructure CI : terminée.** `.github/workflows/fork-ci.yml` est actif et
  les workflows upstream incompatibles sont désactivés.
- **Couverture CI : encore ciblée.** Elle contrôle typecheck partagé, drift et
  liens externes. Les parcours multi-moteurs, Axe et le build Gatsby restent des
  contrôles locaux explicites à cause de leur coût.
- **Axe : fiable en strict.** Zéro page scannée, timeout, page inaccessible ou
  ignorée produit un code non nul et une régression automatisée protège ce
  comportement.

### Local-first et publication

- Le mode d'exécution `local` / `development` / `public` est centralisé dans
  `client/config/runtime-mode.ts`.
- `exam-download` calcule ses prérequis localement sans monter les hooks RTK
  Query en mode local.
- Analytics et Stripe ne sont ni initialisés ni importés en mode local.
- `/dev-fr`, son menu et `/___graphql` sont absents du build public.
- Le build de production génère 18 716 pages et présente une vraie 404
  utilisateur.
- AUD-29 n'est pas reproduit en production : 5,51 MiB décodés sur l'accueil,
  10,64 MiB sur le catalogue et 16,98 MiB sur l'éditeur, contre 25,7 à
  95,1 MiB dans Gatsby Develop.

### États produit

- L'examen en cours est versionné dans `fcc-exam-session`, restaurable par
  certification et expiré après sept jours.
- La fin confirme les réponses vides ; les résultats sont résumés, filtrables et
  repliés.
- `/cours-fr` et `/catalog` synchronisent leurs états partageables dans l'URL.
- Le catalogue affiche progression, statut FR précis, 12 cartes initiales,
  chargement progressif et trois colonnes sur grand écran.
- Les certifications disponibles et les traductions à venir sont séparées.

### Traduction

- `tools/translate-workshop.js` prend en charge `extract`, `apply` et `verify`
  pour workshops, labs, lectures, reviews et quizzes.
- Claude reste le seul rédacteur du français final. Aucune prétraduction
  automatique, aucun phrasebook et aucune regex ne valide une traduction.
- `tools/translations/lexique-fr.md` fixe le style et la terminologie.
- `check-translation-quality.js`, `translation-status.js` et
  `check-translation-drift.js` contrôlent sans écrire la traduction.
- Le catalogue combine présence FR automatique et statut
  `absent` / `partial` / `complete` par carte.
- État curriculum : JavaScript v9 `121/230` (468/1311 fichiers), modules 1 à 8 complets ; module 9
  `dom-manipulation-and-events` à 3/12 (`lab-lightbox-viewer` déjà traduit). Prochaine cible :
  relire `lecture-working-with-the-dom-click-events-and-web-apis` (`reviewed: false` — ne pas
  appliquer), puis `workshop-storytelling-app`.

## Principes Non Négociables

- Aucun compte, Auth0 ou backend obligatoire.
- Aucune télémétrie ni aucun SDK de paiement en mode local.
- Aucune requête au port 3000 pour un parcours local.
- Données utilisateur conservées dans le navigateur et formats versionnés.
- Fonctionnement essentiel sans Internet.
- Changements du fork isolés et divergence upstream limitée.
- Aucun composant upstream nécessaire au build supprimé sans preuve.
- Code, tests, IDs, sélecteurs et chaînes techniques du curriculum restent
  verbatim.
- Le chrome général français est prioritaire sur une traduction exhaustive du
  curriculum pendant l'audit.
- Un test qui ne charge ou ne scanne rien doit échouer.
- Chaque correction reproduite reçoit une régression automatisée adaptée.

---

# Vague 1 — Fiabilité Locale Et QA

**Statut : TERMINÉE.** Les quatre défauts élevés sont corrigés et protégés par
des régressions.

## AUD-01 — Recherche du catalogue en thème sombre

- Définir fond, texte, placeholder, bordure, focus et autofill dans les deux
  thèmes.
- Atteindre un contraste d'au moins 4,5:1.
- Ajouter une régression automatisée spécifique au thème sombre.

## AUD-02 — GTM, Google Analytics et Stripe

- Centraliser une détection testable du mode local.
- Empêcher l'initialisation analytics et les imports à effets de bord en local.
- Garantir zéro requête vers GTM, GA et tous les domaines Stripe audités.
- Ajouter un test réseau Playwright bloquant.

## AUD-03 — Backend de `exam-download`

- Ne pas monter les hooks RTK Query, tentatives ou génération de token en local.
- Afficher uniquement les prérequis réellement locaux et le bouton `/exam-fr`.
- Ajouter une régression réseau garantissant zéro requête au port 3000.

## AUD-04 — Faux vert Axe

- Remplacer l'attente `networkidle` inadaptée.
- Compter pages demandées, chargées, scannées, ignorées et échouées.
- Échouer en strict sur timeout, page ignorée, injection Axe impossible ou zéro
  page scannée.
- Couvrir clair, sombre et états dynamiques importants.
- Ajouter un test volontairement inaccessible qui doit sortir non-zéro.

**Sortie validée :** recherche sombre AA, zéro GTM/GA/Stripe, zéro port 3000,
Axe strict incapable de produire un faux vert.

---

# Vague 2 — Accessibilité Et Publication

**Statut : TERMINÉE.** Les données du hub, le socle d'accessibilité, les modes
d'exécution et le build public ont été validés.

## Données et exposition développeur

- `AUD-05` : lire correctement l'historique versionné dans `/dev-fr`.
- `AUD-06` : séparer explicitement les modes développement, local et public ;
  masquer `/dev-fr`, son snapshot, les entrées de menu et GraphiQL hors mode
  développeur.

## Accessibilité commune

- `AUD-07` : fournir un unique `<main id="content-start" tabIndex={-1}>`.
- `AUD-08` : ajouter un titre document et une hiérarchie de titres correcte au
  catalogue.
- `AUD-09` : supprimer le `main` imbriqué de `/dev-fr` et rendre les logs
  scrollables nommés et focusables.
- `AUD-10` : corriger les contrastes du footer et de l'accueil dans les deux
  thèmes.
- `AUD-19` : présenter une certification inconnue comme une erreur métier.

## Publication et mesure de référence

- Vérifier la séparation développement/local/public dans un build de production.
- `AUD-20` : vérifier la vraie 404 du build produit ; ne pas modifier l'écran
  technique normal de `gatsby develop`.
- Produire une première mesure de performance du build de production. Cette
  mesure sert de référence à `AUD-29`, sans optimisation prématurée.

**Sortie validée :** Axe strict vert, parcours clavier validé, outils dev
absents du build public et 404 utilisateur vérifiée.

---

# Vague 3 — États Et Navigation

**Statut : TERMINÉE.** URL, F5, Retour, reprise d'examen et vérité du snapshot
sont couverts par tests unitaires et navigateur.

- `AUD-11` : synchroniser les sous-vues de `/cours-fr` avec une URL partageable
  et l'historique navigateur.
- `AUD-12` : persister une session d'examen versionnée et proposer
  Reprendre/Recommencer.
- `AUD-13` : confirmer la fin lorsqu'il reste des réponses vides et prévenir le
  double envoi.
- `AUD-14` : résumer les résultats, replier les détails et filtrer
  erreurs/non-réponses.
- `AUD-16` : synchroniser recherche et filtres du catalogue avec les paramètres
  `q`, `level` et `topic`.
- `AUD-23` : remplacer le faux « Rafraîchir » par « Relire le snapshot », afficher
  l'âge et la commande qui régénère réellement les données.

La logique pure extraite pour cette vague doit recevoir des tests unitaires :
session, tirage, score, migration du stockage, historique et progression.

**Sortie validée :** retour, F5, partage d'URL et reprise conservent ou
expliquent chaque état important.

---

# Vague 4 — Catalogue, Traduction Et Finitions

**Statut : TERMINÉE.** Tous les constats de cette vague sont corrigés, sauf
AUD-29 classé non reproductible dans le build de production après mesure.

- `AUD-15` : remplacer le statut FR binaire par complet, partiel ou absent au
  niveau pertinent.
- `AUD-17` : paginer ou charger progressivement le catalogue et ajouter un retour
  haut.
- `AUD-18` : traduire le chrome général uniquement : titres de structure,
  boutons, messages génériques, archives, 404 et « Bon retour, You. ». Ne pas
  lancer la traduction des 18 717 pages.
- `AUD-21` : restaurer le focus du déclencheur après fermeture du dropdown.
- `AUD-22` : supprimer les warnings console actionnables, après retrait des
  trackers locaux.
- `AUD-24` : maintenir le footer en bas des pages courtes.
- `AUD-25` : rendre le tableau `/dev-fr` réellement lisible sur mobile.
- `AUD-26` : clarifier partout le caractère local, personnel et non officiel.
- `AUD-27` : utiliser une grille catalogue efficace sur grand écran.
- `AUD-28` : distinguer clairement contenu disponible en français et fallback
  anglais.
- `AUD-29` : comparer les métriques du build de production à la référence de la
  vague 2, puis seulement lazy-loader, paginer ou ajouter des budgets si les
  coûts restent excessifs.

`AUD-23` appartient à la vague 3, même s'il se trouve numériquement entre
`AUD-21` et `AUD-28`; il n'est pas dupliqué ici.

La QA de traduction doit être branchée dans les contrôles du dépôt lorsqu'elle
est fiable. La traduction française reste écrite et relue par Claude, jamais
générée automatiquement.

**Sortie validée :** catalogue progressif et fidèle à sa couverture FR, chrome
cohérent, console exploitable et performances mesurées sur la production.

---

# Vague 5 — Évolutions Produit

**Statut : À PRIORISER APRÈS LA CAMPAGNE D'AUDIT.**

Ces éléments restent volontairement après les quatre vagues correctives :

1. célébrations/confettis avec `prefers-reduced-motion` ;
2. onboarding du premier lancement ;
3. export/import du profil local ;
4. bouton global Continuer ;
5. répétition espacée (SRS) ;
6. XP et niveaux ;
7. séries d'activité ;
8. badges et succès ;
9. PWA et hors-ligne avancé ;
10. certificats locaux clairement non officiels ;
11. défi du jour local ;
12. nouveaux formats d'exercices.

Ces fonctions ne doivent jamais retarder une correction de fiabilité,
confidentialité, accessibilité, persistance ou publication.

## Maintenance Transversale

- Documenter la stratégie de synchronisation upstream et les fichiers patchés.
- Garder les contrôles traduction, drift, liens, réseau, console et Axe
  déterministes.
- Mettre à jour le tracker après chaque reproduction, correction et preuve
  navigateur.
- Ne conclure à aucune amélioration de production depuis `gatsby develop`.
- Conserver les preuves sous `screenshots/` avec le navigateur, la résolution,
  le thème et la date.

---

_Règle d'or : corriger d'abord un problème mesuré, ajouter sa régression, puis
mettre à jour le tracker. Une vague ne commence que lorsque la précédente est
validée._
