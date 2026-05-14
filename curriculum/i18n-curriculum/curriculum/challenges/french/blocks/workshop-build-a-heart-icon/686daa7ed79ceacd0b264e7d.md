---
id: 686daa7ed79ceacd0b264e7d
title: Étape 2
challengeType: 0
dashedName: step-2
---

# --description--

Tu dois imbriquer un élément `path` dans ton élément `svg` pour donner une forme à l'image.

Crée un élément `path`.

# --hints--

Tu dois avoir un élément `path` imbriqué dans ton élément `svg`.

```js
const path = document.querySelector('svg path');
assert.exists(path);
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
    <svg>
    --fcc-editable-region--

    --fcc-editable-region--
    </svg>
  </body>
</html>
```
