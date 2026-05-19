---
id: 5f356ed6cf6eab5f15f5cfe6
title: Étape 16
challengeType: 0
dashedName: step-16
---

# --description--

Les `div` l'élément est utilisé principalement à des fins de mise en page de conception, contrairement aux autres éléments de contenu que vous avez utilisés jusqu'à présent. Ajouter un `div` élément intérieur `body` élément et ensuite déplacer tous les autres éléments dans le nouveau `div`.

Dans l'ouverture `div` tag, ajouter le `id` attribut avec une valeur de `menu`.

# --hints--

Votre ouverture `<div>` tag devrait avoir un `id` attribut défini à `menu`.

```js
assert.strictEqual(document.querySelector('div')?.id, 'menu');
```

Tu devrais fermer. `</div>` marque.

```js
assert(code.match(/<\/div>/i));
```

Vous ne devriez pas changer votre `body` élément. Assurez-vous de ne pas supprimer l'étiquette de fermeture.

```js
assert.lengthOf(document.querySelectorAll('body'), 1);
```

Votre `div` l'élément doit être imbriqué dans le `body`.

```js
assert.equal(document.querySelector('div')?.parentElement?.tagName, 'BODY');
```

Vous devriez déplacer tous les autres éléments dans le nouveau `div`.

```js
assert.lengthOf(document.querySelector('body > div#menu > main')?.children, 3);
```

# --seed--

## --seed-contents--

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cafe Menu</title>
    <link href="styles.css" rel="stylesheet"/>
  </head>
--fcc-editable-region--
  <body>
    <main>
      <h1>CAMPER CAFE</h1>
      <p>Est. 2020</p>
      <section>
        <h2>Coffee</h2>
      </section>
    </main>
  </body>
--fcc-editable-region--
</html>
```

```css
body {
  background-color: burlywood;
}

h1, h2, p {
  text-align: center;
}
```
