---
id: 66f3f6eb66ea9dc41cdc30df
title: Concevoir un ensemble de boîtes colorées
challengeType: 25
dashedName: set-of-colored-boxes
demoType: onClick
---

# --description--

Dans ce lab, tu vas pratiquer l'utilisation des couleurs CSS en concevant des boîtes.

**Objectif :** Remplir les user stories ci-dessous et faire passer tous les tests pour terminer le lab.

**User Stories :**

1. Tu devrais définir la couleur d'arrière-plan pour `body` à `#f4f4f4`.
2. Tu devrais avoir un `div` avec une classe `color-grid` pour contenir tous tes éléments de couleur.
3. Tu devrais avoir cinq éléments `div` dans l'élément `.color-grid`.
4. Les cinq éléments `div` devraient chacun avoir une classe `color-box` et `color#`, où `#` est le numéro de l'ordre de ce `div`. Par exemple : `color1` pour le premier `div`, `color2` pour le second, et ainsi de suite.
5. La classe `.color-box` devrait avoir une `width` et une `height` définies pour que tes éléments `div` soient visibles sur la page.
6. L'élément `.color1` devrait avoir une `background-color` qui utilise une valeur de couleur hexadécimale.
7. L'élément `.color2` devrait avoir une `background-color` qui utilise une valeur de couleur RGB.
8. L'élément `.color3` devrait avoir une `background-color` qui utilise une valeur de couleur prédéfinie (mot).
9. L'élément `.color4` devrait avoir une `background-color` qui utilise une valeur de couleur HSL.
10. L'élément `.color5` devrait avoir une `background-color` définie.

**Note :** Assure-toi de lier ta feuille de style dans ton HTML et d'appliquer ton CSS.

# --hints--

`body` devrait avoir une couleur d'arrière-plan de `#f4f4f4`.

```js
const body = document.body;
const bodyBgColor = getComputedStyle(body).backgroundColor;
assert.strictEqual(bodyBgColor, 'rgb(244, 244, 244)');
```

Tu devrais avoir un élément `div` avec une classe `color-grid`.

```js
const colorGrid = document.querySelector('div.color-grid');
assert.exists(colorGrid);
```

Tu devrais avoir cinq éléments `div` dans l'élément `.color-grid`.

```js
const colorGridChildren = document.querySelectorAll('div.color-grid > div');
assert.strictEqual(colorGridChildren.length, 5);
```

Chacun des cinq éléments `div` devrait avoir une classe `color-box` et `color#` — remplace l'ordre du `div` pour le symbole `#`.

```js
const colorGridChildren = document.querySelectorAll('div.color-grid > div');
assert.strictEqual(colorGridChildren.length, 5);

colorGridChildren.forEach((child, index) => {
  const colorClass = `color${index + 1}`;
  assert.isTrue(child.classList.contains('color-box'));
  assert.isTrue(child.classList.contains(colorClass));
});
```

La classe `.color-box` devrait avoir les propriétés `width` et `height` définies.

```js
const cssHelp = new __helpers.CSSHelp(document);
assert.isNotEmpty(cssHelp.getStyle('.color-box')?.getPropVal('width', true));
assert.isNotEmpty(cssHelp.getStyle('.color-box')?.getPropVal('height', true));
```

Les éléments `.color-box` devraient toujours avoir une `width` et une `height` non nulles. Essaie de redimensionner l'aperçu à une taille plus petite, assure-toi que les boîtes ne disparaissent pas.

```js
const colorBoxes = document.querySelectorAll('.color-box');
assert.isNotEmpty(colorBoxes);

colorBoxes.forEach(box => {
  const width = getComputedStyle(box).width;
  const height = getComputedStyle(box).height;
  assert.notStrictEqual(width, '0px');
  assert.notStrictEqual(height, '0px');
});
```

L'élément `.color1` devrait avoir une couleur d'arrière-plan hexadécimale.

```js
const hexChars = "[0-9a-fA-F]"
const hexRegex = new RegExp(`\\.color1\\s*{[^}]*\\bbackground-color\\s*:\\s*#((${hexChars}{3,4})||(${hexChars}{6})||(${hexChars}{8}))\\s*;?[^}]*}`);
assert.match(__helpers.removeCssComments(code), hexRegex);
```

L'élément `.color2` devrait avoir une couleur d'arrière-plan RGB.

```js
assert.match(__helpers.removeCssComments(code), /\.color2\s*{[^}]*\bbackground-color\s*:\s*rgb\s*\(\s*\d+(?:\.\d+)?\s*(,|\s+)\s*\d+(?:\.\d+)?\s*\1\s*\d+(?:\.\d+)?\s*(\/\s*\d{1,2}(?:\.\d+)?%\s*)?\)\s*;?[^}]*}/);
```

L'élément `.color3` devrait avoir une couleur d'arrière-plan prédéfinie (mot).

```js
const colorSet = new Set(["black", "silver", "gray", "white", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua", "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "aqua", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey", "gray", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "fuchsia", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "transparent", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"]);
const matchedColor = __helpers.removeCssComments(code).match(/\.color3\s*{[^}]*\bbackground-color\s*:\s*(?<color>[a-zA-Z]+)\s*;?[^}]*}/);
assert.isTrue(colorSet.has(matchedColor.groups.color.toLowerCase()));
```

L'élément `.color4` devrait avoir une couleur d'arrière-plan HSL.

```js
const absHSLVals = '\\s*(none|\\d+(?:\\.\\d+)?(?:deg)?)\\s*\\d+(?:\\.\\d+)?%?\\s*\\d+(?:\\.\\d+)?%?\\s*(\\/\\s*\\d{1,2}(?:\\.\\d+)?%\\s*)?';
const legacyHSLVals = '\\s*\\d+(?:\\.\\d+)?(?:deg)?\\s*,\\s*\\d+(?:\\.\\d+)?%\\s*,\\s*\\d+(?:\\.\\d+)?%\\s*(?:,\\s*\\d+(?:\\.\\d+)?\\s*)?';
const hslRegex = new RegExp(`\\.color4\\s*{[^}]*\\bbackground-color\\s*:\\s*hsl\\s*\\((${absHSLVals}|${legacyHSLVals})\\)\\s*;?[^}]*}`);
assert.match(__helpers.removeCssComments(code), hslRegex);
```

L'élément `.color5` devrait avoir une couleur d'arrière-plan définie.

```js
assert.isNotEmpty(new __helpers.CSSHelp(document).getStyle('.color5')?.getPropVal('background-color', true));
```

# --seed--

## --seed-contents--

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Colored Boxes</title>
</head>
<body>

</body>
</html>
```

```css

```

# --solutions--

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Colored Boxes</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Colored Boxes</h1>
    <div class="color-grid"> 
        <div class="color-box color1"></div>
        <div class="color-box color2"></div>
        <div class="color-box color3"></div>
        <div class="color-box color4"></div>
        <div class="color-box color5"></div>
    </div>
</body>
</html>
```

```css
body {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
}

h1 {
    margin-bottom: 20px;
}

.color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    width: 100%;
    max-width: 800px;
}

.color-box {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    border-radius: 8px;
    text-align: center;
    width: 100px;
    height: 100px;
}

.color1 {
    background-color: #33FF57;
}

.color2 {
    background-color: rgb(128,0,128);
}

.color3 {
    background-color: orange;
}

.color4 {
    background-color: hsl(59, 61%, 26%);
}

.color5 {
    background-color: red;
}
```
