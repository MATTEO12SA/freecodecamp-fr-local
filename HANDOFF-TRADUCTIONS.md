# Handoff Traductions FR — freeCodeCamp Local Fork

Ce fichier contient toutes les informations nécessaires pour continuer le travail de traduction du curriculum freeCodeCamp en français dans une nouvelle session Claude.

## Contexte Projet

- **Repo local** : `c:\Users\Erazer\.vscode\code\Nouveau dossier\freeCodeCamp`
- **Remote** : `https://github.com/MATTEO12SA/freecodecamp-fr-local.git` (alias `standalone`, branche `main`)
- **Objectif** : Le superblock `responsive-web-design-v9` (cert RWD v9) du curriculum freeCodeCamp est traduit en français. La suite est maintenant `javascript-v9`, demarree par les blocs `lecture-introduction-to-javascript` et `lecture-introduction-to-strings`.
- **Source EN** : `curriculum/challenges/english/blocks/<bloc>/<id>.md`
- **Cible FR** : `curriculum/i18n-curriculum/curriculum/challenges/french/blocks/<bloc>/<id>.md` (même `id`, même nom de fichier)

## État Actuel — Ce Qui Est Fait

### RWD v9 — Contenu Pédagogique Complet ✅

**Tous les lectures, labs autonomes, reviews, quizzes, examen, métadonnées de cert, titres + intros dans `intro.json` et workshops sont traduits.** 158 blocs FR sur 158 totaux (100%).

Modules pédagogiques complets : `semantic-html`, `basic-html`, `html-forms-and-tables`, `html-and-accessibility`, `computer-basics`, `basic-css`, `design-for-developers`, `absolute-and-relative-units`, `pseudo-classes-and-elements`, `css-colors`, `styling-forms`, `css-box-model`, `css-flexbox`, `css-typography`, `css-and-accessibility`, `css-positioning`, `attribute-selectors`, `responsive-design`, `css-variables`, `css-grid`, `css-animations`, plus `review-css`, `exam-responsive-web-design-certification` et la cert YAML.

### JavaScript v9 — Démarré

État actuel : 2 blocs FR sur 230. Blocs traduits : `lecture-introduction-to-javascript` (4 fichiers) et `lecture-introduction-to-strings` (3 fichiers). Prochaine cible logique : `lecture-understanding-code-clarity`.

Attention : les lectures JS utilisent surtout `# --interactive--`, `# --questions--`, `## --answers--` et `### --feedback--`. Le pipeline `tools/translate-workshop.js` ne couvre pas encore ces sections; traduire ces blocs manuellement et verifier que les blocs de code restent verbatim.

### RWD v9 — Workshops Traduits : 17/17 ✅

Les "workshops" sont les ateliers step-by-step (`Build a XYZ`). Lourds, formuls, mais chaque step a une description courte + hints. Le code (seed-contents, asserts) reste verbatim.

| Workshop                                | Fichiers | Statut  |
| --------------------------------------- | -------- | ------- |
| workshop-game-settings-panel            | 16       | ✅ done |
| workshop-flexbox-photo-gallery          | 22       | ✅ done |
| workshop-greeting-card                  | 27       | ✅ done |
| workshop-ferris-wheel                   | 29       | ✅ done |
| workshop-piano                          | 31       | ✅ done |
| workshop-parent-teacher-conference-form | 37       | ✅ done |
| workshop-colorful-boxes                 | 43       | ✅ done |
| workshop-rothko-painting                | 44       | ✅ done |
| workshop-registration-form              | 61       | ✅ done |
| workshop-balance-sheet                  | 66       | ✅ done |
| workshop-accessibility-quiz             | 67       | ✅ done |
| workshop-nutritional-label              | 68       | ✅ done |
| workshop-magazine                       | 79       | ✅ done |
| workshop-cat-painting                   | 80       | ✅ done |
| workshop-colored-markers                | 89       | ✅ done |
| workshop-flappy-penguin                 | 104      | ✅ done |
| workshop-city-skyline                   | 115      | ✅ done |

Pour vérifier en live :

```powershell
pwsh -Command "
  \$structure = Get-Content -Raw curriculum/structure/superblocks/responsive-web-design-v9.json | ConvertFrom-Json
  \$allBlocks = @()
  foreach (\$c in \$structure.chapters) { foreach (\$m in \$c.modules) { foreach (\$b in \$m.blocks) { \$allBlocks += \$b }}}
  \$fr = (Get-ChildItem -Directory 'curriculum/i18n-curriculum/curriculum/challenges/french/blocks/').Name
  \$allBlocks | Where-Object { \$_ -notin \$fr }"
```

## Infrastructure Mise En Place (Tous Pushed)

### Détection Automatique Des Certifications Traduites

[client/src/utils/has-french-intro.ts](client/src/utils/has-french-intro.ts) — fonction `hasFrenchIntro(superBlock)` qui sait si un cert ou module a au moins un challenge FR. **Liste générée au build via `preval`** qui scanne `curriculum/i18n-curriculum/.../french/blocks/` et croise avec `curriculum/structure/superblocks/*.json`. Zéro maintenance manuelle.

Utilisé par :

