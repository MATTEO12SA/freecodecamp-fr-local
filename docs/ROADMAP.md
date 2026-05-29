# ROADMAP — Plan d'action pour passer en qualite « produit »

> Audit senior + plan d'implementation detaille du fork **freeCodeCamp FR Local**.
> Etabli le 2026-05-29. Objectif : transformer un outil personnel solide en une
> experience d'apprentissage francophone de niveau commercial, **sans renier le
> local-first** (pas de compte, pas de backend, vie privee totale).

Ce document se lit de haut en bas, mais s'execute **par vagues** : Vague 1 (quick
wins), Vague 2 (fondations), Vague 3 (transformations). Chaque chantier suit le
meme gabarit : Objectif · Impact/Difficulte · Etat actuel (fichiers reels) ·
Comment faire (etapes) · Fichiers · Definition of Done · Risques.

Legende impact : 🟢 Faible · 🟡 Moyen · 🟠 Eleve · 🔴 Revolutionnaire.
Difficulte : Faible · Moyenne · Elevee · Tres elevee.
Statut : ⬜ A FAIRE · 🔄 EN COURS · ✅ FINI (mis a jour au fil de l'execution).

---

## 0. Diagnostic (etat des lieux, mai 2026)

Forces : extraction de traduction sure (`tools/translate-workshop.js`),
neutralisation backend propre (`client/src/utils/ajax.ts`), local-first coherent,
RWD v9 traduit a 100 %.

Faiblesses structurelles identifiees (a corriger en priorite) :

1. **0 test sur le code custom.** `exam-fr.tsx` (scoring, shuffle, review),
   `local-progress.ts`, `exam-history.ts`, `has-french-intro.ts` n'ont aucun
   test unitaire. Seuls les tests upstream subsistent.
2. **Etat d'apprentissage fragile et ephemere.** Progression = `localStorage`
   mono-appareil (`fcc-local-user`), aucun export. L'examen garde son etat en
   `useState` : **un rechargement en plein examen efface les 80 questions**.
3. **L'historique d'examen ne retient que le score.** `ExamAttempt` =
   `{cert, date, score, total, pct}`. Les **questions ratees ne sont pas
   persistees** → « Reviser mes erreurs » ne marche que dans la session courante,
   et aucune repetition espacee n'est possible.
4. **Pipeline de traduction 100 % manuel.** `translate-workshop.js` extrait la
   prose en JSON ; un humain traduit. `phrasebook.json` ne contient que 12 regles.
   C'est le goulot qui bloque tout le reste du curriculum (JS v9 : 10/230 au 2026-05-29 ; diagnostic initial : 2/230).
5. **Navigation sans URL.** `cours-fr.tsx` change d'ecran via un `useState`
   (`{v:'lang'|'fr-home'|'fr-cert'}`) → bouton retour casse, pas de partage/
   bookmark, etat perdu au reload.
6. **Aucune identite propre.** Theme freeCodeCamp brut, emoji 📁/🚧, pas
   d'onboarding, pas de marque.
7. **CI heritee non taillee.** Le repo embarque les workflows fCC (deploy-_,
   crowdin-_, docker-\*) qui n'ont aucun sens pour un fork local et peuvent
   echouer/tourner maintenant que le repo est public ; aucune CI ne valide les
   systemes propres du fork.

## 1. Principes directeurs (a ne jamais violer)

- **Local-first non negociable.** Aucune feature ne doit introduire de compte ni
  de backend obligatoire. Tout etat = stockage navigateur, exportable par fichier.
- **Compatibilite upstream.** Minimiser la divergence de fichiers fCC ; isoler le
  code du fork dans des modules clairement identifies pour pouvoir rebaser.
- **Identite francophone assumee.** Le FR + local + sans compte est l'argument
  unique : le mettre en avant partout.
- **Verifiable.** Tout nouveau systeme metier arrive avec ses tests vitest.

---

# CHANTIER 0 — Systeme de traduction optimise (traduction par Claude) 🔴 — ✅ FINI

> **Point de depart de la roadmap.** Tout le reste du curriculum (JS, Python, SQL…)
> est bloque par la vitesse et la qualite de traduction. On optimise donc d'abord
> ce systeme — avec un principe non negociable : **c'est Claude qui redige chaque
> traduction**, jamais un dictionnaire de phrases pre-fabriquees.

- **Objectif :** faire du fork une machine a traduire de haute qualite ou Claude
  ecrit la totalite du francais, encadre par un pipeline sur et un controle qualite
  automatique.
- **Impact :** 🔴 Revolutionnaire · **Difficulte :** Moyenne · **Statut :** ✅ FINI (2026-05-29).
- **Principe (ce que tu as demande) :** aucune traduction generee par regles ou par
  un dictionnaire de phrases. Le `phrasebook.json` (12 regex de pre-remplissage)
  sort du chemin par defaut. Les outils ne font que : (a) **isoler** la prose a
  traduire, (b) **reconstruire** le `.md` sans toucher au technique, (c) **verifier**
  qualite + integrite. La traduction elle-meme = Claude.
- **Etat actuel :** `tools/translate-workshop.js` fait `extract → apply → verify`.
  `extract` pre-remplit `fr` via `applyPhrasebook` (= phrases predefinies, a
  retirer). Aucun controle automatique de qualite (checklist humaine
  « should/Your/the… »). Pas de lexique de reference partage.
- **Comment faire :**
  1. **Retirer les phrases predefinies du defaut.** `extract` laisse `fr: ''`
     partout → Claude traduit tout. Le phrasebook reste possible en option
     explicite (`--phrasebook`), desactivee par defaut.
  2. **Lexique de reference FR** (`tools/translations/lexique-fr.md`) : la
     terminologie canonique (array→tableau, string→chaine, tutoiement « tu »…) que
     Claude **consulte** pour rester coherent. Ce n'est PAS un remplacement
     automatique — juste une reference de style.
  3. **QA automatique** (`tools/check-translation-quality.js`) : pour un bloc FR,
     detecter chunks non traduits (`fr` vide ou identique a `en`), restes anglais
     probables, integrite des placeholders d'assertion (`$1/$2`) et des spans de
     code inline. Sortie : rapport + exit code (0 OK / 1 problemes).
  4. **Brancher la QA** dans `pnpm local:check` et la documenter.
  5. **Documenter le workflow Claude** dans `docs/OPTIMIZE-TRANSLATIONS.md` :
     `extract` → Claude traduit le JSON (lexique en reference) → `reviewed:true` →
     `apply` → `verify` → `check-translation-quality`.
- **Fichiers :** `~ tools/translate-workshop.js`, `+ tools/translations/lexique-fr.md`,
  `+ tools/check-translation-quality.js`, `~ docs/OPTIMIZE-TRANSLATIONS.md`,
  `~ tools/translations/phrasebook.json` (devient optionnel).
- **DoD :** `extract` ne pre-remplit plus aucun `fr` ; la QA tourne sur un bloc et
  detecte un reste anglais ; un bloc traduit par Claude passe `apply` + `verify` +
  QA au vert ; workflow documente.
- **Risques :** ne jamais laisser un outil « inventer » du francais — Claude reste
  le seul traducteur. `verify` (diff technique) demeure le garde-fou anti-casse.
- **Realise (2026-05-29) :** `extract` ne pre-remplit plus les `fr`
  (phrasebook passe en option `--phrasebook`, off par defaut) ; ajout de
  `tools/translations/lexique-fr.md` (reference de style) et de
  `tools/check-translation-quality.js` (QA : chunks non traduits, restes anglais,
  integrite `$n` et code inline) ; `translate-workshop.js` exporte ses helpers et
  ne lance le CLI que via `require.main`. Verifie : QA verte sur `workshop-piano`
  (0 erreur), `extract` produit des `fr` vides. Reste optionnel : brancher la QA
  dans `pnpm local:check` a l'echelle du repo.

---

# VAGUE 1 — Quick wins a fort effet (echelle : jours)

## 1.1 — Persister l'examen en cours (anti-F5) 🟠 — 🔄 EN COURS

- **Objectif :** ne plus jamais perdre un examen au rechargement/fermeture.
- **Impact :** 🟠 Eleve · **Difficulte :** Faible.
- **Etat actuel :** `client/src/pages/exam-fr.tsx` garde `phase`, `currentIndex`,
  `answers`, `seed`, `questions` (via `useMemo` sur `seed`) en memoire React. Rien
  n'est sauvegarde.
- **Comment faire :**
  1. Creer `client/src/utils/exam-session.ts` : lecture/ecriture d'une session en
     cours sous la cle `fcc-exam-session` (forme versionnee, comme
     `local-progress.ts`). Champs : `cert`, `seed`, `currentIndex`, `answers`,
     `mode`, `startedAt`.
  2. Dans `exam-fr.tsx`, ecrire la session a chaque `selectAnswer`/`goNext` et la
     relire au montage. Comme les questions sont **deterministes a partir du
     `seed`** (`shuffleArray(arr, seed)`), il suffit de persister le `seed` pour
     reconstruire exactement le meme examen — pas besoin de stocker les questions.
  3. Proposer « Reprendre l'examen en cours » sur l'ecran intro si une session
     existe ; la purger a `restart()` et apres sauvegarde du resultat.
- **Fichiers :** `+ exam-session.ts`, `~ exam-fr.tsx`.
- **DoD :** F5 en question 40/80 → on revient en 40/80 avec les memes reponses.
- **Risques :** bien purger la session terminee pour ne pas « ressusciter » un
  vieil examen ; gerer le cas ou le pool a change (cert plus traduit).

## 1.2 — Routing par URL dans `cours-fr` 🟠

- **Objectif :** URL reelle par vue (`/cours-fr`, `/cours-fr/<cert>`), retour
  navigateur fonctionnel, liens partageables.
- **Impact :** 🟠 Eleve · **Difficulte :** Moyenne.
- **Etat actuel :** `cours-fr.tsx` pilote l'affichage avec `const [view, setView]`.
- **Comment faire :**
  1. Remplacer l'etat `view` par la lecture de l'URL. Deux options :
     - **Simple :** query param `?cert=<key>` (comme `exam-fr` lit deja
       `?cert=`), via `location.search` + `navigate()` de Gatsby.
     - **Propre :** route client-only Gatsby (`/cours-fr/[cert].tsx`) ou
       `@reach/router` embarque dans la page.
  2. Conserver l'ouverture d'accordeon initiale (`dispatch(toggleBlock(...))`)
     declenchee par le `cert` de l'URL.
  3. Mettre a jour les liens internes (les cartes appellent `navigate` au lieu de
     `setView`).
- **Fichiers :** `~ cours-fr.tsx` (+ eventuelle route `pages/cours-fr/[cert].tsx`).
- **DoD :** ouvrir un cert, faire « retour navigateur » → revient a la liste ;
  recharger sur `/cours-fr/responsive-web-design-v9` → ouvre directement le cert.
- **Risques :** SSR/hydratation (lire l'URL apres montage pour la progression
  `localStorage`, deja gere ainsi dans le code existant).

## 1.3 — Celebration de reussite (confetti + payoff) 🟠

- **Objectif :** recompenser visuellement examen reussi / challenge termine /
  serie atteinte.
- **Impact :** 🟠 Eleve · **Difficulte :** Faible (**`canvas-confetti` est deja
  une dependance** du client).
- **Comment faire :**
  1. Creer `client/src/utils/celebrate.ts` qui encapsule `canvas-confetti` et
     **respecte `prefers-reduced-motion`** (no-op si l'utilisateur le demande).
  2. Declencher sur : `phase==='results' && passed` dans `exam-fr.tsx` ; a la
     complétion d'un challenge ; au franchissement d'un palier (cf. 2.4).
  3. Ajouter un bandeau de resultat soigne (gros score, message FR encourageant).
- **Fichiers :** `+ celebrate.ts`, `~ exam-fr.tsx`.
- **DoD :** reussir un examen lance une animation ; `prefers-reduced-motion`
  desactive l'anim sans bug.

## 1.4 — Export / Import du profil 🟠

- **Objectif :** lever la peur de « tout perdre » (localStorage efface) et
  permettre le multi-appareil **sans backend**.
- **Impact :** 🟠 Eleve · **Difficulte :** Faible.
- **Etat actuel :** progression (`fcc-local-user`), historique d'examen
  (`fcc-exam-history`) — uniquement en localStorage.
- **Comment faire :**
  1. `client/src/utils/profile-io.ts` : `exportProfile()` agrege toutes les cles
     fcc-\* en un JSON `{version, exportedAt, data:{...}}` et declenche un
     telechargement ; `importProfile(file)` valide la version et re-ecrit les cles.
  2. Bouton « Exporter / Importer mes donnees » dans `/dev-fr` (et/ou une page
     profil locale).
  3. Versionner le format et migrer a l'import (reutiliser le pattern de
     validation deja present dans `local-progress.ts`/`exam-history.ts`).
- **Fichiers :** `+ profile-io.ts`, `~ dev-fr.tsx`.
- **DoD :** exporter sur PC A, importer sur PC B → meme progression et historique.

## 1.5 — Progression visible sur les cartes 🟡

- **Objectif :** afficher le % de progression (et l'etat de traduction) sur
  chaque carte de certif, pas seulement dans la vue detail.
- **Impact :** 🟡 Moyen · **Difficulte :** Faible.
- **Etat actuel :** `cours-fr.tsx` ne calcule le % qu'en vue `fr-cert`.
- **Comment faire :** factoriser le calcul `done/total` (deja present) dans un
  helper, l'appeler pour chaque carte de `CERTIFICATIONS`, afficher une mini-barre
  - « 12 % » + le badge « 🚧 Traduction a venir » existant.
- **Fichiers :** `~ cours-fr.tsx` (+ helper dans `utils`).
- **DoD :** chaque carte montre son avancement sans cliquer.

## 1.6 — Ecran de bienvenue (onboarding 1er lancement) 🟠

- **Objectif :** expliquer en 10 secondes : local, sans compte, en francais.
- **Impact :** 🟠 Eleve · **Difficulte :** Faible.
- **Comment faire :**
  1. Cle `fcc-onboarding-seen` en localStorage.
  2. Au 1er chargement (sur `/` ou `/cours-fr`), afficher 3 slides (local /
     sans compte / FR + « Commencer ») puis poser la cle.
  3. Lien « Revoir l'intro » dans `/dev-fr`.
- **Fichiers :** `+ components/onboarding/*`, `~ index.tsx` ou `cours-fr.tsx`.
- **DoD :** 1re visite → intro ; visites suivantes → acces direct.

## 1.7 — Mouvement et confort 🟢

- **Objectif :** transitions de vue fluides + respect du `prefers-reduced-motion`.
- **Impact :** 🟢 Faible (mais perception qualite) · **Difficulte :** Faible.
- **Comment faire :** transitions CSS sur les changements de vue
  (`cours-fr`/`exam-fr`), barre de progression animee, helper global
  `prefers-reduced-motion` (partage avec 1.3). Pas besoin de framer-motion au
  depart : CSS suffit.
- **DoD :** navigation ressentie comme fluide ; aucune anim si reduced-motion.

## 1.8 — « Reprendre ou j'en etais » global 🟡

- **Objectif :** un bouton « Continuer » en page d'accueil vers le dernier
  challenge non termine.
- **Impact :** 🟡 Moyen · **Difficulte :** Faible.
- **Comment faire :** stocker `lastVisitedChallenge` (slug + date) a la complétion/
  visite ; l'afficher en CTA principal sur `/` et `/cours-fr` (le catalogue
  calcule deja `firstUnfinished` — reutiliser la logique).
- **DoD :** ouvrir l'app → 1 clic pour reprendre.

---

# VAGUE 2 — Fondations (echelle : semaines)

## 2.1 — Extraire la logique pure + tests vitest 🔴

- **Objectif :** rendre le coeur metier testable et fiable.
- **Impact :** 🔴 Revolutionnaire (qualite) · **Difficulte :** Moyenne.
- **Etat actuel :** scoring, `shuffleArray`, `prepareQuestions`, `moduleStats`
  sont inlines dans `exam-fr.tsx` ; `local-progress`/`exam-history` sans tests.
- **Comment faire :**
  1. Extraire dans `client/src/utils/exam-core.ts` : `shuffleArray`,
     `prepareQuestions`, calcul de score, `moduleStats`, selection review.
  2. Ecrire `exam-core.test.ts`, `local-progress.test.ts`, `exam-history.test.ts`
     (vitest est deja la ; voir le mock existant
     `client/src/utils/__mocks__/has-french-intro.ts`).
  3. Cas a couvrir : shuffle deterministe pour un seed donne ; pool < 80
     questions ; reponses nulles ; migration d'anciens formats localStorage ;
     cap `MAX_PER_CERT` de l'historique.
- **Fichiers :** `+ exam-core.ts`, `+ *.test.ts`, `~ exam-fr.tsx`.
- **DoD :** `pnpm -F @freecodecamp/client test` couvre le coeur ; refactor sans
  regression.

## 2.2 — CI taillee pour le fork 🟠

- **Objectif :** valider automatiquement les systemes du fork ; arreter les
  workflows fCC inutiles maintenant que le repo est public.
- **Impact :** 🟠 Eleve · **Difficulte :** Moyenne.
- **Etat actuel :** `.github/workflows/` contient les workflows upstream
  (deploy-api, deploy-client, crowdin-_, docker-_, devcontainer-ci…) sans rapport
  avec un fork local.
- **Comment faire :**
  1. Ajouter `.github/workflows/fork-ci.yml` : sur `push`/`pull_request`, faire
     `pnpm install`, typecheck client + shared, `vitest`, `lint-root`, et
     idealement un sous-ensemble des smoke tests.
  2. **Desactiver** (ou supprimer) les workflows herites non pertinents :
     `deploy-*`, `crowdin-*`, `docker-*`, `devcontainer-ci`, `e2e-third-party`.
     A defaut de suppression, retirer leurs declencheurs (`on:`) pour eviter
     qu'ils tournent/echouent.
  3. Brancher `axe-test.mjs` (cf. 2.6) une fois les pages custom couvertes.
- **Fichiers :** `+ fork-ci.yml`, `~/− workflows herites`.
- **DoD :** une PR déclenche uniquement la CI du fork, verte ; aucun workflow de
  deploiement/upload ne se lance.
- **Risques :** ne pas casser le submodule i18n / `curriculum-i18n-submodule.yml`
  s'il sert encore ; verifier avant suppression.

## 2.3 — Persister les erreurs + Repetition espacee (SRS) 🔴

- **Objectif :** transformer l'examen en outil d'apprentissage durable : retenir
  les questions ratees et les re-presenter intelligemment dans le temps.
- **Impact :** 🔴 Revolutionnaire · **Difficulte :** Elevee.
- **Etat actuel :** `exam-history.ts` ne stocke que le score agrege ; `startReview`
  ne vit que le temps d'une session.
- **Comment faire :**
  1. **Cle stable de question :** les quiz n'ont pas d'`id` par question (juste
     `text/distractors/answer`). Definir une cle = hash du `text` (ex. djb2/SHA
     court) ou `block + index`. C'est le prerequis de tout SRS.
  2. `client/src/utils/srs.ts` : stockage `fcc-srs` `{questionKey: {ease,
intervalDays, dueDate, lapses, lastSeen, block, cert}}`. Algorithme type
     Leitner/SM-2 simplifie (bonnes reponses → intervalle x ease ; ratees →
     reset + lapse++).
  3. A la fin d'un examen, mettre a jour le SRS pour chaque question vue.
  4. Nouveau mode « Reviser (SRS) » : tirer en priorite les questions `dueDate <=
today`, puis les blocs faibles.
  5. Ponderer le tirage de l'examen complet vers les blocs a fort taux d'echec
     (lien avec 2.x equilibrage adaptatif).
- **Fichiers :** `+ srs.ts`, `+ srs.test.ts`, `~ exam-fr.tsx`, `~ exam-history.ts`.
- **DoD :** rater une question aujourd'hui → elle revient en priorite demain ;
  l'etat survit aux sessions.
- **Risques :** la cle par hash de texte casse si l'enonce FR est re-traduit
  (acceptable : la question repart « neuve »). Documenter ce choix.

## 2.4 — XP, niveaux, series, heatmap 🟠

- **Objectif :** donner une progression d'identite mesurable.
- **Impact :** 🟠 Eleve (series = retention 🔴) · **Difficulte :** Moyenne.
- **Etat actuel :** `buildLocalUser` cable `points:0` et tous les `is…Cert:false` ;
  aucune notion d'XP/serie.
- **Comment faire :**
  1. `client/src/utils/xp.ts` : attribuer de l'XP par challenge/examen ; courbe de
     niveaux ; cle `fcc-xp`.
  2. `client/src/utils/streak.ts` : jours d'activite consecutifs (cle `fcc-streak`)
     - 1 « gel » de serie autorise par semaine.
  3. Page profil locale (ou bloc dans `/dev-fr`) : niveau, XP, serie, **heatmap
     d'activite** style GitHub (un carre par jour).
  4. Declencher la celebration (1.3) aux paliers (niveau, 7 jours, etc.).
- **Fichiers :** `+ xp.ts`, `+ streak.ts`, `+ profil`, tests associes.
- **DoD :** une session ajoute de l'XP visible ; la serie s'incremente chaque jour
  et se brise apres une absence (hors gel).

## 2.5 — Explications de reponse dans l'examen 🟠

- **Objectif :** corriger en expliquant le _pourquoi_, avec lien vers la lecon.
- **Impact :** 🟠 Eleve · **Difficulte :** Moyenne.
- **Etat actuel :** l'ecran resultats montre la bonne reponse, jamais le pourquoi.
- **Comment faire :** enrichir le pipeline de quiz pour exposer une explication
  (si presente dans le `.md` source) ; sinon, lier au challenge source via
  `block`/`slug`. Afficher un repli « Revoir la lecon » pointant vers `/learn/...`.
- **Fichiers :** `~ exam-fr.tsx`, eventuellement la requete GraphQL + parsing quiz.
- **DoD :** chaque question ratee propose une explication ou un lien direct vers
  la lecon correspondante.

## 2.6 — Accessibilite : audit etendu + clavier 🟠

- **Objectif :** rendre les pages custom reellement accessibles.
- **Impact :** 🟠 Eleve · **Difficulte :** Moyenne.
- **Etat actuel :** bases presentes (barre `aria-hidden` + texte, `aria-label` sur
  les choix). Manques : navigation clavier de l'examen, focus visibles, gestion
  `prefers-reduced-motion`, contrastes non audites ; `axe-test.mjs` ne couvre pas
  les pages custom.
- **Comment faire :**
  1. Etendre `axe-test.mjs` a `/cours-fr`, `/catalog`, `/exam-fr`, `/dev-fr` et le
     brancher en CI (2.2).
  2. Examen : touches `1-4` pour repondre, `←/→` pour naviguer, focus visible,
     `aria-live` sur le changement de question.
  3. Auditer les contrastes ; ajouter une option « police lisible / espacement »
     (dyslexie).
- **Fichiers :** `~ axe-test.mjs`, `~ exam-fr.tsx`, CSS.
- **DoD :** examen entierement utilisable au clavier + lecteur d'ecran ; axe vert
  en CI.

## 2.7 — Identite visuelle FR (design tokens) 🟠

- **Objectif :** une marque reconnaissable, pas un clone re-skinné.
- **Impact :** 🟠 Eleve · **Difficulte :** Moyenne.
- **Comment faire :** definir des design tokens (couleurs, typo, rayons,
  espacements) propres par-dessus `@freecodecamp/ui` ; remplacer les emoji
  📁/🚧 par un set SVG coherent ; nom + logo « non-officiel » ; mode sombre +
  theme « focus » examen.
- **Fichiers :** CSS/variables globales, `cours-fr.css`, `exam-fr.css`, assets.
- **DoD :** l'app a une identite distincte et coherente sur toutes les pages.

## 2.8 — Strategie d'upstream documentee 🟠

- **Objectif :** pouvoir suivre les mises a jour de freeCodeCamp sans cauchemar de
  merge.
- **Impact :** 🟠 Eleve · **Difficulte :** Moyenne.
- **Etat actuel :** 233 fichiers divergent de l'upstream sans carte de patchs.
- **Comment faire :** documenter dans `docs/UPSTREAM.md` la liste des fichiers fCC
  patches et pourquoi, la procedure de rebase (`git fetch origin`, rebase/merge,
  points de conflit connus), et la regle « code du fork = modules isoles
  prefixes ». Idealement, concentrer le code custom hors des fichiers upstream.
- **DoD :** un rebase sur une nouvelle version fCC suit une checklist ecrite.

---

# VAGUE 3 — Transformations (echelle : mois)

## 3.1 — (Deplace) Traduction par Claude → voir CHANTIER 0

Ce point a ete **remonte en tete de roadmap** sous une forme differente : pas de
LLM-API ni de glossaire impose qui « fabrique » du francais, mais **Claude comme
seul traducteur**, encadre par le pipeline et la QA. Voir **CHANTIER 0**.

## 3.2 — QA de traduction + couverture reelle 🟠

- **Objectif :** remplacer la relecture manuelle fragile par des controles
  deterministes, et mesurer la couverture en **% reel**.
- **Impact :** 🟠 Eleve · **Difficulte :** Moyenne.
- **Etat actuel :** la QA est une checklist humaine (« scanner should/Your/the… ») ;
  `has-french-intro.ts` est **binaire** (1 `.md` = « traduit »).
- **Comment faire :**
  1. `tools/check-translation-quality.js` : detecte restes anglais, verifie la
     terminologie vs `glossary.json`, controle la coherence des placeholders
     `$1/$2` d'assertions, signale les hybrides.
  2. Memoire de traduction (TM) : `tools/translations/tm.json` qui grossit avec
     chaque phrase validee ; `pretranslate` la consulte d'abord (coherence +
     vitesse).
  3. Faire passer `has-french-intro` / `translation-status.js` d'un booleen a un
     **pourcentage** par bloc/module (fichiers FR / fichiers EN) ; exposer ce % sur
     les cartes (1.5) et dans `/dev-fr`.
