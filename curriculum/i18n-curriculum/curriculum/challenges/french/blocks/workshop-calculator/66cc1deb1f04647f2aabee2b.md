---
id: 66cc1deb1f04647f2aabee2b
title: Étape 15
challengeType: 1
dashedName: step-15
---

# --description--

Si tu regardes dans la console, tu verras la valeur `Infinity`. `Infinity` est une valeur spéciale en JavaScript qui représente un nombre supérieur à tout autre nombre.

La division par zéro n'est pas une opération valide en mathématiques.

Pour prendre en compte ce cas particulier, tu dois mettre à jour ta fonction `calculateQuotient` afin qu'elle vérifie plutôt si `num2` vaut zéro.

Si c'est le cas, la fonction doit retourner la chaîne `"Error: Division by zero"`. Sinon, elle doit retourner le résultat de la division de `num1` par `num2`.

# --hints--

Ta fonction `calculateQuotient` doit retourner la chaîne `"Error: Division by zero"` si `num2` vaut zéro.

```js
assert.strictEqual(calculateQuotient(10, 0), 'Error: Division by zero');
assert.strictEqual(calculateQuotient(3, 0), 'Error: Division by zero');
```

Ta fonction `calculateQuotient` doit retourner le résultat de la division de `num1` par `num2` si `num2` n'est pas zéro.

```js
assert.strictEqual(calculateQuotient(10, 2), 5);
assert.strictEqual(calculateQuotient(3, 3), 1);
```

# --seed--

## --seed-contents--

```js
function calculateSum(num1, num2) {
  return num1 + num2;
}

console.log(calculateSum(2, 5));
console.log(calculateSum(10, 10));
console.log(calculateSum(5, 5));

function calculateDifference(num1, num2) {
  return num1 - num2;
}

console.log(calculateDifference(22, 5));
console.log(calculateDifference(12, 1));
console.log(calculateDifference(17, 9));

function calculateProduct(num1, num2) {
  return num1 * num2;
}

console.log(calculateProduct(13, 5));

--fcc-editable-region--
function calculateQuotient(num1, num2) {
  return num1 / num2;
}
--fcc-editable-region--

console.log(calculateQuotient(7, 11));
console.log(calculateQuotient(3, 0));
```
