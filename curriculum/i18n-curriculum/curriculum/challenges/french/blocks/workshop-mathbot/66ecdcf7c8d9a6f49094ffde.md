---
id: 66ecdcf7c8d9a6f49094ffde
title: Étape 13
challengeType: 1
dashedName: step-13
---

# --description--

Dans les leçons précédentes, tu as appris que la méthode `Math.round()` arrondit la valeur à l'entier le plus proche.

Voici quelques exemples :

```js
Math.round(6.7); // 7
Math.round(3.2); // 3
```

Cela diffère des méthodes `Math.floor()` et `Math.ceil()`, qui arrondissent respectivement vers le bas et vers le haut à l'entier le plus proche.

Crée une nouvelle variable appelée `numRounded` et affecte le résultat de l'arrondi du nombre `2.7`. Ensuite, affiche la valeur de `numRounded` dans la console.

En dessous, crée une autre nouvelle variable appelée `numRounded2` et affecte le résultat de l'arrondi du nombre `11.2`. Ensuite, affiche la valeur de `numRounded2` dans la console.

# --hints--

Tu devrais avoir une variable appelée `numRounded`.

```js
assert.isNotNull(numRounded);
```

Tu devrais affecter le résultat de l'arrondi du nombre `2.7` à la variable `numRounded`.

```js
assert.equal(numRounded, 3);
```

Tu ne devrais pas coder en dur la valeur `3` pour la variable `numRounded`. Veille à utiliser la méthode `Math.round()`.

```js
assert.notMatch(code, /numRounded\s*=\s*3/);
```

Tu devrais afficher la valeur de `numRounded` dans la console.

```js
assert.match(code, /console\.log\(\s*numRounded\s*\)/);
```

Tu devrais avoir une variable appelée `numRounded2`.

```js
assert.isNotNull(numRounded2);
```

Tu devrais affecter le résultat de l'arrondi du nombre `11.2` à la variable `numRounded2`.

```js
assert.equal(numRounded2, 11);
```

Tu ne devrais pas coder en dur la valeur `11` pour la variable `numRounded2`. Veille à utiliser la méthode `Math.round()`.

```js
assert.notMatch(code, /numRounded2\s*=\s*11/);
```

Tu devrais afficher la valeur de `numRounded2` dans la console.

```js
assert.match(code, /console\.log\(\s*numRounded2\s*\)/);
```

# --seed--

## --seed-contents--

```js
const botName = "MathBot";
const greeting = `Hi there! My name is ${botName} and I am here to teach you about the Math object!`;

console.log(greeting);

console.log("The Math.random() method returns a pseudo random number greater than or equal to 0 and less than 1.");

const randomNum = Math.random();
console.log(randomNum);

console.log("Now, generate a random number between two values.");

const min = 1;
const max = 100;

const randomNum2 = Math.random() * (max - min) + min;
console.log(randomNum2);

console.log("The Math.floor() method rounds the value down to the nearest whole integer.");

const numRoundedDown = Math.floor(6.7);
console.log(numRoundedDown);

console.log("Now, generate a random integer between two values.");

const randomInt = Math.floor(Math.random() * (max - min) + min);
console.log(randomInt);

console.log("The Math.ceil() method rounds the value up to the nearest whole integer.");

const numRoundedUp = Math.ceil(3.2);
console.log(numRoundedUp);

console.log("The Math.round() method rounds the value to the nearest whole integer.");

--fcc-editable-region--

--fcc-editable-region--
```
