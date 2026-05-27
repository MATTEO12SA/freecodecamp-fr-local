# Documentation Du Fork FR Local

Ce repo est une version locale de freeCodeCamp : un client Gatsby en francais, sans compte, sans backend obligatoire et sans liens de navigation vers des sites externes.

## Architecture Locale

- `dev.ps1` lance le client sur `http://localhost:8000`.
- `dev.ps1` relance directement Gatsby quand les fichiers generes existent deja, sans repasser par `turbo setup`.
- `dev.ps1 -Clean` vide le cache Gatsby avant de relancer.
- `dev.ps1 -Full` force l'ancien chemin complet avec `turbo setup`.
- `dev-logs/` garde le statut du serveur et les logs du dernier lancement.
- `client/src/redux/fetch-user-saga.js` cree un utilisateur local au lieu d'appeler une session serveur.
- `client/src/utils/local-progress.ts` lit et ecrit la progression dans `localStorage`.
- `client/src/redux/local-progress-epic.js` persiste les challenges termines apres `submitComplete`.
- `client/src/utils/ajax.ts` garde les signatures HTTP attendues par le code, mais renvoie des reponses locales pour eviter la dependance backend.
- `CLIENT_LOCALE=french` et `CURRICULUM_LOCALE=french` pilotent l'interface et le curriculum francais.
- `client/tools/external-curriculum/build-external-curricula-data-v2.ts` lit l'intro locale disponible pour generer les titres statiques du plan avec les traductions francaises.

## Interface Et Navigation

- La home pointe vers `/cours-fr`.
- `/cours-fr` affiche les certifications francaises. Chaque cert sans contenu FR porte un badge `🚧 Traduction à venir`, calcule automatiquement via `client/src/utils/has-french-intro.ts` (voir section dediee).
- `/cours-fr` ouvre l'accordeon officiel d'un cert qui contient ses chapitres, modules, blocs et l'examen (l'examen est cliquable, il route vers la page exam-download nettoyee).
- `/catalog` ajoute un theme synthetique `Francais`. Mecanisme identique a celui de `/cours-fr` : `hasFrenchIntro(superBlock)` est partagee entre les deux pages.
- `/exam-fr?cert=<superblock>` est une page d'examen locale 100% francaise (voir section dediee).
- Les contenus non compatibles avec le mode local sont filtres du dossier FR, notamment daily challenge, CodeAlly, Ona, Codespaces, MS Trophy et projets qui exigent des services externes. Note : `challengeTypes.exam` et `challengeTypes.examDownload` sont **autorises** maintenant pour que l'examen apparaisse dans l'accordeon.
- Le layout principal neutralise les ancres externes restantes au rendu : elles ne gardent pas de `href`, pas de `target`, et ne peuvent pas sortir du site local.

## Nettoyage Strict Effectue

Fonctionnalites retirees ou neutralisees :

- Defi du jour : widget `/learn`, routes `/learn/daily-coding-challenge/*`, calendrier, archive et breadcrumb supprimes.
- Forum/aide : `HelpModal` retourne `null`, l'epic de creation de question forum est supprime, les boutons d'aide visibles sont retires.
- Donations : composants Donation et saga donation supprimes du client.
- App mobile : `MobileAppModal` retourne `null`.
- Partage social : composant `share` supprime et boutons retires des jaws d'exercices.
- CodeAlly/Ona/Codespaces : instructions et boutons de lancement remplaces par messages locaux desactives.
- Pages inutiles localement : `/blocked` et `/status/version` supprimees.
- Scripts obsoletes de diagnostic, traduction ponctuelle et screenshots supprimes.

Ce qui reste volontairement :

- Les constantes et types daily challenge partages peuvent rester quand ils protegent la compatibilite du build.
- Les templates upstream non visibles peuvent rester si les supprimer casserait Gatsby, TypeScript ou l'acces aux contenus d'origine.
- Les URLs techniques necessaires aux exercices, images, medias, CDN ou exemples de code ne sont pas traitees comme des liens de navigation.
- `preview-portal.tsx` utilise `window.open('', ...)` pour ouvrir une fenetre locale d'aperçu du code, pas un site externe.

## Curriculum Francais

Les fichiers traduits sont dans :

```text
curriculum/i18n-curriculum/curriculum/challenges/french/
```

