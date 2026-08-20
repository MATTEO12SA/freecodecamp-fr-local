# Documentation Du Fork FR Local

Ce repo est une version locale de freeCodeCamp : un client Gatsby en francais,
sans compte, sans backend obligatoire pour le parcours principal et sans liens
de navigation cliquables vers des sites externes. Depuis la correction de
l'audit du 26 juillet 2026, le mode local empêche aussi l'initialisation de GTM
et Google Analytics ainsi que l'import Stripe.

## Architecture Locale

- `dev.ps1` lance le client sur `http://localhost:8000`.
- `dev.ps1` relance directement Gatsby quand les fichiers generes existent deja, sans repasser par `turbo setup`.
- `dev.ps1 -Clean` vide le cache Gatsby avant de relancer.
- `dev.ps1 -Full` force l'ancien chemin complet avec `turbo setup`.
- `dev-logs/` garde le statut du serveur et les logs du dernier lancement.
- `client/src/redux/fetch-user-saga.js` cree un utilisateur local au lieu d'appeler une session serveur.
- `client/src/utils/local-progress.ts` lit et ecrit la progression dans `localStorage`.
- `client/src/redux/local-progress-epic.js` persiste les challenges termines apres `submitComplete`.
- `client/src/utils/ajax.ts` garde les signatures HTTP attendues par le code et renvoie des reponses locales pour le parcours principal.
- `client/config/runtime-mode.ts` centralise les modes `local`, `development` et `public`. Les hooks réseau spécifiques à `exam-download`, les analytics, Stripe et les pages développeur utilisent cette source testable.
- `CLIENT_LOCALE=french` et `CURRICULUM_LOCALE=french` pilotent l'interface et le curriculum francais.
- `client/tools/external-curriculum/build-external-curricula-data-v2.ts` lit l'intro locale disponible pour generer les titres statiques du plan avec les traductions francaises.

## Interface Et Navigation

- La home pointe vers `/cours-fr`.
- `/cours-fr` sépare les certifications « Disponibles maintenant » des « Traductions à venir ». Les premières ouvrent l'accordéon; les secondes sont informatives et non cliquables.
- `/cours-fr` synchronise sa vue et la certification sélectionnée dans l'URL, donc Retour, partage et rechargement conservent le contexte.
- `/catalog` ajoute un theme synthetique `Francais`, une recherche texte, la progression locale et un bouton `Continuer`. `hasFrenchIntro(superBlock)` fournit la présence FR automatique, puis `catalog-translation-status.ts` calcule un état `absent`, `partial` ou `complete` par carte à partir des intros et fichiers réels.
- `/catalog` conserve ses filtres dans `q`, `level` et `topic`, affiche 12 cartes initiales, charge la suite sur demande et utilise trois colonnes à 1440 px.
- `/dev-fr` affiche le hub dev local : etat serveur, derniers logs, progression traduction, drift EN->FR, git, liens rapides et progression navigateur. Il lit `client/static/local-dev/report.json`, genere par `pnpm local:report`. Le bouton « Relire le snapshot » refetch ce fichier sans le regenerer.
- `/dev-fr`, son entrée de menu et `/___graphql` existent en développement et sont supprimés du build public.
- `/exam-fr?cert=<superblock>` est une page d'examen locale 100% francaise (voir section dediee).
- Le menu principal expose `/learn`, `/cours-fr`, `/catalog` et `/dev-fr`. L'examen reste accessible depuis `/cours-fr` et `/dev-fr`, pas depuis le menu.
- Les contenus non compatibles avec le mode local sont filtres du dossier FR, notamment daily challenge, CodeAlly, Ona, Codespaces, MS Trophy et projets qui exigent des services externes. Note : `challengeTypes.exam` et `challengeTypes.examDownload` sont **autorises** maintenant pour que l'examen apparaisse dans l'accordeon.
- Le layout principal neutralise les ancres externes restantes au rendu : elles ne gardent pas de `href`, pas de `target`, et ne peuvent pas sortir du site local. Le mode local neutralise également les SDK analytics/paiement avant import.

## Etat Verifie Apres Correction De L'Audit

