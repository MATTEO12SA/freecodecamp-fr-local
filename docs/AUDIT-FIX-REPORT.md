# Rapport Final Des Corrections D'Audit

Date de validation : 26 juillet 2026  
Audit source : [`AUDIT_COMPLET_APPLICATION.md`](../AUDIT_COMPLET_APPLICATION.md)  
Commit audité : `8fa33f421b` sur `main`  
Tracker : [`AUDIT-FIX-TRACKER.md`](AUDIT-FIX-TRACKER.md)  
Preuves : `screenshots/audit-fix-2026-07-26/`

Ce rapport décrit l'état du workspace après correction. L'audit source reste un
instantané historique de l'état antérieur. Conformément à la mission, aucun
commit et aucun push n'ont été créés pendant cette campagne.

## Résumé

| État                        | Nombre |
| --------------------------- | -----: |
| Problèmes audités           |     29 |
| Corrigés                    |     28 |
| Partiellement corrigés      |      0 |
| Déjà corrigés               |      0 |
| Non reproductibles          |      1 |
| Reportés avec justification |      0 |
| Encore ouverts              |      0 |

`AUD-29` est le seul point classé `Non reproductible` : la charge extrême était
mesurée sous Gatsby Develop. Le build de production mesuré ne reproduit pas ce
niveau et n'a donc pas reçu d'optimisation prématurée.

## Corrections

