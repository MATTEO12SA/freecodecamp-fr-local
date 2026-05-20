# Handoff Traductions FR — freeCodeCamp Local Fork

Ce fichier contient toutes les informations nécessaires pour continuer le travail de traduction du curriculum freeCodeCamp en français dans une nouvelle session Claude.

## Contexte Projet

- **Repo local** : `c:\Users\Erazer\.vscode\code\Nouveau dossier\freeCodeCamp`
- **Remote** : `https://github.com/MATTEO12SA/freecodecamp-fr-local.git` (alias `standalone`, branche `main`)
- **Objectif** : Traduire le superblock `responsive-web-design-v9` (cert RWD v9) du curriculum freeCodeCamp en français.
- **Source EN** : `curriculum/challenges/english/blocks/<bloc>/<id>.md`
- **Cible FR** : `curriculum/i18n-curriculum/curriculum/challenges/french/blocks/<bloc>/<id>.md` (même `id`, même nom de fichier)

## État Actuel — Ce Qui Est Fait

### Chapitre HTML

- ✅ 100% traduit (modules basic-html, semantic-html, html-forms-and-tables, lab-survey-form, html-and-accessibility, review-html)

### Chapitre Computers

- ✅ Module `computer-basics` — 16 fichiers (5 blocs : 3 lectures + review + quiz)

### Chapitre CSS (en cours)

- ✅ Module `basic-css` — 40 fichiers complets + 2 cafe-menu manquants
- ✅ Module `design-for-developers` — 23 fichiers complets
- ✅ Module `absolute-and-relative-units` — 8 fichiers complets
- ✅ Module `pseudo-classes-and-elements` — 10 fichiers pédagogiques (lectures + lab + review + quiz). **Workshops non traduits** : `workshop-greeting-card` (27) + `workshop-parent-teacher-conference-form` (37) = 64 fichiers restants
- ✅ Module `css-colors` — 9 fichiers pédagogiques. **Workshop non traduit** : `workshop-colored-markers` (89 fichiers)
- ✅ Module `styling-forms` — 7 fichiers pédagogiques. **Workshops non traduits** : `workshop-registration-form` (61) + `workshop-game-settings-panel` (16) = 77 fichiers
- ✅ Module `css-box-model` — 10 fichiers pédagogiques complets (7 lectures + lab + review + quiz). **Workshop non traduit** : `workshop-rothko-painting` (44)
- ✅ Module `css-flexbox` — 5 fichiers pédagogiques complets (2 lectures + lab + review + quiz). **Workshops non traduits** : `workshop-flexbox-photo-gallery` (22) + `workshop-colorful-boxes` (43)
- ✅ Module `lab-page-of-playing-cards` — 1 lab complet
- ✅ Module `css-typography` — 10 fichiers pédagogiques complets (7 lectures + lab + review + quiz). **Workshop non traduit** : `workshop-nutritional-label` (68)
- ✅ Module `css-and-accessibility` — 5 fichiers pédagogiques complets (2 lectures + lab + review + quiz). **Workshop non traduit** : `workshop-accessibility-quiz` (67)
- ✅ Module `css-positioning` — 8 fichiers pédagogiques complets (5 lectures + lab + review + quiz). **Workshop non traduit** : `workshop-cat-painting` (80)
- ✅ Module `attribute-selectors` — 5 fichiers pédagogiques complets (3 lectures + review + quiz). **Workshop non traduit** : `workshop-balance-sheet` (66)
- ✅ Module `lab-book-inventory-app` — 1 lab complet
- ✅ Module `responsive-design` — 6 fichiers pédagogiques complets (4 lectures + review + quiz). **Workshop non traduit** : `workshop-piano` (31)
- ✅ Module `lab-technical-documentation-page` — 1 lab complet
- ✅ Module `css-variables` — 5 fichiers pédagogiques complets (2 lectures + lab + review + quiz). **Workshop non traduit** : `workshop-city-skyline` (115)
- ✅ Module `css-grid` — 12 fichiers pédagogiques complets (8 lectures + lab + lecture-debugging-css + review + quiz). **Workshop non traduit** : `workshop-magazine` (79)
- ✅ Module `lab-product-landing-page` — 1 lab complet
- ✅ Module `css-animations` — 6 fichiers pédagogiques complets (2 lectures + 2 labs + review + quiz). **Workshops non traduits** : `workshop-ferris-wheel` (29), `workshop-flappy-penguin` (104)
- ✅ Module `exam-responsive-web-design-certification` — 1 exam
- ✅ Module `review-css` — 1 review

### Infrastructure

