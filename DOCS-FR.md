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

Responsive Web Design v9 est la priorite. Plusieurs blocs sont deja en francais : plan du curriculum, debogage Camperbot, attributs HTML, adoption d'animaux, boilerplate, Cat Photo App, Recipe Page, Bookstore Page, SEO, Travel Agency, audio/video, Music Player et Cafe Menu.

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

## Hot-Reload Des Traductions

### Le Pipeline De Donnees Du Build

Quand tu lances `dev.ps1`, Gatsby utilise un plugin custom pour transformer les fichiers `.md` du curriculum en pages web. Le pipeline complet est :

```text
.md FR (curriculum/i18n-curriculum/curriculum/challenges/french/blocks/<block>/<id>.md)
   |
   v 1. Au demarrage : pnpm setup -> tsc compile la lib curriculum
   v 2. Au demarrage : node build-curriculum genere curriculum/generated/curriculum.json (110 MB)
   v 3. client/utils/build-challenges.js lit curriculum.json -> retourne tous les challenges
   |
   v
gatsby-source-challenges (tools/client-plugins/gatsby-source-challenges/gatsby-node.js)
   |
   v 4. sourceNodes() : creee un node Gatsby par challenge, source = buildChallenges
   v 5. chokidar.watch(curriculumPath) : surveille les .md FR pour les changements
   v 6. createPagesStatefully() : cree une page par challengeNode via la query GraphQL
   |
   v
client/public/page-data/.../page-data.json
   |
   v 7. Le navigateur fetch ce JSON quand on visite la page du challenge
   |
   v
React rendu dans le navigateur
```

### Hot-Reload Upstream

Le plugin a deja un watcher chokidar pour ne pas avoir a redemarrer Gatsby a chaque edit :

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

`curriculumPath` est resolu via `client/utils/build-challenges.js:24` qui appelle `getContentDir(curriculumLocale)`. Quand `CURRICULUM_LOCALE=french`, ca pointe vers `curriculum/i18n-curriculum/curriculum/challenges/french/` -- exactement la ou nous editons les .md FR.

Quand chokidar detecte un changement :

1. `handleChallengeUpdate(filePath, 'changed')` est appelle.
2. La fonction supprime l'ancien node Gatsby et appelle `onSourceChange(filePath)` (alias `replaceChallengeNodes`).
3. `replaceChallengeNodes` parse le fichier .md modifie via `blockCreator.createChallenge` et retourne une nouvelle version du challenge.
4. Le plugin remplace le node Gatsby existant par le nouveau.
5. Gatsby detecte le node update et regenere `page-data.json` pour la page de ce challenge.
6. Le browser fetch le nouveau `page-data.json` au prochain rafraichissement.

En theorie : edite un .md FR, sauvegarde, attends quelques secondes, Ctrl+F5 -> nouveau contenu.

### Le Probleme Concret Sur Cette Machine

Sur ce setup (Windows + chemin avec espace `Nouveau dossier` + curriculum.i18n en sous-dossier), le watcher upstream ne reagit PAS aux edits. Tests effectues :

- Lancer `dev.ps1 -Fast` avec `CURRICULUM_LOCALE=french`. Le serveur demarre sur `:8000` et sert les pages FR.
- Editer `curriculum/i18n-curriculum/curriculum/challenges/french/blocks/lab-checkout-page/66da326c....md` (changer le titre).
- Sauvegarder le fichier (mtime modifie, vrai write fs).
- Attendre 30 s puis chercher `Challenge file changed` dans `dev-logs/latest.log`.
- Resultat : aucun event. Gatsby n'a pas reagi.
- HTTP 200 sur la page, mais le titre affiche reste l'ancien.
- Verification du JSON par-challenge servi par Gatsby (`curl http://localhost:8000/curriculum-data/v2/challenges/.../<id>.json`) : nouveau titre present.
- Verification du `page-data.json` que la page utilise reellement : ancien titre.

Le JSON statique est a jour (regenere par `create:external-curriculum`), mais Gatsby ne re-source pas le node depuis le `.md`. C'est ce niveau-la qui ne se met pas a jour.

