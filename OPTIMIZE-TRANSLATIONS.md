# Plan d'Optimisation — Traductions Workshops RWD

Ce document définit la méthode pour finir les workshops Responsive Web Design v9 plus vite **sans baisser la qualité**.

Principe non négociable : les traductions finales sont rédigées et relues par Codex. Les scripts servent seulement à éviter de recopier le code et à vérifier que les parties techniques restent intactes.

## Objectif

Il reste 13 workshops RWD à traduire, soit 884 fichiers. Ces fichiers contiennent beaucoup de code HTML/CSS/JS répété dans les sections `seed`, `solutions` et `hints`.

Les premiers passages du pipeline sont terminés : `workshop-greeting-card` et `workshop-ferris-wheel` ont été extraits, traduits, appliqués, vérifiés, commit et pushés. Le pipeline `tools/translate-workshop.js` et `tools/translations/phrasebook.json` existent déjà.

Le gain attendu ne doit pas venir d'une traduction automatique brute, mais d'un pipeline qui :

- extrait uniquement la prose à traduire ;
- laisse le code, les tests et les marqueurs hors du contexte de traduction ;
- réassemble les `.md` FR à partir des fichiers EN ;
- vérifie automatiquement que seules les zones de prose autorisées ont changé.

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

Prochaine cible recommandée : `workshop-piano`.

```powershell
node tools/translate-workshop.js extract workshop-piano
# traduire et relire tools/translations/workshop-piano.json
node tools/translate-workshop.js apply workshop-piano
node tools/translate-workshop.js verify workshop-piano
pnpm -C curriculum lint-challenges --superblock responsive-web-design-v9
git diff --check
git commit -m "translate piano workshop"
git push standalone main
```

## Validations Obligatoires

Après chaque workshop :

```powershell
pnpm exec prettier --check tools/translate-workshop.js tools/translations/phrasebook.json
pnpm -C curriculum lint-challenges --superblock responsive-web-design-v9
node tools/translate-workshop.js verify <workshop>
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

Avancer workshop par workshop, avec commit + push à chaque fin de workshop.

Ordre recommandé, du plus petit au plus gros :

| Workshop                                  | Fichiers |
| ----------------------------------------- | -------- |
| `workshop-piano`                          | 31       |
| `workshop-parent-teacher-conference-form` | 37       |
| `workshop-colorful-boxes`                 | 43       |
| `workshop-rothko-painting`                | 44       |
| `workshop-registration-form`              | 61       |
| `workshop-balance-sheet`                  | 66       |
| `workshop-accessibility-quiz`             | 67       |
| `workshop-nutritional-label`              | 68       |
| `workshop-magazine`                       | 79       |
| `workshop-cat-painting`                   | 80       |
| `workshop-colored-markers`                | 89       |
| `workshop-flappy-penguin`                 | 104      |
| `workshop-city-skyline`                   | 115      |

## Ce Qu'On N'Utilise Pas Comme Source Finale

- `tools/translate-challenges.py` : il utilise Argos Translate, donc il peut produire une base approximative, mais il ne respecte pas l'exigence de traduction parfaite.
- Traductions upstream Crowdin : elles peuvent être consultées ponctuellement, mais elles ne doivent pas être appliquées sans relecture complète.
- Regex seules : elles accélèrent les phrases standard, mais ne remplacent pas la relecture humaine par Codex.

## TL;DR

On accélère le travail en retirant le code du chemin de traduction, pas en déléguant la qualité à un traducteur automatique. Le script extrait la prose, Codex traduit et relit, le script réassemble et vérifie que la technique est inchangée.
