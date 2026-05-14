---
id: 686daa7ed79ceacd0b264e7f
title: Étape 4
challengeType: 0
dashedName: step-4
---

# --description--

L'étape suivante consiste à définir les attributs `width` et `height` de l'élément `svg`. Comme tu crées une icône, les deux valeurs doivent être petites.

Définis les deux valeurs sur `24`.

# --hints--

Ton élément `svg` doit avoir un attribut `width` égal à `24`.

```js
const svg = document.querySelector('svg');
assert.strictEqual(svg.getAttribute('width'), '24');
```

Ton élément `svg` doit avoir un attribut `height` égal à `24`.

```js
const svg = document.querySelector('svg');
assert.strictEqual(svg.getAttribute('height'), '24');
```

# --seed--

## --seed-contents--

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Icône de coeur</title>
  </head>
  <body>
    --fcc-editable-region--
    <svg>
    --fcc-editable-region--
      <path
        d="M12 21s-6-4.35-9.33-8.22C-.5 7.39 3.24 1 8.4 4.28 10.08 5.32 12 7.5 12 7.5s1.92-2.18 3.6-3.22C20.76 1 24.5 7.39 21.33 12.78 18 16.65 12 21 12 21z"
      ></path>
    </svg>
  </body>
</html>
```
