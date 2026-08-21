# Handoff Traductions FR — freeCodeCamp Local Fork

Ce fichier contient toutes les informations nécessaires pour continuer le travail de traduction du curriculum freeCodeCamp en français dans une nouvelle session Claude.

## Contexte Projet

- **Repo local** : racine du depot `freecodecamp-fr-local`
- **Remote** : `https://github.com/MATTEO12SA/freecodecamp-fr-local.git` (alias `standalone`, branche `main`)
- **Objectif** : curriculum v9 en français, local-first. JS/RWD/FEL/APIs sont **100 % fichiers**. Prochaine cert : `python-v9` (puis `relational-databases-v9`).
- **Source EN** : `curriculum/challenges/english/blocks/<bloc>/<id>.md`
- **Cible FR** : `curriculum/i18n-curriculum/curriculum/challenges/french/blocks/<bloc>/<id>.md` (même `id`, même nom de fichier)

## État Actuel — Ce Qui Est Fait

### JavaScript v9 — TERMINÉ (230/230)

État actuel (fichiers) :

| Cert             |   Blocs | Fichiers FR/EN |
| ---------------- | ------: | -------------- |
| RWD v9           | 158/158 | 1553/1553      |
| JS v9            | 230/230 | 1311/1311      |
| FEL v9           |   62/62 | 532/532        |
| APIs v9          |   16/16 | 48/48          |
| Python v9        |    0/78 | 0/527          |
| Relational DB v9 |    0/34 | 0/64           |
| Full-stack v9    |     0/1 | 0/1            |

Prochaine cible de traduction : **`python-v9`**. Python / SQL / full-stack à 0 % n’est pas un bug.

Qualité (2026-08-21) : 15 `# --assignment--` EN sur reviews JS/FEL/APIs corrigés ; labels `/learn` JS+APIs traduits ; fausses notes « Coming 2026 » retirées sur les modules déjà livrés. RWD a encore des ERREUR de drift de chunks (`check-translation-quality`) — ne pas réécrire les workshops sans preuve. Chrome `translations.json` encore partiellement EN (hors scope immédiat).

Note pièges (vus module 5 / module 10) : si une description ou un hint a un chunk de prose vide entre deux blocs de code (ex. cargo-manifest-validator, ou trailing space après une fence dans `workshop-planets-tablist`), l'extracteur crée un chunk `{en:"",fr:""}` — `apply` exige un fr non vide au sens `.trim()`. Fix : **supprimer** ce chunk vide du JSON (`replaceChunks` ignore déjà les prose vides à l'origine, donc les comptes restent alignés). Ne pas tenter `fr: " "` : `ensureAllTranslationsPresent` le refuse aussi via `.trim()`.

Note pièges connus du pipeline (vus module 3) : le `verify` custom de `translate-workshop.js` peut crier `nombre de blocs de prose dans # --hints-- modifie` quand une étape EN a une ligne blanche avec un espace (` `) entre le dernier bloc de code et `# --seed--` (ex. loan-qualification step-3) — c'est un faux positif d'espace, le `.md` rendu est identique. Autorité finale : `pnpm -C curriculum lint-challenges --superblock javascript-v9` (doit sortir exit 0).

### Etat Produit A Ne Pas Confondre Avec L'Etat Des Traductions

L'[audit initial](../AUDIT_COMPLET_APPLICATION.md) du 26 juillet 2026 ne change
pas la prochaine cible de traduction. Sa campagne de correction est terminée :
28 constats corrigés, 1 charge dev non reproduite en production. Le
[tracker](AUDIT-FIX-TRACKER.md) et le
[rapport final](AUDIT-FIX-REPORT.md) sont les références produit actuelles.

Pendant un lot de traduction :

- `verify`, `check-translation-quality` et `lint-challenges` restent les autorites sur le curriculum ;
- `latest.log` prouve l'integration Gatsby, pas l'accessibilite ni l'absence de requetes tierces ;
- `Theme > Francais` part de la présence d'au moins un fichier FR ; chaque carte affiche ensuite un statut précis `absent` / `partial` / `complete` ;
- ne pas profiter d'un lot de traduction pour corriger les 29 constats UI au hasard : suivre [ROADMAP.md](ROADMAP.md) par lots separes.

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

