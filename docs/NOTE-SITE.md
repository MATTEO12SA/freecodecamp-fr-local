# Note du site — freeCodeCamp FR Local

Photo du 18 août 2026, après les correctifs d'audit, d'UI et de captures.
Ce fichier est l'état **courant**. `AUDIT_COMPLET_APPLICATION.md` reste la
photo navigateur du 26 juillet 2026 (notes plus basses, 29 constats).

La vue visuelle vit aussi dans le canvas d'audit du workspace Cursor
(`audit-complet-fork.canvas.tsx`).

## Note globale

**8,3 / 10** (estimation code + parcours Playwright, pas un nouveau Lighthouse).

Juillet mesuré : 6,7 / 10. Août matin (relecture code) : 7,8 / 10.

## Notes par domaine (/10)

| Domaine        | 26 juillet (mesuré) | 18 août soir |
| -------------- | ------------------- | ------------ |
| Fonctionnement | 7,8                 | 8,6          |
| Stabilité      | 7,6                 | 8,3          |
| Design         | 6,8                 | 7,8          |
| Cohérence      | 6,4                 | 8,2          |
| UX             | 6,9                 | 8,5          |
| Responsive     | 8,4                 | 8,6          |
| A11y           | 5,8                 | 7,7          |
| Perf           | 5,7                 | 7,1          |
| Textes         | 6,1                 | 7,6          |
| Confiance      | 5,8                 | 8,4          |

## Ce qui tient la note

- Mode local : pas de compte, pas d'API obligatoire, pas de GTM/GA/Stripe.
- 27/29 constats de juillet confirmés dans le code ; AUD-29 non reproduit en
  production ; AUD-22 encore partiel (warnings Monaco/vidéo).
- Examen : session v2 (seed, index, réponses — **pas** les solutions),
  Reprendre / Recommencer, filtre « Sans réponse », liste limitée aux certs
  qui ont des quiz FR.
- Catalogue : statut FR d'après `intro` + couverture fichiers, pas un booléen.
- Qualité FR JS v9 dans `pnpm local:check`. Argos (`translate-challenges.py`)
  désactivé.
- Watcher Windows : `fs.watch` récursif par défaut (`FCC_WATCHFILE=1` pour
  l'ancien poller).

## Ce qui empêche 9+

- Curriculum JS v9 à 149/230 blocs (~49 %). Modules 1-12 complets.
- Examen honor-system, HTML des quizzes rendu tel quel.
- GitHub Actions ne lance pas qualité FR, tsc client, ni Axe.
- Lab cert `lab-markdown-to-html-converter.json` extrait, `reviewed: false` — ne pas appliquer.
- Confettis de complétion respectent `prefers-reduced-motion`.
- Pas d'export de profil / PWA (vague 5, volontairement plus tard).

## Relancer les preuves

```powershell
.\dev.ps1
pnpm -C client test exam-certifications catalog exam-session exam-history
pnpm test:audit-regression
pnpm screenshots
```
