# Audit complet de l'application

Date : 26 juillet 2026  
Branche : `main`  
Commit audite : `8fa33f421b` (`fix dev check ipv6 localhost probe`)  
Environnement : Gatsby 5, React 18, TypeScript, `http://localhost:8000`  
Preuves historiques (juillet 2026, dossier retiré) : régénérer l'état actuel avec `pnpm screenshots` → `screenshots/current/`.

> **Document historique.** Les mesures et constats ci-dessous décrivent le
> commit audité avant correction. Ne pas les lire comme l'état actuel du
> produit. Le statut final des 29 points est dans
> [`docs/AUDIT-FIX-TRACKER.md`](docs/AUDIT-FIX-TRACKER.md) et la campagne de
> validation dans
> [`docs/AUDIT-FIX-REPORT.md`](docs/AUDIT-FIX-REPORT.md).

## 1. Resume executif

L'application est **fonctionnelle et solide pour apprendre en local**, mais elle
n'est **pas prete pour une publication publique**. Le serveur est stable, les
parcours essentiels aboutissent, la progression et le theme persistent, les
challenges sont reellement executables et l'examen local fonctionne. Les 163 URL
internes decouvertes repondent correctement et aucun overflow horizontal global
n'a ete detecte aux cinq resolutions demandees.

Le responsive est le point le plus abouti. Le meme coeur fonctionne dans
Chromium, Firefox et WebKit, de 1440x900 a 360x800. L'application reste aussi
utilisable lorsque toutes les requetes HTTPS externes sont bloquees.

Les risques principaux sont :

1. la recherche du catalogue presque illisible en theme sombre (contraste
   1,08:1) ;
2. GTM, Google Analytics et Stripe charges systematiquement sur `localhost` ;
3. le template `exam-download` qui tente encore un backend absent sur le port
   3000 ;
4. `axe-test.mjs` qui peut ignorer toutes ses pages puis annoncer un faux succes ;
5. plusieurs etats utilisateur non persistants ou non representes dans l'URL.

**Trois corrections les plus urgentes**

1. Corriger le theme sombre et le socle a11y commun.
2. Supprimer toute telemetrie/Stripe du mode local et fiabiliser les gardes QA.
3. Isoler `exam-download` du backend, puis securiser l'examen et ses donnees.

**Verdict** : beta locale utilisable. Aucun bloquant ou critique verifie. Quatre
problemes eleves interdisent toutefois une publication publique immediate.

## 2. Notes generales

| Domaine                |   Note | Justification                                                                                                                         |
| ---------------------- | -----: | ------------------------------------------------------------------------------------------------------------------------------------- |
| Fonctionnement general | 7,8/10 | Navigation, catalogue, progression, editeur et examen aboutissent ; quelques etats et le template examen upstream restent incorrects. |
| Stabilite              | 7,6/10 | Aucun crash, stockage corrompu tolere, trois moteurs compatibles ; erreurs reseau sur `exam-download`.                                |
| Design visuel          | 6,8/10 | Base sobre et lisible, mais densite variable, pages tres longues et champ sombre illisible.                                           |
| Coherence UI           | 6,4/10 | Composants principaux coherents, mais langue, navigation, footer et etats ne suivent pas toujours les memes regles.                   |
| Facilité d'utilisation | 6,9/10 | Entrees principales claires ; retour/reload, examen et snapshot dev demandent encore des contournements.                              |
| Responsive             | 8,4/10 | Aucun overflow global aux cinq tailles ; quelques limites sur tableau dev et resultats longs.                                         |
| Accessibilite          | 5,8/10 | Labels et clavier globalement bons ; violations Axe serieuses et outil officiel non fiable.                                           |
| Performance            | 5,7/10 | Interactions acceptables en dev, mais bundles lourds, catalogue volumineux et tiers systematiques.                                    |
| Textes et messages     | 6,1/10 | Textes locaux directs ; melange FR/EN et plusieurs libelles trompeurs.                                                                |
| Confiance              | 5,8/10 | LocalStorage et hors-ligne rassurants ; trackers, erreurs console et outils dev publics reduisent la confiance.                       |

**Note globale ponderee : 6,7/10.**

