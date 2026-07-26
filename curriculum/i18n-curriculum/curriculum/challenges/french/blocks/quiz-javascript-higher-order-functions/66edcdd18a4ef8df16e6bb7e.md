---
id: 66edcdd18a4ef8df16e6bb7e
title: Quiz sur les fonctions d'ordre supérieur en JavaScript
challengeType: 8
dashedName: quiz-javascript-higher-order-functions
---

# --description--

Pour réussir le quiz, tu dois répondre correctement à au moins 18 des 20 questions ci-dessous.

# --quizzes--

## --quiz--

### --question--

#### --text--

Laquelle des affirmations suivantes sur les fonctions d'ordre supérieur en JavaScript n'est PAS vraie ?

#### --distractors--

Les fonctions d'ordre supérieur peuvent fortement améliorer la lisibilité et la maintenabilité du code en permettant d'utiliser des techniques de programmation fonctionnelle.

---

Les fonctions d'ordre supérieur comme map, filter et reduce sont des outils puissants pour manipuler des tableaux, mais elles ne sont pas propres à la programmation fonctionnelle.

---

Les fonctions d'ordre supérieur peuvent rendre le code plus complexe à comprendre, mais elles peuvent aussi mener à des solutions plus expressives et plus concises.

#### --answer--

Toutes les fonctions en JavaScript, y compris celles qui ne prennent pas ou ne renvoient pas d'autres fonctions, peuvent être classées comme fonctions d'ordre supérieur.

### --question--

#### --text--

Qu'est-ce qu'une fonction factory dans le contexte des fonctions d'ordre supérieur ?

#### --distractors--

Une fonction qui crée de nouvelles variables.

---

Une fonction qui fonctionne uniquement avec des chaînes.

---

Une fonction qui génère automatiquement des commentaires de code.

#### --answer--

Une fonction qui renvoie une nouvelle fonction selon des paramètres précis

### --question--

#### --text--

Après l'exécution du code, quelle sera la valeur de `forEachRes` et de `mapRes` ?

```js
const numbers = [1, 1, 1, 1, 1];
let sum = 0;
const forEachRes = numbers.forEach(num => {
  return (sum += num);
});
const mapRes = numbers.map(num => {
  return (sum += num);
});
```

#### --distractors--

`forEachRes` vaut `undefined` et `mapRes` vaut `[1,2,3,4,5]`

---

`forEachRes` vaut `0` et `mapRes` vaut `[1,2,3,4,5]`

---

`forEachRes` vaut `5` et `mapRes` vaut `[1,2,3,4,5]`

#### --answer--

`forEachRes` vaut `undefined` et `mapRes` vaut `[6,7,8,9,10]`

### --question--

#### --text--

Quel est le résultat de ce code ?

```js
[, undefined, 'a', 'b', { 20: 5 }].sort();
```

#### --distractors--

Éléments non pris en charge pour trier un tableau, donc erreur.

---

Aucune fonction de rappel fournie, donc erreur.

---

```js
[empty, 'a', 'b', undefined, { '20': 5 }]
```

#### --answer--

```js
[{ '20': 5 }, 'a', 'b', undefined, empty]
```

### --question--

#### --text--

Laquelle des affirmations suivantes décrit une fonction de rappel en JavaScript ?

#### --distractors--

Une fonction appelée immédiatement lors de sa déclaration.

---

Une fonction appelée avec un contexte précis.

---

Une fonction qui renvoie une autre fonction.

#### --answer--

Une fonction passée comme argument à une autre fonction, pour être exécutée par la logique de cette fonction.

### --question--

#### --text--

Quel est le résultat de l'utilisation de `reduce()` sur un tableau ?

#### --distractors--

Un booléen indiquant si certains éléments respectent une condition.

---

Un tableau avec tous les éléments réduits par la fonction de rappel spécifiée.

---

Un tableau de booléens.

#### --answer--

Cela varie selon la valeur initiale de l'accumulateur et la fonction de rappel.

### --question--

#### --text--

Comment la méthode `sort()` se comporte-t-elle si aucune fonction de comparaison n'est fournie lors d'un tri numérique ?

#### --distractors--

Elle remplit les emplacements vides avec `null`.

---

Elle renvoie un tableau de caractères spéciaux.

---

Elle trie le tableau dans l'ordre inverse.

#### --answer--

Elle trie le tableau comme des chaînes en se basant sur les unités de code UTF-16.

### --question--

#### --text--

Quel est le but de la méthode `some()` en JavaScript ?

#### --distractors--

Créer un nouveau tableau avec les résultats d'une fonction appliquée à chaque élément.

---

Parcourir un tableau sans produire de résultat.

---

Réduire un tableau à une seule valeur à partir d'une fonction de rappel.

#### --answer--

Déterminer si certains éléments d'un tableau passent un test précis.

### --question--

