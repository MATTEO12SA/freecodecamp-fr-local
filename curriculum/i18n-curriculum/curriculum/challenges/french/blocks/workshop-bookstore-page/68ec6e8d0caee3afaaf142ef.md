---
id: 68ec6e8d0caee3afaaf142ef
title: Étape 8
challengeType: 0
dashedName: step-8
---

# --description--

Tu peux ajouter plusieurs éléments dans un élément `div` pour regrouper du contenu lié. Dans l'élément qui a une `class` de `card-container`, crée un autre élément `div`. Ce `div` représentera la première carte de livre.

Ajoute un attribut `class` à ce nouvel élément `div` et définis la valeur de l'attribut `class` sur `card`.

# --hints--

Tu dois avoir un élément `div` imbriqué dans l'élément avec une classe `card-container`.

```js
assert.exists(document.querySelector('.card-container div'));
```

Ton nouvel élément `div` doit avoir un attribut `class`.

```js
assert.isTrue(document.querySelector('.card-container div')?.hasAttribute('class'));
```

Ton nouvel élément `div` doit avoir une `class` avec la valeur `card`.

```js
assert.exists(document.querySelector('.card-container div.card'));
```
# --seed--

## --seed-contents--

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>XYZ Bookstore Page</title>
</head>

<body>
  <h1>XYZ Bookstore</h1>
  <p>Browse our collection of amazing books!</p>
  
  <div class="card-container">
--fcc-editable-region--
    
--fcc-editable-region--
  </div>
</body>

</html>
```
