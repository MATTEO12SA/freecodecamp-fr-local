---
id: 66ed8fedf45ce3ece4053eb3
title: Quiz sur CSS Grid
challengeType: 8
dashedName: quiz-css-grid
---

# --description--

Pour réussir le quiz, tu dois répondre correctement à au moins 18 des 20 questions ci-dessous.

# --quizzes--

## --quiz--

### --question--

#### --text--

Qu'est-ce que CSS Grid ?

#### --distractors--

Une méthode utilisée pour afficher des tableaux sur un site web.

---

Une méthode utilisée pour disposer des images en tuiles.

---

Une façon d'afficher des contours autour des éléments HTML.

#### --answer--

Une mise en page en deux dimensions pour les documents HTML.

### --question--

#### --text--

Laquelle des propositions suivantes est la bonne façon de créer un conteneur de grille ?

#### --distractors--

`display: grid-area;`

---

`grid: grid-template;`

---

`grid-template: set;`

#### --answer--

`display: grid;`

### --question--

#### --text--

Que fait la propriété `grid-template-columns` ?

#### --distractors--

Elle définit deux colonnes et trois lignes pour un conteneur de grille.

---

Elle définit toutes les colonnes de la mise en page en grille sur une longueur fixe.

---

Elle crée un conteneur de mise en page en grille à deux colonnes.

#### --answer--

Elle définit le nombre de colonnes dans une mise en page en grille.

### --question--

#### --text--

Que fait la propriété `grid-template-rows` ?

#### --distractors--

Elle précise la taille et l'emplacement d'un élément de grille dans une mise en page en grille.

---

Elle crée un modèle pour créer de nouvelles lignes de grille.

---

Elle précise une taille de ligne par défaut dans le conteneur de grille.

#### --answer--

Elle précise le nombre et la hauteur de chaque ligne dans une mise en page en grille.

### --question--

#### --text--

Que fait la fonction `minmax()` ?

#### --distractors--

Elle alterne entre la première et la deuxième valeur, selon l'espace disponible.

---

Elle renvoie la moyenne des deux entrées.

---

Elle définit la taille minimale de l'élément pour un navigateur fonctionnant en plein écran.

#### --answer--

Elle définit les tailles minimale et maximale d'une piste.

### --question--

#### --text--

Quel est le raccourci des propriétés `column-gap` et `row-gap` ?

#### --distractors--

`gap-column-row`

---

`gutters`

---

`grid-gap`

#### --answer--

`gap`

### --question--

#### --text--

Quelle est la différence entre une grille implicite et une grille explicite ?

#### --distractors--

Les grilles implicites utilisent la propriété `grid-template-columns`, tandis que les grilles explicites utilisent la propriété `grid-template-rows`.

---

Les grilles explicites utilisent la propriété `grid-template-columns`, tandis que les grilles implicites utilisent la propriété `grid-template-rows`.

---

Les grilles implicites utilisent les propriétés `grid-template-columns` ou `grid-template-rows` pour créer des colonnes, tandis que les lignes et colonnes sont automatiquement créées dans les grilles explicites.

#### --answer--

Les grilles explicites utilisent les propriétés `grid-template-columns` ou `grid-template-rows` pour créer des colonnes, tandis que les lignes et colonnes sont automatiquement créées dans les grilles implicites.

### --question--

#### --text--

Laquelle des unités suivantes représente une fraction de l'espace dans le conteneur de grille ?

#### --distractors--

`fractional`

---

`frac`

---

`f`

#### --answer--

`fr`

### --question--

#### --text--

Que sont les lignes de grille ?

#### --distractors--

Un raccourci pour les lignes et les colonnes.

---

Les contours d'un élément de grille.

---

Des lignes le long desquelles les colonnes et lignes de grille sont créées.

#### --answer--

Des lignes sur lesquelles chacun des éléments de grille commence et se termine.

### --question--

#### --text--

Que fait la propriété `grid-column` ?

#### --distractors--

