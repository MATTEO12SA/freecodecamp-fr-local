---
id: 6732b28eeadda1158cdbff7b
title: 'Comment vérifier si un tableau contient une certaine valeur ?'
challengeType: 19
dashedName: how-can-you-check-if-an-array-contains-a-certain-value
---

# --interactive--

En JavaScript, la méthode `includes()` est un moyen simple et efficace de vérifier si un tableau contient une valeur précise. Cette méthode retourne une valeur booléenne : `true` si le tableau contient l'élément spécifié, et `false` sinon.

La méthode `includes()` est particulièrement utile lorsque tu as besoin de vérifier rapidement la présence d'un élément dans un tableau sans avoir besoin de connaître sa position exacte. Commençons par un exemple d'utilisation de la méthode `includes()` :

:::interactive_editor

```js
let fruits = ["apple", "banana", "orange", "mango"];
console.log(fruits.includes("banana")); // true
console.log(fruits.includes("grape"));  // false
```

:::

Dans cet exemple, nous avons un tableau de fruits. Nous utilisons la méthode `includes()` pour vérifier si `banana` est dans le tableau. Elle retourne `true` car `banana` est bien présent. Nous vérifions ensuite `grape`, ce qui retourne `false` car il n'est pas dans le tableau.

La méthode `includes()` est sensible à la casse lorsqu'elle traite des chaînes. Cela signifie que `Banana` avec un B majuscule et `banana` tout en minuscules sont considérés comme des valeurs différentes. Voici un exemple qui illustre cela :

:::interactive_editor

```js
let fruits = ["apple", "banana", "orange"];
console.log(fruits.includes("banana")); // true
console.log(fruits.includes("Banana")); // false
```

:::

Dans ce cas, `banana` (tout en minuscules) est trouvé dans le tableau, mais `Banana` (avec la première lettre en majuscule) ne l'est pas, donc le second appel à `includes()` retourne `false`.

La méthode `includes()` peut aussi accepter un second paramètre optionnel qui indique la position dans le tableau où commencer la recherche. C'est utile si tu veux vérifier la présence d'un élément dans une partie précise du tableau. Voici comment utiliser cette fonctionnalité :

:::interactive_editor

```js
let numbers = [10, 20, 30, 40, 50, 30, 60];
console.log(numbers.includes(30, 3)); // true
console.log(numbers.includes(30, 4)); // true
```

:::

Pour le premier `console.log`, nous recherchons le nombre `30` à partir de l'index `3`. Dans ce cas, il y a un nombre `30` qui apparaît après l'index `3`, donc la méthode `includes()` retourne `true`.

Il en va de même pour le second `console.log`. Nous recherchons le nombre `30` à partir de l'index `4`. Comme le nombre `30` apparaît bien après cet index, elle retournera `true`.

Il est utile de noter que `includes()` utilise la comparaison d'égalité stricte (`===`), ce qui signifie qu'elle peut distinguer les différents types. Par exemple :

:::interactive_editor

```js
let mixedArray = [1, "2", 3, "4", 5];
console.log(mixedArray.includes(2));  // false
console.log(mixedArray.includes("2")); // true
```

:::

Dans ce cas, le nombre `2` et la chaîne `"2"` sont considérés comme des types de données différents. Donc, le premier `console.log` retournera `false`, tandis que le second `console.log` retournera `true`.

La méthode `includes()` est un outil puissant pour vérifier la présence d'éléments dans les tableaux. Elle est simple à utiliser, efficace, et peut t'éviter d'écrire des boucles ou des conditions plus complexes pour parcourir les tableaux. Que tu travailles avec des chaînes, des nombres ou des types de données mixtes, `includes()` offre un moyen direct de vérifier si une valeur existe dans ton tableau.

# --questions--

## --text--

Quelle sera la sortie du code suivant ?

```js
let arr = [1, 2, 3, 4, 5];
console.log(arr.includes(3, 3));
```

## --answers--

`true`

### --feedback--

Le second paramètre de `includes()` indique la position de départ de la recherche.

---

`false`

---

`undefined`

### --feedback--

Le second paramètre de `includes()` indique la position de départ de la recherche.

---

Cela déclenchera une erreur.

### --feedback--

Le second paramètre de `includes()` indique la position de départ de la recherche.

## --video-solution--

2

## --text--

Quelle sera la sortie du code suivant ?

```js
let arr = ["a", "b", "c", "d", "e"];
console.log(arr.includes("C"));
```

## --answers--

`true`

### --feedback--

Souviens-toi que `includes()` est sensible à la casse lorsqu'elle traite des chaînes.

---

`false`

---

`undefined`

### --feedback--

Souviens-toi que `includes()` est sensible à la casse lorsqu'elle traite des chaînes.

---

Cela déclenchera une erreur.

### --feedback--

Souviens-toi que `includes()` est sensible à la casse lorsqu'elle traite des chaînes.

## --video-solution--

2

## --text--

Quelle sera la sortie du code suivant ?

```js
let arr = [1, "2", 3, "4", 5];
console.log(arr.includes("3"));
```

## --answers--

`true`

### --feedback--

La méthode `includes()` utilise l'égalité stricte (`===`) pour la comparaison.

---

`false`

---

`undefined`

### --feedback--

La méthode `includes()` utilise l'égalité stricte (`===`) pour la comparaison.

---

Cela déclenchera une erreur.

### --feedback--

La méthode `includes()` utilise l'égalité stricte (`===`) pour la comparaison.

## --video-solution--

2
