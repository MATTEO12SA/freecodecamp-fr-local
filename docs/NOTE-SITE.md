# Note du site — freeCodeCamp FR Local

Photo du 21 août 2026, après UX fork FR, qualité des 4 certs 100 %, et arrêt
propre du serveur local. `AUDIT_COMPLET_APPLICATION.md` reste la photo
navigateur du 26 juillet 2026.

La vue visuelle vit aussi dans le canvas d'audit du workspace Cursor
(`audit-complet-fork.canvas.tsx`).

## Note globale

**8,5 / 10** (estimation code + parcours, pas un nouveau Lighthouse).

Juillet mesuré : 6,7 / 10. 18 août : 8,3 / 10.

## Notes par domaine (/10)

| Domaine        | 26 juillet (mesuré) | 21 août |
| -------------- | ------------------- | ------- |
| Fonctionnement | 7,8                 | 8,7     |
| Stabilité      | 7,6                 | 8,4     |
| Design         | 6,8                 | 8,0     |
| Cohérence      | 6,4                 | 8,4     |
| UX             | 6,9                 | 8,6     |
| Responsive     | 8,4                 | 8,5     |
| A11y           | 5,8                 | 7,7     |
| Perf           | 5,7                 | 7,1     |
| Textes         | 6,1                 | 8,2     |
| Confiance      | 5,8                 | 8,5     |

## Ce qui tient la note

- Mode local : pas de compte, pas d'API obligatoire, pas de GTM/GA/Stripe.
- 28/29 constats de juillet corrigés ; AUD-29 non reproduit en production ;
  AUD-22 encore partiel (warnings Monaco/vidéo possibles).
- Catalogue = **7 certs v9** + badges FR + section française. Plus de liste
  vide « Français ».
- Menu dropdown compact, clic extérieur, labels Carte / Parcours / Catalogue /
  Outils.
- `/dev-fr` : HTTP live, traductions = preval, snapshot optionnel (git/drift).
- RWD / JS / FEL / APIs : complets au niveau **fichiers**. Le % affiché n'est 100
  que si intros (y compris copies autonomes) et titres le sont aussi.
  Assignments reviews EN corrigés ; labels `/learn` JS+APIs en FR.
- Examen : session v2, Reprendre / Recommencer, filtre « Sans réponse ».
- Watcher : `fs.watch` récursif + touch preval sur **couverture** v9.
- `dev.ps1` écrit `local:report` une fois le port UP.

## Ce qui empêche 9+

- Python / SQL / full-stack encore 0 % (prochaine cible : `python-v9`).
- Chrome `translations.json` encore partiellement EN (`Reset this lesson?`,
  footer legal, Socrates).
- `/exam-fr` et `/learn` ont encore `Col mdOffset`.
- RWD : drift de chunks (`check-translation-quality` ERREUR) non retouché.
- Examen honor-system. Vague 5 restante : SRS, XP, streaks, badges, PWA.

## Relancer

```powershell
.\dev.ps1
pnpm -C client exec vitest run src/pages/catalog.test.tsx src/pages/dev-fr.test.tsx
pnpm local:check
```

Arrêt propre : tuer le process LISTENING sur le port 8000 (ou Ctrl+C dans le
terminal `.\dev.ps1`). `dev-logs/status.json` doit passer à `DOWN`.
