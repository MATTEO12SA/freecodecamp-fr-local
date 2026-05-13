---
id: 5dfb5ecbeacea3f48c6300b1
title: Étape 23
challengeType: 0
dashedName: step-23
---

# --description--

L'élément `li` (pour *list item*) sert à créer un **élément** dans une liste, qu'elle soit ordonnée ou non.

Voici un exemple d'éléments de liste dans une liste non ordonnée :

```html
<ul>
  <li>milk</li>
  <li>cheese</li>
</ul>
```

À l'intérieur de ton `ul`, imbrique **trois** éléments `li` pour afficher trois choses que les chats adorent :

`catnip`

`laser pointers`

`lasagna`

# --hints--

Tu dois avoir trois éléments `li`. Chacun doit avoir sa propre balise ouvrante et fermante.

```js
assert.lengthOf(document.querySelectorAll('li'),3)
assert.lengthOf(code.match(/<\/li\>/g),3);
```

Tu dois avoir trois `li` avec les textes `catnip`, `laser pointers` et `lasagna` (l'ordre n'a pas d'importance).

```js
assert.deepStrictEqual(
  [...document.querySelectorAll('li')]
    .map((item) => item.innerText.toLowerCase())
    .sort((a, b) => a.localeCompare(b)),
  ['catnip', 'lasagna', 'laser pointers']
);
```

Les trois `li` doivent être placés entre les balises ouvrante et fermante du `ul`.

```js
assert(
  [...document.querySelectorAll('li')].filter(
    (item) => item.parentNode.nodeName === 'UL'
  ).length === 3
);
```

# --seed--

## --seed-contents--

```html
<html>
  <body>
    <main>
      <h1>CatPhotoApp</h1>
      <section>
        <h2>Cat Photos</h2>
        <p>Everyone loves <a href="https://cdn.freecodecamp.org/curriculum/cat-photo-app/running-cats.jpg">cute cats</a> online!</p>
        <p>See more <a target="_blank" href="https://freecatphotoapp.com">cat photos</a> in our gallery.</p>
        <a href="https://freecatphotoapp.com"><img src="https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg" alt="A cute orange cat lying on its back."></a>
      </section>
      <section>
        <h2>Cat Lists</h2>
        <h3>Things cats love:</h3>
--fcc-editable-region--
        <ul>
          
        </ul>
--fcc-editable-region--
      </section>
    </main>
  </body>
</html>
```