## 3. Couverture de l'audit

### Projet et profils

- Client Gatsby/React/Redux, contenu genere depuis le curriculum.
- Progression : `fcc-local-user` dans `localStorage`.
- Historique examen : `fcc-exam-history`.
- Aucun compte, role, Auth0, MongoDB ou backend requis pour le parcours local.
- Serveur Gatsby : port 8000. Le port 3000 doit pouvoir rester eteint.

### Routes rendues et manipulees

- `/`, `/cours-fr`, `/catalog`, `/learn`, `/learn/archive`, `/dev-fr`
- `/exam-fr`, certificat RWD, certificat invalide, question, resultat, revision
- `/404.html`, route inconnue, `/___graphql`
- `/challenges` et ancienne URL de challenge avec redirections
- templates HTML/JS classiques, ES6, frontend/backend project, video, dialogue,
  Odin, lecture, quiz, review, lab RWD, lab JS, `exam-download`
- workshop Cat Photo App avec Monaco et soumission reelle

Le scan a decouvert 196 liens et 163 URL internes uniques. Les 163 ont un statut
HTTP valide : [resultat des liens](screenshots/audit-2026-07-26/link-results.json).

### Parcours reels

- menu souris/clavier, fermeture `Echap`, retour de focus ;
- theme sombre puis reload ;
- vues internes de `/cours-fr`, Retour, reload et URL directe ;
- recherche `javascript`, filtre francais et aucun resultat dans `/catalog` ;
- deux etapes Cat Photo App soumises, deux IDs persistes, arrivee etape 3 ;
- examen question 1 a 80, 79 reponses vides, resultats, historique, revision ;
- reload en cours d'examen, certificat invalide ;
- `/dev-fr`, snapshot, historique et stockage corrompu ;
- redirections, 404, console, reseau et fonctionnement sans HTTPS externe.

Preuves du challenge :
[etape 1](screenshots/flow-step1-after-submit.png) et
[etape 2](screenshots/flow-step2-after-submit.png).

### Appareils et moteurs

- Chromium : 1440x900, 1280x720, 768x1024, 390x844, 360x800.
- Firefox : 1440x900.
- WebKit : 1440x900.

Firefox et WebKit conservent le theme, retournent 20 cartes pour `javascript`,
demarrent l'examen et affichent Monaco :
[resultats multi-moteurs](screenshots/audit-2026-07-26/cross-browser-results.json).

### Accessibilite, reseau et performance

- Axe reel clair/sombre, desktop/mobile et etats dynamiques.
- Navigation clavier, labels, focus, titres, landmarks, contrastes et IDs.
- Console, requetes echouees, mode hors ligne et Resource Timing.

Preuves :

- [Axe clair](screenshots/audit-2026-07-26/axe-results.json)
- [Axe dynamique](screenshots/audit-2026-07-26/axe-dynamic-results.json)
- [Axe sombre](screenshots/audit-2026-07-26/dark-results.json)
- [clavier](screenshots/audit-2026-07-26/keyboard-results.json)
- [performance/reseau](screenshots/audit-2026-07-26/performance-results.json)
- [parcours fonctionnels](screenshots/audit-2026-07-26/flow-results.json)

### Limites

- Les 18 717 pages Gatsby n'ont pas toutes ete rendues une par une. Les 163 URL
  decouvertes ont ete controlees en HTTP et chaque famille de template importante
  a ete rendue.
- Aucun compte/role n'existe dans ce mode, donc aucun parcours auth a tester.
- L'installateur natif Exam Environment n'a pas ete execute : hors perimetre web
  et installation intrusive.
- Pas d'appareil physique, de lecteur d'ecran physique ni de clavier virtuel.
- Le zoom exact 200 % et l'orientation physique n'ont pas eu de session dediee.
- Les performances viennent de Gatsby develop, pas d'un build production.

## 4. Tableau complet des problemes

