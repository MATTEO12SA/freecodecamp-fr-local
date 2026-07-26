---
id: ae9defd7acaf69703ab432ea
title: Implémente un calculateur de PPCM sur une plage
challengeType: 26
dashedName: implement-a-range-based-lcm-calculator
---

# --description--

Dans ce lab, tu vas créer une fonction qui prend un tableau de deux nombres et renvoie le plus petit commun multiple (PPCM) de ces deux nombres et de tous les nombres compris entre eux.

**Objectif** : réalise les user stories ci-dessous et fais passer tous les tests pour terminer le lab.

**User stories**

1. Tu dois avoir une fonction `smallestCommons` qui accepte un tableau de deux nombres comme argument.
1. La fonction `smallestCommons` doit renvoyer le plus petit commun multiple divisible sans reste par les deux nombres et par tous les nombres successifs dans la plage entre eux.
1. La fonction doit gérer les entrées où les deux nombres ne sont pas dans l'ordre numérique.

# --hints--

Tu dois avoir une fonction `smallestCommons`.

```js
assert.isFunction(smallestCommons);
```

`smallestCommons([1, 5])` doit renvoyer un nombre.

```js
assert.isNumber(smallestCommons([1, 5]));
```

`smallestCommons([1, 5])` doit renvoyer `60`.

```js
assert.strictEqual(smallestCommons([1, 5]), 60);
```

`smallestCommons([5, 1])` doit renvoyer `60`.

```js
assert.strictEqual(smallestCommons([5, 1]), 60);
```

`smallestCommons([2, 10])` doit renvoyer `2520`.

```js
assert.strictEqual(smallestCommons([2, 10]), 2520);
```

`smallestCommons([1, 13])` doit renvoyer `360360`.

```js
assert.strictEqual(smallestCommons([1, 13]), 360360);
```

`smallestCommons([23, 18])` doit renvoyer `6056820`.

```js
assert.strictEqual(smallestCommons([23, 18]), 6056820);
```

# --seed--

## --seed-contents--

```js

```

# --solutions--

```js
function smallestCommons(arr) {
  let [min, max] = arr.sort((a, b) => a - b);

  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  function lcm(a, b) {
    return (a * b) / gcd(a, b);
  }

  let multiple = min;

  for (let i = min + 1; i <= max; i++) {
    multiple = lcm(multiple, i);
  }

  return multiple;
}
```
