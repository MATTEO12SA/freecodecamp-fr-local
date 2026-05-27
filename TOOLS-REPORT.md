# Rapport Sur Le Dossier `tools`

Ce dossier contient surtout l'outillage interne freeCodeCamp. Il ne sert pas seulement aux traductions : il sert aussi a parser le curriculum, generer des challenges, alimenter Gatsby, compiler les scripts du navigateur et preparer des donnees de dev.

## Resume Pratique

Pour le travail de traduction actuel, les fichiers les plus importants sont :

- `tools/translate-workshop.js` : pipeline securise pour extraire/appliquer/verifier la prose des workshops step-by-step.
- `tools/translations/*.json` : JSON de travail relus pour les workshops deja traduits.
- `tools/translations/phrasebook.json` : aide de pre-remplissage pour les hints repetitifs.
- `tools/client-plugins/gatsby-source-challenges/gatsby-node.js` : plugin Gatsby qui lit les challenges et surveille les nouveaux fichiers FR pendant le serveur dev.
- `tools/challenge-parser` : parser utilise par le curriculum pour transformer les `.md` en donnees exploitables.

Le reste sert surtout au developpement upstream freeCodeCamp ou a des workflows locaux precis.

## Ce Qu'Il Ne Faut Pas Modifier Sans Besoin

- `tools/client-plugins/browser-scripts/dist/` : fichiers generes et volumineux pour le runner de tests dans le navigateur.
- `tools/**/node_modules/` : dependances installees localement dans certains packages.
- `tools/**/.turbo/` : logs/cache de Turborepo.
- `tools/challenge-parser/parser/__fixtures__` et `__snapshots__` : fixtures de tests du parser.
- `tools/scripts/seed-exams/exams/` : donnees d'examen de dev, sensibles par conception upstream.

## Dossiers Et Scripts

| Chemin                                           | Role                                                                                                                                                                                     | Utile Pour Nous                                                                 |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `tools/translate-workshop.js`                    | Extrait/applique/verifie les workshops (`description/hints`) et les lectures JS (`description/interactive/questions/answers/feedback`) sans toucher au code technique.                   | Oui, pour les workshops et les lectures JavaScript v9.                          |
| `tools/translate-challenges.py`                  | Ancien script de traduction automatique via Argos Translate.                                                                                                                             | Non comme source finale. A eviter pour la qualite demandee.                     |
| `tools/translations/`                            | Stocke les JSON relus des workshops et le `phrasebook`.                                                                                                                                  | Oui. Les JSON gardent une trace du travail et permettent de regenerer/verifier. |
| `tools/translation-status.js`                    | Compte les blocs FR traduits par superblock `*-v9.json` et affiche une barre + %. Lecture seule.                                                                                         | Oui. Remplace les comptages PowerShell ad-hoc tapes a chaque session.           |
| `tools/check-translation-drift.js`               | Compare la date du dernier commit git de chaque `.md` EN vs son equivalent FR et signale les FR potentiellement obsoletes. Exit 1 si drift.                                              | Oui. Controle qualite anti-drift, utilisable en pre-commit.                     |
| `tools/local-dev-report.js`                      | Genere le snapshot JSON de `/dev-fr` : serveur, logs, traduction, drift, git.                                                                                                            | Oui. Source de donnees sans backend pour le hub dev local.                      |
| `tools/local-check.js`                           | Lance les checks locaux et affiche `READY` ou `BLOCKED`.                                                                                                                                 | Oui. Commande de verification rapide avant push.                                |
| `tools/challenge-helper-scripts/`                | Scripts upstream pour creer/renommer/supprimer des challenges, steps, tasks, quizzes et projets.                                                                                         | Rarement. Utile si on cree du curriculum, pas pour traduire un bloc existant.   |
| `tools/challenge-parser/`                        | Parser Markdown du curriculum : frontmatter, sections, quizzes, seeds, solutions, tests, directives.                                                                                     | Indirectement crucial. Les validations et builds s'appuient dessus.             |
| `tools/client-plugins/gatsby-source-challenges/` | Plugin Gatsby qui transforme les challenges en nodes Gatsby. Dans ce fork, il surveille aussi les fichiers FR et logge `watcher.added`, `challenge.integrating`, `challenge.integrated`. | Tres important pour voir les traductions arriver dans `latest.log`.             |
| `tools/client-plugins/browser-scripts/`          | Compile les scripts executes dans le navigateur : runner de tests JS/DOM/Python, workers TypeScript/Python/Sass.                                                                         | Indirectement. Ne pas toucher pour traduire.                                    |
| `tools/daily-challenges/`                        | Seed des daily coding challenges dans MongoDB local/prod.                                                                                                                                | Non pour les traductions.                                                       |
| `tools/scripts/sync-i18n.ts`                     | Synchronisation i18n upstream.                                                                                                                                                           | A utiliser prudemment, peut toucher beaucoup de fichiers.                       |
| `tools/scripts/redirect-gen.ts`                  | Generation de redirections.                                                                                                                                                              | Non pour les traductions courantes.                                             |
| `tools/scripts/test_challenges.sh`               | Helper shell pour tester des challenges.                                                                                                                                                 | Peu utile sur Windows, preferer les commandes `pnpm`.                           |
| `tools/scripts/move-bf.sh`                       | Script shell historique de deplacement de fichiers.                                                                                                                                      | Non utile ici.                                                                  |
| `tools/scripts/seed/`                            | Scripts de seed MongoDB pour donnees utilisateur/demo/surveys.                                                                                                                           | Non pour les traductions.                                                       |
| `tools/scripts/seed-exams/`                      | Generation/seed d'examens de dev.                                                                                                                                                        | Non pour la traduction du curriculum.                                           |
| `tools/challenge-editor/`                        | Dossier present mais vide dans ce checkout.                                                                                                                                              | Aucun usage actuel.                                                             |