| ID     | Gravite    | Categorie               | Page/route                | Resolution     | Probleme                                                    | Etapes de reproduction                                      | Resultat attendu                                     | Resultat obtenu                                                         | Preuve                                                                                                                                                                                                             | Cause probable                                                            | Correction recommandee                                                                | Fichiers probablement concernes                                                                 | Effort estime  |
| ------ | ---------- | ----------------------- | ------------------------- | -------------- | ----------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------- |
| AUD-01 | **Eleve**  | UI / a11y               | `/catalog`, sombre        | Toutes         | Texte de recherche presque invisible.                       | Activer sombre, ouvrir catalogue, saisir `javascript`.      | Contraste >= 4,5:1.                                  | Texte clair sur fond blanc, 1,08:1.                                     | [capture](screenshots/audit-2026-07-26/evidence-dark-catalog-search.png)                                                                                                                                           | L'input ne definit ni fond ni couleur.                                    | Utiliser les tokens des deux themes pour texte, fond, placeholder, focus et autofill. | `client/src/pages/catalog.css`                                                                  | Tres faible    |
| AUD-02 | **Eleve**  | Vie privee / reseau     | Toutes                    | Toutes         | GTM, GA et Stripe se chargent en local.                     | Vider Network puis ouvrir une page.                         | Zero tracking/paiement sans besoin ni consentement.  | Environ 13 requetes tierces par page.                                   | [mesures](screenshots/audit-2026-07-26/performance-results.json)                                                                                                                                                   | GTM initialise a l'import ; import Stripe avec effet de bord.             | Gate local explicite et imports dynamiques apres configuration/consentement.          | `client/src/analytics/index.ts`, `analytics-settings.ts`, `utils/stripe.ts`, Gatsby browser/SSR | Moyen          |
| AUD-03 | **Eleve**  | Fonctionnel / reseau    | template `exam-download`  | Toutes         | Queries vers un backend absent.                             | Ouvrir l'examen RWD upstream et observer Network.           | Bouton local sans requete port 3000.                 | `FETCH_ERROR` sur `/user/exam-environment/...`.                         | [capture](screenshots/audit-2026-07-26/evidence-exam-download-after-30s.png)                                                                                                                                       | `ExamPrerequisites` monte toujours ses hooks RTK.                         | Ne pas monter ces hooks en mode local ; calculer les prerequis en local.              | `templates/Challenges/exam-download/show.tsx`, `attempts.tsx`, `utils/ajax.ts`                  | Faible a moyen |
| AUD-04 | **Eleve**  | QA / a11y               | `axe-test.mjs`            | N/A            | Faux vert possible apres zero page scannee.                 | Lancer `node axe-test.mjs --strict` avec tiers lents.       | Echec si une page est skippee.                       | 4 timeouts `networkidle`, 4 `SKIP`, puis sortie 0.                      | [Axe reel](screenshots/audit-2026-07-26/axe-results.json), [check](screenshots/audit-2026-07-26/local-check-full.stdout.log)                                                                                       | Aucun compteur scanned/expected.                                          | `domcontentloaded`, blocage tiers, compteur, echec sur tout skip.                     | `axe-test.mjs`, `tools/local-check.js`                                                          | Faible         |
| AUD-05 | **Moyen**  | Donnees locales         | `/dev-fr`                 | Toutes         | Le hub affiche 0 tentative apres un examen.                 | Terminer examen, verifier son historique, ouvrir `/dev-fr`. | 1 tentative et derniere date.                        | `0` et `aucun`.                                                         | [capture](screenshots/audit-2026-07-26/flow-dev-fr-with-exam-history.png)                                                                                                                                          | Le hub lit des tableaux racine, l'ecriture utilise `{ version, byCert }`. | Reutiliser un lecteur/agregeur exporte par `exam-history.ts`.                         | `pages/dev-fr.tsx`, `utils/exam-history.ts`                                                     | Tres faible    |
| AUD-06 | **Moyen**  | Securite conditionnelle | `/dev-fr`, `/___graphql`  | Toutes         | Outils et donnees dev dans la navigation.                   | Ouvrir menu puis Dev FR et GraphiQL.                        | Absents d'un build public.                           | Branche, commit, logs et GraphiQL accessibles.                          | [dev](screenshots/audit-2026-07-26/chromium-1440x900-dev-fr.png), [GraphiQL](screenshots/audit-2026-07-26/chromium-1440x900-___graphql.png)                                                                        | Routes non conditionnees.                                                 | Gate par environnement et test de build public.                                       | Page/menu/config Gatsby                                                                         | Faible         |
| AUD-07 | **Moyen**  | Clavier                 | Pages custom              | Desktop/mobile | Le skip link cible un ID absent.                            | Tab puis activer « Aller au contenu ».                      | Focus sur le main.                                   | Hash change, cible absente, focus non transfere.                        | [clavier](screenshots/audit-2026-07-26/keyboard-results.json)                                                                                                                                                      | Header global, layouts custom sans `content-start`.                       | Un unique `<main id="content-start" tabIndex={-1}>`.                                  | Header et layouts                                                                               | Faible         |
| AUD-08 | **Moyen**  | A11y / SEO              | `/catalog`                | Toutes         | Titre document vide et saut h1 vers h3.                     | Lire `document.title`, lancer Axe.                          | Titre descriptif et headings ordonnes.               | `document-title` et `heading-order`.                                    | [Axe](screenshots/audit-2026-07-26/axe-results.json)                                                                                                                                                               | Pas de SEO ; cartes en h3.                                                | Ajouter SEO et passer cartes en h2 ou introduire une section h2.                      | `pages/catalog.tsx`, `components/catalog-item.tsx`                                              | Tres faible    |
| AUD-09 | **Moyen**  | A11y semantique         | `/dev-fr`                 | Toutes         | Deux `main` et logs scrollables non focusables.             | Lancer Axe et tabuler les logs.                             | Main unique, regions scrollables nommees/focusables. | 4 violations landmarks/scroll.                                          | [Axe](screenshots/audit-2026-07-26/axe-results.json)                                                                                                                                                               | `LearnLayout` et page ajoutent chacun main ; pre sans tabindex.           | Section/div interne, `tabIndex=0`, nom accessible.                                    | `layouts/learn.tsx`, `pages/dev-fr.tsx/css`                                                     | Faible         |
| AUD-10 | **Moyen**  | Contraste               | Footer et accueil         | Toutes         | Textes secondaires sous AA.                                 | Ouvrir theme clair, lancer Axe.                             | 4,5:1 minimum.                                       | Footer 4,26-4,45 ; note 4,32.                                           | [Axe](screenshots/audit-2026-07-26/axe-results.json)                                                                                                                                                               | Opacite trop faible.                                                      | Couleurs explicites validees dans les deux themes.                                    | `Footer/footer.css`, `pages/index.css`                                                          | Tres faible    |
| AUD-11 | **Moyen**  | Navigation              | `/cours-fr`               | Toutes         | Sous-vues sans URL/historique.                              | Ouvrir cert RWD, Retour puis reload.                        | Retour liste ; URL partageable ; reload conserve.    | URL reste `/cours-fr`, Retour quitte, reload revient au choix.          | [parcours](screenshots/audit-2026-07-26/flow-results.json)                                                                                                                                                         | `useState<View>` uniquement.                                              | Routes enfants ou query param synchronise.                                            | `pages/cours-fr.tsx`                                                                            | Moyen          |
| AUD-12 | **Moyen**  | Persistance             | `/exam-fr`                | Toutes         | Examen en cours perdu au reload.                            | Demarrer, aller question 2, recharger.                      | Reprise ou avertissement.                            | Retour intro, reponses perdues.                                         | [parcours](screenshots/audit-2026-07-26/flow-results.json)                                                                                                                                                         | Etat React uniquement.                                                    | Brouillon versionne dans storage, Reprendre/Recommencer.                              | `pages/exam-fr.tsx`, nouvel utilitaire                                                          | Moyen          |
| AUD-13 | **Moyen**  | Prevention erreur       | Examen, derniere question | Toutes         | Terminer accepte 79 reponses vides sans confirmation.       | Cliquer Suivant jusqu'a 80 puis Terminer.                   | Recap des vides et confirmation.                     | Resultat immediat 0/80, aucun dialogue.                                 | [derniere](screenshots/audit-2026-07-26/evidence-exam-last-question.png), [resultat](screenshots/audit-2026-07-26/flow-exam-results-unanswered.png)                                                                | Dernier `goNext` passe directement aux resultats.                         | Modale, lien vers premiere vide, anti-double-clic.                                    | `pages/exam-fr.tsx`                                                                             | Faible         |
| AUD-14 | **Moyen**  | UX / DOM                | Resultats examen          | Toutes         | Corrige de 80 questions long de 19 935 px.                  | Finir l'examen et parcourir la page.                        | Resume, filtres et details repliables.               | Liste continue tres longue.                                             | [Axe dynamique](screenshots/audit-2026-07-26/axe-dynamic-results.json)                                                                                                                                             | Toutes les corrections ouvertes.                                          | Sommaire, accordéons, filtre erreurs/vides, ancres.                                   | `pages/exam-fr.tsx/css`                                                                         | Moyen          |
| AUD-15 | **Moyen**  | Contenu / filtre        | `/catalog`, Francais      | Toutes         | Des cartes filtrees FR ont un resume anglais.               | Theme Francais, inspecter 21 cartes.                        | Resume FR ou statut partiel clair.                   | Au moins 4 resumes entierement anglais.                                 | [capture](screenshots/audit-2026-07-26/flow-catalog-french-filter.png)                                                                                                                                             | `hasFrenchIntro` teste le superblock, pas chaque carte.                   | Statut complet/partiel/absent par carte.                                              | `catalog.tsx`, `has-french-intro.ts`, intros                                                    | Moyen          |
| AUD-16 | **Moyen**  | Navigation              | `/catalog`                | Toutes         | Recherche/filtres perdus au reload.                         | Chercher, filtrer puis recharger.                           | URL restaure et partage l'etat.                      | Retour a 62 cartes et Tous.                                             | [parcours](screenshots/audit-2026-07-26/flow-results.json)                                                                                                                                                         | Etat React local.                                                         | Query params `q`, `level`, `topic`.                                                   | `pages/catalog.tsx`                                                                             | Faible a moyen |
| AUD-17 | **Moyen**  | Performance / liste     | `/catalog`                | Toutes         | 62 cartes, 11 398 px et 1 145 noeuds.                       | Charger catalogue complet et mesurer.                       | Pagination ou chargement progressif.                 | Page longue et repetitive.                                              | [capture](screenshots/audit-2026-07-26/chromium-1440x900-catalog.png), [mesures](screenshots/audit-2026-07-26/performance-results.json)                                                                            | Rendu integral sans pagination.                                           | Pagination/Charger plus, compte de resultats, retour haut.                            | Catalogue et item                                                                               | Moyen          |
| AUD-18 | **Moyen**  | Langue                  | `/learn`, archives, 404   | Toutes         | Melange brutal FR/EN.                                       | Parcourir ces pages.                                        | Chrome FR, fallback signale.                         | « Bon retour, You. », « Archived Coursework », 404 anglaise.            | [learn](screenshots/audit-2026-07-26/chromium-1440x900-learn.png), [archives](screenshots/audit-2026-07-26/chromium-1440x900-learn-archive.png), [404](screenshots/audit-2026-07-26/chromium-1440x900-404html.png) | Traductions upstream incompletes.                                         | Traduire d'abord le chrome et badger les fallbacks.                                   | i18n FR, composants Learn/404                                                                   | Moyen a eleve  |
| AUD-19 | **Moyen**  | Gestion erreur          | `/exam-fr?cert=invalid`   | Toutes         | Cert invalide presente comme non traduit.                   | Ouvrir URL directe.                                         | « Certification inconnue ».                          | Titre `invalid`, 0 question, message traduction.                        | [capture](screenshots/audit-2026-07-26/chromium-1440x900-exam-fr-cert-invalid.png)                                                                                                                                 | Valeur brute utilisee en fallback.                                        | Allowlist et etat erreur metier.                                                      | `pages/exam-fr.tsx`                                                                             | Tres faible    |
| AUD-20 | **Faible** | 404 dev                 | Route inconnue            | Toutes         | Gatsby develop montre routes et code.                       | Ouvrir `/route-audit-inexistante`.                          | 404 utilisateur en demonstration.                    | Ecran debug Gatsby, 18 717 pages.                                       | [capture](screenshots/audit-2026-07-26/chromium-1440x900-route-audit-inexistante.png)                                                                                                                              | Comportement normal dev.                                                  | Ne pas publier develop ; tester build production.                                     | Config/deploiement                                                                              | Tres faible    |
| AUD-21 | **Faible** | Clavier                 | Dropdown catalogue        | Toutes         | Echap ferme mais focus va sur body.                         | Ouvrir Theme au clavier, Echap.                             | Focus retourne au trigger.                           | Focus perdu.                                                            | [clavier](screenshots/audit-2026-07-26/keyboard-results.json)                                                                                                                                                      | Pas de ref/restauration.                                                  | `triggerRef.focus()` apres fermeture.                                                 | Dropdown/catalogue                                                                              | Faible         |
| AUD-22 | **Faible** | Console                 | Challenges/videos         | Toutes         | Warnings repetes.                                           | Ouvrir editeur et video.                                    | Console exploitable.                                 | Plugins deja enregistres, `web-share` non reconnu, warnings GA Firefox. | Scans bruts dans `screenshots/audit-2026-07-26/`                                                                                                                                                                   | Enregistrement non idempotent et tiers.                                   | Rendre plugins idempotents, ajuster iframe, retirer analytics local.                  | Monaco/browser-scripts, videos, analytics                                                       | Faible         |
| AUD-23 | **Moyen**  | Exactitude UX           | `/dev-fr`                 | Toutes         | « Rafraichir » ne regenere pas le rapport.                  | Noter timestamp, cliquer.                                   | Donnees regenerees ou libelle explicite.             | Meme timestamp, simple refetch.                                         | [parcours](screenshots/audit-2026-07-26/flow-results.json)                                                                                                                                                         | Navigateur incapable de lancer pnpm.                                      | « Relire le snapshot », age et commande visible.                                      | `pages/dev-fr.tsx`                                                                              | Tres faible    |
| AUD-24 | **Faible** | Layout                  | Pages courtes             | Desktop        | Footer au milieu, vide dessous.                             | Ouvrir intro cours/examen a 1440x900.                       | Footer en bas du viewport.                           | Suit immediatement le contenu.                                          | [cours](screenshots/audit-2026-07-26/chromium-1440x900-cours-fr.png), [examen](screenshots/audit-2026-07-26/chromium-1440x900-exam-fr.png)                                                                         | Shell non flex pleine hauteur.                                            | `min-height:100dvh`, main flex 1.                                                     | Layout/footer                                                                                   | Faible         |
| AUD-25 | **Faible** | Responsive              | `/dev-fr`                 | 360/390        | Colonnes du tableau hors ecran, scroll peu visible.         | Ouvrir petit mobile et atteindre progression.               | Cartes ou affordance de scroll.                      | Colonnes droites masquees.                                              | [capture](screenshots/audit-2026-07-26/chromium-360x800-dev-fr.png)                                                                                                                                                | Table desktop dans overflow.                                              | Cartes mobile ou premiere colonne sticky + ombre.                                     | `dev-fr.tsx/css`                                                                                | Faible         |
| AUD-26 | **Faible** | Marque                  | Global                    | Toutes         | Fork local et marque officielle ambigus.                    | Lire header/footer/404/titres.                              | Statut non officiel explicite partout.               | `freeCodeCamp.org` et « apprentissage local » melanges.                 | [accueil](screenshots/audit-2026-07-26/chromium-1440x900-home.png)                                                                                                                                                 | Heritage upstream partiel.                                                | Mention persistante et metadata coherentes.                                           | Header/Footer/SEO/i18n                                                                          | Faible         |
| AUD-27 | **Faible** | Design                  | `/catalog`                | 1440           | Deux colonnes et espace perdu.                              | Ouvrir catalogue 1440.                                      | Grille 3 colonnes lisible.                           | Deux cartes et grands bords.                                            | [capture](screenshots/audit-2026-07-26/chromium-1440x900-catalog.png)                                                                                                                                              | Grille/conteneur limites.                                                 | `auto-fit/minmax` et contraintes de carte.                                            | `catalog.css`                                                                                   | Faible         |
| AUD-28 | **Faible** | Vocabulaire             | `/cours-fr`               | Toutes         | « Certifications francaises » inclut des fallbacks anglais. | Ouvrir liste.                                               | Disponibles et A venir separes.                      | Titre implique une couverture FR totale.                                | [capture](screenshots/audit-2026-07-26/flow-cours-fr-certifications.png)                                                                                                                                           | Disponibilite et roadmap groupees.                                        | Renommer et separer les etats.                                                        | `cours-fr.tsx`, i18n                                                                            | Tres faible    |
| AUD-29 | **Moyen**  | Performance             | Global/challenge          | Desktop dev    | Charges decodees tres lourdes.                              | Mesurer chargement a froid.                                 | Bundles conditionnels et budgets.                    | Accueil 25,7 Mo, catalogue 29,7 Mo, challenge 95,1 Mo decodes.          | [mesures](screenshots/audit-2026-07-26/performance-results.json)                                                                                                                                                   | Gatsby dev, Monaco, curriculum et tiers charges tot.                      | Refaire en production, lazy-load, paginer, retirer tiers, budgets CI.                 | Gatsby/templates/catalogue/analytics                                                            | Moyen          |

