---
id: 672bbeb6eefd7ca9c003ea00
title: Quels sont des exemples de pseudo-classes structurelles d'arbre ?
challengeType: 19
dashedName: what-are-examples-of-tree-structural-pseudo-classes
---

# --interactive--

Les pseudo-classes structurelles d'arbre te permettent de cibler et styliser les éléments en fonction de leur position dans l'arbre du document. L'arbre du document fait référence à la structure hiérarchique des éléments dans un document HTML.

Voici une liste de pseudo-classes structurelles d'arbre :

- `:root`
- `:empty`
- `:nth-child(n)`
- `:nth-last-child(n)`
- `:first-child`
- `:last-child`
- `:only-child`
- `:nth-of-type`
- `:first-of-type`
- `:last-of-type`
- `:only-of-type`

Regardons de plus près chacune des pseudo-classes structurelles d'arbre, accompagnée d'exemples.

La pseudo-classe `:root` est généralement l'élément `html` racine. Elle t'aide à cibler le plus haut niveau du document pour que tu puisses appliquer un style commun à tout le document.

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<h1>Welcome to My Website</h1>
<p>This is a sample paragraph to demonstrate the :root pseudo-class.</p>
```

```css
:root {
  background: black;
  color: aliceblue;
}
```

:::

La pseudo-classe `:root` est aussi couramment utilisée pour définir les variables CSS :

```css
:root {
  --main-font: 'Arial, sans-serif';
  --primary-color: blue; 
  --secondary-color: green; 
}
```

Avec les variables CSS, tu peux stocker des valeurs et les réutiliser dans ta feuille de style. Tu en apprendras plus sur ça plus tard.

Les éléments vides, c'est-à-dire les éléments sans enfants autres que de l'espace blanc, sont aussi inclus dans l'arbre du document. C'est pour ça qu'il y a une pseudo-classe `:empty` pour cibler les éléments vides. Par exemple, ce code HTML a deux éléments de liste vides. Avec la pseudo-classe `:empty`, tu peux styliser les éléments de liste vides différemment :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<ul>
  <li>Item 1</li>
  <li></li> <!-- This list is empty -->
  <li>Item 2</li>
  <li></li> <!-- Another empty list -->
  <li>Item 3</li>
</ul>
```

```css
:empty {
  background: black;
}
```

:::

La chose la plus pratique à faire avec les éléments de liste vides est probablement de ne pas les afficher du tout :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<ul>
  <li>Item 1</li>
  <li></li> <!-- This list is empty -->
  <li>Item 2</li>
  <li></li> <!-- Another empty list -->
  <li>Item 3</li>
</ul>
```

```css
:empty {
  display: none;
}
```

:::

`:nth-child(n)` te permet de sélectionner les éléments en fonction de leur position dans un parent, tandis que `:nth-last-child(n)` te permet de sélectionner les éléments en comptant à partir de la fin. Le `n` peut être un nombre spécifique ou un mot-clé comme `odd` ou `even`. C'est incroyablement utile pour styliser les cellules de tableau en fonction de la position : paire et impaire.

Voici un exemple HTML d'une table de prix de fruits. Le CSS utilise la pseudo-classe `:nth-child` pour cibler les cellules de tableau en fonction des positions paires et impaires :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<table>
  <tr>
    <th>Item</th>
    <th>Price</th>
  </tr>
  <tr>
    <td>Apple</td>
    <td>$1.00</td>
  </tr>
  <tr>
    <td>Banana</td>
    <td>$0.50</td>
  </tr>
  <tr>
    <td>Orange</td>
    <td>$0.80</td>
  </tr>
</table>
```

```css
th,
td {
  border: 1px solid lightgray;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: orangered;
}

tr:nth-child(odd) {
  background-color: lightgreen;
}
```

:::

Les pseudo-classes `:first-child`, `:last-child` et `:only-child` agissent toutes sur les éléments dans un conteneur parent ou tout le document.

- `:first-child` sélectionne le premier élément dans un élément parent ou le document.
- `:last-child` sélectionne le dernier élément dans un élément parent ou le document.
- `:only-child` sélectionne le seul élément dans un élément parent ou le document.

Utiliser les pseudo-classes `:first-child` et `:last-child` sélectionnera à la fois `Item 1` et `Item 3` dans cet exemple :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

```css
li:first-child {
  background-color: orangered;
}

li:last-child {
  background-color: lightgreen;
}
```

:::

Si tu as plus de listes non ordonnées sur la page, tu dois être plus spécifique avec la sélection :

Pour te montrer comment la pseudo-classe `:only-child` fonctionne, voici un exemple HTML avec deux éléments `div` séparés. Utiliser la pseudo-classe `:only-child` garantit que seul l'élément `div` avec un seul enfant est sélectionné :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<div class="container">
  <div>This is the only item in this container.</div>
</div>

<div class="container">
  <div>This is one of two items in this container.</div>
  <div>Here is the second item.</div>
