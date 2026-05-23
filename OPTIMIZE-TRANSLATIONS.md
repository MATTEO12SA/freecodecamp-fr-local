# Plan d'Optimisation — Traductions Workshops RWD

Ce document définit la méthode pour finir les workshops Responsive Web Design v9 plus vite **sans baisser la qualité**.

Principe non négociable : les traductions finales sont rédigées et relues par Codex. Les scripts servent seulement à éviter de recopier le code et à vérifier que les parties techniques restent intactes.

## Objectif

Il reste 0 workshop RWD à traduire. Les 17 workshops RWD listés dans le tableau du HANDOFF sont maintenant traduits, dont 15 passés par ce pipeline et 2 (game-settings-panel, flexbox-photo-gallery) faits avant.

Les passages du pipeline sont terminés : `workshop-greeting-card`, `workshop-ferris-wheel`, `workshop-piano`, `workshop-parent-teacher-conference-form`, `workshop-colorful-boxes`, `workshop-rothko-painting`, `workshop-registration-form`, `workshop-balance-sheet`, `workshop-accessibility-quiz`, `workshop-nutritional-label`, `workshop-magazine`, `workshop-cat-painting`, `workshop-colored-markers`, `workshop-flappy-penguin` et `workshop-city-skyline` ont été extraits, traduits, appliqués, vérifiés, commit et pushés. Le pipeline `tools/translate-workshop.js` et `tools/translations/phrasebook.json` existent déjà.

Le gain attendu ne doit pas venir d'une traduction automatique brute, mais d'un pipeline qui :

- extrait uniquement la prose à traduire ;
- laisse le code, les tests et les marqueurs hors du contexte de traduction ;
- réassemble les `.md` FR à partir des fichiers EN ;
- vérifie automatiquement que seules les zones de prose autorisées ont changé.

## Retour D'Expérience Des Workshops Déjà Traduits

Ce qui a été validé sur les workshops déjà passés par le pipeline, jusqu'à `workshop-city-skyline` :

- Le bon rythme est **un workshop complet par tranche** : extraction, traduction JSON, application, vérification, docs, commit, push.
- Le pipeline fait gagner du temps parce qu'il évite de relire des milliers de lignes de `seed`, `solutions`, asserts et HTML/CSS répétés. Exemples concrets : `workshop-parent-teacher-conference-form` a généré 37 fichiers et 5824 lignes FR à partir d'un JSON relu de 1517 lignes ; `workshop-registration-form` a généré 61 fichiers en ne traduisant que 322 chaînes de prose.
- La qualité vient de la relecture humaine du JSON, pas du script. Le script protège la technique ; il ne garantit pas le style, le ton ni la justesse pédagogique.
- Sur les gros workshops de 60+ fichiers, un helper Node temporaire peut accélérer le pré-remplissage du JSON, mais il doit rester un brouillon local : ne jamais le commit, ne jamais lui faire confiance sans relecture et le supprimer avant le commit final.
- Les hints mécaniques peuvent produire des phrases grammaticalement cassées même quand tous les champs `fr` sont remplis. Après génération, lancer un scan ciblé sur les artefacts anglais ou hybrides : `the`, `should`, `Your`, `hovered`, `matching the`, `but found`, `undefined`, `a doit`, accords singulier/pluriel et vieux restes comme `devrait`.
- Le scan anti-anglais doit être interprété intelligemment : les valeurs en backticks exigées par les tests restent souvent en anglais (`HTML/CSS Quiz`, `Select an option`, `Calories`, `Total Fat`, etc.).
- Toujours échantillonner plusieurs familles d'étapes après remplissage : premières étapes HTML, étapes de formulaire, étapes CSS, dernière étape. Les erreurs de sujet comme `the first...` ou `Les éléments ... doit` se voient vite sur ces échantillons.
- Le premier fichier ajouté d'un nouveau workshop doit apparaître dans `dev-logs/latest.log` avec `watcher.added`, puis `watcher.touched` si le bloc FR n'existait pas encore, puis `challenge.integrating` et `challenge.integrated`.
- Quand `intro.json` change, `latest.log` doit aussi montrer `intro.changed` puis `intro.integrated`.
- `client/i18n/locales/french/intro.json` contient souvent deux entrées pour le même workshop : une entrée module et une entrée superblock. Il faut mettre à jour les deux, sinon `/learn` et les vues module peuvent diverger.
- Les compteurs docs doivent être mis à jour à chaque workshop : nombre de blocs FR, nombre de workshops restants, nombre total de fichiers restants et prochaine cible.
- Le hook `.husky/pre-push` doit garder `xargs -n 50`. Sans découpage, Windows peut échouer avec "ligne de commande trop longue" quand un workshop ajoute 60+ fichiers.
- `workshop-city-skyline` a confirmé un piège des helpers temporaires : les remplacements trop larges comme `utilise -> utilisé` cassent des verbes au présent (`qui utilise`, `elle utilise`). Les corrections doivent être ciblées, puis rescannees sur un échantillon de plusieurs étapes.