## 5. Analyse page par page

### Accueil `/`

Le but local, sans compte et avec progression navigateur est comprehensible. Le
CTA principal, le menu et le theme fonctionnent aux cinq tailles. A corriger :
contraste de la note, skip link sans cible, branding et promesse locale contredite
par les trackers (`AUD-02`, `AUD-07`, `AUD-10`, `AUD-26`).

### Cours FR `/cours-fr`

Le choix de parcours, la liste, la progression et l'accordeon RWD sont utilisables
et responsive. Les vues ne sont pas adressables, l'ordre de titres du detail est
imparfait et le vocabulaire surestime la couverture FR (`AUD-11`, `AUD-28`).

### Catalogue `/catalog`

Recherche et filtres fonctionnent ; `javascript` retourne 20 cartes et l'etat
vide est utile. Les dettes majeures sont le champ sombre, le titre/heading, le
filtre FR trop large, l'absence d'URL d'etat et la longueur de la liste
(`AUD-01`, `AUD-08`, `AUD-15` a `AUD-17`, `AUD-21`, `AUD-27`).

### Cursus `/learn` et archives

Accordeons, progression, liens et stockage corrompu sont stables. L'interface
reste tres anglaise, y compris « Bon retour, You. » et toute la page archive
(`AUD-18`). Les charges dev sont importantes (`AUD-29`).

