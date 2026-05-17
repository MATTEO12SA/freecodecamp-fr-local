---
id: 66ed8fa2f45ce3ece4053eab
title: Quiz sur les bases du CSS
challengeType: 8
dashedName: quiz-basic-css
---

# --description--

Pour réussir le quiz, tu dois répondre correctement à au moins 18 des 20 questions ci-dessous.

# --quizzes--

## --quiz--

### --question--

#### --text--

Que signifie CSS ?

#### --distractors--

Cascading Style Script

---

Concatenating Style Script

---

Castor Sage Style

#### --answer--

Cascading Style Sheets

### --question--

#### --text--

Laquelle des suivantes est une règle CSS correcte ?

#### --distractors--

`p=red`

---

`p (color: red)`

---

`{p color: red;}`

#### --answer--

`p {color: red;}`

### --question--

#### --text--

Que fait `<meta name="viewport">` ?

#### --distractors--

Il lie des feuilles de style externes à une page web pour le design responsive.

---

Il spécifie les métadonnées utilisées par les moteurs de recherche pour indexer une page web.

---

Il spécifie l'encodage de caractères utilisé sur la page web.

#### --answer--

Il contrôle la forme et la taille d'une page web sur différentes tailles d'écran.

### --question--

#### --text--

Quelle syntaxe est correcte pour utiliser le CSS inline ?

#### --distractors--

`<p color =  blue></p>`

---

`<p><style = blue></p>`

---

`p {color: blue;}`

#### --answer--

`<p style="color: blue;"></p>`

### --question--

#### --text--

Quand on utilise le CSS interne, où l'élément `style` est-il placé dans le HTML ?

#### --distractors--

Dans l'élément `meta`.

---

Dans l'élément `script`.

---

Dans l'élément `body`.

#### --answer--

Dans l'élément `head`.

### --question--

#### --text--

Quelle règle est correcte pour définir la largeur et la hauteur en CSS ?

#### --distractors--

`height-width: 50px;`

---

`width-and-height: 50px;`

---

`flex-width: 50px; flex-height: 50px;`

#### --answer--

`width: 50px; height: 50px;`

### --question--

#### --text--

Quel sélecteur cible correctement les éléments `h1` uniquement à l'intérieur d'un `div` ?

#### --distractors--

`div, h1 {}`

---

`div ~ h1 {}`

---

`div + h1 {}`

#### --answer--

`div h1 {}`

### --question--

#### --text--

Quel sélecteur est correct pour cibler les enfants directs d'un `footer` ?

#### --distractors--

`footer ~ ul {}`

---

`footer + ul {}`

---

`footer ul {}`

#### --answer--

`footer > ul {}`

### --question--

#### --text--

Quel sélecteur est correct pour cibler le frère suivant d'un `img` ?

#### --distractors--

`img h1 {}`

---

`img > h1 {}`

---

`img ~ h1 {}`

#### --answer--

`img + h1 {}`

### --question--

#### --text--

Quel sélecteur est correct pour cibler tous les frères précédés par un élément `img` ?

#### --distractors--

`img > caption {}`

---

`img caption {}`

---

`img + caption {}`

#### --answer--

`img ~ caption {}`

### --question--

#### --text--

Quelle affirmation est VRAIE à propos des éléments block-level ?

#### --distractors--

Les éléments block-level s'empilent horizontalement par défaut.

---

Les propriétés `width` et `height` ne s'appliquent généralement pas aux éléments block-level sauf si tu définis leur propriété `display` à `inline-block`.

---

Les éléments block-level ne peuvent pas contenir d'éléments inline à l'intérieur.

#### --answer--

Les éléments block-level commencent sur une nouvelle ligne et prennent toute la largeur de leur conteneur.

### --question--

#### --text--

Quelle affirmation est VRAIE quand on utilise la valeur `inline-block` ?

#### --distractors--

Les éléments s'empilent verticalement, prenant toujours toute la largeur de leur conteneur.

---

Les éléments s'alignent horizontalement mais ne peuvent pas appliquer de padding ou margin vertical.

---

Les éléments respectent les paramètres de largeur et de hauteur mais ne peuvent pas contenir d'autres éléments à l'intérieur.

#### --answer--

Les éléments conservent le flux inline mais permettent de définir la largeur et la hauteur.

### --question--

#### --text--

Étant donné les sélecteurs suivants, lequel a la spécificité la plus élevée ?

#### --distractors--

`div`

---

`h1`

---

`p`

#### --answer--

`#id`

### --question--

#### --text--

Étant donné les sélecteurs suivants, lequel a la spécificité la plus faible ?