| ID     | Cause réelle                                                                                    | Correction                                                                                                             | Fichiers principaux                                                                            | Tests                                                                   | Preuve navigateur                                                                             |
| ------ | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| AUD-01 | L'input du catalogue héritait de couleurs incompatibles avec le thème sombre.                   | Tokens explicites pour fond, texte, placeholder, bordure, focus et autofill.                                           | `client/src/pages/catalog.css`                                                                 | `catalog-theme.test.ts`, `local-network-test.mjs`                       | Contrastes texte/placeholder >= 4,5 dans les deux thèmes et les trois moteurs.                |
| AUD-02 | Analytics démarrait à l'import et Stripe avait un effet de bord avant décision de mode.         | Détection centralisée `local/development/public`, analytics no-op local, import Stripe différé et bloqué en local.     | `client/config/runtime-mode.ts`, `client/src/analytics/index.ts`, `client/src/utils/stripe.ts` | `runtime-mode.test.ts`, `local-services.test.tsx`, `test:local-network` | Zéro requête GTM, GA ou Stripe sur sept routes dans Chromium, Firefox et WebKit.              |
| AUD-03 | `ExamPrerequisites` montait toujours les hooks RTK Query upstream.                              | `LocalExamPrerequisites` est choisi avant montage des hooks en mode local.                                             | `client/src/templates/Challenges/exam-download/show.tsx`                                       | tests du template, `test:local-network`                                 | Zéro requête vers le port 3000 dans les trois moteurs.                                        |
| AUD-04 | Axe attendait `networkidle`, comptait mal les scans et pouvait sortir 0 après tous les `SKIP`.  | Attente DOM stable, compteurs complets, mode strict bloquant, injection directe `axe-core` et régression inaccessible. | `axe-test.mjs`, `axe-test-regression.mjs`, `tools/local-check.js`                              | `test:axe-regression`, `test:axe`                                       | 10 demandées, 10 chargées, 10 scannées, 0 ignorée, 0 échec, 0 violation sérieuse.             |
| AUD-05 | `/dev-fr` supposait un tableau alors que l'historique courant utilise `{ version, byCert }`.    | Lecteur et agrégateur robustes pour schéma courant, ancien et corrompu.                                                | `client/src/utils/exam-history.ts`, `client/src/pages/dev-fr.tsx`                              | `exam-history.test.tsx`, `test:audit-regression`                        | Le hub affiche la tentative enregistrée et sa dernière date.                                  |
| AUD-06 | Routes et menu développeur n'étaient pas conditionnés par le mode.                              | Suppression de `/dev-fr`, du menu et de GraphiQL hors développement.                                                   | `runtime-mode.ts`, `client/gatsby-node.ts`, navigation                                         | build client, `test:production-regression`                              | Build public : `/dev-fr` et `/___graphql` en 404, menu sans « Dev FR ».                       |
| AUD-07 | Les layouts custom n'exposaient pas la cible `content-start`.                                   | Un unique `main` focusable par page et cible de skip link cohérente.                                                   | layout Learn et pages custom                                                                   | `test:audit-regression`, `test:axe`                                     | Activation du skip link : focus sur le `main` de cinq pages.                                  |
| AUD-08 | Catalogue sans SEO et titres de cartes en `h3` après le `h1`.                                   | Titre document, métadonnées et cartes en `h2`.                                                                         | `catalog.tsx`, `catalog-item.tsx`                                                              | tests catalogue/item, `test:axe`                                        | Titre descriptif et hiérarchie `h1` -> `h2`.                                                  |
| AUD-09 | `LearnLayout` et `/dev-fr` créaient deux `main`; les logs scrollables n'étaient pas focusables. | Landmark unique et régions de logs nommées/focusables.                                                                 | `learn.tsx`, `dev-fr.tsx`, `dev-fr.css`                                                        | `test:audit-regression`, `test:axe`                                     | Un seul `main`; navigation clavier dans les logs.                                             |
| AUD-10 | Opacité trop faible sur les textes secondaires.                                                 | Couleurs explicites AA sur footer, accueil et hub.                                                                     | `footer.css`, `index.css`, `dev-fr.css`                                                        | `test:axe`, `test:local-network`                                        | Zéro violation sérieuse en clair et sombre.                                                   |
| AUD-11 | Les sous-vues de `/cours-fr` vivaient seulement dans un `useState`.                             | Parsing/sérialisation de la vue et de la certification dans l'URL.                                                     | `cours-fr.tsx`, `cours-fr-navigation.ts`                                                       | `cours-fr-navigation.test.ts`, `test:audit-regression`                  | URL directe, F5 et Retour conservent/restaurent la vue.                                       |
| AUD-12 | La session d'examen restait uniquement dans React.                                              | Store versionné par certification, expiration sept jours, Reprendre/Recommencer.                                       | `exam-fr.tsx`, `exam-session.ts`                                                               | `exam-session.test.tsx`, `test:audit-regression`                        | Reprise de l'index et des réponses après rechargement.                                        |
| AUD-13 | La dernière action calculait le score malgré les réponses vides.                                | `alertdialog` avec nombre de réponses vides, annulation, Échap et anti-double envoi.                                   | `exam-fr.tsx`                                                                                  | `test:audit-regression`, `test:axe`                                     | Confirmation réelle avant fin, puis une seule transition vers les résultats.                  |
| AUD-14 | Les 80 corrections étaient toutes ouvertes.                                                     | Résumé, filtres erreurs/non-réponses et détails repliés.                                                               | `exam-fr.tsx`, `exam-fr.css`                                                                   | `test:audit-regression`, `test:axe`                                     | 80 détails fermés au chargement et page sous 10 000 px.                                       |
| AUD-15 | `hasFrenchIntro` prouvait seulement une présence au niveau superblock.                          | Statut `absent/partial/complete` par carte et traduction des quatre intros visibles concernées.                        | `catalog-translation-status.ts`, catalogue, `intro.json`                                       | tests statut/catalogue/item                                             | Filtre Français sans les quatre résumés anglais, avec statut partiel explicite si nécessaire. |
| AUD-16 | Recherche et filtres catalogue étaient des états React non partageables.                        | Paramètres `q`, `level` et `topic` synchronisés avec l'historique.                                                     | `catalog.tsx`, `catalog-filters.ts`                                                            | `catalog-filters.test.ts`, tests catalogue                              | Recherche, thème, F5 et Retour validés.                                                       |
| AUD-17 | Les 62 cartes étaient rendues immédiatement.                                                    | 12 cartes initiales, « Afficher plus », compteur et « Retour en haut ».                                                | `catalog.tsx`, `catalog.css`                                                                   | tests catalogue, `test:audit-regression`                                | Rendu initial limité à 12 cartes.                                                             |
| AUD-18 | Chrome FR incomplet dans Learn, archives et 404.                                                | Titres de structure, archives, messages, 404, métadonnées et placeholder utilisateur traduits.                         | i18n FR, Intro, archive, FourOhFour                                                            | test Intro, `test:audit-regression`                                     | Chromium : chaînes ciblées absentes de `/learn`, `/learn/archive` et `/404.html`.             |
| AUD-19 | Une valeur `cert` brute servait de fallback.                                                    | Allowlist des certifications et état métier « inconnue ».                                                              | `exam-fr.tsx`, `exam-certifications.ts`                                                        | `exam-certifications.test.ts`, navigateur                               | URL invalide affiche une erreur explicite sans faux état de traduction.                       |
| AUD-20 | L'écran était celui normal de Gatsby Develop, pas la 404 du produit.                            | Wrapper de build fiable et régression dédiée sur les fichiers produits.                                                | `client/tools/build-client.js`, `production-regression-test.mjs`                               | build client, `test:production-regression`                              | Route inconnue du build : 404 utilisateur, sans écran technique Gatsby.                       |
| AUD-21 | Échap fermait le dropdown sans restituer le focus.                                              | Capture clavier et focus rendu au déclencheur.                                                                         | `catalog.tsx`                                                                                  | tests catalogue, `test:audit-regression`                                | Focus du trigger vérifié après Échap.                                                         |
| AUD-22 | Plugin Babel dupliqué, iframe avec `web-share` et analytics local.                              | Enregistrement idempotent, iframe YouTube nocookie contrôlée et trackers retirés du local.                             | challenge-builder, `video-player.tsx`, analytics, test réseau                                  | tests transformers, `test:local-network`                                | Sept routes dans trois moteurs : 0 erreur console, 0 warning audité.                          |
| AUD-23 | « Rafraîchir » ne pouvait que refetch un JSON statique.                                         | Libellé « Relire le snapshot », âge visible et commande de régénération.                                               | `dev-fr.tsx`, `snapshot-age.ts`                                                                | `snapshot-age.test.ts`, navigateur                                      | Timestamp inchangé correctement expliqué; action sans promesse de régénération.               |
| AUD-24 | Le shell n'occupait pas toute la hauteur.                                                       | Layout flex avec `min-height: 100dvh` et contenu extensible.                                                           | `client/src/components/layouts/global.css`                                                     | `test:audit-regression`, `test:axe`                                     | Footer au bas d'un viewport 1440x900 sur page courte.                                         |
| AUD-25 | Tableau desktop dans un overflow peu perceptible.                                               | Lignes transformées en cartes étiquetées sur petit écran.                                                              | `dev-fr.tsx`, `dev-fr.css`                                                                     | `test:audit-regression`, `test:axe`                                     | Capture 360x800 sans colonne tronquée ni débordement horizontal.                              |
| AUD-26 | Héritage de marque officielle et fork local ambigu.                                             | Marque « FR Local », mention non officielle persistante, SEO et données structurées requalifiés.                       | Header, footer, SEO, i18n/meta                                                                 | tests Intro/SEO, navigateur                                             | UI, titre et métadonnées portent l'identité locale non officielle.                            |
| AUD-27 | Grille et conteneur limitaient le catalogue à deux colonnes.                                    | Largeur utile et grille à trois colonnes sur grand écran.                                                              | `catalog.css`                                                                                  | tests catalogue, navigateur                                             | Trois colonnes mesurées à 1440x900.                                                           |
| AUD-28 | Disponibilité actuelle et feuille de route étaient regroupées.                                  | « Disponibles maintenant » séparé de « Traductions à venir », cartes à venir non cliquables.                           | `cours-fr.tsx`, `french-certification-groups.ts`                                               | test groupes FR, navigateur                                             | Deux groupes distincts visibles dans `/cours-fr`.                                             |
| AUD-29 | Gatsby Develop embarquait instrumentation, sources et bundles non optimisés.                    | Mesure du vrai build après retrait des trackers et pagination; pas d'optimisation sans défaut produit.                 | `production-performance-test.mjs`, catalogue, analytics                                        | build client, `test:production-performance`                             | Non reproduit : 5,51 / 10,64 / 16,98 MiB décodés, toutes les routes HTTP 200.                 |

