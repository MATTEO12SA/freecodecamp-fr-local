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
- [ROADMAP.md](ROADMAP.md) : audit senior + plan d'action detaille (vagues 1/2/3) pour passer en qualite produit.

A la racine (hors `docs/`) :

- [../README.md](../README.md) : demarrage standard avec `.\dev.ps1`.
- [../dev-logs/README.md](../dev-logs/README.md) : comprendre `latest.log`, `status.json`, `server.log`, `errors.log`.

## Lancer Le Serveur

```powershell
.\dev.ps1
.\dev-check.ps1 -Wait -Open
```

## Verifier Avant Push

```powershell
pnpm local:check        # HTTP + drift + tests catalogue + lint JS v9 + typecheck client/shared + garde liens externes
pnpm local:check:full   # + lint client/racine + smoke tests + audit a11y axe (serveur UP requis)
```

Ces commandes generent aussi le snapshot utilise par `/dev-fr`.

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
- `/catalog` : catalogue global, recherche, filtres niveau/theme, `Theme > Francais`, progression locale, bouton continuer.
- `/learn` : parcours complet local.
- `/dev-fr` : hub local (serveur, logs, traduction, drift, git, liens, progression navigateur).
- `/exam-fr?cert=responsive-web-design-v9` : examen local FR, accessible depuis `/cours-fr` et `/dev-fr`.

Le menu principal expose `/learn`, `/cours-fr`, `/catalog`, `/dev-fr`.
