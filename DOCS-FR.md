# Documentation Du Fork FR Local

Ce repo est une version locale de freeCodeCamp : un client Gatsby en francais, sans compte, sans backend obligatoire et sans liens de navigation vers des sites externes.

## Architecture Locale

- `dev.ps1` lance le client sur `http://localhost:8000`.
- `dev.ps1 -Fast` relance directement Gatsby quand les fichiers generes existent deja, sans repasser par `turbo setup`.
- `dev-logs/` garde le statut du serveur et les logs du dernier lancement.
- `client/src/redux/fetch-user-saga.js` cree un utilisateur local au lieu d'appeler une session serveur.
- `client/src/utils/local-progress.ts` lit et ecrit la progression dans `localStorage`.
- `client/src/redux/local-progress-epic.js` persiste les challenges termines apres `submitComplete`.
- `client/src/utils/ajax.ts` garde les signatures HTTP attendues par le code, mais renvoie des reponses locales pour eviter la dependance backend.
- `CLIENT_LOCALE=french` et `CURRICULUM_LOCALE=french` pilotent l'interface et le curriculum francais.
- `client/tools/external-curriculum/build-external-curricula-data-v2.ts` lit l'intro locale disponible pour generer les titres statiques du plan avec les traductions francaises.

## Interface Et Navigation

- La home pointe vers `/cours-fr`.
- `/cours-fr` affiche les cours en francais et garde un fallback anglais pour les exercices compatibles localement.
- Les contenus non compatibles avec le mode local sont filtres du dossier FR, notamment daily challenge, CodeAlly, Ona, Codespaces, examens serveur, MS Trophy et projets qui exigent des services externes.
- Le layout principal neutralise les ancres externes restantes au rendu : elles ne gardent pas de `href`, pas de `target`, et ne peuvent pas sortir du site local.
- Les liens Markdown externes dans `/cours-fr` sont rendus comme texte desactive.

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
- Les templates upstream non visibles peuvent rester si les supprimer casserait Gatsby, TypeScript ou le fallback anglais.
- Les URLs techniques necessaires aux exercices, images, medias, CDN ou exemples de code ne sont pas traitees comme des liens de navigation.
- `preview-portal.tsx` utilise `window.open('', ...)` pour ouvrir une fenetre locale d'aperçu du code, pas un site externe.

## Curriculum Francais

Les fichiers traduits sont dans :

```text
curriculum/i18n-curriculum/curriculum/challenges/french/
```

Responsive Web Design v9 est la priorite. Le contenu pedagogique est traduit jusqu'au module CSS `css-positioning` inclus : chapitre HTML complet, `computer-basics`, puis les modules CSS de base jusqu'au positionnement CSS. Les gros workshops CSS non prioritaires restent en fallback anglais tant qu'ils ne sont pas traduits.

Regles de traduction :

- Ne jamais traduire les tests, selecteurs, variables, URLs techniques et chaines exigees par les tests.
- Traduire les textes utilisateur en francais simple.
- Garder le fallback anglais pour les fichiers manquants.

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

Les lignes `status.up` dans `latest.log` confirment que Gatsby repond sur `http://localhost:8000`. Les lignes `watcher.changed` et `watcher.added` confirment que le watcher a vu un `.md` FR modifie ou ajoute. Les lignes `challenge.integrating` puis `challenge.integrated` confirment que Gatsby a lance puis termine la reintegration de la page.

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
.\dev.ps1 -Fast
```

`client/tools/external-curriculum/build-external-curricula-data-v2.ts` evite de reecrire les fichiers JSON inchanges. Cela reduit les events sur `client/static/curriculum-data` et evite que Gatsby tombe sur un fichier `client/public/curriculum-data` en cours de remplacement pendant le dev server.

## Verification

Commandes recommandees :

```powershell
pnpm -C curriculum lint-challenges
pnpm exec tsc --noEmit --pretty false -p client/tsconfig.json
pnpm --filter @freecodecamp/shared type-check
```

Verification manuelle :

1. Lancer `.\dev.ps1 -Clean` apres une modification de curriculum, ou `.\dev.ps1 -Fast` pour une relance rapide sans regeneration.
2. Ouvrir `/`, `/learn` et `/cours-fr`.
3. Verifier que le defi du jour n'apparait plus.
4. Ouvrir un exercice Responsive Web Design traduit.
5. Ouvrir un exercice en fallback anglais compatible.
6. Confirmer qu'aucun lien visible ne sort vers forum, donation, app mobile, social, CodeAlly, Ona, GitHub externe ou Okta.

## Limites Connues

- Les certificats PDF et examens serveur ne sont pas operationnels localement.
- Certains composants upstream restent dans le code car ils sont partages par le build ou les types, meme s'ils ne sont plus visibles.
- Si un nouveau composant upstream ajoute un lien externe, la garde globale le bloque au clic, mais il faut aussi le retirer proprement si ce composant devient visible.