## Vérifications

### Contrôles locaux

- `pnpm local:check` : `READY`, 9 contrôles verts.
- `pnpm local:check:full` : lints client/racine, smoke, soumission,
  persistance, parcours complet, réseau/console et Axe strict.
- `pnpm -C client type-check` : exit 0.
- `pnpm -C curriculum lint-challenges --superblock javascript-v9` : exit 0.
- `node tools/translation-status.js javascript-v9` : 118/230 blocs,
  465/1311 fichiers.
- `node tools/check-translation-drift.js` : aucun drift.
- `git diff --check` : aucune erreur d'espace.

Le premier passage du check complet a correctement bloqué cinq erreurs ESLint et
un fichier Markdown non formaté. Les régions scrollables, le dialogue d'examen,
le type d'environnement Gatsby et le formatage du tracker ont été corrigés
avant le passage final.

### Réseau Et Console

`local-network-test.mjs` a couvert :

- `/`
- `/catalog`
- `/learn`
- le template `exam-download`
- `/exam-fr?cert=responsive-web-design-v9`
- un challenge avec éditeur
- un challenge vidéo

Résultat dans Chromium, Firefox et WebKit :

- 0 requête GTM/Google Analytics ;
- 0 chargement Stripe ;
- 0 requête vers le port 3000 ;
- 0 erreur console ;
- 0 warning audité (`plugin already registered`, `web-share`, cookie GA).