#### --distractors--

`#id`

---

`.class`

---

`div h1`

#### --answer--

`h1`

### --question--

#### --text--

Que fait le sélecteur `*` ?

#### --distractors--

Cible certains éléments de la page.

---

Cible les éléments qui ont des enfants sur la page.

---

Cible tous les éléments `p` de la page.

#### --answer--

Cible tous les éléments de la page.

### --question--

#### --text--

Que fait `!important` en CSS ?

#### --distractors--

Il fait fonctionner la règle CSS exclusivement pour les styles inline et ignore les styles définis dans les feuilles de style externes ou internes.

---

Il désactive toutes les autres propriétés CSS appliquées au même élément, ce qui en fait effectivement la seule règle qui affecte le style de l'élément.

---

Il s'applique à un certain sélecteur ou groupe d'éléments.

#### --answer--

Il remplace toutes les autres valeurs appliquées à la propriété pour ce sélecteur.

### --question--

#### --text--

Comment fonctionne l'algorithme de cascade CSS ?

#### --distractors--

Il détermine les styles de l'élément en fonction de l'ordre de déclaration, indépendamment des autres facteurs.

---

Il applique les styles uniquement en fonction de l'ordre dans lequel ils sont écrits, en ignorant la spécificité.

---

Il applique les styles en priorisant la spécificité, en ignorant l'origine et la pertinence.

#### --answer--

Il détermine les styles de l'élément en fonction de la spécificité et de l'ordre de déclaration.

### --question--

#### --text--

Quelle règle applique `32px` de margin à tous les côtés ?

#### --distractors--

`margin-top: 32px;`

---

`margin: 32px 0;`

---

`margin: 0 32px;`

#### --answer--

`margin: 32px;`

### --question--

#### --text--

Quelle règle applique `24px` de padding au haut et au bas ?

#### --distractors--

`padding: 24px;`

---

`padding-top-bottom: 24px;`

---

`padding: 0 24px;`

#### --answer--

`padding: 24px 0;`

### --question--

#### --text--

Pour `padding: 10px 20px 30px 40px`, quel est l'ordre correct des valeurs ?

#### --distractors--

Droite, Haut, Gauche, Bas.

---

Haut, Gauche, Bas, Droite.

---

Haut, Bas, Droite, Gauche.

#### --answer--

Haut, Droite, Bas, Gauche.

## --quiz--

### --question--

#### --text--

Quelles sont les parties principales d'une règle CSS ?

#### --distractors--

Éléments et attributs

---

Style et feuilles

---

Scripts et valeurs

#### --answer--

Sélecteurs et blocs de déclaration

### --question--

#### --text--

Laquelle des suivantes est la syntaxe correcte pour une règle CSS ?

#### --distractors--

```css
body [
  font-family: Arial;
]
```

---

```css
font-family {
  body: Arial;
}
```

---

```css
body {
  font-family; Arial:
}
```

#### --answer--

```css
body {
  font-family: Arial;
}
```

### --question--

#### --text--

Que sont les styles par défaut du navigateur ?

#### --distractors--

Des éléments HTML qui ont les mêmes propriétés de mise en forme indépendamment du navigateur.

---

Ce sont des styles obligatoires que tu dois utiliser pour des éléments HTML spécifiques.

---

Ce sont les thèmes de couleur des différents navigateurs.

#### --answer--

Les règles CSS que les navigateurs appliquent automatiquement.

### --question--

#### --text--

Quelle est la valeur par défaut de la propriété `width` ?

#### --distractors--

`none`

---

`0`

---

`100%`

#### --answer--

`auto`

### --question--

#### --text--

Que spécifie la propriété `min-height` ?

#### --distractors--

La hauteur de départ d'un élément.

---

La hauteur d'un élément.

---

La hauteur maximale d'un élément.

#### --answer--

La hauteur minimale d'un élément.

### --question--

#### --text--

Laquelle des suivantes est VRAIE à propos du sélecteur universel `*` ?

#### --distractors--

Il a la spécificité la plus élevée parce qu'il peut styliser tous les éléments d'une page.

---

Il contribue 1 à toutes les parties de la valeur de spécificité.

---

Il ne peut pas réinitialiser les styles entre différents navigateurs.

#### --answer--

Il a la valeur de spécificité la plus faible de tous les sélecteurs.

### --question--

#### --text--

Quel sélecteur cible correctement les éléments `li` d'une liste ordonnée ?

#### --distractors--

`li {}`

---

`ul li {}`

---

`ol + li {}`

#### --answer--

`ol li {}`

### --question--

#### --text--

Quel sélecteur cible les éléments paragraphe d'un élément `div` ?

