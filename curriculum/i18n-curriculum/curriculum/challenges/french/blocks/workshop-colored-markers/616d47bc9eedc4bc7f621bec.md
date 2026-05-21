---
id: 616d47bc9eedc4bc7f621bec
title: Étape 5
challengeType: 0
dashedName: step-5
---

# --description--

Ensuite, dans l'élément `div`, ajoute un autre élément `div` et donne-lui la classe `marker`.

# --hints--

Ton nouvel élément `div` devrait avoir une balise ouvrante.

```js
assert.exists([...code.matchAll(/<div.*?>/gi)][1]);
```

Ton nouvel élément `div` devrait avoir une balise fermante.

```js
assert.exists([...code.matchAll(/<\/div\s*>/gi)][1]);
```

Tu devrais imbriquer ton nouvel élément `div` dans le `div` avec la classe `container`.

```js
assert.strictEqual(document.querySelector('.container')?.children[0]?.localName, 'div');
```

Tu devrais donner à ton nouvel élément `div` une classe `marker`.

```js
const containerChildren = [...document.querySelector('.container')?.children];
assert.isNotEmpty(containerChildren)
containerChildren.forEach(child => assert.isTrue(child.classList?.contains('marker')));
```

# --seed--

## --seed-contents--

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Colored Markers</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <h1>CSS Color Markers</h1>
    <div class="container">
--fcc-editable-region--

--fcc-editable-region--
    </div>
  </body>
</html>
```

```css
h1 {
  text-align: center;
}
```
