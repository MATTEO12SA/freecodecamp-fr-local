---
id: 618a0b2befb143baefab632b
title: Étape 32
challengeType: 0
dashedName: step-32
---

# --description--

Remarque que les couleurs rouge et cyan sont très vives lorsqu'elles sont juste l'une à côté de l'autre. Ce contraste peut distraire s'il est trop utilisé sur un site web, et peut rendre le texte difficile à lire s'il est placé sur un arrière-plan de couleur complémentaire.

Il vaut mieux choisir une couleur comme couleur dominante et utiliser sa couleur complémentaire comme accent pour attirer l'attention sur certains contenus de la page.

D’abord, dans la règle `h1`, utilise la fonction `rgb` pour définir son `background-color` sur cyan.

# --hints--

Tu ne devrais pas supprimer ni modifier la propriété `text-align` ou sa valeur.

```js
assert.strictEqual(new __helpers.CSSHelp(document).getStyle('h1')?.textAlign, 'center');
```

Ta règle CSS `h1` devrait avoir une propriété `background-color` définie sur `rgb(0, 255, 255)`.

```js
assert.strictEqual(new __helpers.CSSHelp(document).getStyle('h1')?.backgroundColor, 'rgb(0, 255, 255)');
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
      <div class="marker one">
      </div>
      <div class="marker two">
      </div>
      <div class="marker three">
      </div>
    </div>
  </body>
</html>
```

```css
h1 {
  text-align: center;
--fcc-editable-region--

--fcc-editable-region--
}

.container {
  background-color: rgb(255, 255, 255);
  padding: 10px 0;
}

.marker {
  width: 200px;
  height: 25px;
  margin: 10px auto;
}

.one {
  background-color: rgb(255, 0, 0);
}

.two {
  background-color: rgb(0, 255, 255);
}

.three {
  background-color: rgb(0, 0, 0);
}

```