## Infrastructure Mise En Place

### Détection Automatique Des Certifications Traduites

[client/src/utils/has-french-intro.ts](../client/src/utils/has-french-intro.ts) — fonction `hasFrenchIntro(superBlock)` qui sait si un cert ou module a au moins un challenge FR. **Liste générée au build via `preval`** qui scanne `curriculum/i18n-curriculum/.../french/blocks/` et croise avec `curriculum/structure/superblocks/*.json`. Zéro maintenance manuelle.

Utilisé par :

- [client/src/pages/cours-fr.tsx](../client/src/pages/cours-fr.tsx) — affiche le badge "🚧 Traduction à venir" sur les certs non traduites.
- [client/src/pages/catalog.tsx](../client/src/pages/catalog.tsx) — filtre `Theme > Francais` du catalogue.

`hasFrenchIntro()` reste la source automatique de présence FR au niveau
superblock. Le catalogue complète ce booléen avec
`catalog-translation-status.ts`, qui compare les intros et le contenu réel pour
afficher `absent`, `partial` ou `complete` par carte. Ne pas remplacer ces deux
sources par une liste manuelle.

**Live update (sans restart)** : [tools/client-plugins/gatsby-source-challenges/gatsby-node.js](../tools/client-plugins/gatsby-source-challenges/gatsby-node.js) détecte les nouveaux blocs FR via `fs.watch` recursive. Quand un block FR jamais vu apparaît **ou** que la couverture fichiers d’une cert v9 change (nouveaux `.md` dans un bloc déjà connu), il `fs.utimesSync` sur `has-french-intro.ts` pour forcer Webpack à ré-évaluer le preval. Confirmation dans `dev-logs/latest.log` :

```
watcher.touched [fcc-source-challenges] touched has-french-intro.ts (new block <name>)
watcher.touched [fcc-source-challenges] touched has-french-intro.ts (coverage change after ...)
```

Test bout-en-bout vérifié : créer un nouveau dossier `blocks/<x>/` avec un `.md` → `watcher.added` + `watcher.touched` + Webpack `Re-building development bundle` en <1s.

**Après un gros lot d’`apply` pendant que Gatsby tournait déjà** : si les pourcentages catalogue / `/cours-fr` / `/dev-fr` restent figés, **redémarrer Gatsby une fois** (`Ctrl+C` puis `.\dev.ps1`) pour recharger le preval. `.\dev.ps1` régénère aussi `client/static/local-dev/report.json` dès que le port `:8000` est UP.

**Après édition de `client/i18n/locales/french/intro.json`** (titres modules `/learn`) : hard refresh navigateur ; si les titres restent EN, redémarrer Gatsby. Audit qualité 2026-08-21 : 15 `# --assignment--` EN sur reviews JS/FEL/APIs corrigés ; labels modules JS/APIs + fausses notes « Coming 2026 » sur modules déjà livrés corrigés dans `intro.json`.

### Catalogue fork FR

Le catalogue (`packages/shared/src/config/catalog.ts`) liste les **7 certifications v9** (pas les micro-cours upstream). Badges `Français · %` / `FR partiel · %` / `À traduire`, section « Disponibles en français » en tête.

### Examen Local FR

[client/src/pages/exam-fr.tsx](../client/src/pages/exam-fr.tsx) — page d'examen 100% locale, accessible via `/exam-fr?cert=<superblock>`. Tire au hasard 80 questions parmi tous les `quiz-*` traduits de la cert, distractors mélangés, score à la fin, 70% pour réussir.

L'examen a une mémoire locale (tout dans `localStorage`, aucune API) :

- **Historique** : chaque examen complet est enregistré via [client/src/utils/exam-history.ts](../client/src/utils/exam-history.ts) (clé `fcc-exam-history`). L'écran d'intro affiche les 5 dernières tentatives (date + score + %). Les révisions ne sont pas enregistrées.
- **Session en cours** : [client/src/utils/exam-session.ts](../client/src/utils/exam-session.ts) conserve seed, index, réponses et mode par certification dans `fcc-exam-session`, avec schéma versionné et expiration de sept jours. L'intro propose Reprendre/Recommencer.
- **Stats par module** : l'écran résultats regroupe les questions par bloc source (`sourceBlock`) et affiche un tableau « Réussite par module » trié du plus faible au plus fort.
- **Révision ciblée** : un bouton « Réviser mes erreurs » relance un mini-examen composé uniquement des questions ratées (réutilise les `PreparedQuestion` en mémoire, pas de nouveau tirage du pool).
- **Fin sûre** : les réponses vides sont confirmées avant le score et les corrections sont filtrables dans des détails repliés.

