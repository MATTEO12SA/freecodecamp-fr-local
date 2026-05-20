---
id: 671a999cc77b7f9bceb4caeb
title: Révision des animations CSS
challengeType: 31
dashedName: review-css-animations
---

# --interactive--

## Bases des animations CSS

- **Définition** : Les animations CSS te permettent de créer des effets dynamiques et visuellement engageants sur les pages web sans avoir besoin de JavaScript ni de programmation complexe. Elles fournissent un moyen de faire passer progressivement des éléments entre différents styles pendant une durée donnée.
- **La règle `@keyframes`** : Cette règle définit les étapes et les styles de l'animation. Elle précise les styles que l'élément doit avoir à différents moments de l'animation.

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css">
<div class="box">Slide</div>
```

```css
.box {
  width: 120px;
  padding: 10px;
  background: #0077ff;
  color: white;
  animation: slide-in 1s ease-in-out;
}

@keyframes slide-in {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
```

:::

- **Propriété `animation`** : C'est la propriété raccourcie utilisée pour appliquer des animations.
- **`animation-name`** : Cette propriété précise le nom de la règle `@keyframes` à utiliser.
- **`animation-duration`** : Cette propriété définit le temps que l'animation doit prendre pour se terminer.
- **`animation-timing-function`** : Cette propriété définit la manière dont l'animation progresse dans le temps, par exemple ease, linear ou ease-in-out.
- **`animation-delay`** : Cette propriété indique un délai avant le démarrage de l'animation.
- **`animation-iteration-count`** : Cette propriété définit combien de fois l'animation doit se répéter.
- **`animation-direction`** : Cette propriété détermine si l'animation doit être jouée vers l'avant, vers l'arrière ou en alternance.
- **`animation-fill-mode`** : Cette propriété indique comment l'élément doit être stylisé avant et après l'animation.
- **`animation-play-state`** : Cette propriété te permet de mettre l'animation en pause et de la reprendre.

## Accessibilité et media query `prefers-reduced-motion`

- **La media query `prefers-reduced-motion`** : L'un des principaux problèmes d'accessibilité des animations est qu'elles peuvent provoquer de l'inconfort, voire des effets physiques négatifs, chez certains utilisateurs. Les personnes ayant des troubles vestibulaires ou une sensibilité au mouvement peuvent ressentir des vertiges, des nausées ou des maux de tête lorsqu'elles sont exposées à certains types de mouvements à l'écran. La media query `prefers-reduced-motion` permet aux développeurs web de détecter si l'utilisateur a demandé des animations ou des effets de mouvement minimaux au niveau du système.

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css">
<button class="animated-element">Hover me</button>
```

```css
.animated-element {
  padding: 10px 16px;
  transition: transform 0.3s ease-in-out;
}

.animated-element:hover {
  transform: translateX(20px);
}

@media (prefers-reduced-motion: reduce) {
  .animated-element {
    transition: none;
  }
}
```

:::

# --assignment--

Révise les sujets et concepts liés aux animations CSS.