L'[audit initial](../AUDIT_COMPLET_APPLICATION.md) conserve les observations au
commit `8fa33f421b`. Le
[tracker](AUDIT-FIX-TRACKER.md) et le
[rapport final](AUDIT-FIX-REPORT.md) décrivent l'état corrigé.

Points valides a conserver :

- serveur stable et HTTP 200 ;
- progression locale et theme persistes ;
- deux challenges soumis reellement dans Monaco ;
- examen 80 questions, historique et revision fonctionnels ;
- aucun lien interne mort parmi les 163 controles ;
- aucun overflow horizontal global aux tailles testees ;
- coeur de l'application utilisable quand toutes les requetes HTTPS externes sont bloquees.

Résultats de la campagne :

- 28 constats corrigés et 1 non reproduit dans le build de production ;
- zéro GTM/GA/Stripe, zéro requête port 3000, zéro erreur console et zéro
  warning audité sur sept routes dans Chromium, Firefox et WebKit ;
- Axe strict : 10 pages/états demandés, chargés et scannés, zéro ignoré,
  zéro échec et zéro violation sérieuse ;
- build de production : 18 716 pages ; `/dev-fr` et `/___graphql` absents,
  404 utilisateur validée ;
- charges décodées production : accueil 5,51 MiB, catalogue 10,64 MiB,
  éditeur 16,98 MiB.

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

Comportements désormais gardés par régression :

- aucun import Stripe ni initialisation analytics en mode local ;
- aucun hook backend dans `exam-download` en mode local ;
- aucun outil développeur dans le build public ;
- aucun succès Axe après zéro page scannée.

## Curriculum Francais

Les fichiers traduits sont dans :

```text
curriculum/i18n-curriculum/curriculum/challenges/french/
```

Responsive Web Design v9 est entierement traduit (158/158 blocs). La priorite actuelle est JavaScript v9.

JavaScript v9 est en cours : 140 blocs FR sur 230 (602/1311 fichiers) — modules 1-11 **100 % complets**. Prochaine cible : relire `tools/translations/lecture-working-with-regular-expressions.json` (`reviewed: false` — ne pas appliquer). Les lectures JS utilisent les sections `description`, `interactive`, `questions`, `answers` et `feedback`; le pipeline `tools/translate-workshop.js` les extrait/verifie avec `kind: "lecture"`, les reviews avec le meme mode (+ `# --assignment--`) et les quizzes avec `kind: "quiz"`.

Regles de traduction :

- Ne jamais traduire les tests, selecteurs, variables, URLs techniques et chaines exigees par les tests.
- Traduire les textes utilisateur en francais simple.
- Garder le contenu d'origine pour les fichiers FR manquants.

## Pipeline De Traduction Des Workshops

Les gros workshops doivent passer par [tools/translate-workshop.js](../tools/translate-workshop.js). Le script est un outil de securite, pas un traducteur automatique :

```powershell
node tools/translate-workshop.js extract <workshop>
node tools/translate-workshop.js apply <workshop>
node tools/translate-workshop.js verify <workshop>
```

`extract` lit les fichiers EN et ecrit `tools/translations/<workshop>.json` avec uniquement les titres, descriptions et hints hors code. Codex traduit et relit ce JSON manuellement. `apply` reconstruit les `.md` FR depuis les templates EN. `verify` compare EN/FR et echoue si un bloc technique a bouge.

Le meme script sait aussi traiter les lectures JavaScript v9. Dans ce cas, `extract` produit `kind: "lecture"` et extrait la prose des sections `description`, `interactive`, `questions`, `answers` et `feedback`. Les blocs de code, marqueurs, `video-solution` et frontmatter technique restent copies depuis EN. Les **reviews** (`challengeType 31`) passent par le meme mode lecture, avec `# --assignment--` ajoute aux marqueurs de prose. Les **quizzes** (`challengeType 8`) utilisent `kind: "quiz"` : seuls `# --description--`, `#### --text--`, `#### --distractors--` et `#### --answer--` sont traduits ; les distracteurs en code/backticks et les separateurs `---` restent verbatim.

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

