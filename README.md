# freeCodeCamp FR Local

Version personnelle de freeCodeCamp transformee pour fonctionner en local, en francais, sans compte utilisateur et sans backend.

Ce repo est base sur le code open source de freeCodeCamp, mais il est adapte pour un usage personnel : tu lances le client, tu ouvres le site dans ton navigateur, et ta progression reste sauvegardee sur ton ordinateur.

## Objectif

- Apprendre a coder en francais.
- Utiliser freeCodeCamp sans Auth0, MongoDB, API serveur, Stripe, donation ou services externes.
- Garder la progression dans le navigateur avec `localStorage`.
- Avoir un repo GitHub qui t'appartient et que tu peux modifier / commit / push comme tu veux.

## Lancer le projet

Depuis PowerShell :

```powershell
cd "C:\Users\Erazer\.vscode\code\Nouveau dossier\freeCodeCamp"
.\dev.ps1
```

Si Gatsby affiche une erreur qui parle de `.cache`, `async-requires.js` ou d'une ancienne page `certification`, relance avec nettoyage :

```powershell
.\dev.ps1 -Clean
```

Puis ouvre :

```text
http://localhost:8000
```

Page principale des cours francais :

```text
http://localhost:8000/cours-fr
```

## Ce qui a ete change

- Page d'accueil simplifiee avec un bouton direct vers les cours francais.
- Nouvelle page `/cours-fr` avec navigation par langue, certification et theme.
- Interface reduite pour un usage local : moins de liens externes, plus de compte, plus de donation.
- Utilisateur local automatique au demarrage.
- Progression sauvegardee dans `localStorage`.
- Appels reseau backend neutralises.
- Locale francaise ajoutee cote client.
- Traductions du curriculum integrees directement dans le repo.
- Script `dev.ps1` simplifie pour lancer seulement Gatsby et nettoyer les vieux caches Gatsby.

## Curriculum francais inclus

Le dossier francais se trouve ici :

```text
curriculum/i18n-curriculum/curriculum/challenges/french/
```

Contenu traduit actuellement :

- Premiers dossiers HTML de Responsive Web Design v9.
- Cat Photo App complet.
- Cafe Menu complet : 91 / 91 etapes.

Les autres contenus peuvent rester en anglais tant qu'ils ne sont pas traduits.

## Tests et verification

Scripts utiles a la racine :

```text
smoke-test.mjs
submit-test.mjs
persist-test.mjs
human-solve-test.mjs
full-flow-test.mjs
final-check.mjs
```

Verification TypeScript deja utilisee :

```powershell
pnpm exec tsc --noEmit --pretty false -p client/tsconfig.json
```

## Documentation

Lis ces fichiers pour le detail complet :

- `DOCS-FR.md` : explication detaillee de toutes les modifications.
- `QUICKSTART.md` : commandes de demarrage rapide.

## Notes GitHub

Ce repo est maintenant prevu pour etre pousse dans :

```text
https://github.com/MATTEO12SA/freecodecamp-fr-local
```

Il ne depend plus du fork `MATTEO12SA/i18n-curriculum` : les fichiers francais du curriculum sont versionnes directement dans ce repo.

## Licence

Le code original vient de freeCodeCamp et conserve sa licence d'origine. Voir `LICENSE.md`.
