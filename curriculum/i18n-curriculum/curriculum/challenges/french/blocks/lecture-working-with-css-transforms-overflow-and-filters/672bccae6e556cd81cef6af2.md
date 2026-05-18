---
id: 672bccae6e556cd81cef6af2
title: Qu'est-ce que l'effondrement de margin, et comment fonctionne-t-il ?
challengeType: 19
dashedName: what-is-margin-collapsing
---

# --interactive--

L'effondrement de margin est un concept fondamental en CSS qui déroute souvent les personnes qui débutent en développement web.

Ce comportement se produit quand les margins verticales d'éléments adjacents se chevauchent, ce qui donne une seule margin égale à la plus grande des deux.

Comprendre l'effondrement de margin est important pour contrôler précisément l'espacement et la mise en page dans le design web. Voyons donc comment l'effondrement de margin fonctionne et explorons quelques scénarios courants où il se produit.

En CSS, quand deux margins verticales entrent en contact, elles s'effondrent. Cela signifie qu'au lieu de s'additionner, la plus grande margin l'emporte et détermine l'espace entre les éléments. Ce comportement s'applique uniquement aux margins verticales (haut et bas), et pas aux margins horizontales (gauche et droite). Voici un exemple pour illustrer ce concept :

:::interactive_editor

```html
<style>
  .box1 {
    margin-bottom: 20px;
    background-color: lightblue;
  }
  .box2 {
    margin-top: 30px;
    background-color: lightgreen;
  }
</style>

<div class="box1">Box 1</div>
<div class="box2">Box 2</div>
```

:::

Dans cet exemple, tu pourrais t'attendre à ce que l'espace total entre `.box1` et `.box2` soit de 50 pixels (20 pixels plus 30 pixels). Cependant, à cause de l'effondrement de margin, l'espace réel sera de 30 pixels, c'est-à-dire la plus grande des deux margins.

Comme nous l'avons vu dans l'exemple précédent, les margins des éléments frères adjacents s'effondrent. C'est le cas le plus direct d'effondrement de margin. Explorons d'autres cas où l'effondrement de margin peut se produire.

Les margins peuvent aussi s'effondrer entre un élément parent et son premier ou dernier enfant. S'il n'y a pas de bordure, de padding, de contenu inline ou de clearance pour séparer la margin du parent de celle de l'enfant, elles s'effondreront.

:::interactive_editor

```html
<style>
  .parent {
    margin-top: 40px;
    background-color: lightyellow;
  }
  .child {
    margin-top: 30px;
    background-color: lightpink;
  }
</style>

<div class="parent">
  <div class="child">Child element</div>
</div>
```

:::

Dans ce cas, tu pourrais t'attendre à ce que l'enfant soit à 70 pixels du haut (40 pixels plus 30 pixels). Cependant, les margins s'effondrent et la plus grande margin, celle de 40 pixels, est utilisée.

Si un élément n'a pas de contenu, de padding ou de bordure, ses margins du haut et du bas peuvent s'effondrer en une seule margin.

:::interactive_editor

```html
<style>
  .empty-block {
    margin-top: 20px;
    margin-bottom: 10px;
    height: 0;
  }
  .next-block {
    background-color: lightgray;
  }
</style>

<div class="empty-block"></div>
<div class="next-block">Next block</div>
```

:::

Dans cet exemple, les margins du haut et du bas de `empty-block` s'effondrent en une seule margin de 20 pixels, la plus grande des deux.

Voici un exemple pour empêcher l'effondrement avec du padding :

:::interactive_editor

```html
<style>
  .parent {
    margin-top: 40px;
    padding-top: 1px;
    background-color: lightyellow;
  }
  .child {
    margin-top: 30px;
    background-color: lightpink;
  }
</style>

<div class="parent">
  <div class="child">Child element</div>
</div>
```

:::

Dans ce cas, le padding d'un pixel sur le parent empêche la margin de s'effondrer, ce qui donne un espace total de 71 pixels entre le haut du parent et le haut du contenu de l'enfant.

Comprendre l'effondrement de margin est important pour contrôler précisément la mise en page et l'espacement en CSS. Même si cela peut parfois produire des résultats inattendus, c'est une fonctionnalité conçue pour créer un espacement plus esthétique et cohérent dans les documents. En sachant quand l'effondrement de margin se produit et comment l'empêcher quand c'est nécessaire, tu peux créer des mises en page plus prévisibles et plus faciles à maintenir dans tes designs web.

# --questions--

## --text--

Dans quelle direction l'effondrement de margin se produit-il ?

## --answers--

Margins horizontales uniquement.

### --feedback--

Pense aux margins (haut, bas, gauche, droite) qui sont affectées par ce comportement.

---

Margins verticales uniquement.

---

Margins horizontales et verticales.

### --feedback--

Pense aux margins (haut, bas, gauche, droite) qui sont affectées par ce comportement.

---

Margins diagonales.

### --feedback--

Pense aux margins (haut, bas, gauche, droite) qui sont affectées par ce comportement.

## --video-solution--

2

## --text--

Que se passe-t-il quand deux éléments adjacents ont des valeurs de margin différentes ?

## --answers--

Les margins s'additionnent.

### --feedback--

Réfléchis à la margin qui « gagne » quand un effondrement se produit.

---

La plus petite margin est utilisée.

### --feedback--

Réfléchis à la margin qui « gagne » quand un effondrement se produit.

---

La plus grande margin est utilisée.

---

La moyenne des deux margins est utilisée.

### --feedback--

Réfléchis à la margin qui « gagne » quand un effondrement se produit.

## --video-solution--

3

## --text--

Lequel des éléments suivants n'empêchera PAS l'effondrement de margin entre un parent et son premier enfant ?

## --answers--

Ajouter une `border` au parent.

### --feedback--

Pense aux propriétés qui créent une séparation entre les margins du parent et de l'enfant.

---

Définir `padding-top: 1px;` sur le parent.

### --feedback--

Pense aux propriétés qui créent une séparation entre les margins du parent et de l'enfant.

---

Utiliser `display: inline-block;` sur l'enfant.

### --feedback--

Pense aux propriétés qui créent une séparation entre les margins du parent et de l'enfant.

---

Définir `margin-top: 0;` sur l'enfant.

## --video-solution--

4
