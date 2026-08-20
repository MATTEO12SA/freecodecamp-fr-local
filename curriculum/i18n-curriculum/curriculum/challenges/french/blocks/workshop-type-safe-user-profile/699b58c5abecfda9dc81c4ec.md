---
id: 699b58c5abecfda9dc81c4ec
title: Étape 3
challengeType: 1
dashedName: step-3
---

# --description--

Pour l’instant, l’objet `profile` n’a que trois propriétés. Mais ce serait bien d’en avoir quelques-unes de plus.

Ajoute une propriété appelée `mood` à l’objet `profile`. Sa valeur doit être `null`.

# --hints--

Ton objet `profile` doit avoir une propriété `mood`.

```js
assert.property(profile, "mood");
```

Ta propriété `mood` doit avoir la valeur `null`.

```js
assert.isNull(profile?.mood);
```

# --seed--

## --seed-contents--

```ts
--fcc-editable-region--
const profile = {
  username: "codeLearner",
  age: 25,
  isLoggedIn: false,

}
--fcc-editable-region--

console.log(profile);
```
