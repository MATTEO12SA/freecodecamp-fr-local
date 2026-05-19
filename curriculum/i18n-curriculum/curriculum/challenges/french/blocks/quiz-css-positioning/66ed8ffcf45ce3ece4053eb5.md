---
id: 66ed8ffcf45ce3ece4053eb5
title: Quiz sur le positionnement CSS
challengeType: 8
dashedName: quiz-css-positioning
---

# --description--

Pour réussir le quiz, tu dois répondre correctement à au moins 18 des 20 questions ci-dessous.

# --quizzes--

## --quiz--

### --question--

#### --text--

Laquelle des valeurs suivantes n'est PAS une valeur valide pour la propriété `position` ?

#### --distractors--

`fixed`

---

`absolute`

---

`relative`

#### --answer--

`above`

### --question--

#### --text--

Quel est le rôle principal de la propriété `float` en CSS ?

#### --distractors--

Les flottants servent à retirer un élément de son flux normal sur la page et à le positionner automatiquement dans le coin supérieur droit de la page web.

---

Les flottants servent à retirer un élément de son flux normal sur la page et à le positionner en haut de son conteneur.

---

Les flottants servent à retirer un élément de son flux normal sur la page et à le positionner automatiquement dans le coin inférieur droit de la page web.

#### --answer--

Les flottants servent à retirer un élément de son flux normal sur la page et à le positionner soit à gauche, soit à droite de son conteneur.

### --question--

#### --text--

Lequel des exemples suivants montre comment faire flotter un élément boîte à gauche ?

#### --distractors--

```css
.box {
  left: float;
  margin-right: 15px;
  width: 50px;
  height: 50px;
  background-color: black;
}
```

---

```css
.box {
  position: float-left;
  margin-right: 15px;
  width: 50px;
  height: 50px;
  background-color: black;
}
```

---

```css
.box {
  float: left-side;
  margin-right: 15px;
  width: 50px;
  height: 50px;
  background-color: black;
}
```

#### --answer--

```css
.box {
  float: left;
  margin-right: 15px;
  width: 50px;
  height: 50px;
  background-color: black;
}
```

### --question--

#### --text--

Quel est le rôle de la propriété `clear` ?

#### --distractors--

Elle sert à déterminer si un élément doit être déplacé en bas de la page.

---

Elle sert à déterminer si un élément doit être complètement supprimé de la page.

---

Elle sert à déterminer si un élément doit être fixé en haut de la page.

#### --answer--

Elle sert à déterminer si un élément doit être déplacé sous le contenu flottant.

### --question--

#### --text--

Quelle propriété CSS sert à contrôler l'ordre d'empilement vertical des éléments positionnés qui se chevauchent sur la page ?

#### --distractors--

`position`

---

`bg-green`

---

`float`

#### --answer--

`z-index`

### --question--

#### --text--

Laquelle des syntaxes suivantes est correcte pour le positionnement relatif ?

#### --distractors--

```css
.relative {
  position: relative-position;
  top: 30px;
  left: 30px;
}
```

---

```css
.relative {
  relative-position: relative;
  top: 30px;
  left: 30px;
}
```

---

```css
.relative {
  relative: position;
  top: 30px;
  left: 30px;
}
```

#### --answer--

```css
.relative {
  position: relative;
  top: 30px;
  left: 30px;
}
```

### --question--

#### --text--

Quelle propriété CSS utiliserais-tu pour fixer un élément à une certaine position sur la page afin qu'il ne bouge pas lors du défilement ?

#### --distractors--

`position: no-scroll;`

---

`position: relative;`

---

`display: block;`

#### --answer--

`position: fixed;`

### --question--

#### --text--

Que fait le positionnement absolu à un élément ?

#### --distractors--

Le positionnement absolu sert à déterminer si un élément doit être déplacé sous le contenu flottant.

---

Le positionnement absolu sert à positionner l'élément dans le flux normal du document.

---

Le positionnement absolu sert à contrôler l'ordre d'empilement vertical des éléments positionnés qui se chevauchent sur la page.

