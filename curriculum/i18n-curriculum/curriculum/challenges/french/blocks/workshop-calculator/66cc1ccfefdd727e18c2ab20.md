---
id: 66cc1ccfefdd727e18c2ab20
title: Étape 14
challengeType: 1
dashedName: step-14
---

# --description--

Ta fonction `calculateQuotient` semble fonctionner correctement, mais il y a un cas que tu n'as pas encore testé.

Ajoute un `console.log` qui appelle la fonction `calculateQuotient` avec les arguments `3` et `0`.

Assure-toi de bien regarder la sortie de cet appel.

# --hints--

Tu dois avoir un `console.log` qui appelle la fonction `calculateQuotient` avec les arguments `3` et `0`.

```js
assert.match(code, /console\.log\s*\(\s*calculateQuotient\s*\(\s*3\s*,\s*0\s*\)\s*\)\s*;?/);
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

function calculateQuotient(num1, num2) {
  return num1 / num2;
}

console.log(calculateQuotient(7, 11));

--fcc-editable-region--

--fcc-editable-region--
```
