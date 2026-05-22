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

- `status.up` : Gatsby repond sur `http://localhost:8000`. Le watcher teste d'abord l'URL HTTP, puis le port TCP en fallback, parce que Gatsby peut ecouter sur `::1` sous Windows.
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

Si Windows ou le PC crash, le serveur ne peut pas toujours ecrire une derniere ligne `status.down`. Dans ce cas, relance simplement `.\dev.ps1` : `latest.log` et `status.json` sont recrees au debut du lancement.

Si le navigateur ouvre `http://localhost:8000` mais que `status.json` reste en `STARTING` ou passe en `ERROR`, verifier que `dev.ps1` contient bien le probe HTTP dans `Start-PortStatusWatcher`. L'ancien test TCP seul pouvait rater Gatsby quand le port 8000 etait ouvert uniquement sur IPv6 (`::1`).

## Pendant Une Traduction De Workshop

Quand `node tools/translate-workshop.js apply <workshop>` cree des `.md` FR pendant que le serveur tourne, `latest.log` doit montrer le cycle suivant :

```text
watcher.added
challenge.integrating
challenge.integrated
watcher.touched
```

`watcher.touched` apparait seulement si le workshop etait un nouveau bloc FR au demarrage du serveur. Il force la mise a jour live de `Theme > Francais` dans `/catalog` et des badges de `/cours-fr`.

Pour verifier vite :

```powershell
Select-String -Path dev-logs\latest.log -Pattern "watcher.added|watcher.touched|challenge.integrating|challenge.integrated|challenge.error|intro.changed|intro.integrated" | Select-Object -Last 30
```