- ✅ Fix watcher `fs.watchFile` (commit `6163ae508f`) — hot-reload des `.md` FR sur Windows
- ✅ Fix watcher `fs.watch` recursive (commit `227a48aada`) — détecte les nouveaux `.md` créés après démarrage Gatsby
- ✅ Fix régression `writeFileSync` dans `build-external-curricula-data-v2.ts`
- ✅ Fix doublons titres `Étape 60`/`Étape 76` dans `workshop-cafe-menu`
- ✅ Fix titres `workshop-cafe-menu` alignés sur les `dashedName: step-X` (supprime les doublons `Étape 52`/`Étape 70` pendant `create:external-curriculum`)
- ✅ Fix `create:external-curriculum` stable avec Gatsby dev server : le générateur ne réécrit plus les JSON inchangés, ce qui évite les crashs `ENOENT ... chmod client/public/curriculum-data/...`
- ✅ Logs `intro.integrating` / `intro.integrated` dans `dev-logs/latest.log` pour confirmer l'intégration de `intro.json` dans les `curriculum-data`
- ✅ Watcher `intro.json` dans `dev.ps1` : un edit direct écrit `intro.changed` puis `intro.integrated` dans `latest.log` avec `sourceJson`, `curriculumData` et `serverPath=/learn/responsive-web-design-v9/`
- ✅ Fix hot-reload des titres `/learn` : `client/i18n/config.js` garde les fichiers i18n FR dans le graphe Webpack au lieu de les figer via `preval`
- ✅ `client/i18n/locales/french/intro.json` à jour pour tous les modules traduits (titres + intros des blocs ET du module)
- ✅ Curriculum-data régénéré (à refaire après chaque modif d'`intro.json`)
- ✅ `DOCS-FR.md` et `QUICKSTART.md` documentent le fix `fs.watch` recursive

## État Actuel — Ce Qui Reste À Faire

### Chapitre CSS — Modules restants (dans l'ordre du superblock)

Tous les fichiers pédagogiques prioritaires de Responsive Web Design v9 sont traduits : lectures, labs autonomes, reviews, quiz et examen. Les gros workshops CSS restent volontairement en contenu d'origine pour l'instant.

**Priorité suivante : attaquer les workshops seulement si l'utilisateur le demande, sinon continuer la vérification UI/catalogue et la maintenance des logs serveur.**

## Pattern De Traduction (Règles Strictes)

### À traduire (prose française)

- `title:` (frontmatter)
- Sections `# --description--`, `# --interactive--`, `# --questions--`, `# --assignment--`
- `## --text--`, `## --answers--`, `### --feedback--`, `#### --text--`, `#### --distractors--`, `#### --answer--`
- Messages d'erreur dans les blocs ` ```js ` qui sont des chaînes texte affichées à l'utilisateur final (rare, vérifier le contexte)

### À NE JAMAIS toucher (verbatim, copier-coller du EN)

- `id:`, `challengeType:`, `dashedName:`, `videoId:`, `demoType:`, `blockType:`, etc. (frontmatter technique)
- Marqueurs de section : `# --description--`, `## --quiz--`, `## --video-solution--`, `# --hints--`, `# --seed--`, `## --seed-contents--`, `# --solutions--`, etc.
- Tout code dans des blocs ` ```html `, ` ```js `, ` ```css ` (sauf strings UI)
- Sélecteurs CSS, `assert(...)`, `document.querySelector(...)`, regex
- Backticks inline contenant du code/attributs (ex: `` `<h1>` ``, `` `class` ``, `` `:hover` ``, `` `300px` ``)
- URLs (sauf si la doc l'autorise pour `cdn.freecodecamp.org/curriculum/lecture-transcripts/<slug>-fr.png` mais pour l'instant on garde les URLs EN)

### Style FR

- **Tutoiement** systématique (« tu » jamais « vous »)
- Lexique technique cohérent avec les blocs précédents :
  - HTML → « HTML », CSS → « CSS »
  - element → « élément »
  - selector → « sélecteur »
  - property → « propriété »
  - value → « valeur »
  - browser → « navigateur »
  - file → « fichier »
  - background-color, margin, padding, etc. → garder en anglais avec backticks
  - Hue → « teinte », Saturation → « saturation », Lightness → « luminosité »
  - light → « clair », dark → « sombre »
  - hover → « survol » ou garder `:hover`
- Conserver les guillemets `«` `»` français pour les citations longues, et `"` pour le code

### Cas particulier — Frontmatter avec deux-points

Si le titre EN contient `:` (ex: `title: When Should You Use appearance: none...`), il faut entourer le titre FR de guillemets doubles :

```yaml
title: 'Quand devrais-tu utiliser appearance: none pour...'
```

Sinon le parser YAML casse.

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
git commit -m "translate <bloc-slug> module"
git push standalone main
```

**Note** : si tu modifies plusieurs blocs dans le même module, fais un seul commit groupé à la fin.

## Pièges Connus (Ne Pas Refaire)

1. **Doublons de titres** : avant d'écrire un nouveau `Étape X` dans un workshop, vérifier que le titre n'existe pas déjà (`grep -l "^title: Étape X$" curriculum/i18n-curriculum/.../blocks/<workshop>/*.md`). Si oui, c'est probablement un dashedName différent et il faut corriger l'autre fichier (titre doit matcher le `dashedName: step-X`).

2. **Régénération curriculum-data** : après chaque modif d'`intro.json`, exécuter :

   ```powershell
   $env:CURRICULUM_LOCALE='french'; $env:CLIENT_LOCALE='french'
   pnpm -C curriculum build
   pnpm -C client create:external-curriculum
   ```

   Le générateur écrit `intro.integrating` puis `intro.integrated` dans `dev-logs/latest.log`. Sinon les titres des blocs sur `/cours-fr` restent en anglais (ils sont mis en cache dans `client/static/curriculum-data/v2/responsive-web-design-v9.json`). Sur `/learn`, `client/i18n/config.js` permet maintenant à Gatsby de voir les changements `intro.json` et `dev.ps1` écrit `intro.changed` puis `intro.integrated` quand le fichier est sauvegardé ; si un onglet garde l'ancien texte, faire `Ctrl + Shift + R`.

3. **Pre-push hook prettier** : peut bloquer le push si un fichier `.md` a un problème de formatage. Corriger avec :

   ```powershell
   npx prettier --write <file>.md
   git add <file>.md
   git commit --amend --no-edit
   git push standalone main
   ```

4. **DOCS-FR.md sans accent dans le code** : ne pas mettre d'accents dans les noms de variables/commandes des exemples de doc.

5. **PowerShell quoting** : les paths contiennent un espace (`Nouveau dossier`). Toujours utiliser des chemins absolus entre guillemets ou se positionner dans le repo d'abord.

## Commandes Utiles

### Dev server

```powershell
.\dev.ps1                  # lancement quotidien: Gatsby direct, hot-reload des traductions
.\dev.ps1 -Clean           # vide le cache Gatsby puis relance
.\dev.ps1 -Full            # force l'ancien chemin complet avec turbo setup
```

### Navigation locale

- `/cours-fr` reste la page des certifications francaises.
- `/learn` reste le parcours complet local.
- `/catalog` est le catalogue global avec les filtres par niveau et par theme.
- Dans `/catalog`, `Theme > Francais` est un filtre synthetique automatique : il compare les entrees `intro` FR et EN du catalogue, puis affiche les niveaux dont le titre ou le summary est deja traduit tout en gardant leurs themes techniques HTML/CSS/etc.

### Statut serveur

```powershell
Get-Content dev-logs\status.json   # voir si UP/STARTING/DOWN/ERROR
Get-Content dev-logs\latest.log -Tail 50
Get-Content dev-logs\latest.log -Wait | Select-String -Pattern "status.up|status.error|watcher.|challenge.integrating|challenge.integrated|challenge.error|intro.changed|intro.integrating|intro.integrated"
```

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
- L'utilisateur veut le maximum de fichiers traduits par session, en priorisant le contenu pédagogique (lectures + reviews + quizzes + labs) sur les workshops massifs.
- Toujours commit + push à la fin de chaque module (pas juste commit local).
- Tutoiement systématique dans les traductions.

## Comment Démarrer La Prochaine Session

1. Lire ce fichier (`HANDOFF-TRADUCTIONS.md`) en premier
2. Vérifier si l'utilisateur veut attaquer les gros workshops CSS restants ou continuer la maintenance UI/catalogue
3. Si traduction : avancer workshop par workshop, dans l'ordre du superblock
4. À la fin de chaque module : commit + push + mettre à jour `intro.json` si le titre du bloc/module est encore en anglais
5. À la fin de tous les modules pédagogiques : régénérer la curriculum-data (commande ci-dessus)

## Fichier De Structure Du Superblock

Pour vérifier l'ordre exact des blocs/modules :
`curriculum/structure/superblocks/responsive-web-design-v9.json`

## Contact Avec Le Hot-Reload

Tu peux modifier n'importe quel `.md` FR et il sera hot-reloadé en ~5s dans le navigateur (Ctrl + Shift + R). Si tu crées un nouveau `.md` (nouveau bloc ou nouveau fichier dans un bloc existant), le `fs.watch` recursive le détecte automatiquement sans redémarrer le serveur.

Pour vérifier qu'un edit a bien été pris en compte :

```powershell
Select-String -Path dev-logs\latest.log -Pattern "watcher.|challenge.integrating|challenge.integrated|challenge.error|intro.changed|intro.integrating|intro.integrated" | Select-Object -Last 10
```

Pour surveiller en direct : `Get-Content dev-logs\latest.log -Wait | Select-String -Pattern "status.up|status.error|watcher.|challenge.integrating|challenge.integrated|challenge.error|intro.changed|intro.integrating|intro.integrated"`. `status.up` = serveur prêt ; `watcher.changed` / `watcher.added` = modification ou nouveau `.md` détecté ; `challenge.integrating` / `challenge.integrated` = Gatsby relance puis termine l'intégration de la page ; `intro.changed` / `intro.integrated` = edit direct de `intro.json` vu par Gatsby ; `intro.integrating` / `intro.integrated` = `intro.json` repris dans les données statiques.

---

**Dernière session** : module `review-css` terminé, serveur UP, `intro.json` mis à jour et logs `watcher.added` / `challenge.integrated` vérifiés. Tous les contenus pédagogiques prioritaires de Responsive Web Design v9 sont traduits ; les gros workshops CSS restent à traiter uniquement à la demande.