</div>
```

```css
.container div:only-child {
  border: 2px solid crimson;
  padding: 10px;
  background-color: lightblue;
}
```

:::

Les pseudo-classes `:first-of-type` et `:last-of-type` sélectionnent la première et la dernière occurrence d'un type d'élément spécifique dans son parent. Elles sont utiles pour appliquer des styles uniques à la première ou la dernière instance de ce type d'élément parmi ses frères et sœurs.

Dans l'exemple ci-dessous, `:first-of-type` et `:last-of-type` s'appliquent au premier élément et au dernier élément dans l'élément `section` :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />

<section>
  <h2>Introduction</h2>
  <p>This is the first paragraph in the first section</p>
  <p>This is the second paragraph in the first section</p>
</section>
<section>
  <h2>Details</h2>
  <p>This is the first paragraph in the second section.</p>
  <p>This is the second paragraph in the second section.</p>
</section>
```

```css
section p:first-of-type {
  background-color: lightgreen;
}

section p:last-of-type {
  background-color:lightblue;
}
```

:::

`:nth-of-type(n)` te permet de sélectionner un élément spécifique dans son parent en fonction de sa position parmi les frères et sœurs du même type. Par exemple, dans le HTML ci-dessous, `:nth-of-type(2)` cible le second élément dans le container :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />

<div class="container">
  <p>First paragraph</p>
  <p>Second paragraph</p>
  <p>Third paragraph</p>
</div>
```

```css
p:nth-of-type(2) {
  color: red;
  font-weight: bold;
}
```

:::

`:only-of-type` sélectionne un élément s'il est le seul de son type dans son parent. Ça peut être utile pour mettre l'accent sur des éléments uniques ou s'assurer qu'ils sont stylisés différemment quand ils ne font pas partie d'un groupe.

Dans l'exemple ci-dessous, il y a deux éléments `div` avec l'un ayant un seul élément. Le CSS s'applique uniquement au premier container :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />

<div class="container">
  <p>The only paragraph</p>
</div>

<div class="container">
  <p>The first paragraph</p>
  <p>The second paragraph</p>
</div>
```

```css
p:only-of-type {
  border: 4px solid green;
}
```

:::

# --questions--

## --text--

Quelle est la différence entre les pseudo-classes `:first-of-type` et `:last-of-type` ?

## --answers--

`:first-of-type` cible le premier élément d'un type spécifique dans son parent, tandis que `:last-of-type` cible le dernier élément d'un type différent.

### --feedback--

Considère comment ces pseudo-classes t'aident à styliser la première et la dernière instance d'une balise particulière, comme `p` ou `h1`.

---

`:first-of-type` et `:last-of-type` ciblent toutes les deux la première occurrence d'un élément mais dans différentes sections du document.

### --feedback--

Considère comment ces pseudo-classes t'aident à styliser la première et la dernière instance d'une balise particulière, comme `p` ou `h1`.

---

`:first-of-type` sélectionne la première occurrence d'un type d'élément spécifique dans son parent, tandis que `:last-of-type` sélectionne la dernière occurrence de ce même type d'élément dans son parent.

---

`:last-of-type` applique des styles aux premiers et derniers éléments dans le document, tandis que `:last-of-type` applique des styles à tous les éléments d'un type spécifique.

### --feedback--

Considère comment ces pseudo-classes t'aident à styliser la première et la dernière instance d'une balise particulière, comme `p` ou `h1`.

## --video-solution--

3

## --text--

Quelle est la différence entre les pseudo-classes `:first-child` et `:last-child` ?

## --answers--

`:first-child` cible le premier élément dans son parent, tandis que `:last-child` cible le dernier élément dans un parent différent.

### --feedback--

Pense à comment les deux pseudo-classes t'aident à styliser les premiers et derniers éléments dans le même conteneur parent.

---

`:first-child` cible le premier élément dans son parent, tandis que `:last-child` cible le dernier élément dans le même parent.

---

`:first-child` cible le premier élément d'un type spécifique dans son parent, tandis que `:last-child` cible le dernier élément d'un type différent dans son parent.

### --feedback--

Pense à comment les deux pseudo-classes t'aident à styliser les premiers et derniers éléments dans le même conteneur parent.

---

`:first-child` cible les premiers et derniers éléments dans un parent, tandis que `:last-child` cible tous les autres éléments.

### --feedback--

Pense à comment les deux pseudo-classes t'aident à styliser les premiers et derniers éléments dans le même conteneur parent.

## --video-solution--

2

## --text--

Quelle pseudo-classe te permet de cibler les éléments qui n'ont pas d'enfants, y compris ceux qui ne contiennent que de l'espace blanc ?

## --answers--

`:empty`

---

`:first-child`

### --feedback--

Pense à comment tu peux styliser les éléments qui n'ont pas de contenu.

---

`:last-child`

### --feedback--

Pense à comment tu peux styliser les éléments qui n'ont pas de contenu.

---

`:only-of-type`

### --feedback--

Pense à comment tu peux styliser les éléments qui n'ont pas de contenu.

## --video-solution--

1
