---
id: af2170cad53daa0770fabdea
title: Implémente l'algorithme des mutations
challengeType: 26
dashedName: implement-the-mutations-algorithm
---

# --description--

**Objectif :** réalise les user stories ci-dessous et fais passer tous les tests pour terminer le lab.

**User stories :**

1. Crée une fonction nommée `mutation` qui prend un tableau en argument.
1. `mutation` doit retourner `true` si la chaîne du premier élément du tableau contient toutes les lettres de la chaîne du deuxième élément du tableau, et `false` sinon. Par exemple :
    - `mutation(["hello", "Hello"])` doit retourner `true` car toutes les lettres de la deuxième chaîne sont présentes dans la première, sans tenir compte de la casse.
    - `mutation(["hello", "hey"])` doit retourner `false` car la chaîne `hello` ne contient pas de `y`.
    - `mutation(["Alien", "line"])` doit retourner `true` car toutes les lettres de `line` sont présentes dans `Alien`.

# --hints--

`mutation(["hello", "hey"])` doit retourner `false`.

```js
assert.isFalse(mutation(['hello', 'hey']));
```

`mutation(["hello", "Hello"])` doit retourner `true`.

```js
assert.isTrue(mutation(['hello', 'Hello']));
```

`mutation(["zyxwvutsrqponmlkjihgfedcba", "qrstu"])` doit retourner `true`.

```js
assert.isTrue(mutation(['zyxwvutsrqponmlkjihgfedcba', 'qrstu']));
```

`mutation(["Mary", "Army"])` doit retourner `true`.

```js
assert.isTrue(mutation(['Mary', 'Army']));
```

`mutation(["Mary", "Aarmy"])` doit retourner `true`.

```js
assert.isTrue(mutation(['Mary', 'Aarmy']));
```

`mutation(["Alien", "line"])` doit retourner `true`.

```js
assert.isTrue(mutation(['Alien', 'line']));
```

`mutation(["floor", "for"])` doit retourner `true`.

```js
assert.isTrue(mutation(['floor', 'for']));
```

`mutation(["hello", "neo"])` doit retourner `false`.

```js
assert.isFalse(mutation(['hello', 'neo']));
```

`mutation(["voodoo", "no"])` doit retourner `false`.

```js
assert.isFalse(mutation(['voodoo', 'no']));
```

`mutation(["ate", "date"])` doit retourner `false`.

```js
assert.isFalse(mutation(['ate', 'date']));
```

`mutation(["Tiger", "Zebra"])` doit retourner `false`.

```js
assert.isFalse(mutation(['Tiger', 'Zebra']));
```

`mutation(["Noel", "Ole"])` doit retourner `true`.

```js
assert.isTrue(mutation(['Noel', 'Ole']));
```

# --seed--

## --seed-contents--

```js
```

# --solutions--

```js
function mutation(arr) {
  let hash = Object.create(null);

  arr[0]
    .toLowerCase()
    .split('')
    .forEach(c => (hash[c] = true));

  return !arr[1]
    .toLowerCase()
    .split('')
    .filter(c => !hash[c]).length;
}

mutation(['hello', 'hey']);
```
