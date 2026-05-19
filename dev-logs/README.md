# Dev Logs

Ce dossier reste toujours au meme endroit pour suivre le serveur lance par `dev.ps1`.

Commandes utiles :

```powershell
.\dev.ps1        # lancement quotidien: Gatsby direct
.\dev.ps1 -Clean # vide le cache Gatsby puis relance
.\dev.ps1 -Full  # force le setup complet
```

Fichiers crees au lancement :

- `status.json` : statut courant `STARTING`, `UP`, `DOWN` ou `ERROR`.
- `latest.log` : transcript humain du dernier lancement.
- `server.log` : logs structures en JSON Lines, une entree par ligne.
- `errors.log` : avertissements et erreurs detectes avec une action conseillee.

Pour suivre le serveur et les traductions dans le log principal :

```powershell
Get-Content dev-logs\latest.log -Wait | Select-String -Pattern "status.up|status.error|watcher.|challenge.integrating|challenge.integrated|challenge.error"
```

- `status.up` : Gatsby repond sur `http://localhost:8000`.
- `watcher.ready` : le watcher de traductions est arme.
- `watcher.changed` : un `.md` FR existant a ete modifie.
- `watcher.added` : un nouveau `.md` FR a ete detecte.
- `challenge.integrating` : Gatsby commence a reintegrer le fichier.
- `challenge.integrated` : Gatsby a reintegre le fichier et va reconstruire les donnees de page.
- `challenge.error` : l'integration a echoue, regarder la ligne d'erreur juste apres.

Pour voir aussi l'integration de `client/i18n/locales/french/intro.json` dans les titres de modules/blocs :

```powershell
Get-Content dev-logs\latest.log -Wait | Select-String -Pattern "status.up|status.error|watcher.|challenge.integrating|challenge.integrated|challenge.error|intro.changed|intro.integrating|intro.integrated"
```

- `intro.integrating` : le generateur charge `intro.json` et regenere les `curriculum-data`.
- `intro.integrated` : les donnees statiques sont a jour. La ligne indique notamment `responsive-web-design-v9.json=changed` ou `unchanged`.
- `intro.changed` : `intro.json` a ete modifie pendant que le serveur tourne.
- `intro.integrated` avec `logSource=dev-logs/client.stdout.log` : Gatsby a reconstruit le bundle `/learn` apres cette modification.

Les fichiers generes sont ignores par Git. Tu peux vider les `*.log` quand ils ne servent plus, mais garde `README.md`, `.gitignore`, `status.json` et `status-watch.ps1`.