Elle ajoute un nouvel élément de grille comme enfant de l'élément auquel elle est appliquée.

---

Elle aligne verticalement le texte dans l'élément de grille.

---

Elle définit deux colonnes pour un conteneur de grille.

#### --answer--

Elle indique à l'élément de grille sur quelle ligne de grille il doit commencer et se terminer.

### --question--

#### --text--

Comment créer quatre colonnes de largeur égale ?

#### --distractors--

`grid-template-columns: repeat(4);`

---

`grid-template-columns: repeat(1, 4);`

---

`grid-template-columns: repeat(1fr, 4);`

#### --answer--

`grid-template-columns: repeat(4, 1fr);`

### --question--

#### --text--

Que fait la propriété `grid-template-areas` ?

#### --distractors--

Elle sert à préciser où l'élément commence sur une ligne dans le conteneur de grille.

---

Elle sert à créer des espaces entre les pistes dans le conteneur.

---

Elle sert à répéter des sections dans la liste des pistes.

#### --answer--

Elle sert à donner un nom aux éléments que tu vas positionner sur la grille.

### --question--

#### --text--

Que fait la propriété `grid-auto-flow` ?

#### --distractors--

Elle contrôle l'ordre dans lequel les éléments de grille sont affichés.

---

Elle ajuste l'espacement entre les éléments de grille.

---

Elle ajuste automatiquement l'élément pour qu'il tienne dans la grille.

#### --answer--

Elle contrôle comment les éléments placés automatiquement sont insérés dans la grille.

### --question--

#### --text--

Laquelle des propositions suivantes est la bonne façon d'utiliser la propriété `grid-template-areas` ?

#### --distractors--

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr; 
  grid-template-rows: auto 1fr auto; 
  grid-template-areas: set(
    "header header"
    "sidebar main"
    "footer footer" 
  );
  gap: 20px; 
}
```

---

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr; 
  grid-template-rows: auto 1fr auto; 
  grid-template-areas: apply(
    "header header"
    "sidebar main"
    "footer footer" 
  );
  gap: 20px; 
}
```

---

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr; 
  grid-template-rows: auto 1fr auto; 
  grid-template-areas: set-areas;
  gap: 20px; 
}
```

#### --answer--

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr; 
  grid-template-rows: auto 1fr auto; 
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer"; 
  gap: 20px; 
}
```

### --question--

#### --text--

Laquelle des propositions suivantes est la bonne façon de travailler avec la propriété `grid-auto-flow` ?

#### --distractors--

```css
.social-icons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-flow: none;
  grid-auto-columns: 1fr;
}
```

---

```css
.social-icons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-flow: allow;
  grid-auto-columns: 1fr;
}
```

---

```css
.social-icons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-flow: set;
  grid-auto-columns: 1fr;
}
```

#### --answer--

```css
.social-icons {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
}
```

### --question--

#### --text--

Laquelle des propriétés suivantes n'est PAS une propriété de grille valide ?

#### --distractors--

`gap`

---

`grid-column`

---

`grid-template-columns`

#### --answer--

`grid-set`

### --question--

#### --text--

Laquelle de ces propriétés peut être utilisée pour centrer les éléments à l'intérieur d'un élément de grille ?

#### --distractors--

`allow-items`

---

`set-items`

---

`center-items`

#### --answer--

`align-items`

### --question--

#### --text--

Laquelle des valeurs suivantes est correcte avec la propriété `grid-auto-columns` ?

#### --distractors--

`grid-auto-columns: unset-grid;`

---

`grid-auto-columns: revert-grid;`

---

`grid-auto-columns: set-content(20%);`

#### --answer--

`grid-auto-columns: 1fr;`

### --question--

#### --text--

Que sont les pistes de grille ?

#### --distractors--

Un raccourci pour les lignes et les colonnes.

---

Des lignes le long desquelles tu peux animer le mouvement des éléments de grille.

---

Des lignes sur lesquelles chacun des éléments de grille commence et se termine.

#### --answer--

