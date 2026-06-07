# Handoff Traductions FR — freeCodeCamp Local Fork

Ce fichier contient toutes les informations nécessaires pour continuer le travail de traduction du curriculum freeCodeCamp en français dans une nouvelle session Claude.

## Contexte Projet

- **Repo local** : racine du depot `freecodecamp-fr-local`
- **Remote** : `https://github.com/MATTEO12SA/freecodecamp-fr-local.git` (alias `standalone`, branche `main`)
- **Objectif** : traduire le superblock `javascript-v9` du curriculum freeCodeCamp en français.
- **Source EN** : `curriculum/challenges/english/blocks/<bloc>/<id>.md`
- **Cible FR** : `curriculum/i18n-curriculum/curriculum/challenges/french/blocks/<bloc>/<id>.md` (même `id`, même nom de fichier)

## État Actuel — Ce Qui Est Fait

### JavaScript v9 — Modules 1-6 Terminés (80/230)

État actuel : 80 blocs FR sur 230. Les modules `javascript-variables-and-strings` (20/20), `javascript-booleans-and-numbers` (16/16), `introduction-functions-in-javascript` (12/12), `introduction-to-arrays-in-javascript` (7/7), `introduction-to-objects-in-javascript` (10/10) et `javascript-loops` (15/15) sont **100 % traduits** (contenu `.md` + titres/intros `intro.json` aux deux occurrences). Module 6 = `lecture-working-with-loops` (5 leçons) + 5 workshops (`workshop-word-counter` 11, `workshop-sentence-analyzer` 8, `workshop-space-mission-roster` 32, `workshop-heritage-library-catalog` 30, `workshop-festival-crowd-flow-simulator` 33) + 7 labs + `review-javascript-loops` + `quiz-javascript-loops`. Prochaine cible : module 7 `review-javascript-fundamentals` (clé intro.json `review-javascript-fundamentals`).

