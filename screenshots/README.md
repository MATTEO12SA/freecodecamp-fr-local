# Screenshots

Dossier de **captures vivantes** du fork local. Ce n'est plus une archive
d'audit de juillet 2026 : on régénère le tour à chaque fois que l'UI change.

## Relancer le tour humain

Le serveur doit déjà répondre sur `http://localhost:8000`.

```powershell
.\dev.ps1                 # ne relance rien s'il est déjà UP
pnpm screenshots          # node tools/screenshot-tour.mjs
```

Le script clique vraiment : menu, parcours, certification, examen
(Commencer / Reprendre), recherche catalogue, filtre Français, 404, thème
sombre, mobile 390×844.

Résultat : `screenshots/current/` (PNG + `manifest.json` + index Markdown
sans images embarquées). Ce sous-dossier est git-ignoré.

Les pages longues (catalogue, cursus, certification JS, hub dev) sont
capturées en viewport, pas en fullPage. Le tour vérifie aussi : CTA
accueil, Passer l'examen, URL de filtre catalogue, liste d'examen sans
Python, boutons Reprendre / Recommencer.

Les anciennes preuves `audit-2026-07-26/` et `audit-fix-2026-07-26/` ont été
retirées. L'audit historique reste dans `AUDIT_COMPLET_APPLICATION.md` ; les
captures actuelles sont ici.
