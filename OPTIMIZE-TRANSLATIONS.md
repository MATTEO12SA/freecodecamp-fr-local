# Plan d'Optimisation — Traductions Workshops RWD

Ce document analyse pourquoi la traduction des 15 workshops RWD restants est lente, et propose un plan concret pour accélérer x5 à x10.

## Mesure De Référence

| Métrique                                     | Valeur                   |
| -------------------------------------------- | ------------------------ |
| Workshops restants                           | 15                       |
| Fichiers restants                            | 940                      |
| Lignes par fichier (médiane)                 | ~100-180                 |
| Lignes de **code verbatim** par fichier      | ~80-150 (**83%**)        |
| Lignes de **prose à traduire** par fichier   | ~10-30 (**17%**)         |
| Pace actuelle (workshop-flexbox 22 fichiers) | ~30-40 min               |
| Coût en tokens (Read + Write) par fichier    | ~400-600 tokens          |
| Projection sans optimisation                 | 30-50 heures de sessions |

**Constat clé** : 83% du temps et des tokens vont à copier du code HTML/CSS/JS qui est IDENTIQUE entre EN et FR.

## Bottlenecks Identifiés

### B1. Recopie verbatim massive (impact: -83% de tokens à éliminer)

Chaque `Write` regénère TOUT le fichier, incluant le `seed-contents` qui est identique entre EN et FR. Pour [step-22 de workshop-flexbox-photo-gallery](curriculum/challenges/english/blocks/workshop-flexbox-photo-gallery/6153a3ebb4f7f05b8401b716.md) :

