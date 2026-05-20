# freeCodeCamp FR Local

Version personnelle de freeCodeCamp pour apprendre en local, en francais, sans compte, sans backend et sans redirection vers des services externes.

Le site se lance sur ton ordinateur, ta progression reste dans `localStorage`, `/cours-fr` sert de dossier de certifications francaises et `/catalog` garde le catalogue global avec ses filtres, dont `Theme > Francais` pour afficher automatiquement les niveaux deja disponibles en francais.

## Demarrage

Depuis PowerShell :

```powershell
cd "C:\Users\Erazer\.vscode\code\Nouveau dossier\freeCodeCamp"
.\dev.ps1
```

`.\dev.ps1` lance maintenant Gatsby directement en mode rapide. Si les fichiers generes manquent, le script bascule automatiquement sur le setup complet.

Si Gatsby garde une ancienne page en cache :

```powershell
.\dev.ps1 -Clean
```

Si tu veux forcer l'ancien chemin complet avec `turbo setup` :

```powershell
.\dev.ps1 -Full
```

Logs serveur :

```text
dev-logs/status.json
dev-logs/latest.log
dev-logs/errors.log
```

`status.json` indique le statut courant `STARTING`, `UP`, `DOWN` ou `ERROR`.

Pour suivre en direct quand le serveur est prêt et quand Gatsby intègre les traductions :

```powershell
Get-Content dev-logs\latest.log -Wait | Select-String -Pattern "status.up|status.error|watcher.|challenge.integrating|challenge.integrated|challenge.error"
```

`watcher.added` / `watcher.changed` indiquent que le `.md` FR est détecté. `challenge.integrating` puis `challenge.integrated` indiquent que Gatsby réintègre la page.

Pour les titres de modules et de blocs venant de `client/i18n/locales/french/intro.json`, surveille aussi :

```powershell
Get-Content dev-logs\latest.log -Wait | Select-String -Pattern "status.up|status.error|watcher.|challenge.integrating|challenge.integrated|challenge.error|intro.changed|intro.integrating|intro.integrated"
```

`intro.changed` puis `intro.integrated` indiquent qu'une modification directe de `intro.json` a été vue par le serveur et reprise dans le bundle `/learn`. `intro.integrating` puis `intro.integrated` indiquent que `create:external-curriculum` a repris `intro.json` dans les fichiers `curriculum-data` statiques servis par Gatsby.

Pages utiles :

```text
http://localhost:8000
http://localhost:8000/cours-fr
http://localhost:8000/catalog
http://localhost:8000/learn
```

## Ce Fork Change Quoi

- Utilisateur local automatique, sans Auth0 ni MongoDB.
- Progression sauvegardee dans `localStorage`.
- API backend neutralisee pour le flux d'apprentissage local.
- Interface francaise avec contenus d'origine encore disponibles quand la traduction manque.
- Donnees statiques du curriculum generees avec les titres FR quand `CURRICULUM_LOCALE=french`.
- `/cours-fr` affiche les certifications francaises et renvoie vers `/catalog` pour le catalogue global filtre.
- `/catalog` propose le filtre `Theme > Francais` pour afficher uniquement les niveaux deja traduits. Le filtre se met a jour automatiquement quand `client/i18n/locales/french/intro.json` recoit les titres/summaries FR d'un niveau.
- Liens externes visibles desactives ou retires.
- Defi du jour, forum/aide externe, donations, app mobile, partage social, CodeAlly/Ona/Codespaces et pages API inutiles retires du site local.

## Curriculum FR

Les traductions vivent dans :

```text
curriculum/i18n-curriculum/curriculum/challenges/french/
```

Responsive Web Design v9 est la priorite. Le contenu pedagogique est traduit jusqu'au module `css-animations` inclus, et l'examen RWD est traduit : chapitre HTML complet, `computer-basics`, les modules CSS de base jusqu'a CSS Grid, le lab de page de presentation de produit, puis animations CSS. Les gros workshops CSS non prioritaires restent en contenu d'origine tant qu'ils ne sont pas traduits.

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
