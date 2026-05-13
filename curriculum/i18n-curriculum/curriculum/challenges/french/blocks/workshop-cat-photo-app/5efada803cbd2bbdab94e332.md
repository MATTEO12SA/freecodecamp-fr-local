---
id: 5efada803cbd2bbdab94e332
title: Étape 31
challengeType: 0
dashedName: step-31
---

# --description--

À l'intérieur du `figure` que tu viens d'ajouter, imbrique un élément `img` avec un attribut `src` qui vaut `https://cdn.freecodecamp.org/curriculum/cat-photo-app/cats.jpg`.

# --hints--

Le deuxième `figure` doit avoir une balise ouvrante.

```js
assert(document.querySelectorAll('figure').length >= 2);
```

Le deuxième `figure` doit avoir une balise fermante.

```js
assert(code.match(/<\/figure>/g).length >= 2);
```

Le deuxième `figure` doit se trouver juste au-dessus de la balise fermante du deuxième `section`.

```js
assert.strictEqual(document.querySelectorAll('main > section')?.[1]?.lastElementChild?.nodeName, 'FIGURE');
```

Tu dois avoir un troisième élément `img` imbriqué dans le nouveau `figure`.

```js
const catsImg = document.querySelectorAll('figure > img')[1];
assert(
  catsImg
);
```

La troisième image doit avoir un `src` qui vaut `https://cdn.freecodecamp.org/curriculum/cat-photo-app/cats.jpg`.

```js
const catsImg = document.querySelectorAll('figure > img')[1];
assert.strictEqual(
  catsImg?.src?.toLowerCase(), 'https://cdn.freecodecamp.org/curriculum/cat-photo-app/cats.jpg'
);
```

Pense à toujours entourer la valeur d'un attribut par des guillemets.

```js
assert.notMatch(code, /\<img\s+.+\s+src\s*=\s*https:\/\/cdn\.freecodecamp\.org\/curriculum\/cat-photo-app\/cats\.jpg/);
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
--fcc-editable-region--
        <figure>
          
        </figure>
--fcc-editable-region--
      </section>
    </main>
  </body>
</html>
```