Suite en cours : JavaScript v9 (140/230), modules 1-11 **100 % complets**. Prochaine cible : relire `lecture-working-with-regular-expressions` (`reviewed: false` — ne pas appliquer).

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
```

- `status.json` donne le statut courant `STARTING`, `UP`, `DOWN` ou `ERROR`, le mode `normal`/`fast`, l'URL attendue et le dernier probleme detecte.
- `latest.log` garde le transcript lisible du dernier lancement.
- `server.log` et `errors.log` sont d'anciens chemins de diagnostic. Le `dev.ps1` actuel ne les reecrit plus : les evenements et erreurs utiles sont regroupes dans `latest.log`.

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

## Detection Automatique De La Couverture Française

`/cours-fr` et `/catalog` partagent une seule source de verite : [client/src/utils/has-french-intro.ts](../client/src/utils/has-french-intro.ts). La fonction `hasFrenchIntro(superBlock)` renvoie `true` si le cert ou module a au moins un challenge `.md` traduit.

La liste est **generee au build via `preval`** (macro Babel) qui scanne :

1. `curriculum/i18n-curriculum/curriculum/challenges/french/blocks/<block>/*.md` pour la liste des blocs traduits.
2. `curriculum/structure/superblocks/*.json` pour mapper chaque bloc a son cert et a son module.

Resultat : aucune liste de disponibilité manuelle à maintenir. Quand un nouveau
bloc est traduit, le filtre `/catalog` et les groupes `/cours-fr` se mettent à
jour automatiquement.

Le booléen seul ne décrit pas la complétude d'une carte. Le catalogue appelle
[client/src/utils/catalog-translation-status.ts](../client/src/utils/catalog-translation-status.ts)
avec :

- la présence réelle d'au moins un challenge FR ;
- le titre et le résumé français ;
- le titre et le résumé anglais de référence.

Il obtient `absent`, `partial` ou `complete`. Une carte partielle conserve un
libellé explicite au lieu de laisser croire que tout son contenu est traduit.

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

`has-french-intro.ts` utilise `preval` qui ne s'execute pas sous vitest. Pour les tests, [client/src/utils/**mocks**/has-french-intro.ts](../client/src/utils/__mocks__/has-french-intro.ts) fournit un mock simple. `catalog.test.tsx` declare `vi.mock('../utils/has-french-intro')` pour l'utiliser.

## Examen Local FR

freeCodeCamp officiel exige un client desktop Tauri (`exam-environment://`) + un token JWT genere par l'API + Auth0 pour passer un examen de certification. Aucun de ces composants n'existe dans le fork local.

[client/src/pages/exam-fr.tsx](../client/src/pages/exam-fr.tsx) remplace ce flux par un examen 100% local :

