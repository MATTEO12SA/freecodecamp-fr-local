# CLAUDE.md

Ce fichier guide Claude Code (claude.ai/code) lorsqu'il travaille sur le code de ce dépôt.

## Ce Qu'Est Ce Dépôt

Un fork francophone de freeCodeCamp dont le **parcours principal tourne en local** : pas d'Auth0, pas de MongoDB, aucun backend nécessaire pour apprendre. Le client Gatsby est servi sur `http://localhost:8000`, la progression de l'utilisateur vit dans le `localStorage`, et le curriculum est patché pour afficher le contenu français de `curriculum/i18n-curriculum/curriculum/challenges/french/` quand il existe, avec repli sur l'anglais sinon.

L'audit du 26 juillet 2026 a été corrigé sans changer le principe local-first :
les parcours locaux ne chargent plus GTM, Google Analytics ou Stripe et
`exam-download` ne monte plus les hooks backend en mode local. Les constats
historiques restent dans
[`AUDIT_COMPLET_APPLICATION.md`](AUDIT_COMPLET_APPLICATION.md), leur état final
dans [`docs/AUDIT-FIX-TRACKER.md`](docs/AUDIT-FIX-TRACKER.md) et les preuves dans
[`docs/AUDIT-FIX-REPORT.md`](docs/AUDIT-FIX-REPORT.md).

Forme du répertoire de travail :

```
Nouveau dossier/
├── curriculum/i18n-curriculum/   # Fichiers .md des challenges FR (la cible de traduction)
└── freeCodeCamp/                  # Le fork lui-même — espace de travail principal
```

Toutes les commandes ci-dessous se lancent depuis `freeCodeCamp/`. Le shell est **PowerShell** sous Windows ; utiliser la syntaxe PowerShell (`$env:VAR`, backticks, `.\dev.ps1`). Bash marche pour les scripts POSIX, mais le lanceur de dev est PowerShell uniquement.

## Commandes Quotidiennes

```powershell
.\dev.ps1                          # Démarre Gatsby en mode rapide (saute le setup turbo si les fichiers générés existent)
.\dev.ps1 -Clean                   # Vide le cache Gatsby puis démarre
.\dev.ps1 -Full                    # Force le setup turbo complet (chemin lent)

.\dev-check.ps1                    # Instantané : UP / STARTING / ZOMBIE / DOWN (exit 0/3/2/1)
.\dev-check.ps1 -Wait -Timeout 600 # Bloque jusqu'à UP
.\dev-check.ps1 -Open              # Ouvre /cours-fr quand UP
```

`status.json` peut mentir (crash sans nettoyage → bloqué en STARTING/UP ; rebuild Gatsby → port temporairement fermé). **Toujours utiliser `dev-check.ps1` pour un verdict réel** — il combine `status.json` + processus node + HTTP HEAD `localhost` + fallback TCP IPv4/IPv6.

## Lint / Vérification De Types / Tests

```powershell
pnpm -C curriculum lint-challenges                              # Valide la structure des .md de challenges
pnpm -C curriculum lint-challenges --superblock <superblock>    # Lint ciblé
pnpm exec tsc --noEmit --pretty false -p client/tsconfig.json   # Typecheck du client
pnpm --filter @freecodecamp/shared type-check
pnpm lint-root                                                  # Suite de lint racine

pnpm local:check        # HTTP + drift + tests catalogue + lint JS v9 + typecheck client/shared + garde liens externes — verdict pré-push
pnpm local:check:full   # Ajoute lint client/racine, parcours, réseau/console et Axe strict (serveur UP requis)
pnpm local:report       # Régénère l'instantané /dev-fr (client/static/local-dev/report.json)
```

`axe-test.mjs --strict` compte les pages demandées, chargées, scannées, ignorées
et échouées. Une page inaccessible, un timeout, un scan ignoré ou zéro page
scannée produit un code non nul ; `axe-test-regression.mjs` protège ce
comportement.

Statut des traductions (lecture seule, pas de serveur nécessaire) :

```powershell
node tools/translation-status.js        # Avancement FR par cert v9 — niveau fichier (.md FR/EN) + blocs
node tools/check-translation-drift.js   # .md EN modifié après son équivalent FR (repli mtime hors git) — exit 1 en cas de drift
node tools/check-external-links.js      # Échoue si un lien de navigation externe non allowlisté apparaît dans client/src
```

Logique partagée de scan FR (chemins, blocs traduits, structure superblock) centralisée dans `tools/lib/curriculum-fr.js` — l'utiliser plutôt que de réécrire un scan.

