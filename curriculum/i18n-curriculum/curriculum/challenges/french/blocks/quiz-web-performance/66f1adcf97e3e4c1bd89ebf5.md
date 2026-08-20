---
id: 66f1adcf97e3e4c1bd89ebf5
title: 'Quiz : performance web'
challengeType: 8
dashedName: quiz-web-performance
---

# --description--

Pour réussir le quiz, tu dois répondre correctement à au moins 18 des 20 questions ci-dessous.

# --quizzes--

## --quiz--

### --question--

#### --text--

Quelle est la différence clé entre performance réelle et performance perçue en développement web ?

#### --distractors--

La performance réelle se concentre sur le nombre de requêtes HTTP faites par le navigateur, tandis que la performance perçue repose sur la vitesse de rendu CSS.

---

La performance réelle ne concerne que les temps de chargement, tandis que la performance perçue concerne des éléments visuels comme les animations et les indicateurs de chargement.

---

La performance réelle n'inclut que les temps de traitement côté serveur, tandis que la performance perçue est entièrement côté client.

#### --answer--

La performance réelle est la vitesse à laquelle le contenu est chargé, tandis que la performance perçue est la vitesse à laquelle les utilisateurs croient que la page se charge.

### --question--

#### --text--

Quelle métrique indique le mieux la vitesse à laquelle le contenu apparaît sur une page web ?

#### --distractors--

Time to Interactive (TTI)

---

Page Load Time (PLT)

---

Last Contentful Paint (LCP)

#### --answer--

First Contentful Paint (FCP)

### --question--

#### --text--

Laquelle des options suivantes N'EST PAS une façon de réduire les temps de chargement ?

#### --distractors--

Optimiser les médias.

---

Tirer parti du cache navigateur.

---

Minifier et compresser les fichiers.

#### --answer--

Utiliser uniquement des fichiers JPEG.

### --question--

#### --text--

Qu'est-ce que le « time to usable » ?

#### --distractors--

C'est l'intervalle entre la demande d'une page par l'utilisateur et le moment où il peut interagir avec les formulaires de la page.

---

C'est le temps nécessaire pour que toutes les images et animations deviennent disponibles et utilisables.

---

C'est le temps nécessaire pour que toutes les animations CSS et JavaScript se chargent à l'écran.

#### --answer--

C'est l'intervalle entre la demande d'une page par l'utilisateur et le moment où il peut interagir utilement avec elle.

### --question--

#### --text--

Que mesure le First Contentful Paint (FCP) ?

#### --distractors--

Le temps de chargement global de tous les fichiers JavaScript de la page.

---

Le délai avant qu'un utilisateur puisse interagir avec n'importe quel élément de la page.

---

Le temps nécessaire pour que toutes les feuilles de style se chargent et s'appliquent entièrement.

#### --answer--

Le temps qu'il faut pour que le premier morceau de texte ou d'image soit rendu.

### --question--

#### --text--

Lequel des outils suivants N'EST PAS un outil de mesure de performance couramment utilisé ?

#### --distractors--

Chrome DevTools

---

Lighthouse

---

WebPageTest

#### --answer--

WebMeasure

### --question--

#### --text--

À quoi servent les Performance Web APIs ?

#### --distractors--

Elles servent uniquement à mesurer la performance des animations CSS.

---

Elles servent à accélérer automatiquement la performance d'une page web.

---

Elles fournissent un tableau détaillé de métriques de performance pour l'utilisateur.

#### --answer--

Elles permettent aux développeurs de suivre dans le code l'efficacité du chargement et de la réactivité d'une page.

### --question--

#### --text--

Quelle stratégie peut efficacement améliorer la performance perçue ?

#### --distractors--

Utiliser de grandes images pour améliorer la qualité visuelle globale.

---

Charger les styles CSS en dernier pour prioriser le rendu du contenu.

---

Précharger tous les scripts pour qu'ils soient prêts quand on en a besoin.

#### --answer--

Afficher un squelette de chargement pendant que le contenu est récupéré.

### --question--

#### --text--

Lequel des termes suivants désigne le temps qu'une requête met pour aller du navigateur au serveur ?

#### --distractors--

rendering

---

INP

---

CDN

#### --answer--

latency

### --question--

#### --text--

Comment l'optimisation du CSS impacte-t-elle la performance de la page ?

#### --distractors--

Elle empêche le navigateur d'exécuter du JavaScript inutile.

---

Elle réduit la taille globale des fichiers images.

---

Elle élimine le besoin de lazy-loader les images.