### Accessibilité

Le rapport [`axe-wave4.json`](../screenshots/audit-fix-2026-07-26/axe-wave4.json)
contient :

- 10 pages ou états demandés ;
- 10 chargés ;
- 10 scannés ;
- 0 ignoré ;
- 0 échec ;
- 0 violation sérieuse.

Il couvre accueil, `/cours-fr`, catalogue clair/sombre, `/learn`, examen intro,
question sombre et résultats, `exam-download` et `/dev-fr`.

### Navigateurs, Résolutions Et Thèmes

- Parcours essentiels : Chromium, Firefox et WebKit.
- Régression fonctionnelle finale : 17/17 dans Chromium.
- Résolutions finales ciblées : 1440x900 et 360x800.
- Audit de référence également conservé à 1280x720, 768x1024 et 390x844.
- Thèmes : clair et sombre, avec état dynamique de l'examen.
- Captures finales : catalogue, `/cours-fr`, archives, 404, hub mobile et 404 de
  production dans `screenshots/audit-fix-2026-07-26/`.

### Production

- `pnpm -C client build` : exit 0, 18 716/18 716 pages, 951,5 s.
- `pnpm test:production-regression` : 4/4.
- `/dev-fr` : 404.
- `/___graphql` : 404.
- Route inconnue : 404 utilisateur.
- Accueil : transfert 1,07 MiB, décodé 5,51 MiB.
- Catalogue : transfert 1,41 MiB, décodé 10,64 MiB.
- Éditeur : transfert 3,72 MiB, décodé 16,98 MiB.

## Roadmap

- Les anciens chantiers traduction en doublon ont été fusionnés : rédaction
  manuelle par Claude, lexique unique et QA qui vérifie sans écrire.
- Les affirmations « 0 test custom » et « backend totalement neutralisé » ont
  été corrigées avant implémentation.
- Les vagues 1 à 4 sont maintenant marquées terminées.
- AUD-20 est validé uniquement dans le build produit.
- AUD-29 est conclu uniquement depuis la mesure de production.
- Confettis, onboarding, export/import, Continuer global, SRS, XP, séries,
  badges, PWA, certificats, défi du jour et nouveaux formats restent en vague 5.

## Risques Restants

- Le build Gatsby émet encore des avertissements amont non bloquants sur React
  Helmet, certains imports JSON nommés, Babel standalone et la sérialisation du
  cache Webpack. Ils ne se reproduisent pas comme erreurs ou warnings audités
  dans les parcours navigateur.
- Les données utilisateur restent dans `localStorage`; effacer les données du
  navigateur les supprime tant qu'un export/import n'est pas développé.
- La CI distante reste volontairement plus courte que `local:check:full`; les
  tests multi-moteurs et le build de 16 minutes sont des gardes locales.
- La traduction JavaScript v9 a repris après l'audit et se trouve maintenant à
  120/230 blocs. Le rapport de validation lui-même avait été établi à 118/230.