- **Fichiers :** `+ check-translation-quality.js`, `+ tm.json`,
  `~ has-french-intro.ts`, `~ translation-status.js`, `~ curriculum-fr.js`.
- **DoD :** `pnpm local:check` echoue si une traduction viole le glossaire ; le %
  reel s'affiche partout.

## 3.3 — PWA installable + hors-ligne 🔴

- **Objectif :** « apprends a coder, en francais, 100 % hors-ligne » — un pitch
  unique que fCC.org n'offre pas.
- **Impact :** 🔴 Revolutionnaire · **Difficulte :** Elevee.
- **Etat actuel :** pas de `gatsby-plugin-offline` ni `gatsby-plugin-manifest`
  detecte.
- **Comment faire :**
  1. Ajouter `gatsby-plugin-manifest` (nom, icones, couleurs) et
     `gatsby-plugin-offline` (service worker) au `client/gatsby-config`.
  2. Strategie de cache : page-data + assets du curriculum FR en cache-first ;
     verifier le poids (le curriculum est gros — cf. perf).
  3. Banniere « Installer l'app » ; tester le parcours complet sans reseau.
- **Fichiers :** `~ client/gatsby-config.*`, assets d'icones.
- **DoD :** app installable ; un challenge deja visite reste accessible hors-ligne.
- **Risques :** taille du cache (curriculum volumineux) → ne mettre en cache que le
  contenu FR / visite ; invalidation du SW lors d'un rebuild.

