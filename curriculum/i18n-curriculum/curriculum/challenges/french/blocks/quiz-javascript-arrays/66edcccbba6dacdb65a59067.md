---
id: 66edcccbba6dacdb65a59067
title: Quiz sur les tableaux JavaScript
challengeType: 8
dashedName: quiz-javascript-arrays
---

# --description--

Pour réussir le quiz, tu dois répondre correctement à au moins 18 des 20 questions ci-dessous.

# --quizzes--

## --quiz--

### --question--

#### --text--

Quelle sera la sortie du code suivant ?

```js
const numbers = [1, 2, 3];
console.log(numbers[10]);
```

#### --distractors--

`[1, 2, 3]`

---

`null`

---

`10`

#### --answer--

`undefined`

### --question--

#### --text--

Laquelle des propositions suivantes est la bonne façon d'accéder à la chaîne `"Jessica"` dans le tableau `developers` ?

#### --distractors--

```js
const developers = ["Jessica", "Naomi", "Tom"];
developers[1]
```

---

```js
const developers = ["Jessica", "Naomi", "Tom"];
developers[2]
```

---

```js
const developers = ["Jessica", "Naomi", "Tom"];
developers[-1]
```

#### --answer--

```js
const developers = ["Jessica", "Naomi", "Tom"];
developers[0]
```

### --question--

#### --text--

Quelle valeur sera affectée à la variable `index` ?

```js
const numbers = [10, 20, 30, 40];
const index = numbers.indexOf(20);
console.log(index);
```

#### --distractors--

2

---

3

---

-1

#### --answer--

1

### --question--

#### --text--

Que fait la syntaxe rest ?

#### --distractors--

Elle est utilisée pour diviser une chaîne en un tableau de sous-chaînes.

---

Elle est utilisée pour ajouter ou supprimer des éléments à n'importe quelle position d'un tableau.

---

Elle est utilisée pour ajouter des éléments à la fin du tableau et retourne la nouvelle longueur.

#### --answer--

Elle capture les éléments restants d'un tableau dans un nouveau tableau.

### --question--

#### --text--

Qu'est-ce que la déstructuration de tableaux ?

#### --distractors--

Elle est utilisée pour concaténer tous les éléments d'un tableau en une seule chaîne.

---

Elle est utilisée pour vérifier si un tableau contient une valeur précise.

---

Elle est utilisée pour supprimer le dernier élément d'un tableau et retourne cet élément supprimé.

#### --answer--

Elle est utilisée pour extraire des valeurs des tableaux et les affecter à des variables d'une façon plus concise et lisible.

### --question--

#### --text--

Quelle valeur sera affectée à la variable `arr2` ?

```js
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
console.log(arr2);
```

#### --distractors--

`[4, 5, 1, 2, 3]`

---

`[1, 2, [3, 4, 5]]`

---

`[1, 2, 3]`

#### --answer--

`[1, 2, 3, 4, 5]`

### --question--

#### --text--

Qu'est-ce que ce code affichera dans la console ?

```js
const colors = ["red", "blue", "green", "yellow"];
colors.splice(1, 2, "purple");
console.log(colors);
```

#### --distractors--

`["red", "blue", "green", "yellow"]`

---

`["red", "blue", "yellow"]`

---

`["red", "yellow"]`

#### --answer--

`["red", "purple", "yellow"]`

### --question--

#### --text--

Quelle valeur sera affectée à la variable `slicedArr` ?

```js
const arr = ["apple", "banana", "cherry", "date"];
const slicedArr = arr.slice(1, 3);
console.log(slicedArr);
```

#### --distractors--

`["apple", "banana"]`

---

`["cherry", "date"]`

---

`["apple", "cherry"]`

#### --answer--

`["banana", "cherry"]`

### --question--

#### --text--

Quelle méthode retourne le premier index d'un élément donné dans un tableau ?

#### --distractors--

`firstIndex()`

---

`lastIndex()`

---

`searchIndex()`

#### --answer--

`indexOf()`

### --question--

#### --text--

Quelle méthode est utilisée pour supprimer le premier élément d'un tableau et retourne cet élément supprimé ?

#### --distractors--

`pop()`

---

`slice()`

---

`splice()`

#### --answer--

`shift()`

### --question--

#### --text--

Que fait la méthode `concat()` ?

#### --distractors--

Elle joint les éléments d'un tableau en une chaîne.

---

Elle ajoute un élément au début d'un tableau.

---

Elle supprime un élément du tableau.

#### --answer--

Elle fusionne deux tableaux en un nouveau tableau.

### --question--

#### --text--

Quelle sera la sortie de ce code ?

```js
const fruits = ["apple", "banana", "cherry", "apple", "orange"];

fruits.splice(0, 1);

console.log(fruits);
```

#### --distractors--

`["apple", "banana", "cherry", "apple", "orange"]`

---

`["apple", "banana", "cherry"]`

---

`["cherry", 'apple']`

#### --answer--

`["banana", "cherry", "apple", "orange"]`

### --question--

#### --text--

Que fait la méthode `includes()` ?

#### --distractors--

Elle est utilisée pour diviser une chaîne en un tableau de sous-chaînes.

---

Elle est utilisée pour concaténer tous les éléments d'un tableau en une seule chaîne.

---

Elle est utilisée pour ajouter ou supprimer des éléments à n'importe quelle position d'un tableau.

#### --answer--

Elle est utilisée pour vérifier si un tableau contient une valeur précise.

### --question--

#### --text--

Laquelle des méthodes suivantes est utilisée pour inverser un tableau sur place ?

#### --distractors--

`reversed()`

---

`reverseArr()`

---

`reversing()`

#### --answer--

`reverse()`

### --question--

#### --text--

Qu'est-ce qu'un tableau à deux dimensions ?

#### --distractors--

Un tableau qui ne contient que des littéraux d'objet.

---

Un tableau de longueur fixe.

---

Un tableau de nombres à virgule flottante.

#### --answer--

Un tableau de tableaux.

### --question--

#### --text--

Laquelle des propositions suivantes est vraie à propos de la méthode `indexOf()` pour les tableaux ?

#### --distractors--

Elle retourne toujours la dernière occurrence de l'élément.

---

Elle déclenche une erreur si l'élément est introuvable.

---

Elle nécessite que le tableau soit trié.

#### --answer--

Elle retourne `-1` si l'élément est introuvable.

### --question--

#### --text--

Laquelle des propositions suivantes n'est PAS une méthode de tableau ?

#### --distractors--

`includes()`

---

`pop()`

---

`push()`

#### --answer--

`trim()`

### --question--

#### --text--

Quelle sera la sortie du code suivant ?

```js
const arr = ["o", "l", "l", "e", "h"];
console.log(arr.join(""));
```

#### --distractors--

`["o", "l", "l", "e", "h"]`

---

`"hello"`

---

`undefined`

#### --answer--

`"olleh"`

### --question--

#### --text--

Quel sera le résultat de l'utilisation de la méthode `shift()` sur un tableau vide ?


#### --distractors--

`TypeError`

---

`[]`

---

`null`

#### --answer--

`undefined`

### --question--

#### --text--

Quelle méthode retourne un nouveau tableau sans modifier le tableau d'origine ?

#### --distractors--

`shift()`

---

`pop()`

---

`push()`

#### --answer--

`slice()`