## Ce Qu'Il Faut Faire À Chaque Workshop

- Lire `HANDOFF-TRADUCTIONS.md` avant de commencer pour confirmer la prochaine cible et le contexte.
- Vérifier que le repo est propre avec `git status --short`.
- Extraire avec `node tools/translate-workshop.js extract <workshop>`.
- Traduire **tous** les champs `fr` dans `tools/translations/<workshop>.json`.
- Relire le JSON comme un vrai texte pédagogique : phrases naturelles, tutoiement, cohérence avec les workshops précédents.
- Lancer un scan qualité sur le JSON avant `apply` pour repérer les fragments anglais ou hybrides.
- Passer `reviewed` à `true` seulement quand aucun champ `fr` n'est vide et que la relecture est faite.
- Appliquer avec `node tools/translate-workshop.js apply <workshop>`.
- Vérifier immédiatement avec `node tools/translate-workshop.js verify <workshop>`.
- Mettre à jour `intro.json` pour le titre et l'intro du workshop.
- Mettre à jour les docs : `README.md`, `QUICKSTART.md`, `DOCS-FR.md`, `HANDOFF-TRADUCTIONS.md` et ce fichier.
- Lancer les validations listées plus bas avant commit.
- Commit + push tout de suite après un workshop terminé.

## Ce Qu'Il Ne Faut Pas Faire

- Ne pas traduire directement les fichiers `.md` FR à la main quand le workshop passe par le pipeline. Le risque est trop élevé de casser un bloc technique ou une fin de ligne.
- Ne pas modifier `seed-contents`, `solutions`, asserts JS, sélecteurs CSS, IDs, classes, URLs, noms de fichiers, `dashedName`, `challengeType`, `demoType` ou marqueurs `# --...--`.
- Ne pas traduire une chaîne visible si elle est testée par assertion. Si un hint dit que le texte doit être `Parent Teacher Conference Form`, la chaîne en backticks reste en anglais.
- Ne pas faire confiance au phrasebook sans relecture. Il accélère les phrases répétitives, mais il peut produire une phrase correcte grammaticalement et mauvaise pédagogiquement.
- Ne pas committer les scripts temporaires de remplissage (`fill-*.js`). Ils servent seulement pendant un workshop et doivent disparaître avant `git add`.
- Ne pas corriger une mauvaise sortie générée directement dans les `.md` si elle vient d'un patron. Corriger le JSON ou le helper, régénérer avec `apply`, puis vérifier.
- Ne pas utiliser Argos, upstream ou une regex comme source finale. Ces sources peuvent aider à comprendre, mais la livraison doit être relue et harmonisée ici.
- Ne pas oublier `intro.json`. Un workshop peut être traduit dans le curriculum et rester affiché en anglais dans `/learn` si l'intro n'est pas mise à jour.
- Ne pas oublier les docs. Sinon le prochain démarrage repart avec de mauvais compteurs ou une mauvaise prochaine cible.
- Ne pas pousser si `verify`, `lint-challenges`, `git diff --check` ou les tests ciblés échouent.
- Ne pas prendre un `HTTP 200` sur `/learn` comme preuve suffisante. Il faut aussi vérifier le JSON curriculum, les logs serveur et les validations.

## Style FR À Garder

- Tutoiement partout : `tu`, `ton`, `ta`, `tes`.
- Privilégier des consignes simples : `Ajoute`, `Définis`, `Cible`, `Assure-toi`, `Crée`.
- Garder les noms techniques en backticks : `input`, `label`, `fieldset`, `border-radius`, `display`, `::before`.
- Dire `élément label` plutôt que `un label` quand la phrase parle de HTML, en gardant `label` formaté comme du code dans la traduction.
- Dire `élément input` ou `champ de formulaire` plutôt que `input` seul dans une phrase générale, en gardant `input` formaté comme du code dans la traduction.
- Garder les valeurs imposées en anglais dans les backticks si les tests les exigent : `Email: `, `Phone: `, `Parent Teacher Conference Form`.
- Dans les workshops de type page réelle, beaucoup de textes visibles sont testés. Garder en anglais les chaînes imposées par les assertions même si la consigne autour est en français.
- Traduire les titres d'étape en `Étape N`, exactement aligné avec `dashedName: step-N`.
- Garder les titres de workshops cohérents avec `/learn` : `Créer ...` ou `Construire ...`, mais ne pas mélanger plusieurs versions pour le même bloc.

