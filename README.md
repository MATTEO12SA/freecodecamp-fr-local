# freeCodeCamp FR Local

Version personnelle de freeCodeCamp pour apprendre en local, en francais, sans compte et sans backend obligatoire pour le parcours principal.

> **Projet personnel et non officiel.** Ce depot est un fork educatif a usage personnel. Il n'est ni affilie a, ni soutenu par freeCodeCamp.org. « freeCodeCamp » est une marque de freeCodeCamp.org, Inc. Le code et le curriculum d'origine restent sous leurs licences respectives (voir [Licence](#licence)).

Le site se lance sur ton ordinateur, ta progression reste dans `localStorage`, `/cours-fr` sert de dossier de certifications francaises et `/catalog` garde le catalogue global avec ses filtres, dont `Theme > Francais` pour afficher les superblocks qui possedent deja au moins un fichier FR. `/exam-fr?cert=<superblock>` lance un examen local 100% FR qui tire 80 questions parmi les quizzes traduits.

> **Etat qualite verifie le 26 juillet 2026.** Les 29 constats de l'audit ont
> ete traites : 28 sont corriges et la charge lourde mesuree uniquement dans
> Gatsby Develop n'est pas reproduite dans le build de production. Les parcours
> locaux testés ne chargent ni GTM, ni Google Analytics, ni Stripe et ne
> contactent pas le port 3000. Voir le
> [tracker](docs/AUDIT-FIX-TRACKER.md) et le
> [rapport final](docs/AUDIT-FIX-REPORT.md).

## Demarrage

Prerequis : Node.js >= 24 et pnpm >= 10 (voir `.nvmrc` et `package.json`).

Depuis PowerShell :

```powershell
git clone https://github.com/MATTEO12SA/freecodecamp-fr-local.git
cd freecodecamp-fr-local
pnpm install
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
```

`status.json` indique le statut courant `STARTING`, `UP`, `DOWN` ou `ERROR`. Attention : il peut mentir en cas de crash sans cleanup, ou pendant un rebuild Gatsby qui ferme temporairement le port. Pour un vrai check :

```powershell
.\dev-check.ps1                    # snapshot : UP / STARTING / ZOMBIE / DOWN
.\dev-check.ps1 -Wait -Timeout 600 # boucle jusqu'a UP
```

Le script combine `status.json` + process node + HTTP HEAD `localhost` + fallback TCP IPv4/IPv6. Codes de sortie : 0 UP, 1 DOWN, 2 ZOMBIE, 3 STARTING.

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

`server.log` et `errors.log` sont d'anciens chemins de diagnostic. Le lanceur actuel ne les réécrit plus : le suivi utile vit dans `latest.log` et l'état courant dans `status.json`.

Pages utiles :

```text
http://localhost:8000
http://localhost:8000/cours-fr
http://localhost:8000/catalog
http://localhost:8000/dev-fr
http://localhost:8000/learn
http://localhost:8000/exam-fr?cert=responsive-web-design-v9
```

## Ce Fork Change Quoi

- Utilisateur local automatique, sans Auth0 ni MongoDB.
- Progression sauvegardee dans `localStorage`.
- API backend neutralisee pour le flux d'apprentissage principal.
  `exam-download` utilise des prerequis calcules localement et ne monte aucun
  hook RTK Query en mode local.
- Interface francaise avec contenus d'origine encore disponibles quand la traduction manque.
- Donnees statiques du curriculum generees avec les titres FR quand `CURRICULUM_LOCALE=french`.
- `/cours-fr` affiche les certifications francaises. Chaque cert sans contenu FR porte automatiquement un badge `🚧 Traduction a venir`, calcule par `client/src/utils/has-french-intro.ts` (preval qui scanne le filesystem). L'accordeon contient l'examen qui pointe sur la page locale `/exam-fr`. En ouvrant une cert, une barre « X/Y challenges termines » et les coches ✓ refletent la progression `localStorage`.
- `/catalog` propose recherche texte, filtres niveau/theme, `Theme > Francais`,
  progression locale et bouton `Continuer`. Il affiche 12 cartes au depart,
  charge la suite sur demande et calcule pour chaque carte un statut FR
  `absent`, `partiel` ou `complet`.
- `/dev-fr` regroupe serveur, logs, traduction, drift, git, liens rapides et
  progression navigateur via un snapshot genere par `pnpm local:report`.
  `Relire le snapshot` refetch le fichier existant. La route et son menu
  n'existent pas dans le build public.
- `/exam-fr?cert=<superblock>` lance l'examen local : 80 questions tirees au hasard parmi les `quiz-*` traduits du superblock. 70% pour reussir. Pas besoin du `.exe` officiel de freeCodeCamp ni de compte Auth0. L'examen garde un historique local des tentatives, affiche les stats par module et permet de reviser uniquement les questions ratees.
- **Live detection** : creer un nouveau dossier `blocks/<x>/` avec un `.md` FR met a jour automatiquement le filtre catalog et le badge cours-fr sans redemarrer le serveur (voir `dev-logs/latest.log` -> `watcher.touched`).
- Liens de navigation externes visibles desactives ou retires. Le mode local
  bloque aussi l'initialisation analytics et l'import Stripe ; un test réseau
  couvre sept routes dans Chromium, Firefox et WebKit.
- Defi du jour, forum/aide externe, donations, app mobile, partage social, CodeAlly/Ona/Codespaces et pages API inutiles retires du site local.

## Curriculum FR

Les traductions vivent dans :

```text
curriculum/i18n-curriculum/curriculum/challenges/french/
```

RWD / JS / FEL / APIs v9 sont `COMPLET` (`node tools/translation-status.js`).
Python v9 est a **25 %** (modules basics + loops livrés). Prochaine cible :
**`lecture-working-with-dictionaries-and-sets`**. Un affichage `100 %` n'est vrai
que si fichiers + labels intro (y compris copies autonomes) + titres sont FR.

Pour continuer les workshops sans toucher au code technique :

```powershell
node tools/translate-workshop.js extract <workshop>
# traduire et relire tools/translations/<workshop>.json
node tools/translate-workshop.js apply <workshop>
node tools/translate-workshop.js verify <workshop>
```

Le script extrait seulement la prose, reconstruit les `.md` FR depuis les fichiers EN et verifie que les blocs de code, tests, seeds, marqueurs et frontmatter technique restent intacts. Avant `apply`, relire le JSON et scanner les restes anglais/hybrides (`should`, `Your`, `the`, `matching the`, `but found`, `undefined`, accords casses). Les helpers temporaires de remplissage ne se commit pas.

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
pnpm local:report                       # genere le snapshot /dev-fr
pnpm local:check                        # verdict local rapide
pnpm local:check:full                   # checks longs avant push final
```

`pnpm local:check:full` lance Axe en mode strict. Le script échoue sur page
inaccessible, timeout, scan ignoré ou zéro page scannée et affiche ses compteurs.
La régression `pnpm test:axe-regression` vérifie explicitement ce garde-fou.

Scripts locaux gardes :

```text
tools/local-e2e/          # QA Playwright (human-qa, axe, network, prod…)
pnpm test:human-qa
```

La documentation de reference vit dans `docs/`. Les points d'entree, la licence, les instructions agent et l'audit restent a la racine :

- [`docs/README.md`](docs/README.md) : index rapide des docs, commandes et pages locales.
- [`docs/QUICKSTART.md`](docs/QUICKSTART.md) : commandes courtes pour lancer et tester.
- [`docs/DOCS-FR.md`](docs/DOCS-FR.md) : details techniques du fork local et du nettoyage strict.
- [`docs/HANDOFF-TRADUCTIONS.md`](docs/HANDOFF-TRADUCTIONS.md) : etat exact des traductions et prochaine cible.
- [`docs/OPTIMIZE-TRANSLATIONS.md`](docs/OPTIMIZE-TRANSLATIONS.md) : workflow rapide qualite maximale pour les workshops, avec le retour d'experience accumule sur les gros blocs.
- [`docs/TOOLS-REPORT.md`](docs/TOOLS-REPORT.md) : role des scripts et dossiers sous `tools/`.
- [`AUDIT_COMPLET_APPLICATION.md`](AUDIT_COMPLET_APPLICATION.md) : audit navigateur exhaustif du 26 juillet 2026, preuves et 29 problemes priorises.
- [`docs/AUDIT-FIX-TRACKER.md`](docs/AUDIT-FIX-TRACKER.md) : statut et preuves des 29 constats.
- [`docs/AUDIT-FIX-REPORT.md`](docs/AUDIT-FIX-REPORT.md) : rapport final des corrections et validations.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) : vagues correctives terminees, maintenance et evolutions produit.
- [`dev-logs/README.md`](dev-logs/README.md) : lecture des logs serveur et des events de traduction.

Le `CLAUDE.md` (racine) reste le point d'entree pour Claude Code.

## GitHub

Remote personnel :

```text
https://github.com/MATTEO12SA/freecodecamp-fr-local
```

## Licence

Ce projet derive de [freeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp) :

- **Code source** : BSD-3-Clause (voir `LICENSE.md`).
- **Curriculum et contenus pedagogiques** (y compris les traductions FR de ce depot) : [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), comme chez freeCodeCamp.

Les modifications et traductions francaises de ce fork sont publiees sous les memes licences que les fichiers d'origine correspondants.