## 3.4 — Certificats locaux verifiables 🟠

- **Objectif :** un resultat tangible et partageable a la complétion + examen
  reussi, **sans backend**.
- **Impact :** 🟠 Eleve · **Difficulte :** Elevee.
- **Comment faire :** generer un certificat (image/PDF) cote client (lib type
  `jspdf` a ajouter, ou rendu canvas) ; y inscrire un **hash** des donnees de
  complétion + un QR pointant vers une page de verification locale qui recalcule le
  hash a partir d'un export. Bien cadrer le wording « non-officiel » (pas un
  certificat freeCodeCamp.org).
- **Fichiers :** `+ utils/certificate.ts`, `+ page de verification`.
- **DoD :** reussir un cert FR genere un PDF telechargeable verifiable localement.
- **Risques :** ne pas laisser croire a une certification officielle (legal/marque).

## 3.5 — Types d'exercices FR varies 🟠

- **Objectif :** depasser le QCM ; faire pratiquer (remplir-le-trou, debogage,
  projets guides).
- **Impact :** 🟠 Eleve · **Difficulte :** Elevee.
- **Etat actuel :** l'evaluation FR locale = QCM (`exam-fr`) ; `fill-in-the-blank`
  upstream existe deja (fichier patche) — l'integrer au flux FR/examen.