#### --answer--

Le positionnement absolu te permet de retirer un élément du flux normal du document, ce qui le fait se comporter indépendamment des autres éléments.

### --question--

#### --text--

Laquelle des propriétés suivantes n'est PAS une propriété valide que tu peux utiliser pour le positionnement absolu ?

#### --distractors--

`right`

---

`bottom`

---

`top`

#### --answer--

`side`

### --question--

#### --text--

Quelle est la différence essentielle entre le positionnement relatif et le positionnement absolu ?

#### --distractors--

Le positionnement absolu place l'élément dans une position sticky tandis que le positionnement relatif retire un élément du flux normal du document.

---

Le positionnement relatif place l'élément dans une position fixe tandis que le positionnement absolu retire un élément du flux normal du document.

---

Le positionnement absolu place l'élément dans le flux normal du document tandis que le positionnement relatif retire un élément du flux normal du document.

#### --answer--

Le positionnement relatif place l'élément dans le flux normal du document tandis que le positionnement absolu retire un élément du flux normal du document.

### --question--

#### --text--

Lequel des exemples suivants montre comment positionner une boîte dans le coin supérieur gauche de la page ?

#### --distractors--

```css
.box {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: coral;
  width: 50px;
  height: 50px;
}
```

---

```css
.box {
  position: absolute;
  top: 0;
  right: 0;
  background-color: coral;
  width: 50px;
  height: 50px;
}
```

---

```css
.box {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: coral;
  width: 50px;
  height: 50px;
}
```

#### --answer--

```css
.box {
  position: absolute;
  top: 0;
  left: 0;
  background-color: coral;
  width: 50px;
  height: 50px;
}
```

### --question--

#### --text--

Quelle méthode de positionnement permet à un élément de coller à une position définie seulement quand tu fais défiler au-delà d'un certain point ?

#### --distractors--

Le positionnement flottant.

---

Le positionnement fixe.

---

Le positionnement absolu.

#### --answer--

Le positionnement sticky.

### --question--

#### --text--

Lequel des exemples suivants utilise correctement le positionnement sticky ?

#### --distractors--

```css
.box {
  sticky: position;
  top: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: red;
}
```

---

```css
.box {
  position: sticky-fixed;
  top: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: red;
}
```

---

```css
.box {
  position: sticky-top;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: red;
}
```

#### --answer--

```css
.box {
  position: sticky;
  top: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: red;
}
```

### --question--

#### --text--

Quelle est la différence entre le positionnement sticky et le positionnement fixe ?

#### --distractors--

Les éléments sticky ne peuvent être utilisés que dans des mises en page en tableau, tandis que les éléments fixes peuvent être utilisés dans n'importe quel type de mise en page CSS.

---

Les éléments sticky restent toujours à la même position, tandis que les éléments fixes collent à un certain point puis se comportent comme des éléments relatifs.

---

Les éléments fixes sont positionnés par rapport à leur position normale, tandis que les éléments sticky collent seulement à un certain point puis se comportent comme des éléments relatifs.

#### --answer--

Les éléments fixes restent à la même position sur l'écran, tandis que les éléments sticky collent seulement à un certain point puis se comportent comme des éléments relatifs.

### --question--

#### --text--

Quel problème le hack `clearfix` a-t-il résolu quand on travaille avec des flottants ?

#### --distractors--

Le hack `clearfix` a aidé à résoudre le problème des éléments flottants retirés du flux normal du document et placés dans une position fixe sur la page.

---

Le hack `clearfix` a aidé à résoudre le problème des éléments flottants qui n'étaient pas responsives dans les mises en page mobiles et tablettes.

---

Le hack `clearfix` a aidé à résoudre le problème des éléments flottants qui disparaissaient de la page.

#### --answer--

Le hack `clearfix` a aidé à résoudre le problème des chevauchements et des effondrements dans les mises en page quand plusieurs éléments flottants étaient empilés les uns à côté des autres.

### --question--

#### --text--