### Dashboard `/dev-fr`

Le hub centralise serveur, logs, traductions, drift et git. Le schema d'historique
est mal lu, le snapshot n'est pas regenere par le bouton, les landmarks sont
invalides, le tableau mobile est peu lisible et la route ne doit pas etre
publique (`AUD-05`, `AUD-06`, `AUD-09`, `AUD-23`, `AUD-25`).

### Examen `/exam-fr`

Les 80 questions, score, historique, stats et revision fonctionnent. L'examen
perd son etat au reload, termine sans confirmation, produit un resultat immense
et gere mal un cert invalide (`AUD-12` a `AUD-14`, `AUD-19`). Le template upstream
doit cesser de contacter le port 3000 (`AUD-03`).

### Challenges

Deux soumissions Monaco reelles ont reussi et la progression a persiste. Le
challenge reste utilisable a 360 px, hors ligne et dans les trois moteurs. Les
warnings console et le poids du bundle restent a traiter (`AUD-22`, `AUD-29`).

### Erreurs et outils

Les redirections anciennes fonctionnent, `/404.html` existe et GraphiQL repond.
La 404 est partiellement anglaise ; Gatsby develop affiche son debug sur route
inconnue ; GraphiQL doit rester dev-only (`AUD-06`, `AUD-18`, `AUD-20`).

