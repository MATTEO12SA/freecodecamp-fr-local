# Index Documentation FR Locale

Point d'entree rapide pour retrouver les docs du fork local.

## Lancer Le Serveur

- [README.md](README.md) : demarrage standard avec `.\dev.ps1`.
- [QUICKSTART.md](QUICKSTART.md) : commandes courtes, checks rapides et pages utiles.
- [dev-logs/README.md](dev-logs/README.md) : comprendre `latest.log`, `status.json`, `server.log` et `errors.log`.

Commandes principales :

```powershell
.\dev.ps1
.\dev-check.ps1 -Wait -OpenDev
```

## Verifier Avant Push

```powershell
pnpm local:check
pnpm local:check:full
```

Ces commandes generent aussi le snapshot utilise par `/dev-fr`.

## Tableau De Bord Local

- `/dev-fr` : hub local qui regroupe serveur, logs, progression traduction, drift, git, liens rapides et progression navigateur.
- `pnpm local:report` genere `client/static/local-dev/report.json`.
- Le snapshot est local et ignore par git.

## Lire Les Logs

```powershell
Get-Content dev-logs\latest.log -Wait | Select-String -Pattern "status.up|status.error|watcher.|challenge.integrating|challenge.integrated|challenge.error|intro.changed|intro.integrated"
```

Les evenements `watcher.added`, `challenge.integrating` et `challenge.integrated` confirment que Gatsby voit les fichiers `.md` FR.

## Traduire

- [HANDOFF-TRADUCTIONS.md](HANDOFF-TRADUCTIONS.md) : etat exact, prochaine cible, pieges connus.
- [OPTIMIZE-TRANSLATIONS.md](OPTIMIZE-TRANSLATIONS.md) : retour d'experience et workflow qualite.
- `tools/translate-workshop.js` :
  - mode `workshop` pour `description/hints` ;
  - mode `lecture` pour `description/interactive/questions/answers/feedback`.

## Catalogue Et Pages Locales

- `/cours-fr` : certifications FR, progression locale et acces examens.
- `/catalog` : catalogue global avec recherche, filtres niveau/theme, `Theme > Francais`, progression locale et bouton continuer.
- `/learn` : parcours complet local.
- `/exam-fr?cert=responsive-web-design-v9` : examen local FR, accessible depuis `/cours-fr` et `/dev-fr`.

Le menu principal expose les pages utiles : `/learn`, `/cours-fr`, `/catalog`, `/dev-fr`.

## Outils

- [TOOLS-REPORT.md](TOOLS-REPORT.md) : role des scripts sous `tools/`.
- `node tools/translation-status.js` : avancement FR par superblock.
- `node tools/check-translation-drift.js` : drift EN -> FR.
- `pnpm local:report` : snapshot `/dev-fr`.
- `pnpm local:check` : verdict local rapide.