[client/src/templates/Challenges/exam-download/show.tsx](../client/src/templates/Challenges/exam-download/show.tsx)
garde le bouton « Passer l'examen en français » et retire les anciens boutons
cassés. En mode local, `LocalExamPrerequisites` remplace la branche upstream
avant le montage des hooks RTK Query : aucun appel au port 3000.

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
- `/catalog` — 7 certs v9, section FR en tête, badges de couverture ; le thème Français filtre les certs avec au moins un `.md` FR.
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

Le script combine processus node + HTTP HEAD `localhost` + fallback TCP IPv4/IPv6. Codes de sortie : 0 UP, 1 DOWN, 2 ZOMBIE, 3 STARTING.

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

Suite : RWD/JS/FEL/APIs **100 % fichiers**. Pipeline gère lectures, workshops/labs, reviews (mode lecture + `# --assignment--`) et quizzes (`kind: "quiz"`). Prochaine traduction : **python-v9**.

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

`pnpm local:check:full` exécute Axe en mode strict. Une page inaccessible, un
timeout, un scan ignoré ou zéro page scannée provoque désormais un échec ; les
compteurs sont affichés dans la sortie et protégés par
`axe-test-regression.mjs`.

- [tools/translation-status.js](../tools/translation-status.js) : pour chaque `*-v9.json`, compte les blocs FR existants / total et dessine une barre ASCII. JS = 230/230.
- [tools/check-translation-drift.js](../tools/check-translation-drift.js) : compare la date du dernier commit git de chaque `.md` EN vs son équivalent FR. Si l'EN a bougé après la trad → drift potentiel à relire. Exit 0 si aucun drift, 1 sinon (utilisable en pré-commit). État actuel : 0 drift sur 2180 fichiers.
- [tools/local-dev-report.js](../tools/local-dev-report.js) : snapshot optionnel de `/dev-fr` (git/drift/logs). La table traductions et le HTTP sont live.
- [tools/local-check.js](../tools/local-check.js) : lance les checks locaux et affiche `READY` ou `BLOCKED`.
- [tools/translate-workshop.js](../tools/translate-workshop.js) supporte maintenant `kind: "workshop"` et `kind: "lecture"` pour extraire/verifier les lectures JavaScript v9 (`description`, `interactive`, `questions`, `answers`, `feedback`).

## Comment Démarrer La Prochaine Session

1. Lire ce fichier (`HANDOFF-TRADUCTIONS.md`) en premier.
2. Vérifier l'état réel avec la commande PowerShell ci-dessus (compare blocs EN vs FR).
3. Continuer JavaScript v9 : modules 1–12 + form-validation **100 %** (230/230) ; prochaine cible = JavaScript v9 **100 % terminé** (230/230).
4. Pour un workshop step-by-step ou une lecture JS, reprendre le pipeline `extract/apply/verify`; les champs `fr` du JSON restent a traduire et relire manuellement.
5. Commit + push immédiats à la fin de chaque module.

## Fichier De Structure Du Superblock

Pour vérifier l'ordre exact des blocs/modules :
`curriculum/structure/superblocks/javascript-v9.json`

## Hot-Reload Des Traductions

Tu peux modifier n'importe quel `.md` FR et il sera hot-reloadé en ~5s dans le navigateur (Ctrl + Shift + R). Si tu crées un nouveau `.md` (nouveau bloc ou nouveau fichier dans un bloc existant), le `fs.watch` recursive le détecte automatiquement sans redémarrer le serveur — ET si c'est le premier fichier d'un block jamais vu, `has-french-intro.ts` est touché pour mettre à jour le filtre catalog + badge cours-fr.

---