Les espaces entre deux lignes de grille adjacentes.

### --question--

#### --text--

Laquelle des propositions suivantes est la bonne façon d'utiliser la fonction `minmax()` ?

#### --distractors--

```css
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(apply);
}
```

---

```css
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax();
}
```

---

```css
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(set);
}
```

#### --answer--

```css
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(150px, auto);
}
```

## --quiz--

### --question--

#### --text--

Comment positionner un élément de grille dans une mise en page définie par `grid-template-areas` ?

#### --distractors--

En définissant directement la taille et l'emplacement de l'élément dans la grille avec `grid-template-rows` et `grid-template-columns`.

---

En utilisant la propriété `grid-area` et en précisant les positions de début et de fin de ligne et de colonne.

---

En définissant à la fois `grid-area` et des coordonnées explicites en pixels.

#### --answer--

En assignant la zone nommée à la propriété `grid-area` de l'élément.

### --question--

#### --text--

Que contrôle la propriété `grid-auto-rows` ?

#### --distractors--

La hauteur des lignes définies explicitement.

---

La largeur maximale des colonnes de grille.

---

L'espacement entre les lignes.

#### --answer--

La taille des lignes créées implicitement.

### --question--

#### --text--

Quelle propriété utiliserais-tu pour faire s'étendre un élément de grille sur plusieurs lignes ?

#### --distractors--

`grid-row-span`

---

`row-span`

---

`span-rows`

#### --answer--

`grid-row`

### --question--

#### --text--

Qu'est-ce qui définit une grille explicite ?

#### --distractors--

Des pistes créées automatiquement pour s'adapter au contenu.

---

Des pistes définies par l'unité `fr`.

---

Des pistes ajoutées avec `grid-auto-flow`.

#### --answer--

Des pistes définies explicitement avec `grid-template-columns` ou `grid-template-rows`.

### --question--

#### --text--

Quelle valeur de `grid-auto-flow` ferait remplir les colonnes en premier par les nouveaux éléments ?

#### --distractors--

`row`

---

`vertical`

---

`row dense`

#### --answer--

`column`

### --question--

#### --text--

Quel est le rôle de `grid-template-areas` ?

#### --distractors--

Générer automatiquement des pistes implicites.

---

Remplacer l'unité `fr`.

---

Définir des valeurs de `z-index`.

#### --answer--

Représenter visuellement les éléments avec des zones de grille nommées.

### --question--

#### --text--

Comment faire commencer un élément de grille à la ligne de colonne 2 et le faire se terminer à la ligne de colonne 4 ?

#### --distractors--

`grid-column: 2 / span 4;`

---

`grid-column: start 2 / end 4;`

---

`grid-column: from 2 to 4;`

#### --answer--

`grid-column: 2 / 4;`

### --question--

#### --text--

Quel est l'effet de `grid-template-columns: 1fr 2fr 1fr` ?

#### --distractors--

Cela crée trois colonnes de largeur égale.

---

Cela rend la colonne du milieu trois fois plus large que les autres.

---

Cela force toutes les colonnes à avoir exactement une largeur de `1fr`.

#### --answer--

Cela crée trois colonnes où celle du milieu est deux fois plus large que les colonnes latérales.

### --question--

#### --text--

Comment créer une grille avec 3 colonnes égales et un espace de `20px` entre elles ?

#### --distractors--

```css
.container {
  display: grid;
  grid-template: repeat(3, 1fr) / 20px;
} 
```

---

```css
.container {
  display: grid;
  grid: 1fr 1fr 1fr / gap 20px;
}
```

---

```css
.container {
  display: grid;
  grid-template-columns: 20px 1fr 1fr 1fr;
}
```

#### --answer--

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

### --question--

#### --text--

Que crée `repeat(3, minmax(100px, 1fr))` ?

#### --distractors--

Trois colonnes qui ne peuvent pas rétrécir sous `100px`.

---

Trois colonnes fixes de `100px`.

---

Trois lignes avec une hauteur maximale de `1fr`.