Responsive Web Design v9 est la priorite et il est maintenant entierement traduit : chapitre HTML complet, `computer-basics`, modules CSS pedagogiques, labs autonomes, revisions, quiz, examen RWD et tous les workshops du superblock. Etat actuel : 158 blocs FR sur 158 (100%). Les workshops `workshop-game-settings-panel`, `workshop-flexbox-photo-gallery`, `workshop-greeting-card`, `workshop-ferris-wheel`, `workshop-piano`, `workshop-parent-teacher-conference-form`, `workshop-colorful-boxes`, `workshop-rothko-painting`, `workshop-registration-form`, `workshop-balance-sheet`, `workshop-accessibility-quiz`, `workshop-nutritional-label`, `workshop-magazine`, `workshop-cat-painting`, `workshop-colored-markers`, `workshop-flappy-penguin` et `workshop-city-skyline` sont traduits. Il reste 0 workshop RWD.

JavaScript v9 est demarre : `lecture-introduction-to-javascript` et `lecture-introduction-to-strings` sont traduits (7 fichiers, 2 blocs FR sur 230). Les lectures JS utilisent les sections `interactive`, `questions`, `answers` et `feedback`; elles doivent rester manuelles tant que le pipeline workshop ne couvre pas ces sections.

Regles de traduction :

- Ne jamais traduire les tests, selecteurs, variables, URLs techniques et chaines exigees par les tests.
- Traduire les textes utilisateur en francais simple.
- Garder le contenu d'origine pour les fichiers FR manquants.

## Pipeline De Traduction Des Workshops

Les gros workshops doivent passer par [tools/translate-workshop.js](tools/translate-workshop.js). Le script est un outil de securite, pas un traducteur automatique :

```powershell
node tools/translate-workshop.js extract <workshop>
node tools/translate-workshop.js apply <workshop>
node tools/translate-workshop.js verify <workshop>
```

`extract` lit les fichiers EN et ecrit `tools/translations/<workshop>.json` avec uniquement les titres, descriptions et hints hors code. Codex traduit et relit ce JSON manuellement. `apply` reconstruit les `.md` FR depuis les templates EN. `verify` compare EN/FR et echoue si un bloc technique a bouge.

Regles specifiques au pipeline :

- `reviewed: true` est obligatoire dans le JSON avant `apply`.
- `Step N` devient `Étape N`, avec le meme `N` que `dashedName: step-N`.
- Code fences, assertions, selectors, IDs, URLs, frontmatter technique, `seed-contents`, `solutions` et marqueurs restent copies depuis EN.
- Le script normalise seulement les espaces blancs non semantiques des fichiers generes pour eviter les echecs `git diff --check`.
- Le phrasebook `tools/translations/phrasebook.json` aide sur les hints repetitifs, mais chaque phrase doit etre relue.
- Les helpers temporaires de remplissage sont autorises pendant un workshop, mais ils ne doivent pas etre commit. Ils servent a accelerer, pas a valider.
- Avant `apply`, scanner le JSON contre les restes anglais ou hybrides : `undefined`, `Hint non traduit`, `should`, `Your`, `The`, `the`, `matching the`, `but found`, `a doit`, `un règle`. Les valeurs techniques en backticks peuvent rester en anglais si les tests les exigent.
- Apres `apply`, `verify` reste obligatoire : si un bloc technique a bouge, regenerer proprement plutot que corriger les `.md` au hasard.
- Pour les gros workshops, garder `.husky/pre-push` avec `xargs -n 50` afin d'eviter le bug Windows "ligne de commande trop longue".

RWD est termine. Suite en cours : JavaScript v9, prochain bloc logique `lecture-understanding-code-clarity`.

## Scripts Gardes

```text
smoke-test.mjs
submit-test.mjs
persist-test.mjs
full-flow-test.mjs
```

Ces scripts utilisent `playwright` directement, sans chemin `.pnpm` fragile et sans dependance a Edge.

Scripts supprimes : anciens diagnostics, scripts de traduction ponctuelle, captures isolees et tests humains non maintenus.

## Logs De Developpement

`dev.ps1` cree et met a jour le dossier permanent `dev-logs/` :

```text
dev-logs/status.json
dev-logs/latest.log
dev-logs/server.log
dev-logs/errors.log
```