Lequel des exemples suivants utilise correctement le hack `clearfix` ?

#### --distractors--

```css
.clearfix::before {
  position: fixed;
  top: 0;
  width: 100%;
  clear: both;
}
```

---

```css
.clearfix::after {
  position: relative;
  top: 30px;
  left: 30px;
  clear: all;
}
```

---

```css
.clearfix::before {
  top: 30px;
  clear: none;
}
```

#### --answer--

```css
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

### --question--

#### --text--

Qu'est-ce que le positionnement statique ?

#### --distractors--

Cela sert à retirer un élément de son flux normal sur la page et à le positionner automatiquement dans le coin supérieur droit de la page web.

---

Cela te permet de retirer un élément du flux normal du document, ce qui le fait se comporter indépendamment des autres éléments.

---

Cela permet à un élément de coller à une position définie seulement quand tu fais défiler au-delà d'un certain point.

#### --answer--

C'est le flux normal du document. Les éléments sont positionnés de haut en bas et de gauche à droite, les uns après les autres.

### --question--

#### --text--

Lequel des exemples suivants place la barre de navigation en haut de la page avec le positionnement fixe ?

#### --distractors--

```css
.navbar {
  fixed: top;
  top: 0;
  width: 100%;
}
```

---

```css
.navbar {
  upper: fixed;
  width: 100%;
}
```

---

```css
.navbar {
  position: fixed-top;
  top: 0;
  width: 100%;
}
```

#### --answer--

```css
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
}
```

### --question--

#### --text--

Laquelle des valeurs suivantes est valide pour la propriété `z-index` ?

#### --distractors--

`12.0`

---

`none`

---

`up`

#### --answer--

`1`

### --question--

#### --text--

Quelle est la valeur par défaut de la propriété `position` ?

#### --distractors--

`inherit`

---

`initial`

---

`relative`

#### --answer--

`static`

## --quiz--

### --question--

#### --text--

Quelle valeur de `position` te permet d'ajuster la position d'un élément avec `top` et `left` tout en le gardant dans le flux normal du document ?

#### --distractors--

`position: absolute;`

---

`position: static;`

---

`position: fixed;`

#### --answer--

`position: relative;`

### --question--

#### --text--

Comment se comporte initialement un élément avec `position: sticky;` ?

#### --distractors--

Il se comporte comme un élément `fixed` jusqu'à ce qu'une position de défilement soit atteinte.

---

Il est toujours retiré du flux normal du document.

---

Il se comporte comme un élément `absolute` à l'intérieur de son parent.

#### --answer--

Il se comporte comme un élément `relative` jusqu'à ce qu'une position de défilement définie soit atteinte.

### --question--

#### --text--

Lequel des exemples suivants montre une utilisation valide et efficace de la propriété `z-index` pour faire apparaître `.box-two` au-dessus de `.box-one` ?

#### --distractors--

```css
.box-one {
  position: static;
  z-index: 2;
}
.box-two {
  position: static;
  z-index: 1;
}
```

---

```css
.box-one {
  position: absolute;
  stack-order: 1;
}
.box-two {
  position: absolute;
  stack-order: 2;
}
```

---

```css
.box-one {
  float: left;
  z-index: 1;
}
.box-two {
  float: left;
  z-index: 2;
}
```

#### --answer--

```css
.box-one {
  position: absolute;
  z-index: 1;
}
.box-two {
  position: absolute;
  z-index: 2;
}
```

### --question--

#### --text--

À quoi sert la propriété `z-index` en CSS ?

#### --distractors--

Elle définit le niveau de zoom de la page.

---

Elle contrôle l'alignement horizontal des éléments dans un conteneur flex.

---

Elle définit l'espacement entre le contenu d'un élément et sa bordure.

#### --answer--

Elle contrôle l'ordre d'empilement vertical des éléments positionnés qui se chevauchent.

### --question--

#### --text--

Quand tu appliques `top: 10%;` à un élément avec `position: fixed;`, par rapport à quoi les `10%` sont-ils calculés ?

#### --distractors--

La hauteur de l'élément lui-même.

---

La hauteur de son conteneur parent.

---

La largeur du viewport.

#### --answer--

La hauteur du viewport.

### --question--

#### --text--

Lequel des exemples de code utilise correctement la propriété `z-index` pour placer une superposition au-dessus des autres contenus ?

#### --distractors--

```css
.overlay {
  z-index: 5;
  background-color: black;
}
```

---

```css
.overlay {
  display: block;
  z-layer: 1;
  background-color: black;
}
```

---

```css
.overlay {
  float: left;
  z-index: 2;
  background-color: black;
}
```

#### --answer--

```css
.overlay {
  position: absolute;
  z-index: 10;
  background-color: black;
}
```

### --question--

#### --text--

Quelle propriété CSS sert à contrôler si un élément doit être déplacé sous des éléments flottants ?

#### --distractors--

`float`

---

`overflow`

---

`display`

#### --answer--

`clear`

### --question--

#### --text--

Comment un élément avec `position: relative;` et `bottom: 25px;` sera-t-il déplacé ?

#### --distractors--

Il se déplacera de `25px` vers le bas par rapport à sa position normale.

---

Il se déplacera de `25px` vers la droite par rapport à sa position normale.

---

Il sera positionné à `25px` du bas du viewport.

#### --answer--

Il se déplacera de `25px` vers le haut par rapport à sa position normale.

### --question--

#### --text--

La propriété `z-index` n'affecte que les éléments auxquels quelle propriété CSS est appliquée ?

#### --distractors--

Une valeur de `float` autre que `none`.

---

Une valeur de `display` égale à `inline-block`.

---

Une `background-color` définie.

#### --answer--

Une valeur de `position` autre que `static`.

### --question--

#### --text--

Quel serait l'effet de l'application de `float: right;` à un logo dans un en-tête ?

#### --distractors--

Le logo serait aligné à droite, mais resterait dans le flux normal du document, empêchant les autres contenus de s'enrouler autour de lui.

---

Le logo serait retiré du flux et positionné sur le côté droit de tout le viewport du navigateur, pas de son conteneur.

---

Le logo deviendrait un élément de niveau bloc qui occupe toute la largeur de l'en-tête, poussant les autres éléments en dessous.

#### --answer--

Le logo serait retiré de son flux normal et placé sur le côté droit de son conteneur, avec les autres contenus qui s'enroulent autour de lui.

### --question--

#### --text--

Quel extrait CSS gardera un élément fixé en haut du viewport une fois qu'il a été atteint lors du défilement ?

#### --distractors--

```css
.header {
  position: fixed;
  top: 0;
}
```

---

```css
.header {
  position: relative;
  top: 0;
}
```

---

```css
.header {
  position: absolute;
  top: 0;
}
```

#### --answer--

```css
.header {
  position: sticky;
  top: 0;
}
```

### --question--

#### --text--

Quel est le rôle précis de `clear: both;` en CSS ?

#### --distractors--

Cela annule la propriété `float` sur l'élément lui-même, ce qui le renvoie dans le flux normal du document.

---

Cela supprime les propriétés `clear` héritées d'un élément parent et restaure le comportement flottant par défaut.

---

Cela nettoie uniquement les éléments flottants situés à droite, en laissant les éléments flottants à gauche tels quels.

#### --answer--

Cela garantit que l'élément est déplacé sous tous les éléments flottants qui apparaissent avant lui, à gauche comme à droite.

### --question--

#### --text--

Avec le code suivant, comment `.child` sera-t-il positionné ?

```css
.parent {
  /* No position property set */
  height: 200px;
}
.child {
  position: absolute;
  top: 10px;
}
```

#### --distractors--

Il sera positionné à `10px` du haut de l'élément `.parent`, car le positionnement `absolute` est toujours relatif au parent direct.

---

Il restera dans sa position statique par défaut parce que la valeur `absolute` est invalide sans propriété `z-index`.

---

Il sera positionné à `10px` du haut de la fenêtre du navigateur, et restera fixé en place même quand l'utilisateur fera défiler la page.

#### --answer--

Il sera positionné à `10px` du haut du bloc contenant initial, comme le `<body>`, parce que son parent n'est pas positionné.

### --question--

#### --text--

Quel effet le CSS suivant aura-t-il sur l'élément `.box` ?

```css
.box {
  position: absolute;
  top: 50px;
  left: 50px;
}
```

#### --distractors--

L'élément restera dans son flux normal mais sera indenté de `50px` depuis le haut et la gauche, en repoussant les autres éléments.

---

L'élément sera fixé au viewport et restera à `50px` du haut et `50px` de la gauche, même quand la page défilera.

---

L'élément sera positionné par rapport à son propre point de départ, en se déplaçant de `50px` vers le bas et de `50px` vers la droite sans quitter le flux du document.

#### --answer--

L'élément sera retiré du flux normal et placé à `50px` du haut et à `50px` de la gauche de son ancêtre positionné le plus proche.

### --question--

#### --text--

Laquelle des valeurs `position` suivantes retire entièrement un élément du flux normal du document ?

#### --distractors--

`position: static;`

---

`position: relative;`

---

`position: inherit;`

#### --answer--

`position: absolute;`

### --question--

#### --text--

Avec un élément `.parent` et un élément `.child`, quel extrait CSS positionne correctement `.child` à `20px` du coin supérieur gauche de l'élément `.parent` ?

#### --distractors--

```css
.parent {
  /* position: static; by default */
}
.child {
  position: absolute;
  top: 20px;
  left: 20px;
}
```

---

```css
.parent {
  position: relative;
}
.child {
  position: relative;
  top: 20px;
  left: 20px;
}
```

---

```css
.parent {
  position: relative;
}
.child {
  float: left;
  top: 20px;
  left: 20px;
}
```

#### --answer--

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 20px;
  left: 20px;
}
```

