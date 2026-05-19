---
id: 66ed8fc1f45ce3ece4053ead
title: Quiz sur l'accessibilité CSS
challengeType: 8
dashedName: quiz-css-accessibility
---

# --description--

Pour réussir le quiz, tu dois répondre correctement à au moins 9 des 10 questions ci-dessous.

# --quizzes--

## --quiz--

### --question--

#### --text--

Pourquoi dois-tu avoir un bon contraste des couleurs sur ta page web ?

#### --distractors--

Pour rendre la page plus vive.

---

Pour respecter les exigences d'optimisation pour les moteurs de recherche (SEO).

---

Pour faire ressortir les éléments importants de la page.

#### --answer--

Pour rendre le contenu de la page accessible et lisible.

### --question--

#### --text--

Lequel des outils suivants te permet de saisir des couleurs d'arrière-plan et de premier plan, puis de vérifier leur rapport de contraste ?

#### --distractors--

TPGi Colour Contrast Analyzer

---

Figma

---

Canva

#### --answer--

Color Contrast Checker de WebAIM

### --question--

#### --text--

Lequel des outils suivants te permet de sélectionner des couleurs d'arrière-plan et de premier plan depuis du contenu affiché sur ton écran, puis de vérifier leur rapport de contraste ?

#### --distractors--

Figma

---

Canva

---

Color Contrast Checker de WebAIM

#### --answer--

TPGi Colour Contrast Analyzer

### --question--

#### --text--

Pourquoi ne devrais-tu PAS utiliser `display: none` et `visibility: hidden` pour masquer visuellement du contenu ?

#### --distractors--

Ces méthodes font en sorte que seules les technologies d'assistance comme les lecteurs d'écran peuvent accéder au contenu masqué.

---

Ces méthodes font en sorte que le contenu est masqué uniquement jusqu'à ce que les utilisateurs déplacent leur souris dessus.

---

Ces méthodes ne fonctionnent pas avec certains navigateurs.

#### --answer--

Ces méthodes retirent le contenu de l'arbre d'accessibilité, ce qui empêche les lecteurs d'écran d'accéder au contenu masqué.

### --question--

#### --text--

Qu'est-ce qu'un arbre d'accessibilité ?

#### --distractors--

Une représentation visuelle de la mise en page d'une page web.

---

Une structure utilisée par les lecteurs d'écran pour lire le contenu textuel d'une page web.

---

Une copie de l'arbre DOM.

#### --answer--

Une structure utilisée par les lecteurs d'écran pour interpréter le contenu d'une page web et interagir avec lui.

### --question--

#### --text--

Laquelle des options suivantes garantit qu'une image a une largeur minimale de `400px`, mais devient plus large lorsque la largeur de la fenêtre d'affichage est supérieure à `1000px` ?

#### --distractors--

```css
img {
  width: max(400px, 10vw);
}
```

---

```css
img {
  width: max(400px, 30vw);
}
```

---

```css
img {
  width: max(400px, 20vw);
}
```

#### --answer--

```css
img {
  width: max(400px, 40vw);
}
```

### --question--

#### --text--

Laquelle des valeurs de `scroll-behavior` suivantes permet un comportement de défilement fluide ?

#### --distractors--

`auto`

---

`inherit`

---

`revert`

#### --answer--

`smooth`

### --question--

#### --text--

Laquelle des fonctionnalités suivantes est utilisée pour détecter la préférence d'animation de l'utilisateur ?

#### --distractors--

`prefers-contrast`

---

`display-mode`

---

`animation`

#### --answer--

`prefers-reduce-motion`

### --question--

#### --text--

Lequel des problèmes suivants est un problème d'accessibilité de l'attribut `placeholder` dans un élément `input` ?

#### --distractors--

Le texte d'espace réservé empêche les lecteurs d'écran de lire le texte du libellé du champ.

---

Le texte d'espace réservé empêche les lecteurs d'écran de lire la valeur du champ.

---

Le texte d'espace réservé est trop petit pour être lisible.

#### --answer--

Le texte d'espace réservé peut être confondu avec une vraie valeur de champ.

### --question--

#### --text--

Que fait l'attribut `hidden` ?

#### --distractors--

Il masque le contenu et le révèle au survol.

---

Il masque le contenu uniquement dans l'arbre d'accessibilité.

---

Il masque le contenu visuellement, mais le contenu reste disponible dans l'arbre d'accessibilité.

#### --answer--

Il masque le contenu à la fois visuellement et dans l'arbre d'accessibilité.
