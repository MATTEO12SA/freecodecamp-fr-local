# freeCodeCamp FR Local

Version personnelle de freeCodeCamp pour apprendre en local, en francais, sans compte, sans backend et sans redirection vers des services externes.

Le site se lance sur ton ordinateur, ta progression reste dans `localStorage`, `/cours-fr` sert de dossier de certifications francaises et `/catalog` garde le catalogue global avec ses filtres, dont `Theme > Francais` pour afficher automatiquement les niveaux deja disponibles en francais. `/exam-fr?cert=<superblock>` lance un examen local 100% FR qui tire 80 questions parmi les quizzes traduits.

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

`status.json` indique le statut courant `STARTING`, `UP`, `DOWN` ou `ERROR`. Attention : il peut mentir en cas de crash sans cleanup, ou pendant un rebuild Gatsby qui ferme temporairement le port. Pour un vrai check :

```powershell
.\dev-check.ps1                    # snapshot : UP / STARTING / ZOMBIE / DOWN
.\dev-check.ps1 -Wait -Timeout 600 # boucle jusqu'a UP
```

Le script combine `status.json` + process node + port 8000 + HTTP HEAD. Codes de sortie : 0 UP, 1 DOWN, 2 ZOMBIE, 3 STARTING.

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
http://localhost:8000/exam-fr?cert=responsive-web-design-v9
```

## Ce Fork Change Quoi

- Utilisateur local automatique, sans Auth0 ni MongoDB.
- Progression sauvegardee dans `localStorage`.
- API backend neutralisee pour le flux d'apprentissage local.
- Interface francaise avec contenus d'origine encore disponibles quand la traduction manque.
- Donnees statiques du curriculum generees avec les titres FR quand `CURRICULUM_LOCALE=french`.
- `/cours-fr` affiche les certifications francaises. Chaque cert sans contenu FR porte automatiquement un badge `🚧 Traduction a venir`, calcule par `client/src/utils/has-french-intro.ts` (preval qui scanne le filesystem). L'accordeon contient l'examen qui pointe sur la page locale `/exam-fr`. En ouvrant une cert, une barre « X/Y challenges termines » et les coches ✓ refletent la progression `localStorage`.
- `/catalog` propose le filtre `Theme > Francais`. Meme source de verite que `/cours-fr` : la fonction `hasFrenchIntro` est partagee.
- `/exam-fr?cert=<superblock>` lance l'examen local : 80 questions tirees au hasard parmi les `quiz-*` traduits du superblock. 70% pour reussir. Pas besoin du `.exe` officiel de freeCodeCamp ni de compte Auth0. L'examen garde un historique local des tentatives, affiche les stats par module et permet de reviser uniquement les questions ratees.
- **Live detection** : creer un nouveau dossier `blocks/<x>/` avec un `.md` FR met a jour automatiquement le filtre catalog et le badge cours-fr sans redemarrer le serveur (voir `dev-logs/latest.log` -> `watcher.touched`).
- Liens externes visibles desactives ou retires.
- Defi du jour, forum/aide externe, donations, app mobile, partage social, CodeAlly/Ona/Codespaces et pages API inutiles retires du site local.

## Curriculum FR

Les traductions vivent dans :

```text
curriculum/i18n-curriculum/curriculum/challenges/french/
```

Responsive Web Design v9 est la priorite et il est maintenant entierement traduit : chapitre HTML complet, `computer-basics`, modules CSS pedagogiques, labs autonomes, revisions, quiz, examen RWD et tous les workshops du superblock.

Etat actuel RWD v9 : 158 blocs FR sur 158 (100%). Les workshops `workshop-game-settings-panel`, `workshop-flexbox-photo-gallery`, `workshop-greeting-card`, `workshop-ferris-wheel`, `workshop-piano`, `workshop-parent-teacher-conference-form`, `workshop-colorful-boxes`, `workshop-rothko-painting`, `workshop-registration-form`, `workshop-balance-sheet`, `workshop-accessibility-quiz`, `workshop-nutritional-label`, `workshop-magazine`, `workshop-cat-painting`, `workshop-colored-markers`, `workshop-flappy-penguin` et `workshop-city-skyline` sont traduits. Il reste 0 workshop RWD.

JavaScript v9 est demarre : `lecture-introduction-to-javascript` et `lecture-introduction-to-strings` sont traduits (7 fichiers au total, 2 blocs FR sur 230). Les lectures JS utilisent `interactive/questions`, donc elles sont traduites manuellement tant que le pipeline workshop ne gere pas ces sections.

Pour continuer les workshops sans toucher au code technique :

```powershell
node tools/translate-workshop.js extract <workshop>
# traduire et relire tools/translations/<workshop>.json
node tools/translate-workshop.js apply <workshop>
node tools/translate-workshop.js verify <workshop>
```

Le script extrait seulement la prose, reconstruit les `.md` FR depuis les fichiers EN et verifie que les blocs de code, tests, seeds, marqueurs et frontmatter technique restent intacts. Avant `apply`, relire le JSON et scanner les restes anglais/hybrides (`should`, `Your`, `the`, `matching the`, `but found`, `undefined`, accords casses). Les helpers temporaires de remplissage ne se commit pas. Pour les lectures JavaScript v9, traduire manuellement et verifier que les blocs de code restent identiques.

## Validation

Commandes principales :

```powershell
pnpm -C curriculum lint-challenges
node tools/translate-workshop.js verify <workshop>
pnpm exec tsc --noEmit --pretty false -p client/tsconfig.json
pnpm --filter @freecodecamp/shared type-check
pnpm lint-root
```

Suivi des traductions (lecture seule) :

```powershell
node tools/translation-status.js        # avancement FR par superblock v9
node tools/check-translation-drift.js   # drift EN -> FR (exit 1 si drift)
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
- `HANDOFF-TRADUCTIONS.md` : etat exact des traductions et prochaine cible.
- `OPTIMIZE-TRANSLATIONS.md` : workflow rapide qualite maximale pour les workshops, avec le retour d'experience accumule sur les gros blocs.
- `dev-logs/README.md` : lecture des logs serveur et des events de traduction.
- `TOOLS-REPORT.md` : role des scripts et dossiers sous `tools/`.

## GitHub

Remote personnel :

```text
https://github.com/MATTEO12SA/freecodecamp-fr-local
```

## Licence

Le code original vient de freeCodeCamp et conserve sa licence d'origine. Voir `LICENSE.md`.
