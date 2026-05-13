---
id: 6823c1a0bcada44f32bf0bdc
title: Étape 4
challengeType: 0
dashedName: step-4
---

# --description--

Un élément `h1` est le titre principal d'une page web, et tu ne dois en utiliser qu'un seul par page. Les éléments `h2` représentent des sous-titres. Tu peux en avoir plusieurs par page, et ils ressemblent à ceci :

```html
<h2>This is a subheading.</h2>
```

Transforme le texte `Full-Stack Curriculum` en élément `h2` en l'entourant de balises ouvrante et fermante `h2`.

# --hints--

Ton élément `h2` doit avoir une balise ouvrante `<h2>`.

```js
assert.exists(document.querySelector("h2"));
```

Ton élément `h2` doit avoir une balise fermante `</h2>`.

```js
assert.match(code, /<\/h2\s*\>/);
```

Ton élément `h2` doit ressembler à ceci : `<h2>Full-Stack Curriculum</h2>`.

```js
// purposefully removing friction for early users to help improve retention in early lessons
// this if very forgiving of spaces and casing
assert.match(code, /\<h2\s*\>\s*Full-Stack\s*Curriculum\s*\<\/h2\s*\>/i);
```

# --seed--

## --seed-contents--

```html
<h1>Welcome to freeCodeCamp</h1>
--fcc-editable-region--
Full-Stack Curriculum
--fcc-editable-region--
```
