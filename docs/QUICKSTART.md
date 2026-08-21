# Demarrage Rapide

> Etat verifie le 26 juillet 2026 : les 29 constats de l'audit ont ete traites
> (28 corriges, 1 non reproduit en production). Les parcours locaux ne chargent
> plus analytics/Stripe et `exam-download` ne contacte plus le backend. Voir le
> [rapport final](AUDIT-FIX-REPORT.md).

## Lancer Le Site

```powershell
cd freecodecamp-fr-local
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

`intro.integrated` doit indiquer `<superblock>.json=changed` ou `unchanged` et `serverPath=/curriculum-data/v2/<superblock>.json` (`javascript-v9.json` pendant la traduction JS).

Si tu modifies `intro.json` directement pendant que le serveur tourne, `latest.log` doit aussi montrer :

```powershell
Select-String -Path dev-logs\latest.log -Pattern "intro.changed|intro.integrated" | Select-Object -Last 4
```

La ligne doit contenir `sourceJson=client/i18n/locales/french/intro.json`, `curriculumData=/curriculum-data/v2/<superblock>.json` et `serverPath=/learn/<superblock>/`.

## Logs Serveur

Le dossier permanent `dev-logs/` est mis a jour par `dev.ps1` :

```text
dev-logs/status.json
dev-logs/latest.log
```

Regarde `status.json` pour savoir si le serveur est `UP`, `DOWN` ou en `ERROR`, et `latest.log` pour le transcript du dernier lancement. `server.log` et `errors.log` sont d'anciens chemins de diagnostic : le `dev.ps1` actuel ne les réécrit plus.

### Verifier Que Le Serveur Est Vraiment UP

`status.json` peut mentir : crash brutal sans cleanup (reste figé en `STARTING` ou `UP`), ou rebuild Gatsby qui ferme temporairement le port 8000. Pour un check fiable :

```powershell
.\dev-check.ps1                    # snapshot instantane
.\dev-check.ps1 -Wait -Timeout 600 # boucle jusqu'a UP (timeout 10 min)
.\dev-check.ps1 -Quiet             # n'affiche que le verdict final
.\dev-check.ps1 -Open              # ouvre /cours-fr dans le navigateur quand UP
.\dev-check.ps1 -OpenDev           # ouvre /dev-fr dans le navigateur quand UP
```

Le script combine `status.json` + processus node + HTTP HEAD `localhost` + fallback TCP IPv4/IPv6. Verdicts possibles :

- `UP` : port 8000 ouvert ET HTTP repond. Exit 0.
- `STARTING` : au moins un process node tourne mais le port n'est pas pret. Exit 3.
- `ZOMBIE` : `status.json` dit UP/STARTING mais aucun process node. Crash sans cleanup. Exit 2.
- `DOWN` : aucun process, status DOWN. Exit 1.
- `PORT_OPEN_NO_HTTP` : port ouvert mais HTTP rejette. Cas rare.

Ouvre ensuite :

```text
http://localhost:8000/cours-fr
http://localhost:8000/catalog
http://localhost:8000/dev-fr
http://localhost:8000/exam-fr?cert=responsive-web-design-v9
```

`/cours-fr` affiche les certifications. Les certs sans contenu FR portent automatiquement un badge `🚧 Traduction a venir` calcule par `client/src/utils/has-french-intro.ts` (preval qui scanne le filesystem au build). En ouvrant une certification, une barre « X/Y challenges termines » et les coches ✓ refletent la progression sauvegardee dans `localStorage`.

Dans `/catalog`, le fork liste les **7 certifications v9** (pas les micro-cours upstream). Une section « Disponibles en français » est en tête. Le thème `Français` filtre les certs avec au moins un `.md` FR. Chaque carte a un badge `Français · %` / `FR partiel · %` / `À traduire`. Tu peux combiner avec le niveau et la recherche. Pagination 12 cartes.

`/dev-fr` est le hub local. Le statut HTTP est **live** (`fetch('/')`) : si tu vois la page, le serveur n’est pas OFF. La table « Traductions v9 » lit le preval disque, pas le snapshot. `pnpm local:report` reste optionnel (git/drift/logs). GraphiQL est dans **Afficher debug**. Le bouton **Actualiser** relit le live + le snapshot s’il existe. Gatsby retire `/dev-fr`, le menu Outils et `/___graphql` du build public.

`/exam-fr?cert=<superblock>` lance l'examen local FR : 80 questions tirees au
hasard parmi les quizzes traduits, 70% pour reussir. L'examen garde un
historique, les stats par module, la revision des erreurs et une session
versionnee par certification pendant sept jours. Un rechargement propose la
reprise ; terminer avec des réponses vides demande confirmation. `/dev-fr` lit
les formats d'historique actuel, ancien et corrompu sans planter.

### Live Update Quand Tu Traduis Un Nouveau Bloc

Quand tu crees le premier `.md` FR d'un block jamais traduit, le plugin Gatsby touche automatiquement `has-french-intro.ts` pour forcer Webpack a re-evaluer le preval. Verification :

```powershell
Select-String -Path dev-logs\latest.log -Pattern "watcher.touched" | Select-Object -Last 3
```

Tu dois voir : `watcher.touched [fcc-source-challenges] touched has-french-intro.ts (new block <name>)`. Puis `success Re-building development bundle - <X>s` dans `dev-logs/client.stdout.log`. Le filtre `/catalog` et le badge `/cours-fr` se mettent a jour live.

## Traduire Un Prochain Bloc

Etat actuel : RWD/JS/FEL/APIs `COMPLET`. Python v9 : **25 %** (21/78 blocs, 133/527) — modules `python-basics` + `python-loops-and-sequences` livrés. `100 %` affiché n'est vrai que si labels `intro.json` (toutes copies) et titres le sont aussi — `node tools/translation-status.js`. Prochaine traduction : **`lecture-working-with-dictionaries-and-sets`**.

Workflow rapide mais relu manuellement :

```powershell
node tools/translate-workshop.js extract <workshop>
# ou : node tools/translate-workshop.js extract-missing python-v9
```

Traduis et relis `tools/translations/<workshop>.json`, puis applique :

```powershell
node tools/translate-workshop.js apply <workshop>
node tools/translate-workshop.js verify <workshop>
# ou : node tools/translate-workshop.js ship <workshop>
pnpm -C curriculum lint-challenges --superblock python-v9
```

Le script ne traduit pas a ta place : il protege le code, les tests, les seeds et les marqueurs, puis reconstruit les fichiers FR. Apres `apply`, `latest.log` doit montrer `watcher.added`, `challenge.integrating`, `challenge.integrated` et, si le bloc etait nouveau, `watcher.touched`. Pour les lectures JS, le JSON sort en `kind: "lecture"` et extrait aussi `description/interactive/questions/answers/feedback`.

Controle qualite rapide avant `apply` :

```powershell
rg -n '"fr": ""|undefined|Hint non traduit|should|Your|The |the |matching the|but found| a doit| un règle' tools/translations/<workshop>.json
```

Si un helper temporaire a servi a pre-remplir le JSON, supprime-le avant commit. Seuls le JSON relu, les `.md` FR, les docs et les changements de tooling maintenus doivent etre pushés.

## Configuration Locale

Le fork est prevu pour fonctionner sans API, sans MongoDB et sans Auth0 pour le parcours principal.

Variables attendues :

```text
CLIENT_LOCALE=french
CURRICULUM_LOCALE=french
```

Le backend peut rester eteint. Le client construit un utilisateur local,
sauvegarde la progression dans `localStorage` et remplace les prerequis
`exam-download` par un calcul local. Aucun hook RTK Query, token ou appel au port
3000 n'est monté sur ce parcours.

## Verifier

```powershell
pnpm -C curriculum lint-challenges
node tools/translate-workshop.js verify <workshop>
pnpm exec tsc --noEmit --pretty false -p client/tsconfig.json
pnpm --filter @freecodecamp/shared type-check
pnpm lint-root
```

Suivi de l'avancement et detection du drift (lecture seule, pas besoin du serveur) :

```powershell
node tools/translation-status.js        # avancement FR par superblock v9 (barre + %)
node tools/check-translation-drift.js   # .md EN modifie apres son equivalent FR
pnpm local:report                       # snapshot local pour /dev-fr
pnpm local:check                        # HTTP + status + drift + tests catalogue + lint JS v9 + typecheck client/shared + garde liens externes
pnpm local:check:full                   # ajoute lint client/root + smoke tests + axe si serveur UP
```

`axe-test.mjs`, appele par `local:check:full`, fonctionne en strict : timeout,
page inaccessible, scan ignore ou zero page scannee font échouer la commande.
Les compteurs demandés/chargés/scannés/ignorés/échoués sont toujours affichés.

Tests navigateur locaux, avec le serveur deja lance :

```powershell
node smoke-test.mjs
node submit-test.mjs
node persist-test.mjs
node full-flow-test.mjs
```

## Ce Qui Est Retire De La Navigation Locale

- Defi du jour.
- Forum/aide externe.
- Interfaces de donations Stripe, PayPal, Patreon.
- App mobile.
- Partage social.
- CodeAlly, Ona et Codespaces visibles.
- Pages API inutiles comme `/status/version`.
- Liens cliquables vers des sites externes.

Les URLs techniques necessaires aux exercices, images, medias ou tests peuvent
rester dans le code, mais elles ne sont pas presentees comme liens de navigation
du site. Le mode local bloque en plus l'initialisation GTM/Google Analytics et
l'import Stripe. Vérifie la garde avec :

```powershell
pnpm test:local-network -- --browser=chromium
pnpm test:local-network -- --browser=firefox
pnpm test:local-network -- --browser=webkit
```