- `status.json` donne le statut courant `STARTING`, `UP`, `DOWN` ou `ERROR`, le mode `normal`/`fast`, l'URL attendue et le dernier probleme detecte.
- `latest.log` garde le transcript lisible du dernier lancement.
- `server.log` garde les memes evenements en JSON Lines pour analyser proprement les erreurs.
- `errors.log` regroupe les avertissements et erreurs detectes, avec une action conseillee quand le script reconnait le probleme.

Pour voir en direct quand le serveur est pret et quand Gatsby integre les traductions :

```powershell
Get-Content dev-logs\latest.log -Wait | Select-String -Pattern "status.up|status.error|watcher.|challenge.integrating|challenge.integrated|challenge.error"
```

Les lignes `status.up` dans `latest.log` confirment que Gatsby repond sur `http://localhost:8000`. Le watcher teste maintenant l'URL HTTP avant le fallback TCP, parce que Gatsby peut ecouter seulement sur `::1` sous Windows alors que `127.0.0.1:8000` refuse la connexion. Les lignes `watcher.changed` et `watcher.added` confirment que le watcher a vu un `.md` FR modifie ou ajoute. Les lignes `challenge.integrating` puis `challenge.integrated` confirment que Gatsby a lance puis termine la reintegration de la page.

Pour les changements de `client/i18n/locales/french/intro.json`, surveille aussi `intro.integrating` et `intro.integrated` :

```powershell
Get-Content dev-logs\latest.log -Wait | Select-String -Pattern "status.up|status.error|watcher.|challenge.integrating|challenge.integrated|challenge.error|intro.changed|intro.integrating|intro.integrated"
```

`intro.changed` puis `intro.integrated` confirment qu'une modification directe de `intro.json` a ete vue par le serveur et reprise dans le bundle `/learn`. `intro.integrating` puis `intro.integrated` confirment que les titres de blocs/modules ont ete repris dans `client/static/curriculum-data/v2/*.json` et servis sur `/curriculum-data/v2/*.json`.

## Detection Automatique Des Certs Et Modules Traduits

`/cours-fr` et `/catalog` partagent une seule source de verite : [client/src/utils/has-french-intro.ts](client/src/utils/has-french-intro.ts). La fonction `hasFrenchIntro(superBlock)` renvoie `true` si le cert ou module a au moins un challenge `.md` traduit.

La liste est **generee au build via `preval`** (macro Babel) qui scanne :

1. `curriculum/i18n-curriculum/curriculum/challenges/french/blocks/<block>/*.md` pour la liste des blocs traduits.
2. `curriculum/structure/superblocks/*.json` pour mapper chaque bloc a son cert et a son module.

Resultat : aucun maintenance manuelle a faire. Quand un nouveau bloc est traduit, le filtre `/catalog` et le badge `/cours-fr` se mettent a jour automatiquement.

### Mise A Jour Live (Sans Restart)

`preval` s'evalue au demarrage du serveur. Pour eviter de devoir redemarrer chaque fois qu'un nouveau bloc apparait, le plugin Gatsby a un crochet : `tools/client-plugins/gatsby-source-challenges/gatsby-node.js` ecoute les events `fs.watch` recursive sur le dossier curriculum FR. Quand un `.md` est cree dans un bloc jamais vu au boot, le plugin :

1. Memorise le nom du bloc (cache local `knownTranslatedBlocks`).
2. Appelle `fs.utimesSync` sur `client/src/utils/has-french-intro.ts` (touch).
3. Webpack detecte la modif, re-evalue le `preval` -> la `FRENCH_TRANSLATED_SUPERBLOCKS` Set est mise a jour.
4. HMR push le nouveau bundle au navigateur, le filtre/badge se mettent a jour live (~1s).

Les logs dans `dev-logs/latest.log` :

```text
watcher.added [fcc-source-challenges fs.watch] new file detected blocks\<block>\<id>.md
watcher.touched [fcc-source-challenges] touched has-french-intro.ts (new block <block>)
```

Suivi par dans `client.stdout.log` :

```text
success Re-building development bundle - 0.892s
```

### Test Mocks

`has-french-intro.ts` utilise `preval` qui ne s'execute pas sous vitest. Pour les tests, [client/src/utils/**mocks**/has-french-intro.ts](client/src/utils/__mocks__/has-french-intro.ts) fournit un mock simple. `catalog.test.tsx` declare `vi.mock('../utils/has-french-intro')` pour l'utiliser.

## Examen Local FR

