# Demarrage Rapide

## Lancer Le Site

```powershell
cd "C:\Users\Erazer\.vscode\code\Nouveau dossier\freeCodeCamp"
.\dev.ps1
```

Pour relancer plus vite apres un premier demarrage complet :

```powershell
.\dev.ps1 -Fast
```

Le mode rapide saute `turbo setup` et relance directement Gatsby. Utilise-le pour les changements d'interface ou de texte deja generes. Si tu modifies le curriculum, les dependances ou si des titres restent en cache, relance en mode normal.

Si Gatsby affiche une erreur de cache :

```powershell
.\dev.ps1 -Clean
```

## Watcher De Traductions

Lance ce script dans un second terminal pour voir tes traductions en live sans redemarrer Gatsby :

```powershell
.\watch-translations.ps1
```

A chaque sauvegarde d'un fichier `.md` francais ou de `client/i18n/locales/french/intro.json`, il regenere la curriculum-data. Le rebuild prend `~90s` (curriculum.json fait 110 MB), puis rafraichis le navigateur avec `Ctrl+F5`.

Les ecritures sont atomiques (`.tmp` + rename) donc Gatsby ne crashe plus pendant le rebuild. Avant ce fix, Gatsby plantait avec `Couldn't find temp query result` ou `ENOENT chmod` quand il lisait un JSON partiellement ecrit.

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
```

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