## 6. Incoherences globales

- **Langue** : pages custom francaises, chrome `/learn`, archives et 404 encore
  anglais ; fallback non signale de maniere uniforme.
- **Navigation** : vraies routes Gatsby, mais etat pur React dans `/cours-fr` et
  `/catalog`.
- **Persistance** : progression/theme/historique final persists ; examen brouillon
  et filtres non.
- **Donnees** : deux lecteurs incompatibles de `fcc-exam-history`.
- **Accessibilite** : labels souvent bons, mais landmarks, headings, skip link et
  contrastes ne sont pas fournis par un layout commun.
- **Reseau** : coeur hors ligne mais trackers actifs des que le reseau existe.
- **Design** : pages custom compactes, pages upstream/resultats tres longues,
  footer et densite variables.
- **QA** : `local:check:full` est large, mais son etape Axe peut etre faussement
  verte.

## 7. Points positifs

- Serveur stable et HTTP 200.
- 163 URL internes sans lien mort.
- Soumission Monaco reellement executee et progression persistante.
- Theme sombre persistant.
- Stockage corrompu gere sans crash.
- Coeur utilisable sans acces HTTPS externe.
- Chromium, Firefox et WebKit compatibles.
- Aucun overflow horizontal global aux cinq tailles.
- Menu principal clavier correct et modale de challenge confinee.
- Labels, noms accessibles, IDs et alternatives d'image globalement propres.
- Etat vide catalogue clair et liens Commencer/Continuer pertinents.
- Examen local utile : historique, stats par module, revision ciblee.
- Redirections historiques fonctionnelles.
- Pipeline traduction, drift, types, lints et tests locaux deja solides.

