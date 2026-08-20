---
id: 6996cdf1f60cbc30eeeae1c9
title: Étape 12
challengeType: 1
dashedName: step-12
---

# --description--

Si la condition dans le `else if` est vraie, mets à jour la valeur de la variable `low` en ajoutant `1` à la variable `mid`.

Cela étendra la recherche à la moitié droite des zones de recherche actuelles dans la liste, parce que si `value` est supérieure à `valueAtMiddle`, cela signifie que `value` doit être dans la moitié droite de la zone de recherche actuelle.

# --hints--

Tu dois mettre à jour la variable `low` à `mid + 1`.

```js
assert.match(__helpers.removeJSComments(String(binarySearch)), /low\s*=\s*mid\s*\+\s*1/);
```

# --seed--

## --seed-contents--

```js
function binarySearch(searchList, value) {
  let pathToTarget = [];
  let low = 0;
  let high = searchList.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    let valueAtMiddle = searchList[mid];
    pathToTarget.push(valueAtMiddle);

    if (value === valueAtMiddle) {
      return pathToTarget;
    } else if (value > valueAtMiddle) {
--fcc-editable-region--

--fcc-editable-region--
    }

    break;
  }
  return [];
}

console.log(binarySearch([1, 2, 3, 4, 5], 3));
console.log(binarySearch([1, 2, 3, 4, 5, 9], 4));
```
