---
id: 646cecc9eb5c4f4f73dafd07
title: Étape 23
challengeType: 0
dashedName: step-23
---

# --description--

Déplace l'oreille gauche à sa place en définissant une position de `absolute`, un `top` de `-26px` et un `left` de `-31px`.

# --hints--

Ton sélecteur `.cat-left-ear` devrait avoir une propriété `position` définie sur `absolute`. N'oublie pas d'ajouter un point-virgule.

```js
assert.equal(new __helpers.CSSHelp(document).getStyle('.cat-left-ear')?.position, 'absolute')
```

Ton sélecteur `.cat-left-ear` devrait avoir une propriété `top` définie sur `-26px`

```js
assert.equal(new __helpers.CSSHelp(document).getStyle('.cat-left-ear')?.top, '-26px')
```

Ton sélecteur `.cat-left-ear` devrait avoir une propriété `left` définie sur `-31px`

```js
assert.equal(new __helpers.CSSHelp(document).getStyle('.cat-left-ear')?.left, '-31px')
```

# --seed--

## --seed-contents--

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>fCC Cat Painting</title>
    <link rel="stylesheet" href="./styles.css">
</head>
<body>
    <main>
      <div class="cat-head">
        <div class="cat-ears">
          <div class="cat-left-ear">
            <div class="cat-left-inner-ear"></div>
          </div>
          <div class="cat-right-ear">
            <div class="cat-right-inner-ear"></div>
          </div>
        </div>
      </div>
    </main>
</body>
</html>
```

```css
* {
  box-sizing: border-box;
}

body {
  background-color: #c9d2fc;
}

.cat-head {
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: linear-gradient(#5e5e5e 85%, #45454f 100%);
  width: 205px;
  height: 180px;
  border: 1px solid #000;
  border-radius: 46%;
}

--fcc-editable-region--
.cat-left-ear {

  border-left: 35px solid transparent;
  border-right: 35px solid transparent;
  border-bottom: 70px solid #5e5e5e;
}
--fcc-editable-region--
```
