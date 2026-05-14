# Documentation Du Fork FR Local

Ce repo est une version locale de freeCodeCamp : un client Gatsby en francais, sans compte, sans backend obligatoire et sans liens de navigation vers des sites externes.

## Architecture Locale

- `dev.ps1` lance le client sur `http://localhost:8000`.
- `client/src/redux/fetch-user-saga.js` cree un utilisateur local au lieu d'appeler une session serveur.
- `client/src/utils/local-progress.ts` lit et ecrit la progression dans `localStorage`.
- `client/src/redux/local-progress-epic.js` persiste les challenges termines apres `submitComplete`.
- `client/src/utils/ajax.ts` garde les signatures HTTP attendues par le code, mais renvoie des reponses locales pour eviter la dependance backend.
- `CLIENT_LOCALE=french` et `CURRICULUM_LOCALE=french` pilotent l'interface et le curriculum francais.

## Interface Et Navigation

- La home pointe vers `/cours-fr`.
- `/cours-fr` affiche les cours en francais et garde un fallback anglais pour les exercices compatibles localement.
- Les contenus non compatibles avec le mode local sont filtres du dossier FR, notamment daily challenge, CodeAlly, Ona, Codespaces, examens serveur, MS Trophy et projets qui exigent des services externes.
- Le layout principal neutralise les ancres externes restantes au rendu : elles ne gardent pas de `href`, pas de `target`, et ne peuvent pas sortir du site local.
- Les liens Markdown externes dans `/cours-fr` sont rendus comme texte desactive.

## Nettoyage Strict Effectue

Fonctionnalites retirees ou neutralisees :

- Defi du jour : widget `/learn`, routes `/learn/daily-coding-challenge/*`, calendrier, archive et breadcrumb supprimes.
- Forum/aide : `HelpModal` retourne `null`, l'epic de creation de question forum est supprime, les boutons d'aide visibles sont retires.
- Donations : composants Donation et saga donation supprimes du client.
- App mobile : `MobileAppModal` retourne `null`.
- Partage social : composant `share` supprime et boutons retires des jaws d'exercices.
- CodeAlly/Ona/Codespaces : instructions et boutons de lancement remplaces par messages locaux desactives.
- Pages inutiles localement : `/blocked` et `/status/version` supprimees.
- Scripts obsoletes de diagnostic, traduction ponctuelle et screenshots supprimes.

Ce qui reste volontairement :

- Les constantes et types daily challenge partages peuvent rester quand ils protegent la compatibilite du build.
- Les templates upstream non visibles peuvent rester si les supprimer casserait Gatsby, TypeScript ou le fallback anglais.
- Les URLs techniques necessaires aux exercices, images, medias, CDN ou exemples de code ne sont pas traitees comme des liens de navigation.
- `preview-portal.tsx` utilise `window.open('', ...)` pour ouvrir une fenetre locale d'aperçu du code, pas un site externe.

## Curriculum Francais

Les fichiers traduits sont dans :

```text
curriculum/i18n-curriculum/curriculum/challenges/french/
```

Responsive Web Design v9 est la priorite. Plusieurs blocs sont deja en francais : plan du curriculum, debogage Camperbot, attributs HTML, adoption d'animaux, boilerplate, Cat Photo App, Recipe Page, Bookstore Page, SEO, Travel Agency, audio/video, Music Player et Cafe Menu.

Regles de traduction :

- Ne jamais traduire les tests, selecteurs, variables, URLs techniques et chaines exigees par les tests.
- Traduire les textes utilisateur en francais simple.
- Garder le fallback anglais pour les fichiers manquants.

## Scripts Gardes

```text
smoke-test.mjs
submit-test.mjs
persist-test.mjs
full-flow-test.mjs
```

Ces scripts utilisent `playwright` directement, sans chemin `.pnpm` fragile et sans dependance a Edge.

Scripts supprimes : anciens diagnostics, scripts de traduction ponctuelle, captures isolees et tests humains non maintenus.

## Verification

Commandes recommandees :

```powershell
pnpm -C curriculum lint-challenges
pnpm exec tsc --noEmit --pretty false -p client/tsconfig.json
pnpm --filter @freecodecamp/shared type-check
```

Verification manuelle :

1. Lancer `.\dev.ps1 -Clean`.
2. Ouvrir `/`, `/learn` et `/cours-fr`.
3. Verifier que le defi du jour n'apparait plus.
4. Ouvrir un exercice Responsive Web Design traduit.
5. Ouvrir un exercice en fallback anglais compatible.
6. Confirmer qu'aucun lien visible ne sort vers forum, donation, app mobile, social, CodeAlly, Ona, GitHub externe ou Okta.

## Limites Connues

- Les certificats PDF et examens serveur ne sont pas operationnels localement.
- Certains composants upstream restent dans le code car ils sont partages par le build ou les types, meme s'ils ne sont plus visibles.
- Si un nouveau composant upstream ajoute un lien externe, la garde globale le bloque au clic, mais il faut aussi le retirer proprement si ce composant devient visible.
