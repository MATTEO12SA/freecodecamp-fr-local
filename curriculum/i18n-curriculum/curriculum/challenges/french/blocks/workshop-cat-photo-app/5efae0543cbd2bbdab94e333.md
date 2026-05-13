---
id: 5efae0543cbd2bbdab94e333
title: Étape 32
challengeType: 0
dashedName: step-32
---

# --description--

Pour rendre la nouvelle image accessible, ajoute un attribut `alt` avec le texte :

`Two tabby kittens sleeping together on a couch.`

# --hints--

Ton élément `figure` doit avoir une balise ouvrante.

```js
assert(document.querySelectorAll('figure').length === 2);
```

Ton élément `figure` doit avoir une balise fermante.

```js
assert(code.match(/<\/figure>/g).length === 2);
```

Un élément `figure` doit se trouver juste au-dessus de la balise fermante du dernier `section`.

```js
assert.strictEqual(document.querySelectorAll('main > section')?.[1]?.lastElementChild?.nodeName, 'FIGURE');
```

L'image des chats doit être imbriquée dans le `figure`.

```js
const catsImg = document.querySelectorAll('figure > img')[1];
assert.exists(catsImg);
```

La troisième image doit avoir un `src` qui vaut `https://cdn.freecodecamp.org/curriculum/cat-photo-app/cats.jpg`.

```js
const catsImg = document.querySelectorAll('figure > img')[1];
assert.strictEqual(
  catsImg?.src?.toLowerCase(), 'https://cdn.freecodecamp.org/curriculum/cat-photo-app/cats.jpg'
);
```

L'image des chats doit avoir un attribut `alt` qui vaut `Two tabby kittens sleeping together on a couch.`.

```js
const catsImg = document.querySelectorAll('figure > img')[1];
assert.match(catsImg?.getAttribute('alt')?.replace(/\s+/g, ' '), /^Two tabby kittens sleeping together on a couch..?$/i);
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
        <ul>
          <li>catnip</li>
          <li>laser pointers</li>
          <li>lasagna</li>
        </ul>
        <figure>
          <img src="https://cdn.freecodecamp.org/curriculum/cat-photo-app/lasagna.jpg" alt="A slice of lasagna on a plate.">
          <figcaption>Cats <em>love</em> lasagna.</figcaption>  
        </figure>
        <h3>Top 3 things cats hate:</h3>
        <ol>
          <li>flea treatment</li>
          <li>thunder</li>
          <li>other cats</li>
        </ol>
        <figure>
--fcc-editable-region--
          <img src="https://cdn.freecodecamp.org/curriculum/cat-photo-app/cats.jpg">
--fcc-editable-region--
        </figure>
      </section>
    </main>
  </body>
</html>
```
