# Local E2E / QA browser scripts

Tous les scripts Playwright locaux du fork vivent ici (plus rien à la racine
du dépôt pour ces tests).

Lancer depuis la racine du repo, serveur UP (`.\dev.ps1`) :

```powershell
pnpm test:human-qa                          # hub + exercices humains + persist
node tools/local-e2e/human-qa-test.mjs --human
node tools/local-e2e/human-qa-test.mjs --hub
node tools/local-e2e/human-qa-test.mjs --persist

pnpm test:axe                               # a11y strict
pnpm test:axe-regression
pnpm test:local-network
pnpm test:audit-regression
pnpm test:production-regression             # build public requis
pnpm test:production-performance
pnpm screenshots
```

## Contenu

| Fichier | Rôle |
| --- | --- |
| `human-qa-test.mjs` | Suite unifiée : hub / frappe Monaco + FR / persist |
| `shared.mjs` | Helpers communs (browser, overlays, Monaco, assert FR) |
| `scenarios.mjs` | Échantillon d'exercices v1 |
| `smoke-test.mjs` | Stub → `--hub` |
| `submit-test.mjs` | Stub → `--human --rwd-only` |
| `persist-test.mjs` | Stub → `--persist` |
| `full-flow-test.mjs` | Stub → `--human` |
| `axe-test.mjs` | Audit accessibilité |
| `axe-test-regression.mjs` | Garde : Axe doit échouer si page inaccessible |
| `local-network-test.mjs` | Pas de GTM/GA/Stripe / :3000 |
| `audit-regression-test.mjs` | Parcours UI FR |
| `production-regression-test.mjs` | Build public sans `/dev-fr` |
| `production-performance-test.mjs` | Mesures perf build public |
| `screenshot-tour.mjs` | Captures `screenshots/current/` |

Rapports : `dev-logs/human-qa-report.json` (et autres outputs passés en `--output`).
