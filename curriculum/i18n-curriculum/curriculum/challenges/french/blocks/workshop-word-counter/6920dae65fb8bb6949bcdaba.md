---
id: 6920dae65fb8bb6949bcdaba
title: Étape 4
challengeType: 1
dashedName: step-4
---

# --description--

Pour voir comment se comporte la boucle à l'intérieur de `printCharacters`, appelle-la avec l'argument `"hello"`.

# --hints--

Tu dois appeler la fonction `printCharacters` avec `"hello"` comme argument.

```js
const codeWithoutJSComments = __helpers.removeJSComments(code);
const normalizedCode = __helpers.removeWhiteSpace(codeWithoutJSComments);
assert.match(normalizedCode, /printCharacters\(('|"|`)hello\1\)/);
```

# --seed--

## --seed-contents--

```js
function printCharacters(str) {
  for (const char of str) {
    console.log(char);
  }
}
--fcc-editable-region--

--fcc-editable-region--
```