Smoke tests navigateur (le serveur doit tourner) :

```powershell
node smoke-test.mjs
node submit-test.mjs
node persist-test.mjs
node full-flow-test.mjs
```

## Workflow De Traduction

Les traductions vivent dans `curriculum/i18n-curriculum/curriculum/challenges/french/blocks/<block>/<id>.md` — même `id` et même nom de fichier que l'original anglais à `curriculum/challenges/english/blocks/<block>/<id>.md`.

Pour les workshops et les lectures JS, utiliser le **pipeline de sécurité** `tools/translate-workshop.js` — il ne traduit jamais à ta place : il extrait la prose en JSON, puis reconstruit le `.md` FR depuis le template EN pour que les blocs de code, assertions, sélecteurs, IDs, URLs, seeds, solutions et frontmatter technique restent à l'identique :

```powershell
node tools/translate-workshop.js extract <block>   # Écrit tools/translations/<block>.json
# Traduire le JSON manuellement, mettre reviewed: true, scanner les restes
node tools/translate-workshop.js apply <block>     # Reconstruit le .md FR depuis les templates EN + JSON
node tools/translate-workshop.js verify <block>    # Diff des blocs techniques EN/FR
```

Le JSON a trois modes : `kind: "workshop"` (description/hints), `kind: "lecture"` (description/interactive/questions/answers/feedback pour les lectures JS ; les reviews `challengeType 31` ajoutent `# --assignment--`) et `kind: "quiz"` (`challengeType 8` : `#### --text--`/`--distractors--`/`--answer--`). Les distracteurs en code ou backticks et les separateurs `---` restent verbatim.

Avant `apply`, scanner le JSON contre les restes anglais/hybrides — `undefined`, `Hint non traduit`, `should`, `Your`, `The/the`, `matching the`, `but found`, `a doit`, `un règle`. Les chaînes techniques en backticks peuvent rester en anglais si les tests l'exigent.

Les scripts helpers jetables de pré-remplissage sont permis pendant un workshop mais **ne doivent pas être committés** — seuls le JSON relu, les `.md` FR, les docs et les changements d'outillage intentionnels sont livrés.

## Architecture : Comment Un `.md` Traduit Devient Une Page Visible

```
curriculum/i18n-curriculum/.../french/blocks/<block>/<id>.md
   ↓ au boot : pnpm setup → tsc compile la lib curriculum → build-curriculum produit curriculum/generated/curriculum.json (~110 Mo)
   ↓
client/utils/build-challenges.js lit curriculum.json (filtré par CURRICULUM_LOCALE=french)
   ↓
tools/client-plugins/gatsby-source-challenges/gatsby-node.js
   • sourceNodes() : 1 node Gatsby par challenge
   • WATCHER (voir ci-dessous) pour le hot-reload
   • createPagesStatefully() : 1 page par node
   ↓
client/public/page-data/.../page-data.json  ← ce que le navigateur fetch
```

### Le Watcher (Critique — À Lire Avant De Toucher Au Plugin)

Sur ce setup Windows + Defender + « Nouveau dossier », le polling de chokidar ratait les events `change`/`add`/`unlink` tout en coûtant un `stat()` par `.md` surveillé à chaque cycle (1700+ fichiers). Le plugin choisit donc le watcher **selon la plateforme** :

- **Windows** : chokidar tourne en `usePolling: false` (silencieux/économe), et **deux fallbacks natifs Node** font le vrai travail :
  1. `fs.watchFile` (stat-polling Node) attaché à chaque `.md` existant au boot — gère les éditions de fichiers déjà connus.
  2. `fs.watch(recursive: true)` sur la racine du curriculum — gère les **nouveaux** fichiers (workshops, nouveaux blocs). À la détection, il attache un `fs.watchFile` et déclenche `handleChallengeUpdate(..., 'added')`.
- **Linux/macOS** : chokidar (fs.watch natif) est le watcher principal ; les fallbacks natifs sont désactivés pour ne pas traiter chaque changement deux fois.

Garde-fous : les events `changed` dupliqués (watchers qui se chevauchent, éditeur qui sauve deux fois) sont absorbés par un debounce (`CHANGE_DEBOUNCE_MS`, 700 ms), et `createSuperBlockStructureNodes()` n'est plus rejoué sur une simple édition de contenu (seulement à l'ajout/suppression d'un fichier). Réglages : `FCC_WATCH_INTERVAL` (intervalle `fs.watchFile`, défaut 1000 ms), `FCC_FORCE_NATIVE_WATCH=true` (force les fallbacks natifs sur toute plateforme).