#### --answer--

Trois colonnes qui grandissent proportionnellement, mais ne rétrécissent pas sous `100px`.

### --question--

#### --text--

Quelle affirmation sur les grilles implicites est vraie ?

#### --distractors--

Les grilles implicites ignorent la propriété `gap`.

---

Les pistes implicites doivent être définies avec `grid-template-areas`.

---

Les pistes implicites ne peuvent être créées qu'avec la propriété `grid-auto-flow`.

#### --answer--

Les pistes implicites sont créées quand le contenu ne tient pas dans les pistes explicites.

### --question--

#### --text--

Que fait la propriété `place-items` dans CSS Grid ?

#### --distractors--

Elle définit automatiquement la taille des éléments de grille selon l'espace disponible.

---

Elle contrôle les définitions des colonnes et lignes du modèle de grille.

---

Elle ajuste l'ordre des éléments de grille dans le conteneur.

#### --answer--

C'est un raccourci pour aligner les éléments de grille sur les axes de bloc et en ligne.

### --question--

#### --text--

Que permet ce CSS ?

```css
.container {
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
```

#### --distractors--

Créer des colonnes fixes de `150px` qui débordent du conteneur.

---

Créer des colonnes qui font exactement `1fr` de large quel que soit le contenu.

---

Créer au maximum une colonne par tranche de `150px` de largeur disponible.

#### --answer--

Créer des colonnes flexibles qui mesurent au moins `150px` et se replient quand l'espace est limité.

### --question--

#### --text--

Comment créer des mises en page en grille asymétriques ?

#### --distractors--

En utilisant seulement des unités `fr`.

---

En mélangeant différentes unités de longueur dans `grid-template-columns`.

---

En définissant `grid-asymmetric: true`.

#### --answer--

En définissant des tailles différentes pour chaque piste.

### --question--

#### --text--

Que fait `grid-column-start: 2` à un élément de grille ?

#### --distractors--

Il le fait s'étendre sur 2 colonnes.

---

Il le décale de 2 pixels.

---

Il le positionne à partir de la deuxième ligne de grille verticale.

#### --answer--

Il le fait commencer à la deuxième ligne de colonne.

### --question--

#### --text--

Quelle propriété utiliserais-tu pour contrôler le comportement de débordement dans les pistes de grille ?

#### --distractors--

`grid-overflow`

---

`track-sizing`

---

`fit-content`

#### --answer--

`minmax()`

### --question--

#### --text--

Quel sera le résultat du code suivant ?

```css
.container {
  display: grid;
  grid-template-columns: 100px 1fr 2fr;
  grid-template-rows: auto 150px;
  gap: 10px;
}
```

#### --distractors--

Le conteneur aura trois colonnes de largeur égale et deux lignes d'une hauteur de `150px` chacune.

---

Le conteneur aura trois colonnes, toutes avec une largeur de `100px`, et deux lignes d'une hauteur de `150px`.

---

Le conteneur aura deux lignes, chacune avec une hauteur de `1fr`.

#### --answer--

Le conteneur aura trois colonnes : `100px`, `1fr` et `2fr` de large, et deux lignes : une en `auto` et une d'une hauteur de `150px`.

### --question--

#### --text--

Comment faire s'étendre un élément de grille sur toutes les lignes disponibles ?

#### --distractors--

`grid-row: full;`

---

`grid-row: auto / -1;`

---

`grid-row: 1 / span infinite;`

#### --answer--

`grid-row: 1 / -1;`

### --question--

#### --text--

Quelle propriété contrôle l'alignement des éléments de grille le long de l'axe de bloc ?

#### --distractors--

`justify-items`

---

`place-items`

---

`align-content`

#### --answer--

`align-items`

### --question--

#### --text--

Comment garantir qu'un élément de grille reste dans la première colonne quels que soient les changements de grille ?

#### --distractors--

`grid-column: fixed;`

---

`grid-column: first;`

---

`grid-lock: column;`

#### --answer--

`grid-column: 1;`
