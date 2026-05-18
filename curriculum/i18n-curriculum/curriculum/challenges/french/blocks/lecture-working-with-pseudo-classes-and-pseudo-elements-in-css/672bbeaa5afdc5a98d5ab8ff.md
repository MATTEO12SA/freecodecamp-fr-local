---
id: 672bbeaa5afdc5a98d5ab8ff
title: Quels sont des exemples de pseudo-classes de localisation ?
challengeType: 19
dashedName: what-are-examples-of-location-pseudo-classes
---

# --interactive--

Les pseudo-classes de localisation sont utilisées pour styliser les liens et les éléments qui sont ciblés dans le document actuel. Elles offrent une façon d'appliquer des styles en fonction de si un lien est visité ou si un élément est actuellement en focus.

Des exemples de pseudo-classes de localisation sont :

- `:link`
- `:visited`
- `:any-link`
- `:local-link`
- `:target`

Regardons plus en profondeur chacune de ces pseudo-classes.

La pseudo-classe `:link` te permet de cibler tous les liens non visités sur une page web. Tu peux l'utiliser pour styliser les liens différemment avant que l'utilisateur ne clique dessus. Par exemple, tu pourrais vouloir rendre tous les liens non visités bleus ou la couleur principale de ton site web :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<a target="_blank" href="https://www.example.com">Visit Example.com</a>
```

```css
a:link {
  color: magenta;
}
```

:::

Dans ce cas, tout lien sur lequel l'utilisateur n'a pas encore cliqué apparaîtra magenta. Une fois que l'utilisateur clique sur le lien, le style `:link` ne s'applique plus, et la pseudo-classe `:visited` prend le relais. La pseudo-classe `:visited` entre en jeu après que l'utilisateur clique sur le lien, donc tu peux l'utiliser pour cibler les liens sur lesquels l'utilisateur a déjà cliqué.

Voici un exemple de changement de l'état de lien visité à la couleur `purple` :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<a target="_blank" href="https://www.example.com">Visit Example.com</a>
```

```css
a:visited {
  color: purple;
}
```

:::

La pseudo-classe `:visited` aide les utilisateurs à distinguer entre les liens qu'ils ont visités et ceux qu'ils n'ont pas visités.

La pseudo-classe `:any-link` est une combinaison des pseudo-classes `:link` et `:visited`. Donc elle correspond à n'importe quel élément d'ancrage avec un attribut `href`, qu'il soit visité ou non.

Voici un exemple de changement de la couleur de lien pour la pseudo-classe `:any-link` en `crimson` :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<a target="_blank" href="https://www.example.com">Visit Example.com</a>
```

```css
a:any-link {
  color: crimson;
}
```

:::

La pseudo-classe `:local-link` cible les liens qui pointent vers le même document. Elle peut être utile quand tu veux différencier les liens internes des externes. Actuellement, aucun navigateur ne prend en charge la pseudo-classe `:local-link`.

La pseudo-classe `:target` sélectionne un élément qui correspond à l'identifiant de fragment de l'URL actuelle, par exemple, `#section1`. Elle est très utile pour les pages avec une navigation interne.

Voici un exemple HTML qui représente une navigation interne. Le CSS utilise la pseudo-classe `:target` pour styliser la section qui correspond à là où l'utilisateur navigue :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<nav id="table-of-contents">
  <ul>
    <li><a href="#section1">Introduction</a></li>
    <li><a href="#section2">Features</a></li>
  </ul>
</nav>

<section id="section1">
  <h2>Introduction</h2>
  <p>This is the introduction section.</p>
</section>

<section id="section2">
  <h2>Features</h2>
  <p>This section describes the features.</p>
</section>
```

```css
section:target {
  background-color: green;
  border: 2px solid green;
  padding: 10px;
}
```

:::

Quand l'utilisateur clique sur l'un des liens de navigation, la couleur d'arrière-plan pour cette section respective passera au vert.

# --questions--

## --text--

Quelle pseudo-classe te permet de styliser un élément qui correspond à l'identifiant de fragment de l'URL actuelle, comme `#section1` ?

## --answers--

`:hover`

### --feedback--

Pense à comment tu peux mettre en évidence une section spécifique quand tu navigues à travers des liens internes à la page.

---

`:focus`

### --feedback--

Pense à comment tu peux mettre en évidence une section spécifique quand tu navigues à travers des liens internes à la page.

---

`:target`

---

`:checked`

### --feedback--

Pense à comment tu peux mettre en évidence une section spécifique quand tu navigues à travers des liens internes à la page.

## --video-solution--

3

## --text--

Quand les pseudo-classes de localisation sont-elles particulièrement utiles ?

## --answers--

Quand on stylise les éléments en fonction de leurs relations frères et sœurs.

### --feedback--

Pense à comment tu peux styliser les liens et les éléments ciblés en fonction de l'interaction utilisateur.

---

Quand on applique des styles en fonction de si un lien est visité ou si un élément est actuellement en focus.

---

Quand on stylise les éléments en fonction des attributs de leur élément parent.

### --feedback--

Pense à comment tu peux styliser les liens et les éléments ciblés en fonction de l'interaction utilisateur.

---

Quand on ajuste la mise en page d'une page web dynamiquement.

### --feedback--

Pense à comment tu peux styliser les liens et les éléments ciblés en fonction de l'interaction utilisateur.

## --video-solution--

2

## --text--

Quelle pseudo-classe est conçue pour cibler les liens qui pointent vers le même document mais n'est actuellement prise en charge par aucun navigateur ?

## --answers--

`:any-link`

### --feedback--

Considère la pseudo-classe destinée à distinguer les liens internes des externes, même si elle n'est pas encore prise en charge.

---

`:local-link`

---

`:visited`

### --feedback--

Considère la pseudo-classe destinée à distinguer les liens internes des externes, même si elle n'est pas encore prise en charge.

---

`:target`

### --feedback--

Considère la pseudo-classe destinée à distinguer les liens internes des externes, même si elle n'est pas encore prise en charge.

## --video-solution--

2