Latence : édition du `.md` → ~5 s → `Ctrl+Shift+R` dans le navigateur → nouveau contenu. Confirmer via `dev-logs/latest.log` :

```powershell
Select-String -Path dev-logs\latest.log -Pattern "watcher.|challenge.integrating|challenge.integrated|intro.integrated" | Select-Object -Last 10
```

Events de log clés : `watcher.added`, `watcher.changed`, `watcher.touched`, `challenge.integrating`, `challenge.integrated`, `intro.changed`, `intro.integrated`.

### Détection Des Blocs Traduits (`hasFrenchIntro`)

`/cours-fr` (le badge `🚧 Traduction à venir`) et `/catalog` (le filtre `Theme > Francais`) partagent une seule source de vérité : `client/src/utils/has-french-intro.ts`. La fonction `hasFrenchIntro(superBlock)` renvoie true si le cert/module a au moins un `.md` traduit.

La liste est **construite au build via `preval` (macro Babel)** qui scanne `curriculum/i18n-curriculum/.../french/blocks/` et croise avec `curriculum/structure/superblocks/*.json`. Zéro maintenance manuelle.

Quand un bloc FR tout neuf est créé en cours de session, le plugin Gatsby appelle `fs.utimesSync` sur `has-french-intro.ts` pour invalider le cache preval — Webpack réévalue, le HMR pousse le nouveau bundle, le filtre `/catalog` et le badge `/cours-fr` se mettent à jour en live. Confirmation : `watcher.touched [fcc-source-challenges] touched has-french-intro.ts (new block <name>)` dans `latest.log`.

`preval` ne tourne pas sous vitest. `client/src/utils/__mocks__/has-french-intro.ts` fournit le mock de test ; les tests font `vi.mock('../utils/has-french-intro')`.

### `intro.json` (Titres De Blocs/Modules/Chapitres) Est Séparé

`client/i18n/locales/french/intro.json` n'est PAS surveillé par le plugin challenges. Après l'avoir édité, régénérer les données statiques du curriculum :

```powershell
$env:CURRICULUM_LOCALE='french'; $env:CLIENT_LOCALE='french'
pnpm -C curriculum build
pnpm -C client create:external-curriculum
```

`dev.ps1` surveille `intro.json` à part pendant que le serveur tourne — chercher les lignes `intro.changed` → `intro.integrated` avec `serverPath=/learn/<superblock>/`.

## Comportements Spécifiques Au Local (Ne Pas « Corriger »)

Ce sont des écarts intentionnels du fork vis-à-vis de l'upstream — restaurer le comportement upstream casse le parcours local :

- **Utilisateur sans auth** : `client/src/redux/fetch-user-saga.js` construit un utilisateur local au lieu d'appeler une session serveur.
- **Progression en localStorage** : `client/src/utils/local-progress.ts` lit/écrit la progression ; `client/src/redux/local-progress-epic.js` la persiste après `submitComplete`.
- **AJAX backend neutralisé pour le parcours principal** : `client/src/utils/ajax.ts` garde les signatures HTTP mais renvoie des réponses locales. Les templates upstream doivent utiliser la détection centralisée du mode d'exécution avant de monter leurs hooks réseau.
- **Examen local** : `client/src/pages/exam-fr.tsx` remplace le flux Tauri `exam-environment://` + JWT + Auth0 par un examen 100 % local (80 questions tirées des blocs `quiz-*` traduits, 70 % pour réussir, historique/stats par module/révision des erreurs via `client/src/utils/exam-history.ts`, clé `fcc-exam-history`).
- **Page exam-download locale** : les boutons upstream cassés ont été retirés et le lien « Passer l'examen en français » est visible. En mode local, `LocalExamPrerequisites` remplace entièrement `ExamPrerequisites`, donc aucun hook RTK Query, token ou appel au port 3000 n'est monté.
- **`cours-fr.tsx` allégé** : 3014 → 357 lignes. La liste codée en dur `CERTIFICATIONS[].blocks` a été retirée au profit de `hasFrenchIntro()`. Ne pas réintroduire de liste manuelle.
- **Fonctionnalités retirées** : widget+routes Daily Challenge, HelpModal (retourne null), composants+saga Donation, MobileAppModal (null), composant share, lanceurs CodeAlly/Ona/Codespaces, `/blocked`, `/status/version`. `challengeTypes.exam` et `challengeTypes.examDownload` sont volontairement ré-autorisés pour que l'examen apparaisse dans l'accordéon `/cours-fr`.
- **Neutralisation des liens et services externes** : le layout principal supprime `href`/`target` des ancres externes restantes. Le mode local empêche également l'initialisation analytics et l'import Stripe ; `local-network-test.mjs` vérifie ces domaines sur sept routes.