- **Comment faire :** etendre l'examen a plusieurs `challengeType` (fill-in-blank,
  debug) ; reutiliser les composants upstream existants ; varier les formats de
  session (quiz eclair 5 questions, chrono, « mort subite »).
- **DoD :** au moins 2 formats d'exercice en plus du QCM dans le flux FR.

## 3.6 — Mode contributeur de traduction in-app 🔴

- **Objectif :** maintenant que le repo est **public**, passer d'outil perso a
  plateforme FR communautaire.
- **Impact :** 🔴 Revolutionnaire (identite) · **Difficulte :** Tres elevee.
- **Comment faire :** un mode « proposer une traduction » qui, depuis une lecon EN,
  ouvre l'editeur de prose (reutilise le format JSON de `translate-workshop`),
  valide via la QA (3.2), et **exporte un patch / ouvre une PR** (pas d'ecriture
  serveur — le local-first est preserve : la contribution sort sous forme de
  fichier/PR GitHub).
- **DoD :** un visiteur peut proposer une traduction relue et l'exporter en PR.
- **Risques :** gros chantier ; ne pas introduire de backend — rester « export de
  patch ».

## 3.7 — Defi du jour + retention 🔴

- **Objectif :** boucle d'habitude complete (revenir chaque jour).
- **Impact :** 🔴 Revolutionnaire · **Difficulte :** Moyenne.
- **Etat actuel :** le Daily Challenge upstream a ete **retire** ; a recreer en
  version 100 % locale FR.