freeCodeCamp officiel exige un client desktop Tauri (`exam-environment://`) + un token JWT genere par l'API + Auth0 pour passer un examen de certification. Aucun de ces composants n'existe dans le fork local.

[client/src/pages/exam-fr.tsx](client/src/pages/exam-fr.tsx) remplace ce flux par un examen 100% local :

- URL : `/exam-fr?cert=<superblock>` (ex: `/exam-fr?cert=responsive-web-design-v9`).
- GraphQL query sur tous les `quiz-*` du superblock cible.
- 80 questions tirees au hasard parmi le pool. Chaque question a 4 choix (3 distractors + 1 reponse correcte) melanges.
- Score a la fin, 70% pour reussir, vue de revision detaillee.
- Pas de timer (l'utilisateur est seul juge dans le fork local).

Le pool de questions vient directement des `.md` quizzes traduits (`# --quizzes-- > ## --quiz-- > ### --question-- > #### --text-- + #### --distractors-- + #### --answer--`). Gatsby les expose via GraphQL `quizzes[].questions[]`.

Tant que les modules d'un cert n'ont aucun quiz traduit, l'examen affiche `🚧 Aucun quiz FR n'est encore traduit pour cette certification.`

### Bouton D'Acces

[client/src/templates/Challenges/exam-download/show.tsx](client/src/templates/Challenges/exam-download/show.tsx) a ete nettoye : tous les boutons casses (`Open Exam Environment Application`, `Generate Exam Token`, `Attempts`, downloads .exe, support email) sont supprimes. Il ne reste que :

- `ChallengeTitle` avec checkmark de completion.
- `PrerequisitesCallout` (utile : detecte via localStorage les challenges restants).
- Un paragraphe d'explication FR.
- Le bouton `Passer l'examen en francais` qui pointe sur `/exam-fr?cert=<examSuperBlock>`.

## Hot-Reload Des Traductions

**TL;DR** : edite un `.md` FR, sauvegarde, attends ~5 secondes, fais Ctrl+Shift+R dans le navigateur, le nouveau contenu apparait. Pas besoin de redemarrer Gatsby.

### Le Pipeline De Donnees

Quand tu lances `dev.ps1`, Gatsby transforme les `.md` du curriculum en pages web via un plugin custom. Le pipeline :

```text
.md FR (curriculum/i18n-curriculum/curriculum/challenges/french/blocks/<block>/<id>.md)
   |
   v 1. Demarrage : pnpm setup -> tsc compile la lib curriculum
   v 2. Demarrage : build-curriculum genere curriculum/generated/curriculum.json (110 MB)
   v 3. client/utils/build-challenges.js lit curriculum.json -> tous les challenges
   |
   v
gatsby-source-challenges (tools/client-plugins/gatsby-source-challenges/gatsby-node.js)
   |
   v 4. sourceNodes() : 1 node Gatsby par challenge
   v 5. WATCHER : chokidar + fs.watchFile fallback surveillent les .md FR
   v 6. createPagesStatefully() : 1 page par node via GraphQL
   |
   v
client/public/page-data/.../page-data.json
   |
   v 7. Le navigateur fetch ce JSON quand on visite la page
```

### Probleme : Le Watcher Upstream Ne Marchait Pas

Le plugin freeCodeCamp upstream a deja un watcher `chokidar` qui surveille les `.md` :

```js
// tools/client-plugins/gatsby-source-challenges/gatsby-node.js
const watcher = chokidar.watch(curriculumPath, {
  ignored: /(^|[/\\])\../,
  ignoreInitial: true,
  persistent: true,
  cwd: curriculumPath
});
watcher.on('change', filePath =>
  /\.md?$/.test(filePath) ? handleChallengeUpdate(filePath, 'changed') : null
);
```

Quand un `.md` change, `handleChallengeUpdate` -> `replaceChallengeNodes` -> parse le fichier modifie -> remplace le node Gatsby -> Gatsby regenere `page-data.json` -> navigateur prend la nouvelle valeur. En theorie, parfait.

**Mais sur ce setup Windows (chemin `Nouveau dossier`, Defender actif), chokidar ne firait AUCUN event.** Tests isoles :

- `[ready]` event fire correctement (chokidar voit le dossier)
- Aucun `[change]` / `[add]` / `[unlink]` apres modification d'un `.md`
- Meme avec `usePolling: true` + `interval: 500`
- Meme sur un chemin non-submodule (`client/i18n/locales/french/`)
- Meme avec un write provenant du meme processus Node que le watcher

Donc chokidar 3.6.0 est cassé sur ce setup, independamment de la config. Cause probable : Defender ou un autre layer de virtualisation FS masque les events `fs.watch` ET le polling de chokidar.

### Resolution : Fallback `fs.watchFile`

Solution appliquee dans [tools/client-plugins/gatsby-source-challenges/gatsby-node.js](tools/client-plugins/gatsby-source-challenges/gatsby-node.js) : on garde le watcher chokidar (pour les setups Linux/macOS / Windows ou il marche) et on ajoute un **fallback Node natif `fs.watchFile`** qui surveille chaque `.md` individuellement.

```js
function attachFsWatchFileFallback() {
  function walkDir(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = nodePath.join(dir, entry.name);
      if (entry.isDirectory()) walkDir(full);
      else if (/\.md?$/.test(entry.name)) attachWatchFile(full);
    }
  }
  function attachWatchFile(absPath) {
    fs.watchFile(absPath, { interval: 1000 }, (curr, prev) => {
      if (curr.mtimeMs === prev.mtimeMs) return;
      const relPath = nodePath.relative(curriculumPath, absPath);
      reporter.info(`[fcc-source-challenges fs.watchFile] change ${relPath}`);
      handleChallengeUpdate(relPath, 'changed');
    });
  }
  walkDir(curriculumPath);
}
```

`fs.watchFile` utilise un mecanisme different de chokidar (stat-polling natif Node) qui passe outre les soucis de FS layer / antivirus. Coût : ~600 polling cycles par seconde (1 par `.md` FR existant au demarrage), absolument negligeable.

### Probleme Secondaire : Nouveaux Fichiers Crees Apres Le Demarrage

`fs.watchFile` enregistre un watcher par chemin precis au moment du boot. Tout `.md` FR ajoute apres le demarrage du serveur n'est PAS surveille — donc une nouvelle traduction n'apparaitrait jamais sans relancer Gatsby.

### Resolution : `fs.watch` Recursif Sur Le Dossier Racine

Ajoute apres `attachFsWatchFileFallback()` dans le meme fichier : un `fs.watch` recursif qui ecoute les events `rename` (creation/suppression) sur le dossier curriculum. Quand un nouveau `.md` est detecte, on lui attache un `fs.watchFile` ET on declenche `handleChallengeUpdate(..., 'added')`.

```js
const watchedNewFiles = new Set();
function watchForNewFiles() {
  fs.watch(
    curriculumPath,
    { recursive: true, persistent: true },
    (eventType, filename) => {
      if (!filename || !/\.md$/.test(filename)) return;
      if (eventType !== 'rename') return;
      const absPath = nodePath.join(curriculumPath, filename);
      if (watchedNewFiles.has(absPath)) return;
      if (!fs.existsSync(absPath)) return;
      watchedNewFiles.add(absPath);
      fs.watchFile(absPath, { interval: 1000 }, (curr, prev) => {
        if (curr.mtimeMs === prev.mtimeMs) return;
        handleChallengeUpdate(filename, 'changed');
      });
      reporter.info(
        `[fcc-source-challenges fs.watch] new file detected ${filename}`
      );
      handleChallengeUpdate(filename, 'added');
    }
  );
}
watchForNewFiles();
```

`fs.watch` recursif sur Windows utilise `ReadDirectoryChangesW` (natif + performant). Resultat : on peut creer des dizaines de `.md` FR en cours de session sans jamais redemarrer Gatsby — le navigateur affiche le nouveau contenu apres `Ctrl + Shift + R`.

### Resultat Mesure

Sequence reelle apres une edit :

```text
14:21:07 - touch .md (changement de titre)
14:21:08 - [fs.watchFile] change detecte (~1s)
14:21:08 - Challenge file changed -> handleChallengeUpdate appelle
14:21:09 - replaceChallengeNodes re-parse le .md
14:21:09 - Gatsby regenere page-data.json
14:21:12 - Ctrl+Shift+R dans le navigateur -> nouveau titre affiche
```

**Latence : ~5 s entre sauvegarde et affichage.**

### Diagnostic Si Le Hot-Reload Casse

Si tu edits un `.md` et le navigateur ne suit pas :

```powershell
# 1. Le fichier .md a-t-il bien le nouveau contenu ?
Get-Content "curriculum\i18n-curriculum\curriculum\challenges\french\blocks\<block>\<id>.md" | Select-Object -First 5

# 2. Le watcher a-t-il detecte ? Cherche dans le log serveur principal
Select-String -Path dev-logs\latest.log -Pattern "watcher.|challenge.integrating|challenge.integrated|challenge.error" | Select-Object -Last 10

# 3. page-data.json est-il a jour ? (ce que le navigateur fetch reellement)
$slug = "/learn/responsive-web-design-v9/<block>/<dashed-name>"
curl "http://localhost:8000/page-data$slug/page-data.json" | python -c "import json,sys; d=json.load(sys.stdin); print(d['result']['data']['challengeNode']['challenge']['title'])"

# 4. Hard refresh du navigateur (force bypass du cache)
# Ctrl + Shift + R sur Chrome/Edge/Firefox
```

Si l'etape 2 ne montre aucun `watcher.changed`, le fallback est cassé : verifier que le plugin a bien charge avec `Select-String -Path dev-logs\latest.log -Pattern "watcher.ready"` au boot — tu dois voir `watching ... .md files`.

### Cas Particulier : Modification De `intro.json`

`client/i18n/locales/french/intro.json` contient les titres de blocs / modules / chapitres (pas les titres de challenges individuels). Il n'est PAS surveille par le plugin. Pour ces changements :

```powershell
$env:CURRICULUM_LOCALE='french'; $env:CLIENT_LOCALE='french'
pnpm -C curriculum build
pnpm -C client create:external-curriculum
```

`dev.ps1` surveille aussi `intro.json` pendant que Gatsby tourne. Quand tu sauvegardes ce fichier, `latest.log` doit afficher `intro.changed`, puis `intro.integrated` avec `sourceJson=client/i18n/locales/french/intro.json`, `curriculumData=/curriculum-data/v2/responsive-web-design-v9.json` et `serverPath=/learn/responsive-web-design-v9/`.

Le generateur ecrit `intro.integrating` puis `intro.integrated` dans `dev-logs/latest.log`. `client/tools/external-curriculum/build-external-curricula-data-v2.ts` evite de reecrire les fichiers JSON inchanges. Cela reduit les events sur `client/static/curriculum-data` et evite que Gatsby tombe sur un fichier `client/public/curriculum-data` en cours de remplacement pendant le dev server.

Le client garde aussi les fichiers i18n francais dans le graphe Webpack via `client/i18n/config.js`. Quand `intro.json` change pendant que Gatsby tourne, le bundle `/learn` peut donc etre reconstruit sans relancer le serveur. Si l'ancien libelle reste visible dans un onglet deja ouvert, fais `Ctrl+Shift+R`.

## Verification

Commandes recommandees :

```powershell
pnpm -C curriculum lint-challenges
node tools/translate-workshop.js verify <workshop>
pnpm exec tsc --noEmit --pretty false -p client/tsconfig.json
pnpm --filter @freecodecamp/shared type-check
pnpm -C client lint
pnpm lint-root
```

Verification manuelle :

1. Lancer `.\dev.ps1` pour le mode rapide par defaut, `.\dev.ps1 -Clean` si Gatsby garde un cache incoherent, ou `.\dev.ps1 -Full` pour forcer le setup complet.
2. Ouvrir `/`, `/learn`, `/cours-fr` et `/catalog`.
3. Verifier que le defi du jour n'apparait plus.
4. Ouvrir un exercice Responsive Web Design traduit.
5. Dans `/catalog`, verifier que `Theme > Francais` affiche les niveaux traduits automatiquement depuis `intro.json` et peut se combiner avec le filtre `Niveau`.
6. Ouvrir un exercice compatible dont le fichier FR manque encore.
7. Confirmer qu'aucun lien visible ne sort vers forum, donation, app mobile, social, CodeAlly, Ona, GitHub externe ou Okta.

## Limites Connues

- Les certificats PDF et examens serveur ne sont pas operationnels localement.
- Certains composants upstream restent dans le code car ils sont partages par le build ou les types, meme s'ils ne sont plus visibles.
- Si un nouveau composant upstream ajoute un lien externe, la garde globale le bloque au clic, mais il faut aussi le retirer proprement si ce composant devient visible.