#### --answer--

Elle accélère le parsing du HTML.

### --question--

#### --text--

Lequel des éléments suivants montre combien de temps le thread principal est bloqué par de lourdes tâches JavaScript ?

#### --distractors--

Source order

---

Bounce rate

---

WebPageTest

#### --answer--

Total Blocking Time

### --question--

#### --text--

Lorsqu'on mesure l'Interaction to Next Paint (INP), qu'évalue-t-on ?

#### --distractors--

Le temps qu'il faut à la page pour charger entièrement tous les styles et images après une interaction utilisateur.

---

Le délai entre l'interaction d'un utilisateur et la capacité du navigateur à enregistrer la prochaine saisie.

---

L'intervalle entre l'exécution JavaScript et le rafraîchissement du contenu de la page par le navigateur.

#### --answer--

Le temps entre l'interaction d'un utilisateur et la réponse du navigateur en rendant la prochaine frame.

### --question--

#### --text--

Laquelle des APIs suivantes te donne des horodatages haute précision (en millisecondes) pour mesurer combien de temps différentes parties de ton site mettent à charger ?

#### --distractors--

`performance.delay()`

---

`performance.previous()`

---

`performance.next()`

#### --answer--

`performance.now()`

### --question--

#### --text--

Laquelle des APIs suivantes te donne une décomposition de chaque étape du chargement de page, de la résolution DNS à `DOMContentLoaded` ?

#### --distractors--

Permit Timing API

---

Performance Text API

---

Perform Timing API

#### --answer--

Performance Timing API

### --question--

#### --text--

Lequel des éléments suivants écoute les événements de performance comme les layout shifts, les longues tâches et les interactions utilisateur ?

#### --distractors--

```js
const observer = new PermitObserve((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`Long task detected: ${entry.duration}ms`);
  });
});

observer.observe({ type: "longtask", buffered: true });
```

---

```js
const observer = new PerformObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`Long task detected: ${entry.duration}ms`);
  });
});

observer.observe({ type: "longtask", buffered: true });
```

---

```js
const observer = new PermitObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`Long task detected: ${entry.duration}ms`);
  });
});

observer.observe({ type: "longtask", buffered: true });
```

#### --answer--

```js
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`Long task detected: ${entry.duration}ms`);
  });
});

observer.observe({ type: "longtask", buffered: true });
```

### --question--

#### --text--

Comment le lazy loading des images améliore-t-il la performance de la page ?

#### --distractors--

Il s'assure que toutes les images se chargent immédiatement pour une meilleure expérience utilisateur.

---

Il réduit la taille des fichiers images pour accélérer le chargement.

---

Il précharge les images pour éviter tout délai de chargement.

#### --answer--

Il retarde le chargement des images non essentielles jusqu'à ce qu'elles soient visibles.

### --question--

#### --text--

Qu'est-ce que le code splitting ?

#### --distractors--

Cela consiste à découper ton code React en modules qui n'exécutent que des tâches critiques

---

Cela consiste à découper ton code HTML en modules qui n'exécutent que des tâches non critiques.

---

Cela consiste à découper ton code CSS en modules qui exécutent des tâches critiques et non critiques.

#### --answer--

Cela consiste à découper ton code JavaScript en modules qui exécutent des tâches critiques et non critiques.

### --question--

#### --text--

Laquelle des options suivantes est la bonne façon de lazy-loader une image ?

#### --distractors--

```html
<img src="placeholder.jpg" lazy="loading">
```

---

```html
<img src="placeholder.jpg" load="lazy">
```

---

```html
<img src="placeholder.jpg" lazy="load">
```

#### --answer--

```html
<img src="placeholder.jpg" loading="lazy">
```

### --question--

#### --text--

Laquelle des options suivantes N'EST PAS une façon d'améliorer l'INP ?

#### --distractors--

Réduire le travail du thread principal en découpant les longues tâches JavaScript.

---

Optimiser les gestionnaires d'événements.

---

Différer ou lazy-loader les assets lourds.

#### --answer--

Utiliser uniquement des images PNG et JPEG.

### --question--

#### --text--

Pourquoi l'efficacité énergétique est-elle un aspect crucial de la performance web ?

#### --distractors--

Elle améliore l'attrait visuel global de la page.

---

Elle minimise la quantité de JavaScript utilisée sur une page.

---

Elle diminue le nombre de fichiers CSS nécessaires et accélère ton CSS.

#### --answer--

Elle réduit la charge sur le matériel, économise de l'énergie et améliore la durabilité.
