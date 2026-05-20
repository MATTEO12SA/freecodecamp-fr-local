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

Ouvre ensuite :

```text
http://localhost:8000/cours-fr
http://localhost:8000/catalog
```

Dans `/catalog`, ouvre le menu `Theme` puis coche `Francais` pour afficher les niveaux deja disponibles en francais. Ce filtre se met a jour automatiquement avec `client/i18n/locales/french/intro.json`, et tu peux encore le combiner avec `Niveau : Debutant`, `Intermediaire` ou `Avance`.

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
pnpm exec tsc --noEmit --pretty false -p client/tsconfig.json
pnpm --filter @freecodecamp/shared type-check
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