## Pages

```
/             → route vers /cours-fr
/cours-fr     → certifications françaises, barre de progression locale, accès examen
/catalog      → catalogue avec filtre Theme>Francais + progression locale
/learn        → parcours d'apprentissage local complet
/dev-fr       → hub dev (lit client/static/local-dev/report.json issu de pnpm local:report)
/exam-fr?cert=<superblock>  → examen FR local
```

`/dev-fr` est une route **strictement développeur**. Son bouton « Relire le
snapshot » refetch le JSON statique, il ne relance pas `pnpm local:report`. Son
lecteur d'historique prend en charge le format versionné `{ version, byCert }`,
l'ancien tableau et les données corrompues. Le build public supprime `/dev-fr`,
son entrée de menu et `/___graphql`.

## Logs

`dev-logs/` est permanent et mis à jour à chaque exécution de `dev.ps1` :

```
status.json    — STARTING / UP / DOWN / ERROR + mode + dernier problème (peut mentir)
latest.log     — transcript lisible
```

`server.log` et `errors.log` sont d'anciens chemins de diagnostic. Le `dev.ps1` actuel ne les réécrit plus ; utiliser `latest.log` pour les événements et erreurs.

Pattern tail-and-filter :

```powershell
Get-Content dev-logs\latest.log -Wait | Select-String -Pattern "status.up|status.error|watcher.|challenge.integrating|challenge.integrated|intro.integrated"
```

## Carte De La Documentation

Les docs détaillés vivent dans `docs/`. `README.md`, `LICENSE.md`, ce `CLAUDE.md` et l'audit navigateur restent à la racine :

- `README.md` — vue d'ensemble du démarrage (racine)
- `docs/README.md` — index des docs, commandes et pages locales
- `docs/QUICKSTART.md` — commandes courtes et recettes de vérification
- `docs/DOCS-FR.md` — détail technique complet du fork (décisions de nettoyage, mécanisme de hot-reload, internals de l'examen)
- `docs/HANDOFF-TRADUCTIONS.md` — état exact des traductions, prochaine cible, pièges connus
- `docs/OPTIMIZE-TRANSLATIONS.md` — workflow qualité accumulé sur les gros workshops
- `docs/TOOLS-REPORT.md` — ce que fait chaque script sous `tools/`
- `docs/ROADMAP.md` — vagues d'audit terminées, maintenance et évolutions produit
- `docs/AUDIT-FIX-TRACKER.md` — statut et preuves des 29 constats
- `docs/AUDIT-FIX-REPORT.md` — rapport final des corrections et validations
- `AUDIT_COMPLET_APPLICATION.md` — audit navigateur de référence (29 constats, captures, réseau, Axe, responsive, trois moteurs)
- `dev-logs/README.md` — référence des events de log

## État Des Traductions (à la dernière mise à jour — vérifier avec `node tools/translation-status.js`)

- **JavaScript v9** : 126/230 blocs, 535/1311 fichiers — modules 1-8 **100 % complets**. Module 9 `dom-manipulation-and-events` : 8/12. Prochaine cible : relire `tools/translations/workshop-rps-game.json` (`reviewed: false` — ne pas appliquer). Le pipeline gère lectures, workshops/labs, reviews et quizzes.

## Pièges

- `.husky/pre-push` utilise `xargs -n 50` pour éviter le bug Windows « ligne de commande trop longue » sur les gros workshops — à garder.
- Le slug d'URL `responsive-web-design-v9` apparaît partout sous la forme `serverPath=/learn/responsive-web-design-v9/` ; c'est la clé de superblock du cert, pas une faute.
- Gatsby peut n'écouter que sur `::1` sous Windows alors que `127.0.0.1:8000` refuse — `dev.ps1` et `dev-check.ps1` testent donc `localhost`/IPv6 avant de conclure que le serveur est down.
- `client/static/local-dev/report.json` est git-ignored — le régénérer avec `pnpm local:report` si `/dev-fr` dit qu'il manque.
- Le filtre `Theme > Francais` reste fondé sur la présence réelle de fichiers FR,
  mais chaque carte calcule désormais un statut `absent` / `partial` /
  `complete`. Ne pas confondre une carte partielle avec une certification
  entièrement traduite.
- Une session d'examen en cours est versionnée dans `fcc-exam-session`, par
  certification, avec une expiration de sept jours. Le dernier écran confirme
  les réponses manquantes avant de calculer le score.
