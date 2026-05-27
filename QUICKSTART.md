# Demarrage Rapide

## Lancer Le Site

```powershell
cd "C:\Users\Erazer\.vscode\code\Nouveau dossier\freeCodeCamp"
.\dev.ps1
```

`.\dev.ps1` est le lancement quotidien : il saute `turbo setup` et lance directement Gatsby quand les fichiers generes existent deja. Si les fichiers generes manquent, il bascule automatiquement sur le setup complet.

Si Gatsby affiche une erreur de cache :

```powershell
.\dev.ps1 -Clean
```

Si tu veux forcer le setup complet :

```powershell
.\dev.ps1 -Full
```

## Voir Une Traduction Apres Edit

Le hot-reload des `.md` FR fonctionne. Edite ton fichier dans `curriculum/i18n-curriculum/curriculum/challenges/french/blocks/...`, sauvegarde, attends ~5 secondes, puis **Ctrl + Shift + R** dans le navigateur.

Le plugin Gatsby utilise `chokidar` (qui ne fire pas sur ce Windows + Defender), un fallback `fs.watchFile` pour les `.md` existants au demarrage, ET un `fs.watch` recursif pour les `.md` crees apres le demarrage. Voir `DOCS-FR.md` section "Hot-Reload Des Traductions" pour les details.

Pour verifier qu'un edit a bien ete pris en compte :

```powershell
Select-String -Path dev-logs\latest.log -Pattern "watcher.|challenge.integrating|challenge.integrated|challenge.error" | Select-Object -Last 10
```

Pour les changements de `client/i18n/locales/french/intro.json` (titres de blocs / modules / chapitres), regenere d'abord les fichiers statiques :

```powershell
$env:CURRICULUM_LOCALE='french'; $env:CLIENT_LOCALE='french'
pnpm -C curriculum build
pnpm -C client create:external-curriculum
```

Puis verifie `latest.log` :

```powershell
Select-String -Path dev-logs\latest.log -Pattern "intro.integrating|intro.integrated" | Select-Object -Last 4
```

`intro.integrated` doit indiquer `responsive-web-design-v9.json=changed` ou `unchanged` et `serverPath=/curriculum-data/v2/responsive-web-design-v9.json`.

Si tu modifies `intro.json` directement pendant que le serveur tourne, `latest.log` doit aussi montrer :

```powershell
Select-String -Path dev-logs\latest.log -Pattern "intro.changed|intro.integrated" | Select-Object -Last 4
```

La ligne doit contenir `sourceJson=client/i18n/locales/french/intro.json`, `curriculumData=/curriculum-data/v2/responsive-web-design-v9.json` et `serverPath=/learn/responsive-web-design-v9/`.

## Logs Serveur

Le dossier permanent `dev-logs/` est mis a jour par `dev.ps1` :

```text
dev-logs/status.json
dev-logs/latest.log
dev-logs/server.log
dev-logs/errors.log
```

Regarde `status.json` pour savoir si le serveur est `UP`, `DOWN` ou en `ERROR`. Regarde `errors.log` pour les avertissements et erreurs resumes.

### Verifier Que Le Serveur Est Vraiment UP

`status.json` peut mentir : crash brutal sans cleanup (reste figé en `STARTING` ou `UP`), ou rebuild Gatsby qui ferme temporairement le port 8000. Pour un check fiable :

```powershell
.\dev-check.ps1                    # snapshot instantane
.\dev-check.ps1 -Wait -Timeout 600 # boucle jusqu'a UP (timeout 10 min)
.\dev-check.ps1 -Quiet             # n'affiche que le verdict final
```

Le script combine `status.json` + processus node + port TCP + HTTP HEAD `/`. Verdicts possibles :

- `UP` : port 8000 ouvert ET HTTP repond. Exit 0.
- `STARTING` : au moins un process node tourne mais le port n'est pas pret. Exit 3.
- `ZOMBIE` : `status.json` dit UP/STARTING mais aucun process node. Crash sans cleanup. Exit 2.
- `DOWN` : aucun process, status DOWN. Exit 1.
- `PORT_OPEN_NO_HTTP` : port ouvert mais HTTP rejette. Cas rare.

Ouvre ensuite :