## 8. Plan d'amelioration priorise

### A corriger immediatement

1. `AUD-01` : couleurs recherche sombre. Effort tres faible.
2. `AUD-02` : aucun GTM/GA/Stripe en local. Effort moyen.
3. `AUD-03` : aucun hook/query backend dans `exam-download`. Effort faible.
4. `AUD-04` : Axe echoue sur tout `SKIP`. Effort faible.

### A corriger avant mise en production

1. `AUD-06` : masquer routes et donnees dev.
2. `AUD-07` a `AUD-10` : layout/main/skip link/titres/contrastes.
3. `AUD-05` et `AUD-19` : schemas et parametres valides.
4. Build production puis nouvel audit 404, reseau, Lighthouse et bundles.

### Ameliorations recommandees

1. Router `/cours-fr` et les filtres catalogue (`AUD-11`, `AUD-16`).
2. Persister l'examen et confirmer sa fin (`AUD-12`, `AUD-13`).
3. Compacter les resultats (`AUD-14`).
4. Exposer une completude FR par carte (`AUD-15`).
5. Paginer/densifier le catalogue (`AUD-17`, `AUD-27`).
6. Traduire le chrome Learn/archives/404 (`AUD-18`).
7. Corriger le hub et sa version mobile (`AUD-23`, `AUD-25`).

