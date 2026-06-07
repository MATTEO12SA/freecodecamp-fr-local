---
id: adf08ec01beb4f99fc7a68f2
title: Implémente un filtre de valeurs falsy
challengeType: 26
dashedName: implement-a-falsy-remover
---

# --description--

Dans ce lab, tu vas créer une fonction qui supprime toutes les valeurs falsy d'un tableau.

Les valeurs falsy en JavaScript sont `false`, `null`, `0`, `""`, `undefined` et `NaN`.

**Objectif :** réalise les user stories ci-dessous et fais passer tous les tests pour terminer le lab.

**User stories :**

1. Tu dois avoir une fonction `bouncer` qui prend un tableau en argument.
1. La fonction `bouncer` doit renvoyer un nouveau tableau qui contient les mêmes éléments que le tableau passé en argument, sans les éléments falsy.
1. La fonction `bouncer` ne doit pas modifier le tableau passé en argument.

Indice : essaie de convertir chaque valeur en booléen.

# --hints--

Tu dois avoir une fonction `bouncer`.

```js
assert.isFunction(bouncer);
```

`bouncer([7, "ate", "", false, 9])` doit renvoyer `[7, "ate", 9]`.

```js
assert.deepEqual(bouncer([7, 'ate', '', false, 9]), [7, 'ate', 9]);
```

`bouncer(["a", "b", "c"])` doit renvoyer `["a", "b", "c"]`.

```js
assert.deepEqual(bouncer(['a', 'b', 'c']), ['a', 'b', 'c']);
```

`bouncer([false, null, 0, NaN, undefined, ""])` doit renvoyer `[]`.

```js
assert.deepEqual(bouncer([false, null, 0, NaN, undefined, '']), []);
```

`bouncer([null, NaN, 1, 2, undefined])` doit renvoyer `[1, 2]`.

```js
assert.deepEqual(bouncer([null, NaN, 1, 2, undefined]), [1, 2]);
```

La fonction `bouncer` ne doit pas muter le tableau passé en argument.

```js
const arr = ['a', false, 0, 'Naomi'];
bouncer(arr);
assert.deepEqual(arr, ['a', false, 0, 'Naomi']);
```

`bouncer([])` doit renvoyer `[]`.

```js
assert.deepEqual(bouncer([]), []);
```

# --seed--

## --seed-contents--

```js

```

# --solutions--

```js
function bouncer(arr) {
  return arr.filter(e => e);
}
```