## Details Par Usage

### Traduction

`tools/translate-workshop.js` est le bon outil quand le bloc ressemble aux workshops RWD ou aux lectures JavaScript v9 :

```powershell
node tools/translate-workshop.js extract <block>
node tools/translate-workshop.js apply <block>
node tools/translate-workshop.js verify <block>
```

Il protege la technique, mais il ne traduit pas a notre place. Le JSON doit etre relu, corrige et marque `reviewed: true`.

Le JSON contient `kind: "workshop"` pour les blocs `description/hints` et `kind: "lecture"` pour les lectures JS. En mode lecture, le script extrait les zones de prose dans `description`, `interactive`, `questions`, `answers` et `feedback`, en laissant code fences, marqueurs, `video-solution` et frontmatter technique intacts.

### Suivi Et Anti-Drift

Deux scripts Node autonomes, en lecture seule, evitent de retaper des commandes a chaque session :

```powershell
node tools/translation-status.js        # avancement FR par superblock v9 (barre + %)
node tools/check-translation-drift.js   # .md EN modifie apres son FR -> a relire
pnpm local:report                       # snapshot /dev-fr
pnpm local:check                        # verification locale rapide
pnpm local:check:full                   # verification locale longue
```

`check-translation-drift.js` sort en code 1 s'il detecte un drift, donc il peut servir de garde-fou avant un commit. Aucun des deux n'ecrit quoi que ce soit ni n'a besoin du serveur.

`local-dev-report.js` ecrit uniquement dans `client/static/local-dev/report.json`, ignore par git. `/dev-fr` lit ce fichier dans le navigateur.

### Serveur Dev Et Logs

Le plugin `tools/client-plugins/gatsby-source-challenges/gatsby-node.js` est ce qui rend visible l'integration dans `dev-logs/latest.log`.

Lignes importantes :

- `watcher.added` : un nouveau fichier `.md` FR est detecte.
- `watcher.touched` : nouveau bloc FR, donc `has-french-intro.ts` est touche pour mettre a jour `/catalog` et `/cours-fr`.
- `challenge.integrating` : Gatsby commence a integrer le fichier.
- `challenge.integrated` : Gatsby a cree les nodes/page-data.
- `intro.changed` / `intro.integrated` : `intro.json` a ete pris en compte.

### Build Et Validation

`tools/challenge-parser` est utilise en profondeur par les builds et les lint du curriculum. Si un marqueur, une section, un frontmatter ou un bloc code est casse, c'est souvent ce parser qui le fera remonter via :

```powershell
pnpm -C curriculum lint-challenges --superblock <superblock>
```

### Scripts A Ne Pas Confondre

`tools/challenge-helper-scripts` cree ou modifie la structure de challenges. Ce n'est pas un outil de traduction.

`tools/client-plugins/browser-scripts` sert au runner de tests cote navigateur. Ce n'est pas un outil de traduction.

`tools/scripts/seed*` sert aux donnees de dev/database. Ce n'est pas un outil de traduction.

## Recommandation

Pour continuer JavaScript v9 :

1. Traduire les petits blocs de lectures JS via le pipeline `kind: "lecture"` quand ils utilisent `description/interactive/questions/answers/feedback`.
2. Pour les workshops JS step-by-step, reutiliser `translate-workshop.js` si les sections sont compatibles.
3. A chaque nouveau bloc FR, verifier `latest.log` pour `watcher.added`, `watcher.touched`, `challenge.integrating`, `challenge.integrated`.
4. Mettre a jour `intro.json` et les docs a chaque tranche.
