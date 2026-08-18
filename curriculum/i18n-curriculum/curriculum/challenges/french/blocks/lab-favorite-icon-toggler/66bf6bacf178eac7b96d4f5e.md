---
id: 66bf6bacf178eac7b96d4f5e
title: Construire un bouton pour basculer une icône de favori
challengeType: 25
dashedName: build-a-favorite-icon-toggler
demoType: onClick
---

# --description--

Dans ce lab, tu vas utiliser les événements de clic JavaScript pour modifier l'apparence d'une icône de favori. Lorsque tu cliques sur l'icône en forme de cœur, le cœur passe de vide à rempli, et inversement.

**Objectif :** réalise les user stories ci-dessous et fais passer tous les tests pour terminer le lab.

**User stories :**

1. Tu dois avoir une liste non ordonnée contenant trois éléments.
2. La liste non ordonnée doit avoir la classe `item-list`.
3. Les trois éléments de liste doivent contenir le nom de l'élément suivi d'un élément `button` ayant la classe `favorite-icon`.
4. L'élément `button` doit initialement contenir le code `&#9825;` pour représenter un cœur vide.
5. Lorsque tu cliques sur un élément `button` contenant un cœur, tu dois ajouter la classe `filled` au `button` sélectionné si elle n'est pas déjà présente, ou la supprimer si elle est présente.
6. Tu dois avoir un sélecteur de classe qui cible la classe `filled` et définit des propriétés CSS.
7. Lorsque tu cliques sur un élément `button` contenant un cœur, le symbole doit basculer entre `&#9825;` (cœur vide) et `&#10084;` (cœur rempli), selon son état actuel.

**Remarque :** assure-toi de lier ton fichier JavaScript à ton fichier HTML. (Ex. `<script src="script.js"></script>`)

# --hints--

Tu dois avoir une liste non ordonnée.

```js
assert.exists(document.querySelector('ul'));
```

Ta liste non ordonnée doit contenir 3 éléments.

```js
assert.lengthOf(document.querySelectorAll('ul li'), 3);
```

Ta liste non ordonnée doit avoir la classe `item-list`.

```js
assert.exists(document.querySelector('ul.item-list'));
```

Chaque élément de ta liste doit contenir le nom de l'élément.

```js
assert.exists(document.querySelector('ul li').textContent);
```

Chaque élément de ta liste doit contenir un élément `button` ayant la classe `favorite-icon`.

```js
assert.exists(document.querySelector('ul li button.favorite-icon'));
```

Au départ, les éléments `button` doivent contenir le code `&#9825;` pour représenter un cœur vide.

```js
const inputs = document.querySelectorAll('ul li button.favorite-icon');
assert.isNotEmpty(inputs);

for (let input of inputs) {
  assert.strictEqual(input.innerHTML.charCodeAt(0), 9825);
}
```

Tu dois avoir un sélecteur `.filled` qui définit des propriétés CSS.

```js
const filled = new __helpers.CSSHelp(document).getStyle('.filled');
assert.exists(filled);
assert.isNotEmpty([...filled]);
```

Lorsque tu cliques sur l'élément `button` et qu'il possède la classe `filled`, tu dois retirer la classe `filled` de l'élément `button` et remplacer le contenu HTML interne de l'élément `button` par `&#9825;`.

```js
const buttonElements = document.querySelectorAll('.favorite-icon');
assert.isNotEmpty(buttonElements);

buttonElements.forEach(button => button.classList.add('filled'));

buttonElements.forEach(button => {
  button.dispatchEvent(new Event('click', { bubbles: true }));
  assert.isFalse(button.classList.contains('filled'));
  assert.equal(button.innerHTML.charCodeAt(0), 9825);
});
```

Lorsque tu cliques sur l'élément `button` et qu'il ne possède pas la classe `filled`, tu dois ajouter la classe `filled` à l'élément `button` et remplacer l'`innerHTML` de l'élément `button` par `&#10084;`.

```js
const buttonElements = document.querySelectorAll('.favorite-icon');
assert.isNotEmpty(buttonElements);

buttonElements.forEach(button => button.classList.remove('filled'));

buttonElements.forEach(button => {
  button.dispatchEvent(new Event('click', { bubbles: true }));
  assert.isTrue(button.classList.contains('filled'));
  assert.equal(button.innerHTML.charCodeAt(0), 10084);
});
```

# --seed--

## --seed-contents--

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Favorite Icon Toggler</title>
    <link rel="stylesheet" href="styles.css" />
  </head>

  <body>

  </body>
</html>
```

```css

```

```js

```

# --solutions--

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Favorite Icon Toggle</title>
    <link rel="stylesheet" href="styles.css" />
  </head>

  <body>
    <h1>Art Supplies</h1>
    <ul class="item-list">
      <li>
        120 gm paper
        <button class="favorite-icon" id="favoriteIcon1">&#9825;</button>
      </li>
      <li>
        Watercolor set
        <button class="favorite-icon" id="favoriteIcon2">&#9825;</button>
      </li>
      <li>
        Lead pencil 6B
        <button class="favorite-icon" id="favoriteIcon3">&#9825;</button>
      </li>
    </ul>

    <script src="script.js"></script>
  </body>
</html>
```

```css
body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  font-family: Arial, sans-serif;
}

h1 {
  margin-bottom: 20px;
}

.item-list {
  list-style-type: none;
  padding: 0;
}

.item-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  width: 200px;
}

.favorite-icon {
  font-size: 1.25rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.filled {
  color: #d22b2b;
}
```

```js
document.addEventListener("DOMContentLoaded", () => {
  const favoriteIcons = document.querySelectorAll(".favorite-icon");

  favoriteIcons.forEach(icon => {
    icon.addEventListener("click", () => {
      if (icon.classList.contains("filled")) {
        icon.classList.remove("filled");
        icon.innerHTML = "&#9825;"; // Empty heart
      } else {
        icon.classList.add("filled");
        icon.innerHTML = "&#10084;"; // Filled black heart
      }
    });
  });
});
```
