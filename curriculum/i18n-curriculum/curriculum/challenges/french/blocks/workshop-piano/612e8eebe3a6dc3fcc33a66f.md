---
id: 612e8eebe3a6dc3fcc33a66f
title: Étape 9
challengeType: 0
dashedName: step-9
---

# --description--

Maintenant, cible ton élément `#piano` avec un sélecteur d'`id`. Définis sa propriété `background-color` sur `#00471b`, sa propriété `width` sur `992px` et sa propriété `height` sur `290px`.

# --hints--

Tu devrais avoir un sélecteur `#piano`.

```js
assert.exists(new __helpers.CSSHelp(document).getStyle('#piano'));
```

Ton sélecteur `#piano` devrait avoir la propriété `background-color` définie sur `#00471b`.

```js
assert.equal(new __helpers.CSSHelp(document).getStyle('#piano')?.backgroundColor, 'rgb(0, 71, 27)');
```

Ton sélecteur `#piano` devrait avoir une propriété `width` définie sur `992px`.

```js
assert.equal(new __helpers.CSSHelp(document).getStyle('#piano')?.width, '992px');
```

Ton sélecteur `#piano` devrait avoir la propriété `height` définie sur `290px`.

```js
assert.equal(new __helpers.CSSHelp(document).getStyle('#piano')?.height, '290px');
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
    <div id="piano">
      <div class="keys">
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

--fcc-editable-region--

--fcc-editable-region--
```