- **Comment faire :** tirage deterministe d'un challenge/quiz du jour (seed = date) ;
  notifications locales via la PWA (3.3) ; bilan hebdo (« +340 XP, 12 challenges »).
  S'appuie sur XP/series (2.4).
- **DoD :** un « defi du jour » FR + un rappel optionnel.

## 3.8 — Badges / succes / recompenses 🟠

- **Objectif :** multiplier les buts a court terme.
- **Impact :** 🟠 Eleve · **Difficulte :** Moyenne.
- **Comment faire :** systeme de succes (`fcc-achievements`) : 1er examen, 7 jours
  de serie, cert FR 100 %, « tueur de bugs »… ; deblocages cosmetiques (themes,
  avatars) finances par l'XP. S'appuie sur 2.4.
- **DoD :** des succes se debloquent et s'affichent au profil.

---

## 4. Pieges a eviter

- **Pas de backend / multi-utilisateur serveur.** Cela tuerait l'avantage
  local-first et la vie privee. Le « multi-appareil » passe par l'export/import
  (1.4), pas par un compte.
- **Ne pas elaguer l'historique git** (gros, herite de fCC) sans sauvegarde
  complete : operation destructive et a peser.
- **Ne pas multiplier les certifs « vides ».** La variete de contenu depend
  d'abord de la **vitesse de traduction** (CHANTIER 0), pas de nouvelles pages.
