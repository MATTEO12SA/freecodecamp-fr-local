# freeCodeCamp FR Local

Version personnelle de freeCodeCamp pour apprendre en local, en francais, sans compte, sans backend et sans redirection vers des services externes.

Le site se lance sur ton ordinateur, ta progression reste dans `localStorage`, et `/cours-fr` sert de dossier de cours local.

## Demarrage

Depuis PowerShell :

```powershell
cd "C:\Users\Erazer\.vscode\code\Nouveau dossier\freeCodeCamp"
.\dev.ps1
```

Relance rapide apres un premier demarrage complet :

```powershell
.\dev.ps1 -Fast
```

Si Gatsby garde une ancienne page en cache :

```powershell
.\dev.ps1 -Clean
```

Pages utiles :

```text
http://localhost:8000
http://localhost:8000/cours-fr
http://localhost:8000/learn
```

## Ce Fork Change Quoi

- Utilisateur local automatique, sans Auth0 ni MongoDB.
- Progression sauvegardee dans `localStorage`.
- API backend neutralisee pour le flux d'apprentissage local.
- Interface francaise avec fallback anglais pour les contenus non traduits.
- Donnees statiques du curriculum generees avec les titres FR quand `CURRICULUM_LOCALE=french`.
- `/cours-fr` filtre les contenus non ouvrables localement.
- Liens externes visibles desactives ou retires.
- Defi du jour, forum/aide externe, donations, app mobile, partage social, CodeAlly/Ona/Codespaces et pages API inutiles retires du site local.

## Curriculum FR

Les traductions vivent dans :

```text
curriculum/i18n-curriculum/curriculum/challenges/french/
```

Responsive Web Design v9 contient deja plusieurs blocs francais, dont le debut HTML, Cat Photo App, Cafe Menu, Recipe Page, Bookstore Page, SEO, Travel Agency, audio/video et Music Player. Les fichiers manquants tombent en anglais tant qu'ils ne sont pas traduits.

## Validation

Commandes principales :

```powershell
pnpm -C curriculum lint-challenges
pnpm exec tsc --noEmit --pretty false -p client/tsconfig.json
pnpm --filter @freecodecamp/shared type-check
```

Scripts locaux gardes :

```text
smoke-test.mjs
submit-test.mjs
persist-test.mjs
full-flow-test.mjs
```

## Documentation

- `QUICKSTART.md` : commandes courtes pour lancer et tester.
- `DOCS-FR.md` : details techniques du fork local et du nettoyage strict.

## GitHub

Remote personnel :

```text
https://github.com/MATTEO12SA/freecodecamp-fr-local
```

## Licence

Le code original vient de freeCodeCamp et conserve sa licence d'origine. Voir `LICENSE.md`.
