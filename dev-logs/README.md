# Dev Logs

Dossier de diagnostic du serveur lance par `.\dev.ps1`. Les fichiers generes
sont ignores par Git ; seuls ce README, `.gitignore` et les deux scripts
watchers sont versionnes.

## Commandes

```powershell
.\dev.ps1                 # lancement quotidien (Gatsby direct)
.\dev.ps1 -Clean          # vide le cache Gatsby puis relance
.\dev.ps1 -Full           # setup complet (plus lent)
.\dev-check.ps1           # verdict reel : UP / STARTING / ZOMBIE / DOWN
.\dev-check.ps1 -Wait     # attend HTTP pret
```

Si `http://localhost:8000` repond deja, `.\dev.ps1` s'arrete tout de suite
sans relancer Gatsby. C'est le chemin le plus rapide.

`status.json` peut mentir apres un crash. La source de verite est
`.\dev-check.ps1` (processus node + HTTP HEAD, pas seulement le fichier).

## Fichiers

| Fichier | Role |
| --- | --- |
| `status.json` | Statut `STARTING` / `UP` / `DOWN` / `ERROR` du dernier lancement. Ne pas s'y fier seul. |
| `latest.log` | Transcript du lanceur, de Gatsby et des watchers. |
| `latest.prev.log` | Copie de `latest.log` au lancement suivant. |
| `client.stdout.log` | Sortie brute de Gatsby. |
| `client.stderr.log` | Erreurs brutes de Gatsby. |
| `status-watch.ps1` | Attend une reponse HTTP puis ecrit `status.up`. |
| `intro-watch.ps1` | Suit `intro.json` pendant que le serveur tourne. |

Les anciens `server.log`, `errors.log` et `launcher.*.log` ne sont plus
ecrits. Ils ne servaient qu'a dupliquer `latest.log`.

## Evenements utiles

```powershell
Get-Content dev-logs\latest.log -Wait | Select-String -Pattern "status.up|status.error|watcher.|challenge.integrating|challenge.integrated|challenge.error|intro.changed|intro.integrated"
```

- `status.up` : Gatsby repond en HTTP sur `http://localhost:8000`.
- `watcher.ready` : le watcher de traductions est arme (`fs.watch` recursif,
  plus les 2000 pollers `fs.watchFile` par defaut).
- `watcher.changed` / `watcher.added` : un `.md` FR a change ou a ete cree.
- `challenge.integrated` : Gatsby a reintegre le fichier.
- `intro.integrated` : `intro.json` a ete repris dans les donnees de page.

## Pendant une traduction

Quand `node tools/translate-workshop.js apply <bloc>` cree des `.md` FR pendant
que le serveur tourne, tu dois voir :

```text
watcher.added
challenge.integrating
challenge.integrated
watcher.touched
```

`watcher.touched` n'apparait que si c'est le premier fichier FR du bloc. Il
rafraichit le filtre `Theme > Francais` et les badges de `/cours-fr`. Le
catalogue calcule ensuite `absent` / `partial` / `complete` avec le vrai
pourcentage de fichiers traduits.
