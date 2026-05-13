# freeCodeCamp Standalone — Documentation

Ce document explique tout ce qui a été fait pour transformer le repo freeCodeCamp officiel en une version **standalone, hors-ligne, en français, sans compte**.

---

## Vue d'ensemble

Le site original de freeCodeCamp nécessite :
- Un backend Node.js + MongoDB pour les comptes utilisateurs
- Un compte Auth0 pour se connecter
- Plusieurs services externes (Stripe, PayPal, Sentry, Algolia, GrowthBook…)
- Une interface entièrement en anglais

Ce qui a été fait : tout est devenu **local + français + sans compte**. Tu lances un seul script (`.\dev.ps1`), tu ouvres `http://localhost:8000`, et tu codes en français. Ta progression est sauvegardée dans le navigateur.

---

## 1. Suppression du système de compte

### Pourquoi
freeCodeCamp obligeait à se connecter pour valider les exercices. Inutile en local : tu es seul à utiliser ton instance.

### Comment
- **[client/src/redux/fetch-user-saga.js](freeCodeCamp/client/src/redux/fetch-user-saga.js)** — au boot, au lieu d'appeler l'API `/user/session-user`, le saga construit un "local user" depuis `localStorage` :
  ```js
  function* fetchSessionUser() {
    ensureLocalUserInitialized();
    const user = buildLocalUser();
    yield put(fetchUserComplete({ user }));
  }
  ```
- **[client/src/utils/local-progress.ts](freeCodeCamp/client/src/utils/local-progress.ts)** (nouveau) — helpers pour lire/écrire la clé `fcc-local-user` dans `localStorage`. Le user local a `username = 'you'` et la liste `completedChallenges` chargée depuis le disque navigateur.
- **[client/src/redux/local-progress-epic.js](freeCodeCamp/client/src/redux/local-progress-epic.js)** (nouveau) — à chaque dispatch de `submitComplete`, l'epic persiste la nouvelle liste des challenges complétés dans `localStorage`.
- **[client/src/utils/ajax.ts](freeCodeCamp/client/src/utils/ajax.ts)** — toutes les fonctions HTTP (`get`, `post`, `put`, `deleteRequest`) sont remplacées par des stubs qui retournent une réponse fictive `{ok: true, status: 200}` sans toucher au réseau. Aucun appel n'est jamais émis vers le backend.

### Pages compte supprimées
Routes physiquement retirées (renvoient maintenant 404) :
- `pages/settings/` (paramètres de profil)
- `pages/donate.tsx` (donations)
- `pages/email-sign-up.tsx`, `pages/update-email.tsx`
- `pages/update-stripe-card.tsx`
- `pages/[maybeUser].tsx` (profils publics)
- `pages/supporters.tsx`
- `pages/user/`, `pages/unsubscribed/`, `pages/certification/`

Composants orphelins stubbés (retournent `null`) :
- `components/Donation/donation-modal.tsx`
- `components/signout-modal/index.tsx`
- `components/Header/components/language-list.tsx`

### Persistance après reboot
Test automatisé `persist-test.mjs` qui ouvre Edge avec un profil persistant, écrit une progression, ferme le contexte navigateur, rouvre, et vérifie que la progression est toujours là. **4/4 PASS** — la progression survit aux fermetures de navigateur et aux redémarrages de la machine.

---

## 2. Site simplifié visuellement