- 173 lignes au total
- 144 lignes de code (HTML + CSS) verbatim
- 27 lignes de markers (`# --description--`, ` ```html `, etc.)
- **40 lignes de prose à traduire**

→ Je retape 144 lignes à l'identique pour 40 lignes de vraie traduction. **3.6x trop de travail.**

### B2. Patterns d'assertions répétitifs (impact: ~30 phrases stéréotypées)

Les `# --hints--` suivent ~15-20 templates récurrents, exemples :

| Pattern EN                                                                    | Pattern FR                                                                            |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `You should have a \`X\` element.`                                            | `Tu devrais avoir un élément \`X\`.`                                                  |
| `Your \`X\` selector should have a \`Y\` property set to \`Z\` as the value.` | `Ton sélecteur \`X\` devrait avoir une propriété \`Y\` définie à \`Z\` comme valeur.` |
| `You should add a \`X\` property to your \`Y\` selector.`                     | `Tu devrais ajouter une propriété \`X\` à ton sélecteur \`Y\`.`                       |
| `Your \`X\` selector should have a \`Y\` property.`                           | `Ton sélecteur \`X\` devrait avoir une propriété \`Y\`.`                              |
| `Your \`X\` element should have the text \`Y\`.`                              | `Ton élément \`X\` devrait avoir le texte \`Y\`.`                                     |

Ces 5 patrons à eux seuls couvrent ~50% des hints. Avec ~20 patrons on couvre ~80% du travail de traduction des hints.

### B3. Pas de parallélisation (impact: 4-8x)

Actuellement : 1 Read → réfléchir → 1 Write → suivant. Sequential.

Le pattern Read+Write peut tourner en parallèle (4-8 calls simultanés par message). Sous-utilisé.

### B4. Contexte LLM saturable (impact: bloque les gros workshops)

`workshop-city-skyline` a 115 fichiers × ~150 lignes = 17 250 lignes. Lire/écrire tout dans une session sature le contexte. Il faut soit :

- Diviser le workshop en sous-batches commit-par-commit
- OU sortir le code verbatim du contexte du LLM (cf S1)

## Stratégies (Ordonnées Par Impact)

### S1 — Pipeline script (impact: x10, effort: 2 heures)

Créer [tools/translate-workshop.js](tools/translate-workshop.js) qui :

1. **Mode `extract <workshop>`** : parse les `.md` EN, extrait UNIQUEMENT la prose dans `tools/translations/<workshop>.json` avec une structure JSON minimale :

   ```json
   {
     "workshop": "workshop-greeting-card",
     "files": {
       "abc123.md": {
         "title": "Step 1",
         "description": "In this workshop, you will...",
         "hints": [
           "You should have a `body` element.",
           "Your `body` selector should..."
         ]
       }
     }
   }
   ```

2. **LLM remplit le JSON** (équivalent FR), ~17% du volume original.

3. **Mode `apply <workshop>`** : prend le JSON FR + relit les `.md` EN comme templates, remplace UNIQUEMENT les sections prose, copie le reste (frontmatter, seed-contents, solutions) verbatim, écrit dans le dossier FR.

**Gain attendu** : -83% sur les tokens Write, -50% sur les tokens Read (seulement la prose à relire pour vérifier).

Squelette JS :

````js
// tools/translate-workshop.js
const fs = require('fs');
const path = require('path');

function parseChallenge(md) {
  // Découpe par section markers en blocs ordonnés
  // Renvoie { frontmatter, description, hints, seed, solutions }
}

function extractHintSentences(hintsBlock) {
  // Découpe les hints en alternance prose / code block
  // Renvoie un array de sentences (sans les ```js asserts)
}

function reassemble(enTemplate, frTranslations) {
  // Remplace dans enTemplate les sections prose par frTranslations
  // Garde frontmatter, ```code```, et solutions intactes
}
````

### S2 — Phrasebook (impact: x2, effort: 30 min)

Construire [tools/translations/phrasebook.json](tools/translations/phrasebook.json) avec ~20-30 patrons regex et leurs templates FR :

```json
[
  {
    "en": "^You should have a `(.+?)` element\\.$",
    "fr": "Tu devrais avoir un élément `$1`."
  },
  {
    "en": "^Your `(.+?)` selector should have a `(.+?)` property set to `(.+?)` as the value\\.$",
    "fr": "Ton sélecteur `$1` devrait avoir une propriété `$2` définie à `$3` comme valeur."
  }
]
```

Le script S1 applique le phrasebook EN AMONT pour pré-remplir le JSON. Le LLM ne traduit que les phrases NON matchées.

**Gain attendu** : ~70% des hints traduits automatiquement.

### S3 — Pull depuis upstream i18n-curriculum (impact: variable, effort: 5 min de check)

`curriculum/i18n-curriculum/` est un submodule du repo officiel [freeCodeCamp/i18n-curriculum](https://github.com/freeCodeCamp/i18n-curriculum) qui agrège les traductions Crowdin de la communauté.

Vérifier ce qui existe déjà :

```powershell
cd curriculum/i18n-curriculum
git fetch origin
git log origin/main --since="12 months" --name-only -- "curriculum/challenges/french/blocks/workshop-*" | Select-String "workshop-" | Sort-Object -Unique
```

Si certains workshops sont déjà traduits côté upstream, on peut juste les `git checkout` au lieu de tout retraduire.

**Gain potentiel** : 0% à 100% selon ce qui existe. À vérifier en premier.

### S4 — Parallélisation Write (impact: x3, effort: 0)

Une fois le script S1 en place, après que le LLM a rempli le JSON FR, le script peut écrire les 16-115 fichiers FR en une seule passe Node (instantané). Plus de Write calls du tout côté LLM.

### S5 — Détection de progression seed-contents (impact: x1.5, effort: 1h, optionnel)

Les `seed-contents` sont incrémentaux : `step N+1` = `step N` + 1-3 lignes ajoutées. On pourrait n'écrire QUE le diff dans le JSON, et le script S1 reconstruit. Optimisation marginale, faisable si on veut.

## Plan D'Action Recommandé

### Phase 1 — Préparation (1 session, ~1h)

1. ✅ Écrire ce doc (fait).
2. Check `git log` du submodule i18n-curriculum (S3) → est-ce qu'on peut récupérer des traductions toutes prêtes ?
3. Écrire `tools/translate-workshop.js` (S1) avec parse + extract + apply.
4. Écrire `tools/translations/phrasebook.json` (S2) avec 20 patrons.
5. Tester sur `workshop-greeting-card` (27 fichiers) : `node tools/translate-workshop.js extract workshop-greeting-card`.
6. Le LLM remplit `tools/translations/workshop-greeting-card.json` (seulement la prose).
7. `node tools/translate-workshop.js apply workshop-greeting-card`.
8. `git diff` pour vérifier, commit + push.

### Phase 2 — Production (2-3 sessions)

Avec le pipeline en place :

- **Session A** : workshops 27-44 fichiers (greeting-card, ferris-wheel, piano, parent-teacher, colorful-boxes, rothko-painting) = 6 workshops, 211 fichiers.
- **Session B** : workshops 61-79 fichiers (registration-form, balance-sheet, accessibility-quiz, nutritional-label, magazine) = 5 workshops, 341 fichiers.
- **Session C** : workshops 80-115 fichiers (cat-painting, colored-markers, flappy-penguin, city-skyline) = 4 workshops, 388 fichiers.

### Mesure De Réussite

| Métrique                          | Avant | Cible   |
| --------------------------------- | ----- | ------- |
| Fichiers / session                | 16-22 | 100-200 |
| Tokens Write / fichier            | ~300  | ~30-50  |
| Sessions restantes pour finir RWD | 15-20 | 3-4     |

## Risques

- **R1** : Le parser regex pour les `# --hints--` peut rater des cas exotiques (audio quiz, multi-line markdown). À tester sur 2-3 workshops divers avant de scale.
- **R2** : Le phrasebook regex peut faire des faux positifs (ex: traduit du code par erreur). Mettre des regex strictes avec ancres `^...$`.
- **R3** : Si upstream i18n-curriculum (S3) a des traductions, elles peuvent être de qualité variable (tutoiement vs vouvoiement, lexique incohérent). Toujours review avant merge.
- **R4** : `tools/translate-workshop.js` ne doit JAMAIS modifier le code, les `assert(...)`, les URLs `cdn.freecodecamp.org/...`. Tests automatiques nécessaires.

## Notes

- Tutoiement systématique partout : « tu » jamais « vous » (cf [HANDOFF-TRADUCTIONS.md](HANDOFF-TRADUCTIONS.md)).
- Titres : `Step N` → `Étape N` (N doit matcher `dashedName: step-N`).
- Titre avec `:` → entourer de guillemets doubles YAML.
- Frontmatter (`id:`, `challengeType:`, `dashedName:`, `demoType:`) toujours verbatim.

## TL;DR

**Construire un script `tools/translate-workshop.js` qui ne demande au LLM que la prose à traduire (17% du contenu), puis ré-assemble le `.md` FR en copiant le code verbatim côté Node. Combiné avec un phrasebook de 20 patrons, on passe de ~16 fichiers/session à ~100-200 fichiers/session — soit 3-4 sessions au lieu de 15-20 pour finir RWD.**
