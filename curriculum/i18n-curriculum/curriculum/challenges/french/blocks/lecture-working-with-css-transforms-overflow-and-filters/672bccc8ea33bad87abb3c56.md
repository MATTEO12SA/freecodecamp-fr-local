---
id: 672bccc8ea33bad87abb3c56
title: Quelle est la différence entre content-box et border-box ?
challengeType: 19
dashedName: what-is-the-difference-between-content-box-and-border-box
---

# --interactive--

La propriété `box-sizing` peut être définie sur `content-box` ou `border-box` pour contrôler la façon dont la largeur et la hauteur des éléments sont calculées.

Cette propriété peut être définie sur le sélecteur universel (`*`) pour s'appliquer à tous les éléments du document :

```css
* {
  box-sizing: border-box;
}
```

La valeur de la propriété `box-sizing` est `content-box` par défaut, mais tu peux choisir `border-box` si tu en as besoin. Nous allons d'abord explorer `content-box`, puis nous passerons à `border-box`.

Pour comprendre le fonctionnement des modèles, tu dois connaître les quatre concepts principaux du modèle de boîte CSS. Faisons un rapide rappel.

- La zone de contenu est l'espace occupé par le contenu de l'élément.
- Le `padding` est l'espace entre la zone de contenu et la bordure.
- La `border` est le contour qui entoure la zone de contenu et le `padding`.
- La `margin` est l'espace à l'extérieur de la bordure qui sépare l'élément des autres éléments.

Dans le modèle `content-box`, la largeur et la hauteur que tu définis pour un élément déterminent les dimensions de la zone de contenu, mais elles n'incluent pas le `padding`, la `border` ni la `margin`. Utilise `content-box` quand tu as besoin d'un contrôle précis sur la zone de contenu. Quand tu définis `width` et `height`, tu définis seulement la taille du contenu lui-même.

Pour trouver la largeur totale de l'élément, tu devras ajouter le `padding` gauche et droit, ainsi que les bordures gauche et droite. De la même façon, la hauteur totale d'un élément peut être trouvée en ajoutant la hauteur du contenu, le `padding` du haut et du bas, et les bordures du haut et du bas.

Par exemple, nous avons ici un sélecteur de type CSS pour tous les éléments `div`.

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css">
<div></div>
```

```css
div {
  width: 300px;
  height: 200px;
  padding: 20px;
  border: 4px solid black;
}
```

:::

Dans ce cas, si `content-box` est utilisé, la zone de contenu fera 300px sur 200px. La taille totale rendue inclut le `padding` et les bordures. Par exemple, largeur totale = 300px (contenu) + 40px (`padding`) + 8px (bordures) = 348px ; la hauteur totale est calculée de la même façon.

Très bien ! Explorons maintenant `border-box`. C'est différent, car la largeur et la hauteur que tu définis incluent le contenu, le `padding` et la bordure de l'élément (mais pas sa `margin`). Utilise `border-box` quand tu veux que la taille totale de l'élément reste fixe même si le `padding` ou les bordures changent. C'est souvent utile dans les mises en page responsives.

Avec `border-box`, le `padding` et les bordures sont inclus à l'intérieur de la taille spécifiée pour l'élément. Les `width` et `height` que tu définis deviennent les dimensions totales de l'élément : contenu + `padding` + bordure ; les margins restent exclues.

Dans l'exemple suivant, il y a deux éléments `div` avec les mêmes dimensions, mais des valeurs `box-sizing` différentes. Remarque comment cela donne des tailles totales différentes dans le navigateur :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css">
<div class="box" id="red-div"></div>
<div class="box" id="blue-div"></div>
```


```css
.box {
  width: 300px;
  height: 200px;
  padding: 20px;
  border: 4px solid black;
  margin: 10px;
}

#red-div {
  box-sizing: content-box;
  background-color: red;
}

#blue-div {
  box-sizing: border-box;
  background-color: blue;
}
```

:::

Tu peux voir qu'ils ont tous les deux les mêmes `width`, `height`, `padding`, `border` et `margin`. Les seules différences sont les couleurs et la valeur de la propriété `box-sizing`. Cette petite différence a un impact très important sur les dimensions finales.

Choisir entre `content-box` et `border-box` dépend vraiment des besoins spécifiques de ton projet. Même si `border-box` devient de plus en plus populaire grâce à sa simplicité et sa flexibilité, comprendre les deux modèles est important pour implémenter des mises en page CSS efficaces.

# --questions--

## --text--

Laquelle des valeurs suivantes est la valeur par défaut de la propriété `box-sizing` dans la plupart des navigateurs ?

## --answers--

`content-box`

---

`border-box`

### --feedback--

Pense au comportement par défaut pour le dimensionnement des éléments.

---

`padding-box`

### --feedback--

Pense au comportement par défaut pour le dimensionnement des éléments.

---

`margin-box`

### --feedback--

Pense au comportement par défaut pour le dimensionnement des éléments.

## --video-solution--

1

## --text--

Quel est le principal avantage d'utiliser `border-box` pour créer des mises en page responsives ?

## --answers--

Cela rend les calculs plus compliqués.

### --feedback--

Pense à la façon dont le modèle `border-box` gère `padding` et `border` dans les `width` et `height` spécifiées.

---

Cela permet un contrôle plus précis des dimensions de l'élément.

### --feedback--

Pense à la façon dont le modèle `border-box` gère `padding` et `border` dans les `width` et `height` spécifiées.

---

Cela garantit que les éléments conservent leurs dimensions spécifiées, quels que soient les changements de `padding` ou de `border`.

---

Cela améliore la compatibilité des navigateurs.

### --feedback--

Pense à la façon dont le modèle `border-box` gère `padding` et `border` dans les `width` et `height` spécifiées.

## --video-solution--

3

## --text--

Dans le modèle `content-box`, que représente la `width` spécifiée d'un élément ?

## --answers--

La `width` totale de l'élément, y compris `padding`, `border` et `margin`.

### --feedback--

Pense à la relation entre la zone de contenu et les dimensions globales de l'élément dans le modèle `content-box`.

---

La `width` de la zone de contenu uniquement.

---

La `width` de la `border`.

### --feedback--

Pense à la relation entre la zone de contenu et les dimensions globales de l'élément dans le modèle `content-box`.

---

La `width` du `padding`.

### --feedback--

Pense à la relation entre la zone de contenu et les dimensions globales de l'élément dans le modèle `content-box`.

## --video-solution--

2