### Page d'accueil (`pages/index.tsx`)
Remplace l'ancienne home page marketing (témoignages, logos d'entreprises, certifications, FAQ) par une page **minimaliste** :
- Un titre : **« Apprendre à coder. »**
- Un sous-titre court
- **Un seul bouton « Commencer → »** qui mène **directement à `/cours-fr`** (le dossier des cours traduits, plutôt qu'au cursus complet en anglais)
- Une petite note : « Pas de compte. Ta progression reste sur ton ordinateur. »

Styles dans [pages/index.css](freeCodeCamp/client/src/pages/index.css). Plus de "3 cartes" Comment ça marche — bruit visuel retiré.

### Header — barre de navigation
- Plus de barre de recherche Algolia (inutile en local)
- Plus de sélecteur de langue (une seule langue active)
- Plus de bouton « Sign In » (le composant `Login` est devenu un CTA « Commencer » qui mène à `/learn`)
- Menu réduit à **2 entrées** : **Cursus** + **Mode sombre**

### Footer (`components/Footer/index.tsx`)
Réécrit, ne contient plus que : `© freeCodeCamp · Apprentissage local`

### Composants supprimés
- `components/landing/` entièrement (testimonials, FAQ, hero, etc.)
- `assets/images/landing/` (photos témoignages, hero image)
- `assets/images/footer-ads/` (badges Apple Store / Google Play)

---

## 3. Tout en français

### Locale ajoutée
Dans [packages/shared/src/config/i18n.ts](freeCodeCamp/packages/shared/src/config/i18n.ts) :
```ts
export enum Languages { English = 'english', French = 'french' }
export const availableLangs = {
  client: [Languages.English, Languages.French],
  curriculum: [Languages.English, Languages.French]
};
```

Toutes les autres langues (espagnol, chinois, allemand…) supprimées.

### Fichiers de traduction
Nouveau dossier `client/i18n/locales/french/` avec les 7 JSON copiés depuis `english/` puis traduits ciblement (les clés visibles à l'utilisateur). Le `fallbackLng: 'en'` dans [client/i18n/config.js](freeCodeCamp/client/i18n/config.js) rattrape automatiquement les clés non traduites.

### Variables d'environnement
Dans [.env](freeCodeCamp/.env) :
```
CLIENT_LOCALE=french
CURRICULUM_LOCALE=french
```

### Path prefix corrigé
[client/utils/gatsby/path-prefix.js](freeCodeCamp/client/utils/gatsby/path-prefix.js) — fcc utilisait normalement `/french/...` pour les sous-sites localisés. En standalone, le préfixe est forcé à `''` pour que le test-runner JS soit chargé correctement depuis `/js/test-runner/9.0.0/index.js`.

---

## 4. Curriculum traduit (cours par cours)

### Cours actuellement traduits
**HTML — début de Responsive Web Design v9** (18 fichiers ajoutés)
- `workshop-curriculum-outline` : 11 étapes traduites
- `lab-debug-camperbots-profile-page` : 1 lab traduit
- `lecture-understanding-html-attributes` : 2 leçons traduites
- `lab-debug-pet-adoption-page` : 1 lab traduit
- `lecture-understanding-the-html-boilerplate` : 3 leçons traduites
- Les titres et intros visibles dans l'accordéon sont aussi traduits dans `client/i18n/locales/french/intro.json`
- Les textes exacts que l'apprenant doit taper restent en anglais quand les tests les exigent

**Apprendre le HTML — Cat Photo App** (71 / 71 étapes — **100 %**)
- Toutes les étapes (step-1 à step-71) disponibles en français pédagogique
- Chaque fichier `.md` traduit à la main, en respectant :
  - YAML frontmatter intact (sauf `title:`)
  - Blocs de code (` ``` `) jamais traduits
  - Code inline (`` ` ``) jamais traduit
  - Marqueurs de section (`# --description--`, `# --hints--`, etc.) intacts
- Fichiers dans `curriculum/i18n-curriculum/curriculum/challenges/french/blocks/learn-html-by-building-a-cat-photo-app/`

**Apprendre le CSS de base — Cafe Menu** (91 / 91 étapes — **100 %**)
- Toutes les étapes sont présentes en français dans `curriculum/i18n-curriculum/curriculum/challenges/french/blocks/learn-basic-css-by-building-a-cafe-menu/`
- Les blocs de code, marqueurs de section et champs techniques du frontmatter ont été validés comme inchangés par rapport aux fichiers anglais

### Fallback automatique
Le builder du curriculum [curriculum/src/build-superblock.ts](freeCodeCamp/curriculum/src/build-superblock.ts) ligne 330 fait :
```js
const langUsed = isAudited && existsSync(i18nPath) ? this.lang : 'english';
```
Donc pour chaque fichier individuel :
- Si la version française existe → utilisée
- Sinon → fallback automatique vers l'anglais

**Aucun risque de crash** sur un fichier non traduit. Les premiers dossiers HTML v9, Cat Photo App et Cafe Menu sont en français, et le reste tombe naturellement en anglais.

### Page « Dossier FR » (`pages/cours-fr.tsx`)
Page dédiée, accessible **directement depuis la home** (bouton « Commencer → ») **et depuis `/learn`** (bannière « Ouvrir le dossier FR → »).

La page fonctionne maintenant en trois niveaux :
- **Choix de langue** : bouton Français pour rester dans le dossier FR, bouton Anglais pour retourner à `/learn`.
- **Home FR** : conserve les deux sections demandées, **Par certification** et **Par thème**.
- **Par thème** : liste seulement les dossiers déjà traduits ou commencés. HTML ouvre maintenant les cinq dossiers HTML v9 traduits avant Cat Photo App, puis Cat Photo App. CSS ouvre Cafe Menu. La vue bloc affiche les étapes disponibles comme avant.
- **Par certification** : reprend l'architecture officielle anglaise de `/learn/{cert}/` avec `SuperBlockAccordion`, `allSuperBlockStructure` et `allChallengeNode`. Les chapitres, modules, blocs, badges `Workshop` / `Lab` / `Theory` et grilles d'étapes sont donc affichés comme sur freeCodeCamp anglais.

La vue certification n'est plus une grille simplifiée de blocs traduits. Elle montre aussi les blocs non traduits, en anglais, avec la note **« traduction française à venir »**. Exemple : Responsive Web Design ouvre la structure officielle `Courses > HTML > Basic HTML`, avec les premiers dossiers traduits en français : `Créer un plan de curriculum`, `Déboguer la page de profil de Camperbot`, `Comprendre les attributs HTML`, `Déboguer une page d'adoption d'animaux`, `Comprendre le boilerplate HTML`, puis Cat Photo App. Le premier bloc est déplié automatiquement pour reproduire le comportement anglais.

La certification **Bibliothèques Front-End** a aussi une intro française dédiée : elle explique mieux le rôle de React, TypeScript, des outils CSS, des tests et des projets obligatoires avant l'examen.

La vue bloc (`fr-block`) et la vue détail (`fr-step`) ne changent pas fonctionnellement : elles continuent à utiliser les données GraphQL disponibles pour les blocs traduits/commencés.

Correction CSS associée : le hover des cartes dans [cours-fr.css](freeCodeCamp/client/src/pages/cours-fr.css) garde un fond gris transparent et `color: inherit`, pour éviter le bug où la carte devenait blanche au survol.

---

## 5. Scripts de test (Playwright + Edge)

Tous dans la racine du projet `freeCodeCamp/` :

| Script | Rôle | Résultat |
|---|---|---|
| `smoke-test.mjs` | Vérifie l'UI globale : routes 404 pour /settings et /donate, /learn charge, localStorage initialisé, pas d'appel `:3000` | **10 / 10 PASS** |
| `submit-test.mjs` | Teste le pipeline Redux → reducer → epic → localStorage en dispatchant `submitComplete` programmatiquement | **8 / 8 PASS** |
| `persist-test.mjs` | Simule un reboot (fermeture du contexte navigateur, réouverture) et vérifie que la progression survit | **4 / 4 PASS** |
| `human-solve-test.mjs` | Ouvre step-1 dans un vrai navigateur, tape la solution dans Monaco, clique « Vérifier votre code » | **passe** (bannière de succès en français + bouton « Envoyer et continuer ») |
| `full-flow-test.mjs` | Enchaîne step-1 → step-2 → step-3 (collage de solution + Check + Submit) | passe, **0 requêtes en erreur** |
| `human-test.mjs` | Inspection visuelle multi-pages (home / learn / cert / challenge / settings 404 / menu) avec captures d'écran | passe |

Captures dans `screenshots/`.

Dernière vérification ciblée ajoutée pour `/cours-fr` :
- `/cours-fr` répond en HTTP 200 sur le serveur local.
- La home garde **Par certification** + **Par thème**.
- Les certifications s'ouvrent même quand elles ne sont pas encore traduites, car elles affichent maintenant l'architecture anglaise officielle.
- Responsive Web Design affiche `Courses`, `HTML`, `Basic HTML`, les nouveaux dossiers HTML en français et la grille d'étapes comme sur `/learn`.
- Le hover des cartes ne devient plus blanc.
- Les vues thème HTML/CSS ouvrent les nouveaux dossiers HTML, Cat Photo App et Cafe Menu, puis leurs étapes.
- Le vrai challenge `/learn/responsive-web-design-v9/workshop-curriculum-outline/step-1` charge en français, le titre de bloc est français, la solution `Welcome to freeCodeCamp` passe les tests, et la bannière de succès s'affiche.
- Captures ajoutées : `cours-fr-html-new-folders-clean.png`, `cours-fr-curriculum-outline-step1-fr-clean.png`, `cours-fr-curriculum-outline-real-challenge-clean.png`, `cours-fr-front-end-cert-overview-clean.png`.
- TypeScript client passe avec `pnpm exec tsc --noEmit --pretty false -p client/tsconfig.json`.
- Les tests ciblés `signout-modal.test.ts` et `layout-selector.test.tsx` passent : 11/11.

---

## 6. Configuration & corrections

### Stabilité Redux
[client/src/redux/create-store.ts](freeCodeCamp/client/src/redux/create-store.ts) — désactivation des checks dev `immutableCheck` et `serializableCheck` de Redux Toolkit, qui plantaient en **« Maximum call stack size exceeded »** sur des payloads de progression un peu nourris.

### Corrections TypeScript
[client/src/components/signout-modal/index.tsx](freeCodeCamp/client/src/components/signout-modal/index.tsx) — le helper `pathAfterSignout` est réexporté même si le modal de déconnexion est stubbé.

[client/utils/gatsby/layout-selector.test.tsx](freeCodeCamp/client/utils/gatsby/layout-selector.test.tsx) — le test de layout certification utilise un composant local factice, car la page `pages/certification` a été supprimée dans cette version standalone.

### Curriculum local
[packages/shared/src/config/curriculum.ts](freeCodeCamp/packages/shared/src/config/curriculum.ts) — `notAuditedSuperBlocks` réduit à `{ English: [], French: [] }` (sinon des références aux enums supprimés cassaient le build).

### Script dev simplifié
[dev.ps1](freeCodeCamp/dev.ps1) — lance uniquement le client Gatsby (plus l'API). Pas besoin de MongoDB.

### Algolia stubé
[client/src/utils/algolia-locale-setup.ts](freeCodeCamp/client/src/utils/algolia-locale-setup.ts) — retourne des valeurs fixes. La recherche Algolia n'est pas utilisée en local.

---

## 7. Comment l'utiliser

```powershell
cd "freeCodeCamp"
.\dev.ps1
```

Puis ouvre **`http://localhost:8000`** dans Edge ou Chrome.

- Page d'accueil → bouton **Commencer**
- `/learn` → bannière **« Ouvrir le dossier FR »** → page dédiée aux cours traduits
- Ou clique directement sur la première certification pour entrer dans le curriculum
- À chaque challenge : écris ton code, clique **« Vérifier votre code »**, puis **« Envoyer et continuer »** pour passer au suivant

Ta progression est sauvegardée dans `localStorage` sous la clé `fcc-local-user`. Elle survit aux fermetures du navigateur, aux redémarrages, et au temps qui passe — tant que tu n'effaces pas les données du site dans les paramètres de ton navigateur.

---

## 8. Statistiques

- **Lignes de traduction française du curriculum** : 162 fichiers `.md` traduits ou générés puis validés (Cat Photo App + Cafe Menu + premiers dossiers HTML v9)
- **Routes compte supprimées** : 9
- **Composants stubbés / réduits** : 6 (donation modal, signout modal, language-list, learn-alert, help-translate, legacy-links)
- **Locales supprimées** : 10
- **Tests automatisés passés** : 22 / 22 (smoke + submit + persist + flow)
- **Dépendance MongoDB** : éliminée
- **Dépendance Auth0** : éliminée
- **Dépendance API backend** : éliminée
- **Liens externes restants en interface utilisateur** : 0 (forum, news, Crowdin, codeally, GitHub, Twitter, donate — tous retirés)

---

## 9. Ce qui reste à faire

### Traduction du curriculum
- **Premiers dossiers HTML v9 avant Cat Photo App** : **terminé** ✅ (18 fichiers français).
- **Cat Photo App** : **terminé** ✅ (71/71 étapes en français).
- **Cafe Menu** : **terminé** ✅ (91/91 étapes en français).
- **Responsive Web Design / autres certifications** : l'architecture officielle est visible dans `/cours-fr`, avec les blocs déjà traduits en français et les autres contenus à traduire bloc par bloc.
- **JavaScript, Python, bases de données, React** : non commencés.
- **Total restant si tout doit être traduit** : ~16 300 fichiers `.md`. À cette volumétrie, il faut un outil automatique : soit (a) le script Python Argos Translate déjà écrit (`tools/translate-challenges.py`) pour une traduction locale gratuite, soit (b) l'API DeepL (compte gratuit ≤ 500 000 caractères/mois) pour une qualité supérieure.

### Améliorations possibles
- **Ajouter d'autres dossiers traduits dans la section Par thème** au fur et à mesure des traductions, en mettant à jour les métadonnées de [cours-fr.tsx](freeCodeCamp/client/src/pages/cours-fr.tsx).
- **Traduire progressivement les blocs visibles dans Par certification**. L'architecture n'a pas besoin d'être reconstruite à la main : elle vient de `allSuperBlockStructure`.
- **Polir les traductions UI résiduelles** : quelques sections rarement vues (page erreur 404 personnalisée, etc.) tombent encore en fallback anglais. Non bloquant.

### Limitations connues
- Les **certifications** (l'évaluation finale d'un cursus) ne sont pas opérationnelles localement — elles nécessitent une signature serveur. On peut faire tous les challenges mais pas générer de PDF de certification.
- La **recherche** (loupe en haut, supprimée du header) n'est plus disponible. Pour retrouver un cours, passer par `/cours-fr` ou `/learn`.

---

## 10. Outils & scripts implémentés

Tous à la racine de `freeCodeCamp/`.

### Script utilisateur principal
| Fichier | Rôle |
|---|---|
| [dev.ps1](freeCodeCamp/dev.ps1) | Lance Gatsby en mode développement sur `http://localhost:8000`. C'est le seul script à utiliser pour ouvrir le site. |

### Scripts de traduction
| Fichier | Rôle |
|---|---|
| [tools/translate-challenges.py](freeCodeCamp/tools/translate-challenges.py) | Script Python qui traduit en bloc des fichiers `.md` du curriculum avec **Argos Translate** (local, gratuit, hors-ligne). Préserve frontmatter, blocs de code, marqueurs de section. Idempotent : skippe les fichiers déjà traduits et écrit dans `curriculum/i18n-curriculum/...`. Lance avec `python tools/translate-challenges.py --workers 7`. |
| `translate-fr.mjs`, `translate-fr-2.mjs`, `translate-fr-3.mjs` | Petits scripts Node qui ont fait les batches successifs de traduction des fichiers JSON d'i18n côté UI (boutons, nav, modals, page /learn). |

### Scripts de test (Playwright + Edge)
| Fichier | Rôle | Statut |
|---|---|---|
| [smoke-test.mjs](freeCodeCamp/smoke-test.mjs) | UI globale : page d'accueil charge, /settings et /donate renvoient 404, /learn affiche le cursus, localStorage initialisé, aucun appel vers `:3000` | **10/10 PASS** |
| [submit-test.mjs](freeCodeCamp/submit-test.mjs) | Pipeline Redux + epic + localStorage : dispatch `submitComplete`, vérifie la persistance après reload | **8/8 PASS** |
| [persist-test.mjs](freeCodeCamp/persist-test.mjs) | Persistance après reboot : ouvre Edge avec un profil persistant, ferme, rouvre, vérifie que la progression est toujours là | **4/4 PASS** |
| [human-solve-test.mjs](freeCodeCamp/human-solve-test.mjs) | Test « humain » : tape la solution dans Monaco, clique « Vérifier votre code » | **passe** |
| [full-flow-test.mjs](freeCodeCamp/full-flow-test.mjs) | Enchaîne step-1 → step-2 → step-3 (Check + Submit pour chaque) | **passe**, 0 erreur réseau |
| [human-test.mjs](freeCodeCamp/human-test.mjs) | Inspection visuelle multi-pages avec captures d'écran | **passe** |
| [diag-test.mjs](freeCodeCamp/diag-test.mjs) | Capture les requêtes en échec pour diagnostiquer des 404 (utilisé pour trouver le souci du test-runner) | utilitaire |
| [snap-home.mjs](freeCodeCamp/snap-home.mjs), [snap-fr.mjs](freeCodeCamp/snap-fr.mjs) | Captures d'écran ciblées pour vérifications visuelles | utilitaires |

**Total** : 22 / 22 tests automatisés en vert.

### Outils externes utilisés
- **Playwright** (`playwright@1.52.0`) — pilote Edge en mode headless dans les scripts historiques (`channel: 'msedge'`). Si Edge se ferme immédiatement dans une session Playwright, installer Chromium avec `pnpm exec playwright install chromium` et lancer les vérifications ciblées avec le navigateur Chromium fourni par Playwright.
- **Argos Translate** (`pip install --user argostranslate`) — bibliothèque Python de traduction neurale offline. Modèle anglais→français téléchargé une seule fois (~100 Mo).

### Fichiers source modifiés
- **Page d'accueil & layout** : [pages/index.tsx](freeCodeCamp/client/src/pages/index.tsx), [pages/index.css](freeCodeCamp/client/src/pages/index.css), [pages/cours-fr.tsx](freeCodeCamp/client/src/pages/cours-fr.tsx) (nouveau), [pages/cours-fr.css](freeCodeCamp/client/src/pages/cours-fr.css) (nouveau), [pages/learn.tsx](freeCodeCamp/client/src/pages/learn.tsx)
- **Header & Footer** : `universal-nav.tsx`, `nav-links.tsx`, `login.tsx`, `language-list.tsx`, `Footer/index.tsx`
- **Redux store & user** : `create-store.ts`, `fetch-user-saga.js`, `local-progress-epic.js` (nouveau), `redux/index.js`
- **AJAX & utils** : `ajax.ts`, `local-progress.ts` (nouveau), `algolia-locale-setup.ts`, `path-prefix.js`
- **i18n** : `packages/shared/src/config/i18n.ts`, `packages/shared/src/config/curriculum.ts`, `packages/shared/tsconfig.json`, `client/i18n/locales/french/` (nouveau dossier)
- **Gatsby** : `gatsby-browser.tsx` (expose `window.__store__` pour les tests)
- **Composants stubbés** : `Donation/donation-modal.tsx`, `signout-modal/index.tsx`
- **Curriculum** : `curriculum/i18n-curriculum/curriculum/challenges/french/blocks/learn-html-by-building-a-cat-photo-app/` (71 fichiers `.md`)
- **Config** : `.env`

---

## 11. Nettoyage du code mort et des liens externes

Pour rendre l'app **brute et locale uniquement**, une passe de nettoyage a été faite. Tout ce qui n'a aucun usage en mode standalone a été retiré ou neutralisé :

### Analytics & tracking
- Suppression de tous les appels `callGA({...})` dans le flux utilisateur ([completion-modal](freeCodeCamp/client/src/templates/Challenges/components/completion-modal.tsx), [super-block-intro](freeCodeCamp/client/src/templates/Introduction/super-block-intro.tsx), [learn.tsx](freeCodeCamp/client/src/pages/learn.tsx))

### Donations
- `tryToShowDonationModal` + `<DonateModal />` retirés du [learn layout](freeCodeCamp/client/src/components/layouts/learn.tsx) et de [super-block-intro.tsx](freeCodeCamp/client/src/templates/Introduction/super-block-intro.tsx)
- `LearnAlert`, `ConditionalDonationAlert` : tous deux ramenés à `() => null`
- Handlers `onLearnDonationAlertClick` / `onCertificationDonationAlertClick` neutralisés

### Comptes & login
- Bouton `<Login>` retiré de l'[Intro](freeCodeCamp/client/src/components/Intro/index.tsx) (page /learn) et de [completion-modal](freeCodeCamp/client/src/templates/Challenges/components/completion-modal.tsx)
- Bouton `<Login>` "logged-out-cta-btn" retiré de [super-block-intro](freeCodeCamp/client/src/templates/Introduction/super-block-intro.tsx)
- `<EmailSignUpAlert>` retiré de l'Intro
- Citation aléatoire `randomQuote()` retirée

### Liens externes (forum / Crowdin / codeally / news)
- `<HelpTranslate>` (lien Crowdin) → `() => null`
- `<LegacyLinks>` (codeally / OnaNote / exam-english-only) → `() => null`
- Dropdown **« Aide »** retiré de la [tool-panel](freeCodeCamp/client/src/templates/Challenges/components/tool-panel.tsx) pendant les exercices : plus de lien "Get hint" externe, plus de "Ask for help" qui poste sur le forum. Reste : **Lancer les tests**, **Réinitialiser**, **Regarder la vidéo** (si présente).
- Bouton **« Save code »** (sauvegarde DB serveur) retiré du tool-panel

### Sélecteurs Redux & code dérivé
- `signInLoading`, `slug`, `completedChallengeCount`, `isDonating` et `data` retirés des `mapStateToProps` correspondants
- Hook `useClaimableCertsNotification` plus appelé (pas de certificats locaux)

### Résultat
- **`npx tsc --noEmit`** ne rapporte plus que 2 erreurs **pré-existantes** sans rapport avec mes modifications (test files orphelins `signout-modal.test.ts`, `layout-selector.test.tsx`)
- Aucun bouton/lien restant dans le flux utilisateur ne renvoie vers un service externe (forum, news, Crowdin, codeally, GitHub, Twitter, donate)
- Aucun composant qui s'affiche ne dépend d'un compte signed-in ou d'un appel réseau
