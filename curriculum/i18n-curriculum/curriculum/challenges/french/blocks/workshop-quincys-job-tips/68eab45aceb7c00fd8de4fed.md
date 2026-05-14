---
id: 68eab45aceb7c00fd8de4fed
title: Étape 11
challengeType: 0
dashedName: step-11
---

# --description--

À l'intérieur du deuxième élément `section`, imbrique un élément `h2` avec le texte `Importance of Networking`.

Sous ce titre, ajoute un élément de citation en bloc avec un attribut `cite` ayant la valeur `https://www.freecodecamp.org/news/learn-to-code-book/`.

# --hints--

Tu devrais avoir un élément `h2` imbriqué dans la deuxième section.

```js
assert.exists(document.querySelector('main > section:nth-of-type(2) > h2'));
```

Ton élément `h2` devrait avoir le texte `Importance of Networking`.

```js
const h2El = document.querySelector('main > section:nth-of-type(2) > h2');
assert.equal(h2El?.innerText.trim(), 'Importance of Networking');
```

Tu devrais avoir un élément `blockquote` imbriqué dans la deuxième section.

```js
assert.exists(document.querySelector('main > section:nth-of-type(2) > blockquote'));
```

Ton élément `blockquote` devrait être sous ton élément `h2`.

```js
assert.exists(document.querySelector('main > section:nth-of-type(2) > h2 + blockquote'));
```

Ton élément `blockquote` devrait avoir un attribut `cite`.

```js
const blockquoteEl = document.querySelector('main > section:nth-of-type(2) > blockquote');
assert.exists(blockquoteEl?.getAttribute('cite'));
```

L'attribut `cite` de ton élément `blockquote` devrait avoir la valeur `https://www.freecodecamp.org/news/learn-to-code-book/`.

```js
const blockquoteEl = document.querySelector('main > section:nth-of-type(2) > blockquote');
assert.equal(blockquoteEl?.getAttribute('cite'), 'https://www.freecodecamp.org/news/learn-to-code-book/');
```

# --seed--

## --seed-contents--

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quincy's Tips for Getting a Developer Job</title>
  </head>
  <body>
    <h1>Quincy's Tips for Getting a Developer Job</h1>
    <p>
      Learning to code is hard, but as Quincy Larson says,
      <q cite="https://www.freecodecamp.org/news/learn-to-code-book/">You can become a developer.</q>
    </p>

    <main>
      <section>
        <h2>Envisioning Success</h2>
        <blockquote cite="https://www.freecodecamp.org/news/learn-to-code-book/">
          Can you imagine what it would be like to be a successful developer? To have built software systems that people rely upon?
        </blockquote>
        <p>
          &mdash;Quincy Larson, <cite>How to Learn to Code and Get a Developer Job [Full Book]</cite>
        </p>
      </section>
      <section>
--fcc-editable-region--
        
--fcc-editable-region--
      </section>
      <section>

      </section>
    </main>
  </body>
</html>
```