**Dernière session (2026-08-21, UX fork + qualité 4 certs + arrêt local)** :
Catalogue = 7 certs v9 (plus les micro-cours upstream) + badges FR + section « Disponibles en français ». Menu dropdown ≤ 18rem, clic extérieur, labels Carte / Parcours / Catalogue / Outils. `/dev-fr` : HTTP live (`fetch('/')`), table traductions = preval (plus le snapshot), GraphiQL derrière Debug. `/cours-fr` et `/catalog` sans `Col` offset. Watcher touche `has-french-intro.ts` aussi quand la couverture v9 change. `dev.ps1` écrit `local:report` une fois le port UP. 15 assignments EN → FR ; `intro.json` JS/APIs. Serveur local arrêté proprement (port 8000 DOWN). Prochaine traduction : `python-v9`.

**Dernière session (2026-08-20, audio/vidéo + onboarding)** :
JS v9 à 230/230 (1311/1311). Module audio/vidéo + lab drum-machine. Site : onboarding
premier lancement, export/import profil (Dev FR), Continuer, confettis a11y.
Piège music-player step-43 : fence EN indentée ` ```js` — préserver l'espace
devant la fence FR. _(Cible maps-and-sets depuis livrée ; JS v9 est 230/230.)_

**Dernière session (2026-08-20, dates module)** :
JS v9 à 230/230 (1311/1311). Module dates traduit. Prochaine cible : `lecture-working-with-audio-and-video.json` (`reviewed: false`).

**Dernière session (2026-08-20, form-validation + Continuer)** :
JS v9 à 230/230 (1311/1311). Module form-validation : lecture, workshop-calorie-counter
(97 étapes), lab-customer-complaint-form, review/quiz. Site : bouton nav Continuer
(`local-continue.ts` + Header). Prochaine cible : `lecture-working-with-dates.json`
(`reviewed: false`) — **ne pas appliquer**.

**Dernière session (2026-08-20, modules 10–12 a11y + debugging + regex)** :
JS v9 à 230/230 blocs (1311/1311 fichiers), modules 1-12 **100 %**. Modules 10–11
précédemment ; module 12 regex : lecture, spam-filter (32 étapes), 5 labs,
review/quiz. Site : confettis + `prefers-reduced-motion`. Prochaine cible déjà
extraite : `lab-markdown-to-html-converter.json` (`reviewed: false`) — **ne pas
appliquer**. Goal actif : finir JS v9 + optimiser le fork.

**Dernière session (2026-08-20, modules 10–11 a11y + debugging + confettis)** :
JS v9 à 140/230 blocs (602/1311 fichiers), modules 1-11 **100 %**. Module 10 :
lecture ARIA, planets-tablist, note-taking, theme-switcher, review/quiz a11y.
Module 11 : lecture debugging, lab random-background, review/quiz debugging.
Intros FR mises à jour. Site : `fireConfetti` + `prefers-reduced-motion` (+ test),
fix tsc exam-session. Lecture suivante déjà extraite :
`lecture-working-with-regular-expressions.json` (`reviewed: false`) — **ne pas
appliquer**. Goal actif : finir JS v9 + optimiser le fork.

**Dernière session (2026-08-20, module 10 a11y terminé + confettis a11y)** :
JS v9 à 136/230 blocs (594/1311 fichiers), modules 1-10 **100 %**. Traduits :
lecture ARIA, `workshop-planets-tablist`, `workshop-note-taking-app`,
`lab-theme-switcher`, `review-js-a11y`, `quiz-js-a11y`. Intros module a11y FR
(2× dans `intro.json`). Hints vides (trailing space après fence) retirés du
JSON planets. Site : `fireConfetti` respecte `prefers-reduced-motion` (+ test
vitest) ; fix tsc `exam-session.test.tsx`. Lecture suivante déjà extraite :
`lecture-debugging-techniques.json` (`reviewed: false`) — **ne pas appliquer**.
Goal actif : finir JS v9 + optimiser le fork.

**Dernière session (2026-08-20, module 9 DOM terminé)** :
JS v9 à 130/230 blocs (552/1311 fichiers), modules 1-9 **100 %**. Traduits :
`workshop-rps-game`, `lab-football-team-cards`,
`review-dom-manipulation-and-click-events-with-javascript`,
`quiz-dom-manipulation-and-click-event-with-javascript` (+ music-instrument-filter
plus tôt). Chunk vide lab football retiré du JSON (piège module 5). Trailing
space `challengeType: 25 ` conservé pour verify. Lecture a11y suivante déjà
extraite : `lecture-understanding-aria-expanded-aria-live-and-common-aria-states.json`
(`reviewed: false`) — **ne pas appliquer**. Goal actif : finir JS v9 + optimiser
le fork.

**Dernière session (2026-08-20, music-instrument-filter + goal)** :
JS v9 à 126/230 blocs (535/1311 fichiers), module 9 à 8/12.
`workshop-music-instrument-filter` (14 étapes) traduit, verify/QA verts.
JSON suivant déjà extrait : `workshop-rps-game.json` (`reviewed: false`) —
**ne pas appliquer**. Goal actif : finir JS v9 + améliorer/optimiser le fork.

**Dernière session (2026-08-20, emoji-reactor + lecture Event)** :
JS v9 à 125/230 blocs (521/1311 fichiers), module 9 à 7/12.
`workshop-emoji-reactor` (15 étapes) et
`lecture-understanding-the-event-object-and-event-delegation` (2 leçons)
traduits, `reviewed: true`, apply/verify/QA verts. Textes testés
(`How are you feeling today?`, `Happy face emoji`, `Button clicked!`, etc.)
restent en anglais dans les backticks. Titres + intros mis à jour aux deux
occurrences de `intro.json`. JSON suivant déjà extrait :
`tools/translations/workshop-music-instrument-filter.json` (`reviewed: false`,
14 fichiers) — **ne pas appliquer**. Ensuite : `workshop-rps-game`,
`lab-football-team-cards`, review et quiz DOM.

**Dernière session (2026-08-18, lecture DOM + storytelling)** :
JS v9 à 123/230 blocs (504/1311 fichiers), module 9 à 5/12. Lecture
`lecture-working-with-the-dom-click-events-and-web-apis` (20 fichiers, 814
segments) relue, `reviewed: true`, apply/verify/QA verts (0 erreur / 0
avertissement). Workshop `workshop-storytelling-app` (16 étapes) traduit de la
même façon ; les textes testés (`Want to hear a short story?`, `Scary Story`,
histoires dans `storyObj`, etc.) restent en anglais dans les backticks.
Titres + intros des deux blocs mis à jour aux deux occurrences de `intro.json`.
Curriculum régénéré (`pnpm -C curriculum build` + `pnpm -C client
create:external-curriculum`). JSON suivant déjà extrait :
`tools/translations/workshop-emoji-reactor.json` (`reviewed: false`, 15 fichiers)
— **ne pas appliquer**. Après emoji, l'ordre du module 9 reprend à
`lecture-understanding-the-event-object-and-event-delegation` (les labs
favorite-icon, real-time-counter et lightbox sont déjà faits).

**Session (2026-08-18, priorités d'audit + lanceur)** :
JS v9 à 121/230 blocs (468/1311 fichiers), module 9 à 3/12 avec
`lab-lightbox-viewer` déjà traduit. Catalogue : statut FR basé sur `intro` et
le vrai % de fichiers. Examen : session v2 sans solutions, dédup historique
par `seed`, Reprendre/Recommencer, filtre « Sans réponse ». Qualité de
traduction branchée dans `local:check`. Argos (`translate-challenges.py`)
désactivé. Watcher curriculum : `fs.watch` récursif par défaut. `dev.ps1`
sort immédiatement si HTTP est déjà UP. Ne pas appliquer
`lecture-working-with-the-dom-click-events-and-web-apis.json`. Prochaine cible :
ce JSON relu, puis `workshop-storytelling-app`.

**Session (2026-07-26, début module 9 JS)** :
`lab-favorite-icon-toggler` et `lab-real-time-counter` traduits manuellement et
vérifiés, soit JavaScript v9 à 120/230 blocs (467/1311 fichiers) et module
`dom-manipulation-and-events` à 2/12. Le titre/résumé du module ainsi que les
deux entrées de chaque lab dans `intro.json` sont en français. Vérifications :
`verify` OK sur les deux blocs, QA `0 erreur / 0 avertissement`, lint JavaScript
v9 et Prettier verts, données curriculum régénérées, titres FR confirmés par
HTTP.
`latest.log` contient `watcher.added`, `watcher.touched`,
`challenge.integrating`, `challenge.integrated` et `intro.integrated`.
L'extraction
`tools/translations/lecture-working-with-the-dom-click-events-and-web-apis.json`
existe mais reste **non relue** (`reviewed: false`, 814 segments) : ne pas
l'appliquer. Cible courte à l'époque : `lab-lightbox-viewer` (depuis traduit).

**Correction de l'audit + synchronisation docs (2026-07-26)** : les 29 constats
ont été suivis dans `AUDIT-FIX-TRACKER.md`. Résultat : 28 corrigés et AUD-29 non
reproduit dans le build de production. Réseau/console validés sur sept routes
dans Chromium, Firefox et WebKit ; Axe strict 10/10 ; build public 18 716 pages,
outils dev absents et 404 utilisateur validée. Aucun compteur de traduction n'a
changé : JS reste 118/230, prochaine cible module 9.

**Dernière session (2026-07-26, module 8 JS)** : module `higher-order-functions-and-callbacks` terminé à 100 % (13/13 blocs, 37 fichiers, JS 105→118/230). Traduit la lecture `lecture-working-with-higher-order-functions-and-callbacks` (8 fichiers), `workshop-library-manager` (18 étapes), 9 labs mono-fichier, `review-javascript-higher-order-functions` et `quiz-javascript-higher-order-functions`. Titres + intros ajoutés dans `intro.json` aux deux occurrences, et libellé du module ajouté dans la navigation. Vérifications : `verify` + `check-translation-quality` verts sur les 13 blocs, `lint-challenges --superblock javascript-v9` exit 0, `pnpm -C curriculum build` exit 0, `pnpm -C client create:external-curriculum` exit 0, `translation-status.js javascript-v9` = 118/230, drift 0 sur 2180 fichiers, `git diff --check` clean. Prochaine cible : module 9 `dom-manipulation-and-events`.

**Session du 2026-05-29 (lectures + greeting-bot)** : traduit les 7 lectures restantes du module `javascript-variables-and-strings` (16 fichiers, mode `lecture`) + le premier workshop `workshop-greeting-bot` (15 fichiers, mode `workshop`) via le pipeline `extract/apply/verify` — soit 31 fichiers, 8 nouveaux blocs. Lectures : `understanding-code-clarity`, `working-with-data-types`, `working-with-strings-in-javascript`, et les 4 lectures `working-with-string-*-methods`. Titres + intros de tous ces blocs traduits dans `intro.json` (chacun présent 2× : map `blocks` + arbre `chapters/modules`). QA verte partout, drift 0, prettier clean. JS passe de 2/230 à 10/230 blocs. Régénération curriculum-data faite pour afficher les titres. Prochaine cible : `lab-javascript-trivia-bot`.

**Session précédente** : hub dev local + checks + catalogue + pipeline JS + docs, tous pushés par lots.

1. **Checks locaux** — ajout de `pnpm local:report`, `pnpm local:check`, `pnpm local:check:full`; drift optimise en ~1s.
2. **Hub `/dev-fr`** — page locale avec serveur, logs, traduction, drift, git, liens rapides et progression navigateur. `dev-check.ps1 -OpenDev` ouvre cette page quand le serveur est UP.
3. **Menu local** — navigation principale expose `/learn`, `/cours-fr`, `/catalog`, `/dev-fr`. L'examen n'est pas dans le menu, il reste accessible depuis `/cours-fr` et `/dev-fr`.
4. **Catalogue** — recherche texte, `Theme > Francais`, progression locale et bouton `Continuer`; le label separe "Disponible en français" a ete retire pour eviter le doublon.
5. **Pipeline JS** — `tools/translate-workshop.js` extrait/verifie aussi les lectures JS v9 (`kind: "lecture"`). Teste sur `lecture-understanding-code-clarity` sans garder de JSON non relu.
6. **Docs** — ajout de l'index [docs/README.md](README.md) et mise a jour des docs principales.

Vérifs OK à ce moment-là : `pnpm local:check`, `pnpm -C client test catalog`, `pnpm -C client lint`, `pnpm -C client type-check`, verifies `translate-workshop.js` workshop + lectures. JS était alors à 16/230 ; voir les sections du haut pour l'état actuel.

(Mis à jour la session suivante : JS désormais 20/230, module 1 terminé, pipeline étendu — voir la note de session 2026-05-30 ci-dessous.)