- URL : `/exam-fr?cert=<superblock>` (ex: `/exam-fr?cert=responsive-web-design-v9`).
- GraphQL query sur tous les `quiz-*` du superblock cible.
- 80 questions tirees au hasard parmi le pool. Chaque question a 4 choix (3 distractors + 1 reponse correcte) melanges.
- Score a la fin, 70% pour reussir, vue de revision detaillee.
- Pas de timer (l'utilisateur est seul juge dans le fork local).

Le pool de questions vient directement des `.md` quizzes traduits (`# --quizzes-- > ## --quiz-- > ### --question-- > #### --text-- + #### --distractors-- + #### --answer--`). Gatsby les expose via GraphQL `quizzes[].questions[]`.

Tant que les modules d'un cert n'ont aucun quiz traduit, l'examen affiche `🚧 Aucun quiz FR n'est encore traduit pour cette certification.`

### Memoire Locale De L'Examen

Comme le reste du fork, l'examen n'a pas de backend : tout est dans `localStorage`. [client/src/utils/exam-history.ts](../client/src/utils/exam-history.ts) gere une cle dediee `fcc-exam-history` (separee de la progression `fcc-local-user`), structuree par cert.

- **Historique** : a l'entree dans l'ecran resultats, un `useEffect` enregistre la tentative `{ cert, date, score, total, pct }` (examen complet uniquement — les revisions ne polluent pas l'historique). L'ecran d'intro affiche les 5 dernieres tentatives, date FR + score colore selon reussite.
- **Stats par module** : les questions portent leur `sourceBlock` (le bloc `quiz-*` d'origine). L'ecran resultats regroupe les reponses par bloc, calcule le % de reussite et affiche un tableau « Reussite par module » trie du plus faible au plus fort (libelle nettoye : `quiz-css-colors` -> `Css colors`).
- **Revision ciblee** : le bouton « Reviser mes erreurs » relance un mini-examen compose uniquement des questions ratees. Un flag `mode: 'full' | 'review'` fait pointer le `useMemo` `questions` sur les `PreparedQuestion` deja en memoire au lieu de re-tirer 80 questions du pool. La revision n'est pas enregistree dans l'historique.

La lecture de `localStorage` se fait apres montage (les valeurs sont vides cote SSR), donc pas de mismatch d'hydratation.

### Session En Cours

[client/src/utils/exam-session.ts](../client/src/utils/exam-session.ts) persiste
une session versionnée dans `fcc-exam-session`, séparée de l'historique :

- une entrée par certification ;
- seed, index courant, réponses, mode et questions de révision conservés ;
- validation stricte du JSON avant restauration ;
- expiration automatique après sept jours ;
- choix explicite « Reprendre » ou « Recommencer » à l'intro.

Sur la dernière question, une boîte `alertdialog` indique le nombre de réponses
vides. Échap ou « Continuer l'examen » revient aux questions; la fin est
protégée contre le double envoi. Les résultats affichent un résumé, des filtres
et des détails repliables.

### Bouton D'Acces Et Prérequis Locaux

[client/src/templates/Challenges/exam-download/show.tsx](../client/src/templates/Challenges/exam-download/show.tsx) a ete simplifie visuellement : les boutons casses (`Open Exam Environment Application`, `Generate Exam Token`, `Attempts`, downloads .exe, support email) sont supprimes. La page affiche :

- `ChallengeTitle` avec checkmark de completion.
- `LocalExamPrerequisites`, calculé à partir des challenges et de la progression locale.
- Un paragraphe d'explication FR.
- Le bouton `Passer l'examen en francais` qui pointe sur `/exam-fr?cert=<examSuperBlock>`.

`isLocalMode()` choisit cette branche avant le montage de
`ExamPrerequisites`. Les hooks `useGetExamsQuery()` et
`useGetExamIdsByChallengeIdQuery()` restent disponibles pour les modes upstream,
mais ne sont jamais exécutés dans le parcours local. Un test réseau sur trois
moteurs garantit zéro appel au port 3000.

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

Solution appliquee dans [tools/client-plugins/gatsby-source-challenges/gatsby-node.js](../tools/client-plugins/gatsby-source-challenges/gatsby-node.js) : on garde le watcher chokidar (pour les setups Linux/macOS / Windows ou il marche) et on ajoute un **fallback Node natif `fs.watchFile`** qui surveille chaque `.md` individuellement.

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

`fs.watchFile` utilise un mecanisme different de chokidar (stat-polling natif Node) qui passe outre les soucis de FS layer / antivirus. Coût : 1 cycle de stat par `.md` FR existant au demarrage (~1715 fichiers aujourd'hui), a l'intervalle `FCC_WATCH_INTERVAL` (defaut 1000 ms).

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

### Comportement Actuel (Selon La Plateforme)

Le plugin choisit son watcher selon l'OS, pour ne pas faire tourner deux mecanismes en parallele (overhead + double traitement) :

- **Windows** : chokidar tourne en `usePolling: false` (silencieux/econome, il ratait les events de toute facon) ; les fallbacks natifs `fs.watchFile` + `fs.watch` recursif font le vrai travail.
- **Linux/macOS** : chokidar (fs.watch natif) est le watcher principal ; les fallbacks natifs sont desactives.

Garde-fous ajoutes :

- **Debounce** (`CHANGE_DEBOUNCE_MS`, 700 ms) : un meme fichier `changed` plusieurs fois en moins de 700 ms (watchers qui se chevauchent, editeur qui sauve deux fois) n'est traite qu'une fois.
- **Structure** : `createSuperBlockStructureNodes()` n'est plus rejoue sur une simple edition de contenu (la structure vient de `curriculum/structure/*.json`, pas du `.md`), seulement a l'ajout/suppression d'un fichier.
- **Nouveau bloc → `has-french-intro.ts`** : la logique de touch est partagee (`maybeTouchForNewBlock`) entre le handler chokidar `add` et le handler `fs.watch`, donc le rafraichissement live du filtre `/catalog` marche aussi hors Windows.

Variables d'environnement : `FCC_WATCH_INTERVAL` (intervalle `fs.watchFile`, defaut 1000 ms), `FCC_FORCE_NATIVE_WATCH=true` (force les fallbacks natifs sur toute plateforme).

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

`dev.ps1` surveille aussi `intro.json` pendant que Gatsby tourne. Quand tu sauvegardes ce fichier, `latest.log` doit afficher `intro.changed`, puis `intro.integrated` avec `sourceJson=client/i18n/locales/french/intro.json`, `curriculumData=/curriculum-data/v2/<superblock>.json` et `serverPath=/learn/<superblock>/`.

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

Suivi des traductions (lecture seule, sans serveur) :

```powershell
node tools/translation-status.js        # avancement FR par superblock v9 (barre + %)
node tools/check-translation-drift.js   # .md EN modifie apres son equivalent FR (drift)
pnpm local:report                       # snapshot /dev-fr
pnpm local:check                        # verification locale rapide
pnpm local:check:full                   # verification locale longue avant push
```

`local:check:full` lance `axe-test.mjs --strict`. Le script attend un élément
stable plutôt que `networkidle`, compte toutes les pages et échoue si une page
est inaccessible, ignorée, non scannée ou en timeout. Il couvre les thèmes
clair/sombre et les états intro/question/résultats de l'examen.

`check-translation-drift.js` sort en code 1 s'il trouve un drift, donc utilisable en pre-commit. Etat actuel : 0 drift sur 2180 fichiers compares.

Verification manuelle :

1. Lancer `.\dev.ps1` pour le mode rapide par defaut, `.\dev.ps1 -Clean` si Gatsby garde un cache incoherent, ou `.\dev.ps1 -Full` pour forcer le setup complet.
2. Ouvrir `/`, `/learn`, `/cours-fr` et `/catalog`.
3. Verifier que le defi du jour n'apparait plus.
4. Ouvrir un exercice Responsive Web Design traduit.
5. Dans `/catalog`, verifier que `Theme > Francais` affiche les superblocks avec au moins un `.md` FR, signale les contenus partiels et peut se combiner avec le filtre `Niveau`.
6. Ouvrir un exercice compatible dont le fichier FR manque encore.
7. Confirmer qu'aucun lien visible ne sort vers forum, donation, app mobile, social, CodeAlly, Ona, GitHub externe ou Okta.
8. Dans `/cours-fr`, ouvrir une certification : la barre « X/Y challenges termines » et les coches ✓ refletent la progression `localStorage`.
9. Sur `/exam-fr?cert=...`, finir un examen : verifier l'historique sur l'intro, le tableau « Reussite par module » et le bouton « Reviser mes erreurs ».
10. Activer le theme sombre dans `/catalog` et verifier que le texte saisi dans la recherche reste lisible.
11. Ouvrir le panneau reseau : confirmer aucune requete GTM/GA/Stripe.
12. Ouvrir le challenge `exam-download` : confirmer qu'aucune requete ne vise le port 3000.
13. Verifier que `/dev-fr` compte les tentatives stockees sous `{ version, byCert }`.
14. Lancer `pnpm test:local-network` dans Chromium, Firefox et WebKit.
15. Lancer `pnpm test:axe` et verifier `requested = loaded = scanned`.

## Limites Connues

- Les certificats PDF et examens serveur ne sont pas operationnels localement.
- Certains composants upstream restent dans le code car ils sont partages par le build ou les types, meme s'ils ne sont plus visibles.
- Si un nouveau composant upstream ajoute un lien externe, la garde globale le bloque au clic, mais il faut aussi le retirer proprement si ce composant devient visible.
- `/dev-fr` et `/___graphql` sont intentionnellement disponibles dans Gatsby
  Develop. Le test de production garantit leur absence du build public.
- Le statut `partial` d'une carte signifie qu'une partie du contenu existe en
  français, pas que toute la certification est traduite.
- Le build Gatsby conserve des warnings amont sur React Helmet, certains imports
  JSON nommés, Babel standalone et la sérialisation du cache Webpack. Ils
  n'apparaissent pas comme erreurs ou warnings audités dans la console des
  parcours navigateur.
- Les certificats locaux restent non officiels et ne remplacent pas les
  certificats délivrés par freeCodeCamp.org.
