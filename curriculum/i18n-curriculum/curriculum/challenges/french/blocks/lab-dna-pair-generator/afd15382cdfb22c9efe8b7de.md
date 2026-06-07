---
id: afd15382cdfb22c9efe8b7de
title: Implémente un générateur de paires ADN
challengeType: 26
dashedName: implement-a-dna-pair-generator
---

# --description--

Dans la double hélice de l'ADN, les bases sont toujours appariées : si sur un brin il y a une base <em>A</em>, sur l'autre brin directement en face il y a une base <em>T</em>, l'autre paire est <em>C</em> et <em>G</em>.

Dans ce lab, tu vas écrire une fonction pour trouver les paires de bases manquantes pour le brin d'ADN fourni. Pour chaque caractère de la chaîne fournie, trouve le caractère de la base appariée.

Par exemple, pour l'entrée `ATCG`, renvoie `[["A", "T"], ["T", "A"], ["C", "G"], ["G", "C"]]`

La base <em>A</em> s'apparie avec une base <em>T</em>, la base <em>T</em> s'apparie avec une base <em>A</em>, la <em>C</em> s'apparie avec la base <em>G</em>, et enfin la base <em>G</em> s'apparie avec une base <em>C</em>.

**Objectif :** réalise les user stories ci-dessous et fais passer tous les tests pour terminer le lab.

**User stories :**

1. Tu dois avoir une fonction `pairElement` qui prend une chaîne de n'importe quelle longueur en argument.
1. La fonction `pairElement` doit renvoyer un tableau 2D, où chaque sous-tableau contient deux chaînes : la première est une base de l'entrée, et la seconde est la base appariée.
1. Lorsqu'on lui donne `A`, la fonction doit l'apparier avec `T`.
1. Lorsqu'on lui donne `T`, la fonction doit l'apparier avec `A`.
1. Lorsqu'on lui donne `C`, la fonction doit l'apparier avec `G`.
1. Lorsqu'on lui donne `G`, la fonction doit l'apparier avec `C`.

# --hints--

Tu dois créer une fonction nommée `pairElement`.

```js
assert.isFunction(pairElement);
```

`pairElement` doit prendre un seul argument.

```js
assert.lengthOf(pairElement, 1);
```

`pairElement("ATCGA")` doit renvoyer `[["A","T"],["T","A"],["C","G"],["G","C"],["A","T"]]`.

```js
assert.deepEqual(pairElement('ATCGA'), [
  ['A', 'T'],
  ['T', 'A'],
  ['C', 'G'],
  ['G', 'C'],
  ['A', 'T']
]);
```

`pairElement("TTGAG")` doit renvoyer `[["T","A"],["T","A"],["G","C"],["A","T"],["G","C"]]`.

```js
assert.deepEqual(pairElement('TTGAG'), [
  ['T', 'A'],
  ['T', 'A'],
  ['G', 'C'],
  ['A', 'T'],
  ['G', 'C']
]);
```

`pairElement("CTCTA")` doit renvoyer `[["C","G"],["T","A"],["C","G"],["T","A"],["A","T"]]`.

```js
assert.deepEqual(pairElement('CTCTA'), [
  ['C', 'G'],
  ['T', 'A'],
  ['C', 'G'],
  ['T', 'A'],
  ['A', 'T']
]);
```

# --seed--

## --seed-contents--

```js

```

# --solutions--

```js
var lookup = Object.create(null);
lookup.A = 'T';
lookup.T = 'A';
lookup.C = 'G';
lookup.G = 'C';

function pairElement(str) {
 return str.split('').map(function(p) {return [p, lookup[p]];});
}
```