### Finitions facultatives

- retour de focus dropdown (`AUD-21`) ;
- warnings console (`AUD-22`) ;
- footer bas de viewport (`AUD-24`) ;
- branding local non officiel (`AUD-26`) ;
- libelle des certifications (`AUD-28`).

Le detail d'implementation maintenu est dans
[docs/ROADMAP.md](docs/ROADMAP.md).

## 9. Verdict final

- **Le site fonctionne-t-il ?** Oui pour le coeur local.
- **Est-il clair pour un nouveau ?** Partiellement ; l'accueil est clair, le
  melange FR/EN et les outils dev le sont moins.
- **Est-il professionnel ?** Suffisant pour une beta locale, pas pour une
  publication.
- **Est-il utilisable sur mobile ?** Oui dans l'ensemble ; hub et longs resultats
  demandent encore un traitement.
- **Problemes bloquants ?** Aucun verifie.
- **Production maintenant ?** Non pour le public.

**Cinq actions prioritaires**

1. Corriger le champ sombre.
2. Retirer analytics/Stripe du local.
3. Isoler `exam-download` du port 3000.
4. Fiabiliser Axe puis corriger le socle a11y.
5. Fiabiliser historique, examen, `/cours-fr` et filtres catalogue.

---

Etat de la phase d'audit :

- aucun fichier applicatif modifie ;
- preuves conservees dans `screenshots/audit-2026-07-26/` ;
- scripts jetables d'audit supprimes ;
- lints, types, curriculum, catalogue, soumission et persistance valides ;
- documentation synchronisee apres l'audit sans changer les resultats observes.