- **Ne jamais laisser un LLM ecrire les `.md` directement** : toujours via
  `extract → JSON → apply → verify`.
- **Marque/legal :** afficher clairement « non-officiel », ne pas laisser croire a
  une certification freeCodeCamp.org.

## 5. Suivi (checklist)

### Chantier 0 — systeme de traduction

- [x] 0. Traduction par Claude (phrasebook optionnel + lexique + QA + doc) — ✅ FINI

### Vague 1 — jours

- [ ] 1.1 Persister l'examen en cours — 🔄 EN COURS
- [ ] 1.2 Routing URL `cours-fr`
- [ ] 1.3 Celebration confetti (lib deja presente)
- [ ] 1.4 Export / Import du profil
- [ ] 1.5 Progression sur les cartes
- [ ] 1.6 Onboarding 1er lancement
- [ ] 1.7 Transitions + reduced-motion
- [ ] 1.8 « Reprendre ou j'en etais » global

### Vague 2 — semaines

- [ ] 2.1 Logique pure + tests vitest
- [ ] 2.2 CI taillee fork + elagage workflows herites
- [ ] 2.3 Persistance erreurs + SRS
- [ ] 2.4 XP / niveaux / series / heatmap
- [ ] 2.5 Explications de reponse
- [ ] 2.6 A11y : axe etendu + clavier
- [ ] 2.7 Identite visuelle FR (tokens)
- [ ] 2.8 Strategie upstream documentee

### Vague 3 — mois

- [x] 3.1 → remonte en CHANTIER 0 (traduction par Claude)
- [ ] 3.2 QA traduction + couverture %
- [ ] 3.3 PWA hors-ligne
- [ ] 3.4 Certificats verifiables
- [ ] 3.5 Types d'exercices varies
- [ ] 3.6 Contributeur de traduction in-app
- [ ] 3.7 Defi du jour + retention
- [ ] 3.8 Badges / succes

---

_Ce document est un plan vivant : cocher au fur et a mesure, et reprioriser selon
les retours d'usage. Regle d'or : chaque nouveau systeme metier arrive avec ses
tests._