### Cause Identifiee : Chokidar Ne Detecte Pas Les Edits Sur Cette Machine

Test isole avec un script qui watche `client/i18n/locales/french/` (chemin standard, pas un submodule) et touche `intro.json` depuis le meme processus Node :

```js
// test-chokidar.mjs
const watcher = chokidar.watch(watchPath, {
  ignored: /(^|[/\\])\../,
  ignoreInitial: true,
  persistent: true,
  cwd: watchPath,
  usePolling: true,
  interval: 500
});
watcher.on('ready', () => {
  console.log('[ready]');
  // Touche intro.json apres ready
  setTimeout(() => writeFileSync(testFile, content), 2000);
});
watcher.on('change', p => console.log('[change]', p));
```

Resultat : `[ready]` puis `[touched intro.json]` mais **aucun `[change]` event** n'est emis, meme avec polling. Le test repete sur le submodule `curriculum/i18n-curriculum/.../french` donne le meme resultat.

Donc chokidar lui-meme echoue a detecter les writes sur ce setup, independamment du plugin Gatsby. Causes probables :

1. **Windows Defender / antivirus** intercepte les events fs et les retarde au-dela du timeout du watcher.
2. **OneDrive / cloud sync** sur le dossier projet introduit une couche de virtualisation qui masque les events.
3. **Bug node 24 + chokidar + FAT/NTFS atypique** sur le volume.
4. **VS Code ou un autre processus** garde un lock sur le fichier au moment de l'ecriture.

Pour verifier, lance `node test-chokidar.mjs` (script dans le repo, voir l'historique git) en debranchant temporairement Defender / OneDrive / autre IDE et observe si `[change]` apparait. Si oui, c'est l'un de ces processus. Sinon, c'est plus profond (driver fs, junction NTFS, etc.).

### Diagnostic Recommande

Au prochain test, executer dans cet ordre apres la modification d'un `.md` :

```powershell
# 1. Verifier que le fichier .md a bien le nouveau contenu
Get-Content "curriculum\i18n-curriculum\curriculum\challenges\french\blocks\<block>\<id>.md" | Select-Object -First 5

# 2. Chercher la trace du watcher dans les logs Gatsby
Select-String -Path dev-logs\latest.log -Pattern "Challenge file changed|fcc-replace-challenge" | Select-Object -Last 10

# 3. Verifier ce que Gatsby sert dans page-data.json (ancien vs nouveau)
$slug = "/learn/responsive-web-design-v9/<block>/<dashed-name>"
Invoke-WebRequest "http://localhost:8000/page-data$slug/page-data.json" | Select-Object -ExpandProperty Content | Select-String -Pattern '"title"' -SimpleMatch

# 4. Si page-data.json a l'ancien titre, redemarrer Gatsby pour forcer un nouveau sourceNodes
.\dev.ps1 -Fast
```

### Workaround : Redemarrer Gatsby

Tant que le watcher chokidar upstream n'est pas debug sur ce setup, la facon fiable de voir une edit traduction :

```powershell
# 1. Edite tes .md FR.
# 2. Redemarre Gatsby :
.\dev.ps1 -Fast
# 3. Attends "UP" dans dev-logs/status.json (~2 min).
# 4. Ctrl+F5 dans le browser.
```

`-Fast` evite de regenerer curriculum.json ; il sert juste les fichiers existants. Le redemarrage prend ~2 min mais le hot-reload custom qu'on avait essaye d'ajouter (et qui crashait Gatsby avec `ENOENT chmod`) etait pire.

Si tu modifies `client/i18n/locales/french/intro.json` (titres de blocs / chapitres / modules), regenere d'abord les fichiers statiques avant de redemarrer Gatsby :

```powershell
$env:CURRICULUM_LOCALE='french'; $env:CLIENT_LOCALE='french'
pnpm -C curriculum build
pnpm -C client create:external-curriculum
.\dev.ps1 -Fast
```

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