## Pièges Techniques Déjà Rencontrés

- Les fichiers EN peuvent contenir des lignes vides finales dans des sections techniques. `git diff --check` refuse parfois ces lignes sur de nouveaux fichiers. Le script normalise maintenant les espaces blancs copiés et les retours ligne finaux non sémantiques.
- Une réécriture PowerShell peut convertir des fichiers en CRLF ou retirer un espace technique volontaire. Si `verify` échoue après une correction mécanique, régénérer avec `apply`, puis corriger le script si nécessaire plutôt que bricoler les `.md`.
- Un `verify` qui échoue sur `section technique ... modifiee` signifie qu'il faut inspecter les espaces, fins de ligne ou blocs copiés, pas seulement la prose.
- `prettier --write` ne traite pas forcément les `.md` de curriculum comme attendu si le glob PowerShell ne matche pas. Toujours garder `verify` et `git diff --check` comme garde-fous finaux.
- `latest.log` peut montrer seulement le premier fichier ajouté d'un bloc, puis des changements ultérieurs. C'est normal : le signal important est la chaîne `watcher.added` → `challenge.integrating` → `challenge.integrated`.
- Le serveur peut être UP sans que les données statiques soient reconstruites. Pour une vérification locale robuste, lancer `pnpm -C curriculum build` puis `pnpm -C client create:external-curriculum`.
- Les pages existent parfois sous deux chemins : `/learn/responsive-web-design-v9/...` et `/learn/<module>/...`. Tester au moins le chemin superblock du workshop traduit.
- Un hook pre-push qui échoue sur Windows avec "ligne de commande trop longue" n'est pas un problème de traduction. La correction durable est de découper la liste de fichiers avec `xargs -n 50`, pas de réduire le workshop.

## Scan Qualité JSON Avant Application

Avant `apply`, faire au minimum :

```powershell
rg -n '"fr": ""|undefined|Hint non traduit|devrait|devrais|should|Your|The |the |matching the|but found| a doit| un règle' tools/translations/<workshop>.json
```

Puis lire quelques étapes complètes :

```powershell
node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync('tools/translations/<workshop>.json','utf8'));for(const i of [0,1,Math.floor(d.files.length/2),d.files.length-1]){const f=d.files[i];console.log('\n'+f.dashedName);console.log(f.description.map(x=>x.fr).join('\n'));console.log(f.hints.slice(0,8).map(x=>x.fr).join('\n'));}"
```

Objectif : repérer les phrases qui passent techniquement mais sonnent faux. Le `verify` protège le code ; ce scan protège la qualité du français.

Après `apply`, lancer immédiatement :

```powershell
node tools/translate-workshop.js verify <workshop>
```

## Règle De Qualité

- Tutoiement partout : « tu », jamais « vous ».
- `Step N` devient `Étape N`, avec `N` identique au `dashedName: step-N`.
- Code, assertions, sélecteurs, IDs, URLs, frontmatter technique, `seed-contents`, `solutions` et marqueurs de section restent verbatim.
- Le phrasebook peut pré-remplir des hints répétitifs, mais il ne valide jamais une traduction tout seul.
- Chaque fichier JSON extrait doit être relu et corrigé manuellement par Codex avant `apply`.
- Les traductions upstream ou Argos ne sont pas des sources finales. Elles peuvent servir de référence ponctuelle, mais la version livrée doit rester cohérente avec le style FR du repo.

## Pipeline Recommandé

Utiliser `tools/translate-workshop.js` en Node CommonJS avec trois commandes.

### `extract <workshop>`

Lit les fichiers EN de :

```text
curriculum/challenges/english/blocks/<workshop>/
```

Puis écrit :

```text
tools/translations/<workshop>.json
```

Le JSON contient uniquement :

- `title`
- prose de `# --description--`
- textes de `# --hints--` hors blocs ```js
- métadonnées minimales pour retrouver le fichier et l'étape

Le script peut utiliser `tools/translations/phrasebook.json` pour proposer une première traduction des hints simples, mais ces valeurs doivent rester considérées comme brouillon.

### `apply <workshop>`

Relit les `.md` EN comme templates, puis remplace seulement les champs de prose par les valeurs FR validées dans le JSON.

Le script écrit les fichiers FR dans :

```text
curriculum/i18n-curriculum/curriculum/challenges/french/blocks/<workshop>/
```

Toutes les sections techniques sont copiées depuis EN sans modification sémantique. Le script nettoie seulement les espaces blancs non sémantiques au moment d'écrire les fichiers FR, pour éviter les échecs `git diff --check`.

### `verify <workshop>`

Compare chaque fichier EN et FR.

Le check doit échouer si :

- un bloc de code a changé ;
- un assert JavaScript a changé ;
- un marqueur `# --...--` a changé ;
- `id`, `challengeType`, `dashedName`, `demoType` ou autre frontmatter technique a changé ;
- le nombre ou l'ordre des sections attendues ne correspond plus.

