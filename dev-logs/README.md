# Dev Logs

Ce dossier reste toujours au meme endroit pour suivre le serveur lance par `dev.ps1`.

Fichiers crees au lancement :

- `status.json` : statut courant `STARTING`, `UP`, `DOWN` ou `ERROR`.
- `latest.log` : transcript humain du dernier lancement.
- `server.log` : logs structures en JSON Lines, une entree par ligne.
- `errors.log` : avertissements et erreurs detectes avec une action conseillee.

Les fichiers generes sont ignores par Git. Garde ce dossier ouvert pendant le dev pour voir rapidement si le serveur est pret ou si une erreur bloque le lancement.