- [client/src/pages/cours-fr.tsx](client/src/pages/cours-fr.tsx) — affiche le badge "🚧 Traduction à venir" sur les certs non traduites.
- [client/src/pages/catalog.tsx](client/src/pages/catalog.tsx) — filtre `Theme > Francais` du catalogue.

**Live update (sans restart)** : [tools/client-plugins/gatsby-source-challenges/gatsby-node.js](tools/client-plugins/gatsby-source-challenges/gatsby-node.js) détecte les nouveaux blocs FR via `fs.watch` recursive. Quand un block FR jamais vu apparaît, il `fs.utimesSync` sur `has-french-intro.ts` pour forcer Webpack à ré-évaluer le preval. Confirmation dans `dev-logs/latest.log` :

```
watcher.touched [fcc-source-challenges] touched has-french-intro.ts (new block <name>)
```

Test bout-en-bout vérifié : créer un nouveau dossier `blocks/<x>/` avec un `.md` → `watcher.added` + `watcher.touched` + Webpack `Re-building development bundle` en <1s.

### Examen Local FR

[client/src/pages/exam-fr.tsx](client/src/pages/exam-fr.tsx) — page d'examen 100% locale, accessible via `/exam-fr?cert=<superblock>`. Tire au hasard 80 questions parmi tous les `quiz-*` traduits de la cert, distractors mélangés, score à la fin, 70% pour réussir.

[client/src/templates/Challenges/exam-download/show.tsx](client/src/templates/Challenges/exam-download/show.tsx) a été nettoyé : seul le bouton "Passer l'examen en français" est gardé. Les boutons cassés (`Open Exam Environment`, `Generate Exam Token`, `Attempts`, downloads .exe, support email) sont supprimés — ils dépendent de l'API + Auth0 freeCodeCamp qui n'existent pas dans le fork.

L'examen apparaît dans l'accordéon `/cours-fr` (filtre `examDownload` retiré de [client/src/pages/cours-fr.tsx](client/src/pages/cours-fr.tsx)).

### `cours-fr.tsx` Refactoré

Passé de 3014 lignes → 357 lignes. La grosse liste `CERTIFICATIONS[].blocks: [...]` codée en dur (~2700 lignes de boilerplate stale) a été supprimée. Le badge "🚧 Traduction à venir" se calcule via `hasFrenchIntro(cert.key)`.

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
pnpm -C curriculum lint-challenges --superblock responsive-web-design-v9
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

RWD est termine. Suite en cours : JavaScript v9. Prochaine cible recommandee : `lecture-understanding-code-clarity`.

### Lister ce qui manque dans un module

```bash
for b in <bloc1> <bloc2> ...; do
  en=$(ls "curriculum/challenges/english/blocks/$b" 2>/dev/null | wc -l)
  fr=$(ls "curriculum/i18n-curriculum/curriculum/challenges/french/blocks/$b" 2>/dev/null | wc -l)
  echo "$b: EN=$en FR=$fr MISSING=$((en - fr))"
done
```

## Mémoire Utilisateur (Important)

- **« Dis oui tout le temps »** : enchaîner les opérations sans demander confirmation.
- L'utilisateur veut le maximum de fichiers traduits par session.
- Toujours commit + push à la fin de chaque module (pas juste commit local).
- Tutoiement systématique dans les traductions.

## Comment Démarrer La Prochaine Session

1. Lire ce fichier (`HANDOFF-TRADUCTIONS.md`) en premier.
2. Vérifier l'état réel avec la commande PowerShell ci-dessus (compare blocs EN vs FR).
3. Comme RWD = 158/158, ne plus chercher de workshop RWD restant.
4. Continuer JavaScript v9 avec `lecture-understanding-code-clarity`.
5. Pour un workshop step-by-step, reprendre le pipeline `extract/apply/verify`; pour une lecture `interactive/questions`, traduire manuellement.
6. Commit + push immédiats à la fin de chaque module.

## Fichier De Structure Du Superblock

Pour vérifier l'ordre exact des blocs/modules :
`curriculum/structure/superblocks/responsive-web-design-v9.json`

## Hot-Reload Des Traductions

Tu peux modifier n'importe quel `.md` FR et il sera hot-reloadé en ~5s dans le navigateur (Ctrl + Shift + R). Si tu crées un nouveau `.md` (nouveau bloc ou nouveau fichier dans un bloc existant), le `fs.watch` recursive le détecte automatiquement sans redémarrer le serveur — ET si c'est le premier fichier d'un block jamais vu, `has-french-intro.ts` est touché pour mettre à jour le filtre catalog + badge cours-fr.

---

**Dernière session** : serveur relance avec `.\dev.ps1` après detection d'un status zombie (`status.json` disait UP mais `localhost:8000` refusait la connexion). Gatsby est revenu UP et `latest.log` montre `status.up`. Ajout de [TOOLS-REPORT.md](TOOLS-REPORT.md), rapport complet sur le dossier `tools`. JavaScript v9 demarre : `lecture-introduction-to-javascript` traduit (4 fichiers) et `lecture-introduction-to-strings` traduit (3 fichiers), `intro.json` mis a jour pour la cert JavaScript et les blocs. RWD reste termine : 158/158 blocs FR, 0 workshop restant. Prochaine cible : `lecture-understanding-code-clarity`.