#### --distractors--

`p div {}`

---

`div, p {}`

---

`p, div {}`

#### --answer--

`div p {}`

### --question--

#### --text--

Où la `margin` applique-t-elle ses propriétés de mise en forme ?

#### --distractors--

L'espace à l'intérieur de l'élément.

---

Entre le contenu et la bordure.

---

Sur la bordure de l'élément.

#### --answer--

L'espace à l'extérieur de l'élément.

### --question--

#### --text--

Où la propriété `padding` applique-t-elle ses styles ?

#### --distractors--

Entre la bordure de l'élément et les éléments environnants.

---

L'espace à l'extérieur de l'élément.

---

Sur la bordure de l'élément.

#### --answer--

L'espace à l'intérieur de l'élément.

### --question--

#### --text--

Quelle affirmation est FAUSSE à propos des éléments block-level ?

#### --distractors--

Ils peuvent s'étirer pour s'adapter à la largeur de leur conteneur.

---

Les éléments block-level courants incluent `div`, `paragraph` et `section`.

---

Les éléments block-level commencent sur une nouvelle ligne et prennent toute la largeur de leur conteneur.

#### --answer--

Ils ne peuvent pas prendre toute la largeur disponible car ils en sont empêchés.

### --question--

#### --text--

Quelle affirmation est FAUSSE quand on utilise la valeur `inline-block` ?

#### --distractors--

Les éléments `inline-block` se comportent comme des éléments inline.

---

Ils peuvent avoir des propriétés `width` et `height`.

---

Les éléments conservent le flux inline mais permettent de définir `width` et `height`.

#### --answer--

Ils ne partagent pas de propriétés avec les éléments inline ou block-level.

### --question--

#### --text--

Laquelle est VRAIE à propos du mot-clé `!important` ?

#### --distractors--

Il est utilisé pour faire des commentaires sur une propriété CSS importante.

---

Il s'assure qu'une propriété CSS a la syntaxe correcte.

---

Il rend les règles CSS plus faciles à maintenir.

#### --answer--

Il remplace la spécificité des autres sélecteurs.

### --question--

#### --text--

Quel caractère précède le nom d'un sélecteur de classe ?

#### --distractors--

`#`

---

`$`

---

`*`

#### --answer--

`.`

### --question--

#### --text--

Laquelle est FAUSSE à propos des éléments inline ?

#### --distractors--

Ils ne prennent que l'espace dont ils ont besoin.

---

Ils ne commencent pas sur une nouvelle ligne.

---

Les éléments inline courants incluent `span` et `img`.

#### --answer--

Ils commencent toujours sur une nouvelle ligne.

### --question--

#### --text--

Où les styles CSS internes sont-ils accessibles ?

#### --distractors--

Ce sont des styles importants pour le projet, donc ils ne sont pas partagés extérieurement.

---

Comme ils forment la mise en forme de base du projet, ils sont enregistrés dans le fichier `styles.css` pour que les autres pages web puissent y accéder.

---

Ils sont stockés à l'intérieur de l'élément `body` quand il n'y a qu'une seule page web à styliser.

#### --answer--

Ils sont écrits dans la section `style` à l'intérieur de l'élément `head`.

### --question--

#### --text--

Quel est l'ordre pour appliquer la propriété `padding` quand on utilise la syntaxe raccourcie ?

#### --distractors--

`top`, `bottom`, `left`, `right`

---

`left`, `right`, `top`, `bottom`

---

`right`, `top`, `left`, `bottom`

#### --answer--

`top`, `right`, `bottom`, `left`

### --question--

#### --text--

Quel est l'ordre pour appliquer la propriété `margin` quand on utilise la syntaxe raccourcie ?

#### --distractors--

`left`, `right`, `top`, `bottom`

---

`right`, `top`, `left`, `bottom`

---

`top`, `bottom`, `left`, `right`

#### --answer--

`top`, `right`, `bottom`, `left`

### --question--

#### --text--

À quoi servent les styles CSS inline ?

#### --distractors--

Ils sont utilisés pour styliser uniquement les éléments inline.

---

Ils sont utilisés pour styliser les éléments uniquement quand ils apparaissent tous sur la même ligne du viewport du navigateur.

---

Ils sont utilisés pour résoudre le problème de séparation des préoccupations.

#### --answer--

Ils sont utilisés pour styliser directement dans l'élément, au lieu d'utiliser du CSS interne ou externe.

### --question--

#### --text--

Quel symbole précède le sélecteur ID ?

#### --distractors--

`.`

---

`*`

---

`$`

#### --answer--

`#`
