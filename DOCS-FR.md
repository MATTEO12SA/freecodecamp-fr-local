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

## Watcher De Traductions

Pour voir tes modifications de traduction sans redemarrer Gatsby, lance le watcher dans un second terminal en parallele de `.\dev.ps1` :

```powershell
.\watch-translations.ps1
```

Il surveille `curriculum/i18n-curriculum/curriculum/challenges/french/blocks/**/*.md` et `client/i18n/locales/french/intro.json`. A chaque sauvegarde, il regenere automatiquement :

1. `curriculum/generated/curriculum.json` via `pnpm -C curriculum build`
2. `client/static/curriculum-data/v2/*.json` via `pnpm -C client create:external-curriculum`

Gatsby ressert le nouveau JSON statique sans recompiler. Apres chaque rebuild (~90s pour un curriculum.json de 110 MB regenere de zero), rafraichis le navigateur avec `Ctrl+F5` pour bypass le cache du navigateur.

Les logs du watcher sont dans `dev-logs/translations-watcher.log` avec des entrees comme :

```text
[20:01:12] [EVENT] Changed : ...quiz-html-accessibility\66ed9026....md
[20:01:13] [INFO]  Regeneration en cours...
[20:02:44] [OK]    Curriculum-data regeneree en 91.4s. Rafraichis le navigateur (Ctrl+F5).
```

### Pourquoi Gatsby Crashait

Le pipeline de build est en 3 couches :

```text
.md FR / intro.json
        |
        v
curriculum/generated/curriculum.json    (110 MB)
        |
        v
client/static/curriculum-data/v2/
   |- responsive-web-design-v9.json     (listings + titres FR)
   |- ...
   `- challenges/<superblock>/<block>/<id>.json   (18 686 fichiers, 1 par challenge)
        |
        v Gatsby copie static/ -> public/ et fait chmod sur chaque fichier qui change
        v
client/public/curriculum-data/v2/...
```

Le script `create:external-curriculum` reecrivait par defaut **tous les 18 686 fichiers** sur chaque rebuild. Gatsby essayait alors de chmod chacun d'eux en parallele et crashait sur le premier qui etait brievement absent (entre suppression et renommage) :

```text
ENOENT: no such file or directory, chmod 'client\public\curriculum-data\v2\challenges\2022\
responsive-web-design\learn-the-css-box-model-by-building-a-rothko-painting\60a3e33...json'
```

### Deux Couches De Fix

1. **Ecritures atomiques** (`writeFileAtomic` dans `build-curriculum.ts` et `build-external-curricula-data-v2.ts`) : on ecrit dans `<file>.tmp-PID-TS` puis on renomme. Le rename est atomique sur NTFS, donc Gatsby voit toujours un fichier complet, pas un fichier en cours d'ecriture.

2. **Skip des per-challenge files en watch mode** : quand `FCC_WATCH_MODE=1` (mis par `watch-translations.ps1`), le build reecrit uniquement les listings de superblocks (~80 fichiers) et zappe les 18 686 fichiers par-challenge. Gatsby a peu de chmod a faire et ne crashe plus.

### Limite Connue

En mode watch, seuls les **titres de blocs et de leçons** dans les listings se mettent a jour en live. Le **contenu d'un challenge** (description, hints, seed code) ne se met PAS a jour parce que les fichiers `challenges/<sb>/<block>/<id>.json` ne sont pas reecrits.

Pour recharger le contenu, fais un rebuild complet :

```powershell
$env:CURRICULUM_LOCALE='french'
$env:CLIENT_LOCALE='french'
Remove-Item Env:FCC_WATCH_MODE -ErrorAction SilentlyContinue
pnpm -C curriculum build
pnpm -C client create:external-curriculum
```

Cette commande prend ~3 min mais elle met tout a jour. Lance-la quand tu veux verifier le contenu des challenges, pas juste les listings.

## Lint-Staged Sur Windows

Lint-staged 16+ utilise nano-spawn sans shell pour spawner les commandes. Sur Windows avec un chemin parent qui contient des espaces (`Nouveau dossier`), les arguments fichier entoures de guillemets sont passes litteralement, et ESLint v9 / Prettier les rejettent comme patterns malformes :

```text
No files matching the pattern "C:/Users/.../Nouveau" were found.
```

Workaround applique dans `client/.lintstagedrc.mjs` et `curriculum/.lintstagedrc.mjs` : la config est un no-op (sauf le markdown-linter pour `curriculum/challenges/**/*.md` qui n'est pas touche par le bug). Lance lint / format manuellement :

```powershell
pnpm -C client lint
pnpm -C client format
```

Le `pre-push` hook (`.husky/pre-push`) continue de tourner Prettier sur les fichiers modifies via une boucle bash, donc rien ne passe en commit sans relecture des regles.

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