### --question--

#### --text--

Quelle est la différence entre les positionnements `static` et `relative` ?

#### --distractors--

Le positionnement `static` retire un élément du flux du document, tandis que le positionnement `relative` le garde dans le flux.

---

Un élément avec `position: static;` peut être décalé avec les propriétés `top` et `left`, tandis que `position: relative;` ne le peut pas.

---

Le positionnement `static` est destiné aux éléments de niveau bloc, tandis que le positionnement `relative` est uniquement destiné aux éléments en ligne.

#### --answer--

Les deux gardent un élément dans le flux normal du document, mais `relative` permet de décaler l'élément par rapport à sa position d'origine.

### --question--

#### --text--

Quel extrait CSS fait correctement flotter une image à gauche, ce qui permet aux autres contenus de s'enrouler autour d'elle ?

#### --distractors--

```css
.image {
  position: absolute;
  left: 0;
}
```

---

```css
.image {
  display: inline-block;
}
```

---

```css
.image {
  text-align: left;
}
```

#### --answer--

```css
.image {
  float: left;
}
```

### --question--

#### --text--

Quelle est la différence entre les positionnements `absolute` et `fixed` ?

#### --distractors--

Le positionnement `absolute` est relatif au viewport, tandis que le positionnement `fixed` est relatif à l'ancêtre positionné le plus proche.

---

Le positionnement `absolute` garde l'élément dans le flux normal du document, tandis que le positionnement `fixed` le retire du flux.

---

Les deux sont positionnés par rapport au viewport, mais les éléments `fixed` défilent avec la page tandis que les éléments `absolute` ne le font pas.

#### --answer--

Le positionnement `absolute` est relatif à l'ancêtre positionné le plus proche, tandis que le positionnement `fixed` est relatif au viewport du navigateur.

### --question--

#### --text--

Quelle valeur de `position` place un élément dans le flux normal du document et empêche les propriétés de décalage comme `top` et `left` d'avoir un effet ?

#### --distractors--

`position: relative;`

---

`position: absolute;`

---

`position: fixed;`

#### --answer--

`position: static;`
