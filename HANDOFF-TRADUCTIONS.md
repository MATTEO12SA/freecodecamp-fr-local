# Handoff Traductions FR — freeCodeCamp Local Fork

Ce fichier contient toutes les informations nécessaires pour continuer le travail de traduction du curriculum freeCodeCamp en français dans une nouvelle session Claude.

## Contexte Projet

- **Repo local** : `c:\Users\Erazer\.vscode\code\Nouveau dossier\freeCodeCamp`
- **Remote** : `https://github.com/MATTEO12SA/freecodecamp-fr-local.git` (alias `standalone`, branche `main`)
- **Objectif** : Traduire le superblock `responsive-web-design-v9` (cert RWD v9) du curriculum freeCodeCamp en français. Les autres certifications (JS, Python, BDD, Back-End, Front-End Libs, Full-Stack) sont prévues mais commenceront seulement après que RWD soit 100% terminé.
- **Source EN** : `curriculum/challenges/english/blocks/<bloc>/<id>.md`
- **Cible FR** : `curriculum/i18n-curriculum/curriculum/challenges/french/blocks/<bloc>/<id>.md` (même `id`, même nom de fichier)

## État Actuel — Ce Qui Est Fait

### RWD v9 — Contenu Pédagogique Complet ✅

**Tous les lectures, labs autonomes, reviews, quizzes, examen, métadonnées de cert et titres + intros dans `intro.json` sont traduits.** 144 blocs FR sur 158 totaux (~91%).

Modules pédagogiques complets : `semantic-html`, `basic-html`, `html-forms-and-tables`, `html-and-accessibility`, `computer-basics`, `basic-css`, `design-for-developers`, `absolute-and-relative-units`, `pseudo-classes-and-elements`, `css-colors`, `styling-forms`, `css-box-model`, `css-flexbox`, `css-typography`, `css-and-accessibility`, `css-positioning`, `attribute-selectors`, `responsive-design`, `css-variables`, `css-grid`, `css-animations`, plus `review-css`, `exam-responsive-web-design-certification` et la cert YAML.

### RWD v9 — Reste À Traduire : 14 Workshops (913 fichiers)

Les "workshops" sont les ateliers step-by-step (`Build a XYZ`). Lourds, formuls, mais chaque step a une description courte + hints. Le code (seed-contents, asserts) reste verbatim.

| Workshop                                | Fichiers | Statut  |
| --------------------------------------- | -------- | ------- |
| workshop-game-settings-panel            | 16       | ✅ done |
| workshop-flexbox-photo-gallery          | 22       | ✅ done |
| workshop-greeting-card                  | 27       | ✅ done |
| workshop-ferris-wheel                   | 29       | pending |
| workshop-piano                          | 31       | pending |
| workshop-parent-teacher-conference-form | 37       | pending |
| workshop-colorful-boxes                 | 43       | pending |
| workshop-rothko-painting                | 44       | pending |
| workshop-registration-form              | 61       | pending |
| workshop-balance-sheet                  | 66       | pending |
| workshop-accessibility-quiz             | 67       | pending |
| workshop-nutritional-label              | 68       | pending |
| workshop-magazine                       | 79       | pending |
| workshop-cat-painting                   | 80       | pending |
| workshop-colored-markers                | 89       | pending |
| workshop-flappy-penguin                 | 104      | pending |
| workshop-city-skyline                   | 115      | pending |

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

## Workflow Type Par Module

```bash
# 1. Lister les fichiers du module
ls curriculum/challenges/english/blocks/<bloc>/

# 2. Lire les fichiers EN (4 max en parallèle, pour préserver le contexte)
# (Read tool sur 4 fichiers en parallèle)

# 3. Écrire les versions FR (Write tool sur 4 fichiers en parallèle)
# Cible : curriculum/i18n-curriculum/curriculum/challenges/french/blocks/<bloc>/<id>.md

# 4. Commit + push à la fin du module
git add curriculum/i18n-curriculum/curriculum/challenges/french/blocks/<bloc>/
git commit -m "translate <bloc-slug>"
git push standalone main
```

**Note** : si tu modifies plusieurs blocs dans le même module, fais un seul commit groupé à la fin.

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

4. **PowerShell quoting** : les paths contiennent un espace (`Nouveau dossier`). Toujours utiliser des chemins absolus entre guillemets.

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

### Vérifier un push

```bash
git log --oneline -5
```

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
3. Continuer les workshops RWD restants dans l'ordre du tableau, du plus petit au plus grand.
4. À la fin de chaque workshop : commit + push immédiats.
5. Quand RWD = 158/158 : passer à JavaScript v9, ou attendre les instructions utilisateur.

## Fichier De Structure Du Superblock

Pour vérifier l'ordre exact des blocs/modules :
`curriculum/structure/superblocks/responsive-web-design-v9.json`

## Hot-Reload Des Traductions

Tu peux modifier n'importe quel `.md` FR et il sera hot-reloadé en ~5s dans le navigateur (Ctrl + Shift + R). Si tu crées un nouveau `.md` (nouveau bloc ou nouveau fichier dans un bloc existant), le `fs.watch` recursive le détecte automatiquement sans redémarrer le serveur — ET si c'est le premier fichier d'un block jamais vu, `has-french-intro.ts` est touché pour mettre à jour le filtre catalog + badge cours-fr.

---

**Dernière session** : pipeline `tools/translate-workshop.js` ajouté (extract/apply/verify), phrasebook créé, workshop `workshop-greeting-card` (27 fichiers) traduit et vérifié avec préservation du code/tests/seeds. Workshops `workshop-game-settings-panel` (16), `workshop-flexbox-photo-gallery` (22) et `workshop-greeting-card` (27) traduits et pushés. Serveur UP testé OK. **Reste 14 workshops RWD à traduire** (913 fichiers) — voir tableau ci-dessus, du plus petit au plus grand. Une fois RWD à 158/158, passer à JS v9 ou attendre l'utilisateur.
