---
id: 612eaf56b7ba3257fdbfb0db
title: Étape 19
challengeType: 0
dashedName: step-19
---

# --description--

Le piano a besoin du logo freeCodeCamp pour être officiel.

Ajoute un élément `img` avant ton élément `.keys`. Donne à l'`img` une `class` de `logo`, définis son `src` sur `https://cdn.freecodecamp.org/platform/universal/fcc_primary.svg` et donne-lui un texte `alt` de `freeCodeCamp Logo`.

# --hints--

Tu devrais ajouter un nouvel élément `img`.

```js
assert.lengthOf(document.querySelectorAll('img'), 1);
```

Ton élément `img` devrait venir avant ton premier élément `.keys`.

```js
const img = document.querySelector('img');
assert.equal(img?.nextElementSibling?.className, 'keys');
assert.isNull(img?.previousElementSibling);
```

Ton élément `img` devrait avoir une `class` définie sur `logo`.

```js
const img = document.querySelector('img');
assert.equal(img?.className, 'logo');
```

Ton élément `img` devrait avoir un `src` défini sur `https://cdn.freecodecamp.org/platform/universal/fcc_primary.svg`.

```js
const img = document.querySelector('img');
assert.equal(img?.getAttribute('src'), 'https://cdn.freecodecamp.org/platform/universal/fcc_primary.svg');
```

Ton élément `img` devrait avoir un attribut `alt` défini sur `freeCodeCamp Logo`.

```js
assert.equal(document.querySelector('img')?.getAttribute('alt')?.toLowerCase(), 'freecodecamp logo');
```

Rappelle-toi que la casse et l'orthographe comptent.

```js
assert.equal(document.querySelector('img')?.getAttribute('alt'), 'freeCodeCamp Logo');
```

# --seed--

## --seed-contents--

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Piano</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./styles.css">
  </head>
  <body>
    --fcc-editable-region--
    <div id="piano">
      <div class="keys">
    --fcc-editable-region--
        <div class="key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>
        <div class="key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>

        <div class="key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>
        <div class="key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>

        <div class="key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>
        <div class="key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>
      </div>
    </div>
  </body>
</html>
```

```css
html {
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

#piano {
  background-color: #00471b;
  width: 992px;
  height: 290px;
  margin: 80px auto;
  padding: 90px 20px 0 20px;
}

.keys {
  background-color: #040404;
  width: 949px;
  height: 180px;
  padding-left: 2px;
}

.key {
  background-color: #ffffff;
  position: relative;
  width: 41px;
  height: 175px;
  margin: 2px;
  float: left;
}

.key.black--key::after {
  background-color: #1d1e22;
  content: "";
  position: absolute;
  left: -18px;
  width: 32px;
  height: 100px;
}
```