#### --text--

Lequel des exemples suivants est un exemple valide de chaînage de méthodes ?

#### --distractors--

```js
Math.random();
```

---

```js
array.push(1).pop();
```

---

```js
console.log('Hello');
```

#### --answer--

```js
str.toLowerCase().trim().replace(' ', '_');
```

### --question--

#### --text--

Quelle est la sortie du code suivant ?

```js
let numbers = [2, 4, 8, 10];

numbers.forEach(function(number) {
    console.log(number % 2);
});
```

#### --distractors--

`2 4 8 10`

---

`null null null null`

---

`1 2 4 5`

#### --answer--

`0 0 0 0`

### --question--

#### --text--

Quel est un avantage du chaînage de méthodes ?

#### --distractors--

Il optimise intrinsèquement les performances en réduisant le temps d'exécution des fonctions.

---

Il élimine le besoin de variables temporaires, mais peut augmenter l'utilisation de mémoire dans certains cas.

---

Il rend la gestion des erreurs et le débogage plus directs.

#### --answer--

Il favorise une syntaxe simplifiée et un code plus lisible en permettant plusieurs opérations dans une seule expression.

### --question--

#### --text--

Comment peux-tu trier un tableau d'objets selon une propriété précise avec la méthode `sort` ?

#### --distractors--

La méthode `sort` ne peut pas trier des objets.

---

Utilise la méthode `reverse` après le tri.

---

Convertis les objets en chaînes et trie-les.

#### --answer--

Utilise une fonction de comparaison qui compare les valeurs de la propriété.

### --question--

#### --text--

Dans le chaînage de méthodes, quelle pratique courante améliore la clarté et le débogage ?

#### --distractors--

Utiliser moins de méthodes dans la chaîne.

---

Éviter de chaîner les méthodes qui renvoient seulement des valeurs primitives.

---

Utiliser uniquement des méthodes intégrées.

#### --answer--

Découper les longues chaînes en plusieurs étapes.

### --question--

#### --text--

Quel est un inconvénient potentiel d'une utilisation excessive du chaînage de méthodes dans ton code ?

#### --distractors--

Cela ralentit l'exécution du code.

---

Cela empêche l'utilisation de commentaires.

---

Cela augmente la taille du fichier.

#### --answer--

Cela peut rendre le code plus difficile à déboguer.

### --question--

#### --text--

Quelle méthode utiliserais-tu pour déterminer si tous les éléments d'un tableau sont des chaînes ?

#### --distractors--

`some()`

---

`everyInstance()`

---

`filter()`

#### --answer--

`every()`

### --question--

#### --text--

Quelle sera la valeur de `originalArray` après l'exécution du code suivant ?

```js
const originalArray = [{ id: 1 }, { id: 2 }, { id: 3 }];
const filteredArray = originalArray.filter(item => item.id > 1);
filteredArray[0].id = 4;
```

#### --distractors--

`[{ id: 1 }, { id: 2 }, { id: 3 }]`

---

`[{ id: 1 }]`

---

`[{ id: 4 }, { id: 2 }, { id: 3 }]`

#### --answer--

`[{ id: 1 }, { id: 4 }, { id: 3 }]`
### --question--

#### --text--

Quelle sera la valeur de `shortWords` après l'exécution du code suivant ?

```js
const words = ['apple', 'banana', 'pear', 'kiwi'];
const shortWords = words.filter(word => word.length <= 5);
```

#### --distractors--

`[]`

---

`['pear', 'kiwi']`

---

`['apple', 'banana']`

#### --answer--

`['apple', 'pear', 'kiwi']`

### --question--

#### --text--

Quel est le but de fournir une valeur initiale comme argument à la méthode `reduce()` ?

#### --distractors--

Définir la longueur du tableau.

---

Limiter le nombre d'itérations.

---

Spécifier le type de retour de la fonction.

#### --answer--

Définir la valeur de départ de l'accumulateur.

### --question--

#### --text--

La méthode `map` peut-elle être utilisée sur des objets qui ne sont pas des tableaux ?

#### --distractors--

Oui, elle peut être utilisée sur n'importe quel objet.

---

Oui, mais seulement sur des objets avec des propriétés numériques.

---

Cela dépend de la version de JavaScript.

#### --answer--

Non, elle est spécialement conçue pour les tableaux.

### --question--

#### --text--

Quel est le but principal de la méthode `map` en JavaScript ?

#### --distractors--

Trier un tableau et renvoyer un nouveau tableau tout en conservant l'ordre d'origine.

---

Filtrer les éléments d'un tableau et supprimer ou ajouter des éléments selon une condition.

---

Trouver un élément précis dans un tableau et renvoyer son indice avec l'élément.

#### --answer--

Créer un nouveau tableau contenant les résultats de l'appel d'une fonction fournie sur chaque élément du tableau de départ.
