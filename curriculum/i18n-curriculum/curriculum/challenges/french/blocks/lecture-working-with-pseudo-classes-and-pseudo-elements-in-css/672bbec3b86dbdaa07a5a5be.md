---
id: 672bbec3b86dbdaa07a5a5be
title: Quels sont des exemples de pseudo-classes fonctionnelles ?
challengeType: 19
dashedName: what-are-examples-of-functional-pseudo-classes
---

# --interactive--

Les pseudo-classes fonctionnelles te permettent de sélectionner les éléments en fonction de conditions ou de relations plus complexes. Contrairement aux pseudo-classes régulières qui ciblent les éléments en fonction d'un état, par exemple `:hover`, `:focus`, les pseudo-classes fonctionnelles acceptent des arguments entre parenthèses, d'où le nom « pseudo-classes fonctionnelles ».

Des exemples de pseudo-classes fonctionnelles sont :

- `:is()`
- `:where()`
- `:has()`
- `:not()`

Regardons de plus près chacune de ces pseudo-classes fonctionnelles avec des exemples.

La pseudo-classe `:is()` est utile quand tu veux styliser un groupe d'éléments qui partagent certaines, mais pas toutes, les caractéristiques. Par exemple, tu pourrais vouloir styliser différents types de boutons sur ton site web, y compris les éléments `button`, les liens stylisés comme des boutons, et les éléments `input` avec les types `submit` et `reset`. Voici un exemple représentant ça. Sans la fonction `:is()`, tu devrais écrire un sélecteur complexe comme ceci :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<button>Example Button</button>
<a href="#" class="button">Link styled like a button</a>
<input type="submit" value="Submit" />
<input type="reset" value="Reset" />
```

```css
button,
a.button,
input[type='submit'],
input[type='reset'] {
  background-color: darkblue;
  color: white;
  border: 1px solid darkblue;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  cursor: pointer;
  display: inline-block;
  margin: 5px;
  font-size: 16px;
  text-align: center;
}

button:hover,
a.button:hover,
input[type='submit']:hover,
input[type='reset']:hover {
  background-color: blue;
  border-color: blue;
}
```

:::

Avec la fonction `:is()`, tu peux écrire un sélecteur plus compact et compréhensible comme ceci :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<button>Example Button</button>
<a href="#" class="button">Link styled like a button</a>
<input type="submit" value="Submit" />
<input type="reset" value="Reset" />
```

```css
:is(button, a.button, input[type='submit'], input[type='reset']) {
  background-color: darkblue;
  color: white;
  border: 1px solid darkblue;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  cursor: pointer;
  display: inline-block;
  margin: 5px;
  font-size: 16px;
  text-align: center;
}

:is(button, a.button, input[type='submit'], input[type='reset']):hover {
  background-color: blue;
  border-color: blue;
}
```

:::

La pseudo-classe `:where()` fonctionne de manière similaire à `:is()`, mais elle n'augmente pas la spécificité de tes sélecteurs. Ça la rend idéale pour appliquer des styles sans affecter la spécificité d'autres règles.

Par exemple, tu peux utiliser la fonction `:where()` pour appliquer un `margin` et `padding` zéro aux éléments de titre. Cela garantit que le reset n'interférera pas avec des styles plus spécifiques que tu pourrais appliquer plus tard. Voici un exemple pour ça :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<h1>Page Title</h1>
<h2>Subtitle</h2>
<h3>A point</h3>

<p>Example paragraph.</p>
<p>Example paragraph.</p>
<p>Example paragraph.</p>
```

```css
:where(h1, h2, h3) {
  margin: 0;
  padding: 0;
}
```

:::

Styliser un élément parent en fonction des états de ses enfants était auparavant difficile jusqu'à ce que la pseudo-classe `:has()` soit introduite. Elle te permet d'appliquer des styles à un élément parent en fonction de la présence ou de l'état de ses éléments enfants.

Par exemple, le CSS ci-dessous s'appliquera uniquement à n'importe quel élément `article` qui a un `h2` à l'intérieur :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<article>
  <h2>Subheading</h2>
  <p>Lorem ipsum dolor sit amet.</p>
</article>

<article>
  <h3>A point</h3>
  <p>Lorem ipsum dolor sit amet.</p>
  <p>Lorem ipsum dolor sit amet.</p>
</article>
```

```css
article:has(h2) {
  border: 2px solid hotpink;
}
```

:::

La pseudo-classe `:not()` est idéale pour les situations où tu veux appliquer des styles à un groupe d'éléments, en excluant une ou plusieurs exceptions spécifiques. Dans le CSS ci-dessous, tout bouton qui n'est pas un bouton primaire aura un arrière-plan gris :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<button class="primary">Primary Button</button>
<button class="secondary">Secondary Button</button>
<button class="danger">Another Secondary Button</button>
```

```css
button {
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  border: none;
  color: white;
}

button.primary {
  background-color: deepskyblue;
}

button:not(.primary) {
  background-color: grey;
}
```

:::

# --questions--

## --text--

Quelle pseudo-classe fonctionne comme `:is()`, mais n'ajoute aucune spécificité à tes sélecteurs ?

## --answers--

`:not()`

### --feedback--

Cette pseudo-classe est super pour appliquer des styles larges et non invasifs.

---

`:has()`

### --feedback--

Cette pseudo-classe est super pour appliquer des styles larges et non invasifs.

---

`:where()`

---

`:empty`

### --feedback--

Cette pseudo-classe est super pour appliquer des styles larges et non invasifs.

## --video-solution--

3

## --text--

Laquelle de celles-ci n'est pas une pseudo-classe fonctionnelle ?

## --answers--

`:is()`

### --feedback--

Les pseudo-classes fonctionnelles utilisent des parenthèses et acceptent des arguments à l'intérieur.

---

`:first-child`

---

`:has()`

### --feedback--

Les pseudo-classes fonctionnelles utilisent des parenthèses et acceptent des arguments à l'intérieur.

---

`:where()`

### --feedback--

Les pseudo-classes fonctionnelles utilisent des parenthèses et acceptent des arguments à l'intérieur.

## --video-solution--

2

## --text--

Quelle pseudo-classe est parfaite pour une situation dans laquelle tu veux appliquer des styles à un groupe d'éléments sans une ou deux exceptions ?

## --answers--

`:has()`

### --feedback--

Pense à comment tu peux exclure des éléments spécifiques d'être stylisés.

---

`:is()`

### --feedback--

Pense à comment tu peux exclure des éléments spécifiques d'être stylisés.

---

`:not()`

---

`:where()`

### --feedback--

Pense à comment tu peux exclure des éléments spécifiques d'être stylisés.

## --video-solution--

3
