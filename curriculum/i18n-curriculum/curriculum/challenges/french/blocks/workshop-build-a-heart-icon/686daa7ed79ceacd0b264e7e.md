---
id: 686daa7ed79ceacd0b264e7e
title: Étape 3
challengeType: 0
dashedName: step-3
---

# --description--

La forme de l'élément `path` doit être définie. C'est là que l'attribut `d` intervient. Il sert à créer une série de lettres de commande et de nombres qui dessinent une forme.

Ces lettres représentent des commandes comme déplacer vers, tracer une ligne et fermer, tandis que les nombres représentent des coordonnées.

Définis l'attribut `d` de la forme de coeur sur `M12 21s-6-4.35-9.33-8.22C-.5 7.39 3.24 1 8.4 4.28 10.08 5.32 12 7.5 12 7.5s1.92-2.18 3.6-3.22C20.76 1 24.5 7.39 21.33 12.78 18 16.65 12 21 12 21z`.

# --hints--

Tu dois avoir un attribut `d` sur ton élément `path`.

```js
const path = document.querySelector('path');
const d = path.getAttribute('d');
assert.exists(d);
```

Tu dois définir l'attribut `d` sur `M12 21s-6-4.35-9.33-8.22C-.5 7.39 3.24 1 8.4 4.28 10.08 5.32 12 7.5 12 7.5s1.92-2.18 3.6-3.22C20.76 1 24.5 7.39 21.33 12.78 18 16.65 12 21 12 21z`.

```js
const path = document.querySelector('path');
const d = path.getAttribute('d');
assert.strictEqual(
  d,
  'M12 21s-6-4.35-9.33-8.22C-.5 7.39 3.24 1 8.4 4.28 10.08 5.32 12 7.5 12 7.5s1.92-2.18 3.6-3.22C20.76 1 24.5 7.39 21.33 12.78 18 16.65 12 21 12 21z'
);
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
      <path
      --fcc-editable-region--

      --fcc-editable-region--
      ></path>
    </svg>
  </body>
</html>
```
