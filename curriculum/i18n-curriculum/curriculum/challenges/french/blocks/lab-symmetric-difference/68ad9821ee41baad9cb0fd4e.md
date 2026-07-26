---
id: 68ad9821ee41baad9cb0fd4e
title: Crée une fonction de différence symétrique
challengeType: 26
dashedName: lab-symmetric-difference
---

# --description--

Compare deux tableaux et renvoie un nouveau tableau contenant les éléments présents uniquement dans l'un des deux tableaux donnés, mais pas dans les deux. Autrement dit, renvoie la différence symétrique des deux tableaux.

Exemple :

- Tableau A : `["diamond", "stick", "apple"]`

- Tableau B : `["stick", "emerald", "bread"]`

Résultat : `["diamond", "apple", "emerald", "bread"]`

**Objectif :** réalise les user stories ci-dessous et fais passer tous les tests pour terminer le lab.

**User stories :**

1. Ta fonction `diffArray` doit renvoyer un tableau.
2. Ta fonction doit prendre deux arguments, tous les deux des tableaux.
3. Ta fonction doit utiliser la méthode `filter`.
4. Ta fonction doit renvoyer la différence symétrique des deux tableaux.
5. Ta fonction doit renvoyer un tableau vide s'il n'y a pas de différence symétrique.


# --hints--

Tu dois avoir une fonction nommée `diffArray`.

```js
assert.isFunction(diffArray);
```

La fonction `diffArray` doit utiliser la méthode `filter` pour filtrer les éléments présents dans les deux tableaux.

```js
assert(/\.filter\(/.test(diffArray.toString()));
```

`diffArray(["diorite", "andesite", "grass", "dirt", "pink wool", "dead shrub"], ["diorite", "andesite", "grass", "dirt", "dead shrub"])` doit renvoyer `["pink wool"]`.

```js
assert.deepEqual(diffArray(
  ["diorite", "andesite", "grass", "dirt", "pink wool", "dead shrub"],
  ["diorite", "andesite", "grass", "dirt", "dead shrub"]
), ["pink wool"]);
```

`diffArray(["diorite", "andesite", "grass", "dirt", "pink wool", "dead shrub"], ["andesite", "grass", "dirt", "dead shrub"])` doit renvoyer `["diorite", "pink wool"]`.

```js
assert.deepEqual(diffArray(
  ["diorite", "andesite", "grass", "dirt", "pink wool", "dead shrub"],
  ["andesite", "grass", "dirt", "dead shrub"]
), ["diorite", "pink wool"]);
```

`diffArray` doit renvoyer un tableau vide lorsqu'elle est appelée avec deux tableaux identiques.

```js
assert.deepEqual(diffArray(
  ["andesite", "grass", "dirt", "dead shrub"],
  ["andesite", "grass", "dirt", "dead shrub"]
), []);
```

`diffArray(["pen", "book"], ["book", "pencil", "notebook"])` doit renvoyer `["pen", "pencil", "notebook"]`.

```js
assert.deepEqual(diffArray(
  ["pen", "book"],
  ["book", "pencil", "notebook"]
), ["pen", "pencil", "notebook"]);
```

`diffArray(["car", "bike", "bus"], ["bike", "train", "plane", "bus"])` doit renvoyer `["car", "train", "plane"]`.

```js
assert.deepEqual(diffArray(
  ["car", "bike", "bus"],
  ["bike", "train", "plane", "bus"]
), ["car", "train", "plane"]);
```

`diffArray(["apple", "orange"], ["apple", "orange", "banana", "grape"])` doit renvoyer `["banana", "grape"]`.

```js
assert.deepEqual(diffArray(
  ["apple", "orange"],
  ["apple", "orange", "banana", "grape"]
), ["banana", "grape"]);
```

`diffArray([], ["apple", "banana"])` doit renvoyer `["apple", "banana"]`.

```js
assert.deepEqual(diffArray(
  [],
  ["apple", "banana"]
), ["apple", "banana"]);
```

`diffArray(["apple", "banana"], [])` doit renvoyer `["apple", "banana"]`.

```js
assert.deepEqual(diffArray(
  ["apple", "banana"],
  []
), ["apple", "banana"]);
```

`diffArray([], [])` doit renvoyer `[]`.

```js
assert.deepEqual(diffArray(
  [],
  []
), []);
```

# --seed--

## --seed-contents--

```js

```

# --solutions--

```js
function diffArray(arr1, arr2) {
  return arr1
    .filter(item => !arr2.includes(item))
    .concat(arr2.filter(item => !arr1.includes(item)));
}
```
