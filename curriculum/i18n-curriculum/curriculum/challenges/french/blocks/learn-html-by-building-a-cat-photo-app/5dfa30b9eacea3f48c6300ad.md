---
id: 5dfa30b9eacea3f48c6300ad
title: Étape 17
challengeType: 0
dashedName: step-17
---

# --description--

Aux étapes précédentes, tu as utilisé l'élément `a` pour transformer du **texte** en lien. Tu peux aussi transformer **d'autres types de contenu** en lien, par exemple une image, en l'enveloppant dans des balises `a`.

Voici un exemple où une image devient un lien :

```html
<a href="example-link">
  <img src="image-link.jpg" alt="A photo of a cat.">
</a>
```

Transforme l'image en lien en l'entourant des balises nécessaires. Utilise `https://freecatphotoapp.com` comme valeur de l'attribut `href`.

# --hints--

Tu dois toujours avoir un élément `img` avec un `src` qui vaut `https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg`.

```js
assert(
  document.querySelector('img') &&
    document.querySelector('img').getAttribute('src') ===
      'https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg'
);
```

Ton élément `a` doit avoir une balise ouvrante.

```js
assert(document.querySelectorAll('a').length >= 2);
```

Il te manque une balise fermante `</a>` après l'image.

```js
assert.lengthOf(document.querySelectorAll('a'), 3);
```

Ton élément `a` doit avoir une balise fermante.

```js
assert(code.match(/<\/a>/g).length >= 2);
```

Tu dois n'ajouter qu'**une seule** balise fermante `</a>`. Supprime les éventuelles balises fermantes en trop.

```js
assert.lengthOf(code.match(/<\/a>/g), 3);
```

Ton élément `a` doit avoir un attribut `href`.

```js
assert(document.querySelector('a').hasAttribute('href'));
```

Ton élément `a` doit pointer vers `https://freecatphotoapp.com`.

```js
assert(
  document.querySelectorAll('a')[1].getAttribute('href') ===
    'https://freecatphotoapp.com'
);
```

Ton élément `a` doit avoir un attribut `href`.

```js
assert.isTrue(document.querySelectorAll('a')[2]?.hasAttribute('href'));
```

Ton élément `a` doit pointer vers `https://freecatphotoapp.com`.

```js
assert.equal(
  document.querySelectorAll('a')[2]?.getAttribute('href').trim(),
    'https://freecatphotoapp.com'
);
```

Ton élément `img` doit être **imbriqué** dans l'élément `a` : tout l'élément `img` doit se trouver entre les balises ouvrante et fermante du `a`.

```js
assert(document.querySelector('img').parentNode.nodeName === 'A');
```

# --seed--

## --seed-contents--

```html
<html>
  <body>
    <main>
      <h1>CatPhotoApp</h1>
      <h2>Cat Photos</h2>
      <p>Everyone loves <a href="https://cdn.freecodecamp.org/curriculum/cat-photo-app/running-cats.jpg">cute cats</a> online!</p>
      <p>See more <a target="_blank" href="https://freecatphotoapp.com">cat photos</a> in our gallery.</p>
--fcc-editable-region--
      <img src="https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg" alt="A cute orange cat lying on its back.">
--fcc-editable-region--
    </main>
  </body>
</html>
```