Le check accepte uniquement :

- `title:` traduit ;
- prose de `# --description--` traduite ;
- phrases de hints traduites hors blocs de code.

## Phrasebook

Ajouter `tools/translations/phrasebook.json` avec des patrons stricts pour les hints très répétitifs.

Exemples :

```json
[
  {
    "en": "^You should have a `(.+?)` element\\.$",
    "fr": "Tu devrais avoir un élément `$1`."
  },
  {
    "en": "^Your `(.+?)` selector should have a `(.+?)` property set to `(.+?)` as the value\\.$",
    "fr": "Ton sélecteur `$1` devrait avoir une propriété `$2` définie à `$3` comme valeur."
  }
]
```

Important : le phrasebook sert à gagner du temps sur les phrases mécaniques, mais Codex relit tout le JSON avant application.

## Première Exécution — Terminée

Le test réel sur `workshop-greeting-card` est terminé et pushé dans le commit `translate workshop greeting card`.

Ordre exécuté :

1. Créer `tools/translate-workshop.js`.
2. Créer `tools/translations/phrasebook.json`.
3. Lancer :

   ```powershell
   node tools/translate-workshop.js extract workshop-greeting-card
   ```

4. Traduire et relire manuellement `tools/translations/workshop-greeting-card.json`.
5. Lancer :

   ```powershell
   node tools/translate-workshop.js apply workshop-greeting-card
   node tools/translate-workshop.js verify workshop-greeting-card
   ```

6. Vérifier le diff.
7. Lancer les validations.
8. Commit + push :

   ```powershell
   git commit -m "translate workshop greeting card"
   git push standalone main
   ```

Résultat : 27 fichiers FR générés, `intro.json` mis à jour, `verify` OK, `lint-challenges` OK, serveur UP et `latest.log` avec `watcher.added`, `watcher.touched`, `challenge.integrating`, `challenge.integrated`.

## Prochaine Exécution

RWD est terminé : 158 blocs FR sur 158, 0 workshop restant. Pour la suite, passer à JavaScript v9 ou attendre les instructions utilisateur.

```powershell
node tools/translate-workshop.js extract <workshop>
# traduire et relire tools/translations/<workshop>.json
node tools/translate-workshop.js apply <workshop>
node tools/translate-workshop.js verify <workshop>
pnpm -C curriculum lint-challenges --superblock responsive-web-design-v9
git diff --check
git commit -m "translate <workshop-name> workshop"
git push standalone main
```

## Validations Obligatoires

Après chaque workshop :

```powershell
pnpm exec prettier --check tools/translate-workshop.js tools/translations/phrasebook.json
pnpm -C curriculum lint-challenges --superblock responsive-web-design-v9
node tools/translate-workshop.js verify <workshop>
pnpm -C client test catalog
pnpm lint-root
git diff --check
```

Vérifier aussi `dev-logs/latest.log` quand le serveur tourne :

```powershell
Select-String -Path dev-logs\latest.log -Pattern "watcher.added|watcher.touched|challenge.integrating|challenge.integrated|challenge.error" | Select-Object -Last 20
```

Les lignes attendues sont :

- `watcher.added`
- `challenge.integrating`
- `challenge.integrated`
- `watcher.touched` si le workshop était un nouveau bloc FR

## Workshops Restants

Aucun workshop RWD restant.

## Ce Qu'On N'Utilise Pas Comme Source Finale

- `tools/translate-challenges.py` : il utilise Argos Translate, donc il peut produire une base approximative, mais il ne respecte pas l'exigence de traduction parfaite.
- Traductions upstream Crowdin : elles peuvent être consultées ponctuellement, mais elles ne doivent pas être appliquées sans relecture complète.
- Regex seules : elles accélèrent les phrases standard, mais ne remplacent pas la relecture humaine par Codex.

## TL;DR

On accélère le travail en retirant le code du chemin de traduction, pas en déléguant la qualité à un traducteur automatique. Le script extrait la prose, Codex traduit et relit, le script réassemble et vérifie que la technique est inchangée.