Note pièges (vus module 5) : si une description de lab a un chunk de prose vide entre deux blocs de code (ex. cargo-manifest-validator, ligne « Example return value » suivie d'un bloc js), l'extracteur crée un chunk `{en:"",fr:""}` — `apply` exige alors un fr non vide. Fix : supprimer ce chunk vide du JSON (replaceChunks ignore les chunks vides à l'origine, donc les comptes restent alignés). À ne pas confondre avec le faux positif d'espace dans `# --hints--` (module 3 loan-checker) où il faut au contraire garder le chunk avec fr=" ".

Note pièges connus du pipeline (vus module 3) : le `verify` custom de `translate-workshop.js` peut crier `nombre de blocs de prose dans # --hints-- modifie` quand une étape EN a une ligne blanche avec un espace (` `) entre le dernier bloc de code et `# --seed--` (ex. loan-qualification step-3) — c'est un faux positif d'espace, le `.md` rendu est identique. Autorité finale : `pnpm -C curriculum lint-challenges --superblock javascript-v9` (doit sortir exit 0).

Attention : les lectures JS utilisent surtout `# --description--`, `# --interactive--`, `# --questions--`, `## --answers--` et `### --feedback--` (`kind: "lecture"`). Les reviews (`challengeType 31`) passent par le même mode lecture, avec `# --assignment--` ajouté aux marqueurs de prose. Les quizzes (`challengeType 8`) utilisent `kind: "quiz"` : seuls `# --description--`, `#### --text--`, `#### --distractors--` et `#### --answer--` sont traduits ; distracteurs en code/backticks et séparateurs `---` restent verbatim. Traduire le JSON manuellement, puis `apply`/`verify`/`check-translation-quality`.

Pour vérifier en live quels blocs d'un superblock restent à traduire :

```powershell
pwsh -Command "
  \$structure = Get-Content -Raw curriculum/structure/superblocks/javascript-v9.json | ConvertFrom-Json
  \$allBlocks = @()
  foreach (\$c in \$structure.chapters) { foreach (\$m in \$c.modules) { foreach (\$b in \$m.blocks) { \$allBlocks += \$b }}}
  \$fr = (Get-ChildItem -Directory 'curriculum/i18n-curriculum/curriculum/challenges/french/blocks/').Name
  \$allBlocks | Where-Object { \$_ -notin \$fr }"
```

## Infrastructure Mise En Place (Tous Pushed)

### Détection Automatique Des Certifications Traduites

[client/src/utils/has-french-intro.ts](../client/src/utils/has-french-intro.ts) — fonction `hasFrenchIntro(superBlock)` qui sait si un cert ou module a au moins un challenge FR. **Liste générée au build via `preval`** qui scanne `curriculum/i18n-curriculum/.../french/blocks/` et croise avec `curriculum/structure/superblocks/*.json`. Zéro maintenance manuelle.

Utilisé par :

- [client/src/pages/cours-fr.tsx](../client/src/pages/cours-fr.tsx) — affiche le badge "🚧 Traduction à venir" sur les certs non traduites.
- [client/src/pages/catalog.tsx](../client/src/pages/catalog.tsx) — filtre `Theme > Francais` du catalogue.

**Live update (sans restart)** : [tools/client-plugins/gatsby-source-challenges/gatsby-node.js](../tools/client-plugins/gatsby-source-challenges/gatsby-node.js) détecte les nouveaux blocs FR via `fs.watch` recursive. Quand un block FR jamais vu apparaît, il `fs.utimesSync` sur `has-french-intro.ts` pour forcer Webpack à ré-évaluer le preval. Confirmation dans `dev-logs/latest.log` :

```
watcher.touched [fcc-source-challenges] touched has-french-intro.ts (new block <name>)
```

Test bout-en-bout vérifié : créer un nouveau dossier `blocks/<x>/` avec un `.md` → `watcher.added` + `watcher.touched` + Webpack `Re-building development bundle` en <1s.

### Examen Local FR

[client/src/pages/exam-fr.tsx](../client/src/pages/exam-fr.tsx) — page d'examen 100% locale, accessible via `/exam-fr?cert=<superblock>`. Tire au hasard 80 questions parmi tous les `quiz-*` traduits de la cert, distractors mélangés, score à la fin, 70% pour réussir.

L'examen a une mémoire locale (tout dans `localStorage`, aucune API) :

- **Historique** : chaque examen complet est enregistré via [client/src/utils/exam-history.ts](../client/src/utils/exam-history.ts) (clé `fcc-exam-history`). L'écran d'intro affiche les 5 dernières tentatives (date + score + %). Les révisions ne sont pas enregistrées.
- **Stats par module** : l'écran résultats regroupe les questions par bloc source (`sourceBlock`) et affiche un tableau « Réussite par module » trié du plus faible au plus fort.
- **Révision ciblée** : un bouton « Réviser mes erreurs » relance un mini-examen composé uniquement des questions ratées (réutilise les `PreparedQuestion` en mémoire, pas de nouveau tirage du pool).

[client/src/templates/Challenges/exam-download/show.tsx](../client/src/templates/Challenges/exam-download/show.tsx) a été nettoyé : seul le bouton "Passer l'examen en français" est gardé. Les boutons cassés (`Open Exam Environment`, `Generate Exam Token`, `Attempts`, downloads .exe, support email) sont supprimés — ils dépendent de l'API + Auth0 freeCodeCamp qui n'existent pas dans le fork.

L'examen apparaît dans l'accordéon `/cours-fr` (filtre `examDownload` retiré de [client/src/pages/cours-fr.tsx](../client/src/pages/cours-fr.tsx)).

### `cours-fr.tsx` Refactoré

Passé de 3014 lignes → 357 lignes. La grosse liste `CERTIFICATIONS[].blocks: [...]` codée en dur (~2700 lignes de boilerplate stale) a été supprimée. Le badge "🚧 Traduction à venir" se calcule via `hasFrenchIntro(cert.key)`.

**Progression réelle** : la vue d'une certification lit les challenges complétés depuis `localStorage` (`getLocalCompletedChallenges` de [client/src/utils/local-progress.ts](../client/src/utils/local-progress.ts)) et les passe à `SuperBlockAccordion` (coches ✓) + affiche une barre « X/Y challenges terminés » avec le %. Lecture après montage (`useEffect`) pour éviter un mismatch SSR.

### `dev.ps1` Nettoyé

Suppression de ~226 lignes de fallback `Start-Job` jamais exécutées (un `return` précoce les rendait inatteignables). `Start-PortStatusWatcher` utilise uniquement `Start-Process -PassThru` désormais.

### Watchers Précédents (Toujours Actifs)

- `fs.watchFile` polling sur les `.md` FR existants au boot (chokidar est cassé sur ce Windows + Defender).
- `fs.watch` recursive pour détecter les `.md` créés après le boot.
- Watcher dédié sur `intro.json` dans `dev.ps1` (log `intro.changed` / `intro.integrated`).
- `client/i18n/config.js` garde les fichiers i18n FR dans le graphe Webpack (pas de `preval` sur `intro` → hot-reload OK).
- `build-external-curricula-data-v2.ts` ne réécrit pas les JSON inchangés (évite les crashes ENOENT du Gatsby dev).

## Pattern De Traduction (Règles Strictes)

### À traduire (prose française)

- `title:` (frontmatter)
- Sections `# --description--`, `# --interactive--`, `# --questions--`, `# --assignment--`, `# --hints--` (sentences seulement, pas les ` ```js asserts)
- `## --text--`, `## --answers--`, `### --feedback--`, `#### --text--`, `#### --distractors--`, `#### --answer--`

### À NE JAMAIS toucher (verbatim, copier-coller du EN)

- `id:`, `challengeType:`, `dashedName:`, `videoId:`, `demoType:`, `blockType:`, etc. (frontmatter technique)
- Marqueurs de section : `# --description--`, `## --quiz--`, `# --hints--`, `# --seed--`, `## --seed-contents--`, `# --solutions--`, etc.
- Tout code dans des blocs ` ```html `, ` ```js `, ` ```css `
- Sélecteurs CSS, `assert(...)`, `document.querySelector(...)`, regex
- Backticks inline contenant du code/attributs (ex: `` `<h1>` ``, `` `class` ``, `` `:hover` ``, `` `300px` ``)
- URLs (sauf si la doc l'autorise pour `cdn.freecodecamp.org/curriculum/lecture-transcripts/<slug>-fr.png`)

### Style FR

- **Tutoiement** systématique (« tu » jamais « vous »)
- Lexique technique : `element` → élément, `selector` → sélecteur, `property` → propriété, `value` → valeur, `browser` → navigateur, `file` → fichier ; propriétés CSS gardent leur nom EN entre backticks
- Titres de workshop : `Step N` → `Étape N` (le N doit matcher le `dashedName: step-N`)

### Cas particulier — Frontmatter avec deux-points

Si le titre EN contient `:`, entourer le titre FR de guillemets doubles :

```yaml
title: 'Quand devrais-tu utiliser appearance: none pour...'
```

## Workflow Type Par Workshop

Pour les gros workshops futurs, utiliser le pipeline ajoute dans `tools/translate-workshop.js`. Il evite de recopier les blocs techniques et verifie automatiquement que code/tests/seeds restent intacts.

```powershell
# 1. Extraire uniquement la prose a traduire
node tools/translate-workshop.js extract <workshop>

# 2. Traduire et relire manuellement
# tools/translations/<workshop>.json doit passer a reviewed: true
# scanner le JSON contre les restes anglais/hybrides avant apply

# 3. Appliquer, verifier et valider
node tools/translate-workshop.js apply <workshop>
node tools/translate-workshop.js verify <workshop>
pnpm -C curriculum lint-challenges --superblock javascript-v9
git diff --check

# 4. Commit + push a la fin du workshop
git add tools/translations/<workshop>.json curriculum/i18n-curriculum/curriculum/challenges/french/blocks/<workshop>/
git commit -m "translate <workshop>"
git push standalone main
```

Pour les modules non-workshop, le workflow manuel reste possible, mais les workshops doivent passer par `extract/apply/verify` pour reduire le risque de modifier les parties techniques.

### Controle Qualite Appris Sur Les Gros Workshops

- Un helper temporaire peut aider a remplir un JSON de 300+ chaines, mais il doit etre relu comme un brouillon et supprime avant commit.
- Chercher les artefacts apres traduction : `undefined`, `Hint non traduit`, `should`, `Your`, `The`, `the`, `hovered`, `matching the`, `a doit`, `un règle`, accords singulier/pluriel.
- Les textes exacts exiges par les tests restent en anglais dans les backticks ou dans les consignes : ne pas traduire `HTML/CSS Quiz`, `Select an option`, `Calories`, `Total Fat`, etc. si les assertions les attendent.
- Relire plusieurs familles d'etapes, pas seulement le debut : premiere etape, formulaire, CSS, derniere etape. Les patrons fautifs apparaissent souvent seulement au milieu du workshop.
- Apres `apply`, ne jamais corriger les fichiers `.md` au hasard si l'erreur vient d'un patron. Corriger le JSON ou le helper, regenerer, puis relancer `verify`.

## Pièges Connus (Ne Pas Refaire)

1. **Doublons de titres** : avant d'écrire un nouveau `Étape X` dans un workshop, vérifier que le titre n'existe pas déjà. Si oui, c'est probablement un dashedName différent et il faut corriger l'autre fichier (titre doit matcher le `dashedName: step-X`).

2. **Régénération curriculum-data** : après chaque modif d'`intro.json`, exécuter :

   ```powershell
   $env:CURRICULUM_LOCALE='french'; $env:CLIENT_LOCALE='french'
   pnpm -C curriculum build
   pnpm -C client create:external-curriculum
   ```

   Sinon les titres des blocs sur `/cours-fr` restent en anglais. Sur `/learn`, `intro.changed` puis `intro.integrated` dans `latest.log` confirment la prise en compte. Si un onglet garde l'ancien texte, faire `Ctrl + Shift + R`.

3. **Pre-push hook prettier** : peut bloquer le push si un fichier `.md` a un problème de formatage. Fix :

   ```powershell
   npx prettier --write <file>.md
   git add <file>.md
   git commit --amend --no-edit
   git push standalone main
   ```

4. **Pre-push Windows "ligne de commande trop longue"** : le hook `.husky/pre-push` doit garder `xargs -n 50`. Sans ca, les gros workshops de 60+ fichiers peuvent echouer avant le push meme si les validations passent.

5. **PowerShell quoting** : les paths contiennent un espace (`Nouveau dossier`). Toujours utiliser des chemins absolus entre guillemets.

## Commandes Utiles

### Dev server

```powershell
.\dev.ps1                  # lancement quotidien : Gatsby direct, hot-reload des traductions
.\dev.ps1 -Clean           # vide le cache Gatsby puis relance
.\dev.ps1 -Full            # force l'ancien chemin complet avec turbo setup
```

### Navigation locale

- `/cours-fr` — page des certifications françaises avec badge auto "🚧 Traduction à venir" sur celles sans contenu FR.
- `/learn` — parcours complet local.
- `/catalog` — catalogue global avec filtres ; `Theme > Francais` filtre automatiquement les niveaux FR.
- `/exam-fr?cert=<superblock>` — examen local 100% FR (80 questions tirées des quizzes traduits).

### Statut serveur

```powershell
Get-Content dev-logs\status.json
Get-Content dev-logs\latest.log -Tail 50
Get-Content dev-logs\latest.log -Wait | Select-String -Pattern "status.up|status.error|watcher.|challenge.integrating|challenge.integrated|challenge.error|intro.changed|intro.integrating|intro.integrated"
```

`watcher.touched` indique que `has-french-intro.ts` a été touché car un nouveau block a apparu — Webpack va rebuild et l'UI catalog/cours-fr se met à jour live.

**Pour un vrai check serveur** (au-delà de `status.json` qui peut mentir après crash ou rebuild) :

```powershell
.\dev-check.ps1                    # snapshot : UP / STARTING / ZOMBIE / DOWN
.\dev-check.ps1 -Wait -Timeout 600 # boucle jusqu'à UP
.\dev-check.ps1 -Open              # ouvre /cours-fr dans le navigateur quand UP
.\dev-check.ps1 -OpenDev           # ouvre /dev-fr dans le navigateur quand UP
```

Le script combine processus node + port TCP 8000 + HTTP HEAD `/`. Codes de sortie : 0 UP, 1 DOWN, 2 ZOMBIE, 3 STARTING.

### Vérifier un push

```bash
git log --oneline -5
```

### Pipeline workshops

```powershell
node tools/translate-workshop.js extract <workshop>
node tools/translate-workshop.js apply <workshop>
node tools/translate-workshop.js verify <workshop>
```

Suite en cours : JavaScript v9 (80/230 blocs). Modules 1-6 **100 % complets**. Pipeline gere lectures, workshops/labs, reviews (mode lecture + `# --assignment--`) et quizzes (`kind: "quiz"`). Prochaine cible : module 7 `review-javascript-fundamentals`.

### Lister ce qui manque dans un module

```bash
for b in <bloc1> <bloc2> ...; do
  en=$(ls "curriculum/challenges/english/blocks/$b" 2>/dev/null | wc -l)
  fr=$(ls "curriculum/i18n-curriculum/curriculum/challenges/french/blocks/$b" 2>/dev/null | wc -l)
  echo "$b: EN=$en FR=$fr MISSING=$((en - fr))"
done
```

### Outils de suivi

Deux scripts Node autonomes (lecture seule) remplacent les commandes ad-hoc tapées à chaque session :

```powershell
node tools/translation-status.js                 # avancement FR par superblock v9 (barre + %)
node tools/translation-status.js javascript-v9   # un seul superblock

node tools/check-translation-drift.js            # tous les blocs FR
node tools/check-translation-drift.js <block>    # un seul bloc
pnpm local:report                                # genere le snapshot /dev-fr
pnpm local:check                                 # verdict local rapide
pnpm local:check:full                            # checks longs avant push final
```

- [tools/translation-status.js](../tools/translation-status.js) : pour chaque `*-v9.json`, compte les blocs FR existants / total et dessine une barre ASCII. JS = 80/230.
- [tools/check-translation-drift.js](../tools/check-translation-drift.js) : compare la date du dernier commit git de chaque `.md` EN vs son équivalent FR. Si l'EN a bougé après la trad → drift potentiel à relire. Exit 0 si aucun drift, 1 sinon (utilisable en pré-commit). État actuel : 0 drift sur 1722 fichiers.
- [tools/local-dev-report.js](../tools/local-dev-report.js) : genere le snapshot JSON de `/dev-fr` avec serveur, logs, traduction, drift et git.
- [tools/local-check.js](../tools/local-check.js) : lance les checks locaux et affiche `READY` ou `BLOCKED`.
- [tools/translate-workshop.js](../tools/translate-workshop.js) supporte maintenant `kind: "workshop"` et `kind: "lecture"` pour extraire/verifier les lectures JavaScript v9 (`description`, `interactive`, `questions`, `answers`, `feedback`).

## Mémoire Utilisateur (Important)

- **« Dis oui tout le temps »** : enchaîner les opérations sans demander confirmation.
- L'utilisateur veut le maximum de fichiers traduits par session.
- Toujours commit + push à la fin de chaque module (pas juste commit local).
- Tutoiement systématique dans les traductions.

## Comment Démarrer La Prochaine Session

1. Lire ce fichier (`HANDOFF-TRADUCTIONS.md`) en premier.
2. Vérifier l'état réel avec la commande PowerShell ci-dessus (compare blocs EN vs FR).
3. Continuer JavaScript v9 : modules 1-6 **100 % complets** (80/230) ; prochaine cible = module 7 `review-javascript-fundamentals`.
4. Pour un workshop step-by-step ou une lecture JS, reprendre le pipeline `extract/apply/verify`; les champs `fr` du JSON restent a traduire et relire manuellement.
5. Commit + push immédiats à la fin de chaque module.

## Fichier De Structure Du Superblock

Pour vérifier l'ordre exact des blocs/modules :
`curriculum/structure/superblocks/javascript-v9.json`

## Hot-Reload Des Traductions

Tu peux modifier n'importe quel `.md` FR et il sera hot-reloadé en ~5s dans le navigateur (Ctrl + Shift + R). Si tu crées un nouveau `.md` (nouveau bloc ou nouveau fichier dans un bloc existant), le `fs.watch` recursive le détecte automatiquement sans redémarrer le serveur — ET si c'est le premier fichier d'un block jamais vu, `has-french-intro.ts` est touché pour mettre à jour le filtre catalog + badge cours-fr.

---

**Dernière session (2026-05-30, quizzes + reviews)** : module `javascript-variables-and-strings` terminé à 100 % (20/20 blocs, JS 16→20/230). Pipeline `translate-workshop.js` étendu pour deux types : les **quizzes** (`kind: "quiz"`, challengeType 8 — extrait `# --description--`, `#### --text--`, `#### --distractors--`, `#### --answer--` ; distracteurs en code/backticks et séparateurs `---` laissés verbatim) et les **reviews** (challengeType 31, mode lecture + `# --assignment--` ajouté à `lectureProseMarkers`). `check-translation-quality.js` rendu kind-aware en parallèle (`detectKind` + `proseMarkersForKind` exportés depuis `translate-workshop.js`). Traduit les 4 derniers blocs du module via `extract/apply/verify` : `review-javascript-variables-and-data-types`, `review-javascript-strings`, `quiz-javascript-variables-and-data-types`, `quiz-javascript-strings`. Titres + intros ajoutés dans `intro.json` (2× chacun). `verify` vert sur les 4, `lint-challenges --superblock javascript-v9` exit 0, drift 0, prettier clean. Les avertissements `check-translation-quality` restants sont volontaires (termes gardés en anglais : `Camel case` et ses distracteurs `X case`, expansions de l'acronyme ASCII, exemples de littéraux `` `Hello, ${user}!` ``). Prochaine cible : module 2 `javascript-booleans-and-numbers`. ⚠️ Push vers `standalone main` bloqué par le classifieur de permissions Claude cette session : commits locaux faits, à pousser manuellement via `git push standalone main`.

**Session du 2026-05-29 (lectures + greeting-bot)** : traduit les 7 lectures restantes du module `javascript-variables-and-strings` (16 fichiers, mode `lecture`) + le premier workshop `workshop-greeting-bot` (15 fichiers, mode `workshop`) via le pipeline `extract/apply/verify` — soit 31 fichiers, 8 nouveaux blocs. Lectures : `understanding-code-clarity`, `working-with-data-types`, `working-with-strings-in-javascript`, et les 4 lectures `working-with-string-*-methods`. Titres + intros de tous ces blocs traduits dans `intro.json` (chacun présent 2× : map `blocks` + arbre `chapters/modules`). QA verte partout, drift 0, prettier clean. JS passe de 2/230 à 10/230 blocs. Régénération curriculum-data faite pour afficher les titres. Prochaine cible : `lab-javascript-trivia-bot`.

**Session précédente** : hub dev local + checks + catalogue + pipeline JS + docs, tous pushés par lots.

1. **Checks locaux** — ajout de `pnpm local:report`, `pnpm local:check`, `pnpm local:check:full`; drift optimise en ~1s.
2. **Hub `/dev-fr`** — page locale avec serveur, logs, traduction, drift, git, liens rapides et progression navigateur. `dev-check.ps1 -OpenDev` ouvre cette page quand le serveur est UP.
3. **Menu local** — navigation principale expose `/learn`, `/cours-fr`, `/catalog`, `/dev-fr`. L'examen n'est pas dans le menu, il reste accessible depuis `/cours-fr` et `/dev-fr`.
4. **Catalogue** — recherche texte, `Theme > Francais`, progression locale et bouton `Continuer`; le label separe "Disponible en français" a ete retire pour eviter le doublon.
5. **Pipeline JS** — `tools/translate-workshop.js` extrait/verifie aussi les lectures JS v9 (`kind: "lecture"`). Teste sur `lecture-understanding-code-clarity` sans garder de JSON non relu.
6. **Docs** — ajout de [DOCS-INDEX.md](README.md) et mise a jour des docs principales.

Vérifs OK : `pnpm local:check`, `pnpm -C client test catalog`, `pnpm -C client lint`, `pnpm -C client type-check`, verifies `translate-workshop.js` workshop + lectures. JS 16/230. Prochaine cible traduction : reviews/quizzes du module 1 (besoin extension pipeline) ou module 2.

(Mis à jour la session suivante : JS désormais 20/230, module 1 terminé, pipeline étendu — voir la note de session 2026-05-30 ci-dessous.)
