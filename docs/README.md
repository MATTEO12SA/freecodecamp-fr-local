# Documentation FR Locale

Index des docs du fork local. Tous les fichiers de ce dossier sont detailles ;
le point d'entree global reste le `CLAUDE.md` a la racine, et le `README.md`
racine pour le demarrage.

## Contenu De `docs/`

- [QUICKSTART.md](QUICKSTART.md) : commandes courtes, checks rapides, pages utiles.
- [DOCS-FR.md](DOCS-FR.md) : detail technique complet (nettoyage strict, hot-reload, examen local, watcher).
- [HANDOFF-TRADUCTIONS.md](HANDOFF-TRADUCTIONS.md) : etat exact des traductions, prochaine cible, pieges connus.
- [OPTIMIZE-TRANSLATIONS.md](OPTIMIZE-TRANSLATIONS.md) : retour d'experience et workflow qualite des workshops.
- [TOOLS-REPORT.md](TOOLS-REPORT.md) : role de chaque script sous `tools/`.
- [NOTE-SITE.md](NOTE-SITE.md) : note courante du site (8,5/10, 21 août 2026) et écart vs l'audit de juillet.
- [ROADMAP.md](ROADMAP.md) : priorites correctives issues du dernier audit, puis vagues produit.
- [AUDIT-FIX-TRACKER.md](AUDIT-FIX-TRACKER.md) : statut, cause, tests et preuve des 29 constats.
- [AUDIT-FIX-REPORT.md](AUDIT-FIX-REPORT.md) : synthese finale de la campagne de correction.

A la racine (hors `docs/`) :

- [../README.md](../README.md) : demarrage standard avec `.\dev.ps1`.
- [../AUDIT_COMPLET_APPLICATION.md](../AUDIT_COMPLET_APPLICATION.md) : audit navigateur exhaustif du 26 juillet 2026 (29 constats, preuves, notes et verdict).
- [../dev-logs/README.md](../dev-logs/README.md) : comprendre `latest.log`, `status.json` et les anciens chemins `server.log` / `errors.log`.

## Etat Qualite Actuel

- Le coeur local fonctionne sans compte ni backend obligatoire.
- Les 29 constats ont ete suivis : 28 corriges, 1 non reproduit dans le build de production.
- Le test reseau couvre sept routes dans Chromium, Firefox et WebKit avec zero telemetrie, zero appel au port 3000, zero erreur console et zero warning audite.
- Axe strict a scanne 10/10 etats sans page ignoree ni violation serieuse.
- `/dev-fr` et `/___graphql` restent disponibles en developpement et sont absents du build public.

## Lancer Le Serveur

```powershell
.\dev.ps1
.\dev-check.ps1 -Wait -Open
```

## Verifier Avant Push

```powershell
pnpm local:check        # HTTP + drift + qualité FR JS v9 + tests catalogue + lint JS v9 + typecheck client/shared + garde liens externes
pnpm local:check:full   # + lint client/racine + parcours + reseau/console + Axe strict
```

Ces commandes generent aussi le snapshot optionnel (git/drift) de `/dev-fr`. La table traductions et le HTTP de la page sont live.

`axe-test.mjs` affiche les compteurs demandés/chargés/scannés/ignorés/échoués.
Le mode strict échoue dès qu'une page n'est pas réellement scannée ;
`test:axe-regression` vérifie le cas inaccessible.

## Suivi Et Qualite (Lecture Seule)

```powershell
node tools/translation-status.js        # avancement FR par cert v9 — niveau fichier (.md FR/EN) + blocs
node tools/check-translation-drift.js   # drift EN -> FR (repli mtime hors git), exit 1 si drift
node tools/check-external-links.js      # echoue si un lien de navigation externe non allowliste apparait dans client/src
pnpm local:report                       # snapshot /dev-fr (client/static/local-dev/report.json, ignore par git)
```

Logique de scan FR centralisee dans `tools/lib/curriculum-fr.js` (chemins, blocs
traduits, completude fichier, structure superblock).

## Lire Les Logs

```powershell
Get-Content dev-logs\latest.log -Wait | Select-String -Pattern "status.up|status.error|watcher.|challenge.integrating|challenge.integrated|challenge.error|intro.changed|intro.integrated"
```

Les evenements `watcher.added`, `challenge.integrating` et `challenge.integrated`
confirment que Gatsby voit les fichiers `.md` FR.

## Traduire

- [HANDOFF-TRADUCTIONS.md](HANDOFF-TRADUCTIONS.md) : etat exact, prochaine cible, pieges.
- [OPTIMIZE-TRANSLATIONS.md](OPTIMIZE-TRANSLATIONS.md) : workflow qualite.
- `tools/translate-workshop.js` :
  - mode `workshop` pour `description/hints` ;
  - mode `lecture` pour `description/interactive/questions/answers/feedback`.

## Catalogue Et Pages Locales

- `/cours-fr` : certifications FR, progression locale, acces examens.
- `/catalog` : 7 certs v9, section FR en tête, badges de couverture, recherche/filtres, progression locale.
- `/learn` : carte complète du curriculum local (beaucoup de blocs encore EN hors des certs v9 déjà livrées en fichiers).
- `/dev-fr` : hub local. HTTP live, traductions v9 depuis le preval, snapshot optionnel pour git/drift. Menu : **Outils** (develop seulement).
- `/exam-fr?cert=responsive-web-design-v9` : examen local FR, accessible depuis `/cours-fr` et `/dev-fr`.

Le menu principal expose Carte `/learn`, Parcours `/cours-fr`, Catalogue `/catalog`, Outils `/dev-fr`.
L'entrée `/dev-fr` est conditionnée au mode développement.
