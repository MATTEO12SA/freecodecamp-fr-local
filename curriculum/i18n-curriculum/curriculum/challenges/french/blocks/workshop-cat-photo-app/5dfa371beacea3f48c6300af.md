---
id: 5dfa371beacea3f48c6300af
title: Étape 21
challengeType: 0
dashedName: step-21
---

# --description--

Quand tu ajoutes un titre de niveau **inférieur** (par exemple `h3` après un `h2`), tu indiques que tu commences une **sous-section**.

Après le dernier `h2` du deuxième `section`, ajoute un élément `h3` avec ce texte :

`Things cats love:`

# --hints--

Le deuxième `section` semble manquer ou ne pas avoir ses deux balises ouvrante et fermante.

```js
assert(
  document.querySelectorAll('main > section')[1] &&
    code.match(/\<\/section>/g).length == 2
);
```

Il doit y avoir un élément `h3` juste au-dessus de la balise fermante du deuxième `section`.

```js
assert(
  document.querySelectorAll('main > section')[1].lastElementChild.nodeName ===
    'H3'
);
```

Ton élément `h3` doit avoir une balise fermante.

```js
assert.lengthOf(code.match(/<\/h3>/g), 1);
```

Le `h3` juste au-dessus de la balise fermante du deuxième `section` doit avoir le texte `Things cats love:`. N'oublie pas les deux-points (`:`) à la fin.

```js
assert(
  document
    .querySelectorAll('main > section')[1]
    .lastElementChild.innerText.toLowerCase()
    .replace(/\s+/g, ' ') === 'things cats love:'
);
```

Tu dois avoir un élément `h2` avec le texte `Cat Lists` au-dessus du dernier `h3` imbriqué dans le dernier `section`.

```js
const secondSectionLastElemNode = document.querySelectorAll('main > section')[1]
  .lastElementChild;
assert(
  secondSectionLastElemNode.nodeName === 'H3' &&
    secondSectionLastElemNode.previousElementSibling.innerText
      .toLowerCase()
      .replace(/\s+/g, ' ') === 'cat lists'
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
--fcc-editable-region--
      <section>
        <h2>Cat Lists</h2>
        
      </section>
--fcc-editable-region--
    </main>
  </body>
</html>
```