```text
http://localhost:8000/cours-fr
http://localhost:8000/catalog
http://localhost:8000/exam-fr?cert=responsive-web-design-v9
```

`/cours-fr` affiche les certifications. Les certs sans contenu FR portent automatiquement un badge `🚧 Traduction a venir` calcule par `client/src/utils/has-french-intro.ts` (preval qui scanne le filesystem au build).

Dans `/catalog`, le menu `Theme > Francais` filtre automatiquement les modules dont au moins un challenge `.md` FR existe. Tu peux le combiner avec `Niveau : Debutant/Intermediaire/Avance`.

`/exam-fr?cert=<superblock>` lance l'examen local FR : 80 questions tirees au hasard parmi les quizzes traduits, 70% pour reussir.

### Live Update Quand Tu Traduis Un Nouveau Bloc

Quand tu crees le premier `.md` FR d'un block jamais traduit, le plugin Gatsby touche automatiquement `has-french-intro.ts` pour forcer Webpack a re-evaluer le preval. Verification :

```powershell
Select-String -Path dev-logs\latest.log -Pattern "watcher.touched" | Select-Object -Last 3
```

Tu dois voir : `watcher.touched [fcc-source-challenges] touched has-french-intro.ts (new block <name>)`. Puis `success Re-building development bundle - <X>s` dans `dev-logs/client.stdout.log`. Le filtre `/catalog` et le badge `/cours-fr` se mettent a jour live.

## Traduire Un Prochain Bloc

Etat actuel RWD v9 : 158 blocs FR sur 158 (100%). Il reste 0 workshop RWD. JavaScript v9 est demarre avec `lecture-introduction-to-javascript` et `lecture-introduction-to-strings` traduits (7 fichiers, 2 blocs FR sur 230).

Workflow rapide mais relu manuellement :

```powershell
node tools/translate-workshop.js extract <workshop>
```

Traduis et relis `tools/translations/<workshop>.json`, puis applique :

```powershell
node tools/translate-workshop.js apply <workshop>
node tools/translate-workshop.js verify <workshop>
pnpm -C curriculum lint-challenges --superblock responsive-web-design-v9
```

Le script ne traduit pas a ta place : il protege le code, les tests, les seeds et les marqueurs, puis reconstruit les fichiers FR. Apres `apply`, `latest.log` doit montrer `watcher.added`, `challenge.integrating`, `challenge.integrated` et, si le bloc etait nouveau, `watcher.touched`. Pour les lectures JS en `interactive/questions`, traduire manuellement tant que le script n'est pas etendu a ces sections.

Controle qualite rapide avant `apply` :

```powershell
rg -n '"fr": ""|undefined|Hint non traduit|should|Your|The |the |matching the|but found| a doit| un règle' tools/translations/<workshop>.json
```

Si un helper temporaire a servi a pre-remplir le JSON, supprime-le avant commit. Seuls le JSON relu, les `.md` FR, les docs et les changements de tooling maintenus doivent etre pushés.

## Configuration Locale

Le fork est prevu pour fonctionner sans API, sans MongoDB et sans Auth0.

Variables attendues :

```text
CLIENT_LOCALE=french
CURRICULUM_LOCALE=french
```

Le backend peut rester eteint. Le client construit un utilisateur local et sauvegarde la progression dans `localStorage`.

## Verifier

```powershell
pnpm -C curriculum lint-challenges
node tools/translate-workshop.js verify <workshop>
pnpm exec tsc --noEmit --pretty false -p client/tsconfig.json
pnpm --filter @freecodecamp/shared type-check
pnpm lint-root
```

Tests navigateur locaux, avec le serveur deja lance :

```powershell
node smoke-test.mjs
node submit-test.mjs
node persist-test.mjs
node full-flow-test.mjs
```

## Ce Qui Est Retire Du Site Local

- Defi du jour.
- Forum/aide externe.
- Donations Stripe, PayPal, Patreon.
- App mobile.
- Partage social.
- CodeAlly, Ona et Codespaces visibles.
- Pages API inutiles comme `/status/version`.
- Liens cliquables vers des sites externes.

Les URLs techniques necessaires aux exercices, images, medias ou tests peuvent rester dans le code, mais elles ne sont pas presentees comme liens de navigation du site.
