---
id: 66ed8fc9f45ce3ece4053eae
title: Quiz sur les animations CSS
challengeType: 8
dashedName: quiz-css-animations
---

# --description--

Pour réussir le quiz, tu dois répondre correctement à au moins 18 des 20 questions ci-dessous.

# --quizzes--

## --quiz--

### --question--

#### --text--

Quel est le rôle de la propriété `transform` en CSS ?

#### --distractors--

Changer la visibilité d'un élément.

---

Appliquer un effet visuel au texte.

---

Définir les dimensions d'un élément.

#### --answer--

Modifier la position, la taille et la forme d'un élément.

### --question--

#### --text--

Comment la propriété CSS `animation-direction` affecte-t-elle une animation ?

#### --distractors--

Elle indique si une animation doit être répétée.

---

Elle définit la durée de l'animation.

---

Elle définit la vitesse de l'animation.

#### --answer--

Elle définit la manière dont une animation doit être jouée.

### --question--

#### --text--

Quelle propriété CSS fait s'exécuter une animation 3 fois ?

#### --distractors--

`animation-repeat: 3`

---

`animation-loop: 3`

---

`animation-delay: 3`

#### --answer--

`animation-iteration-count: 3`

### --question--

#### --text--

Quelle fonction de temporisation CSS fait avancer une animation à vitesse constante du début à la fin ?

#### --distractors--

`ease`

---

`ease-in`

---

`ease-in-out`

#### --answer--

`linear`

### --question--

#### --text--

Que définit l'at-rule `@keyframes` en CSS ?

#### --distractors--

Les couleurs d'un dégradé CSS.

---

Les angles d'une rotation CSS.

---

Les dimensions d'un élément.

#### --answer--

Les étapes d'une animation CSS.

### --question--

#### --text--

Quel est le rôle de la fonction `translateX()` en CSS ?

#### --distractors--

Elle change l'opacité de l'élément.

---

Elle fait pivoter l'élément.

---

Elle repositionne l'élément verticalement.

#### --answer--

Elle repositionne l'élément horizontalement.

### --question--

#### --text--

Lequel des éléments suivants n'est PAS un problème potentiel avec les animations CSS ?

#### --distractors--

Elles peuvent provoquer de l'inconfort ou des effets physiques négatifs chez certains utilisateurs.

---

Les utilisateurs peuvent les trouver distrayantes.

---

Un usage excessif peut entraîner de mauvaises performances.

#### --answer--

Elles peuvent améliorer l'expérience utilisateur.

### --question--

#### --text--

Où l'at-rule `@keyframes` est-elle définie ?

#### --distractors--

Dans l'élément `body` d'un fichier HTML.

---

Dans l'élément `head` d'un fichier HTML.

---

Dans une définition de classe CSS.

#### --answer--

Au niveau supérieur, en dehors de tout sélecteur CSS.

### --question--

#### --text--

Quelle propriété CSS te permet de mettre une animation en pause et de la reprendre ?

#### --distractors--

`animation-timing-function`

---

`animation-delay`

---

`animation-direction`

#### --answer--

`animation-play-state`

### --question--

#### --text--

Quelle valeur faut-il affecter à la propriété `animation-name` en CSS ?

#### --distractors--

La durée de l'animation en secondes.

---

La fonction de temporisation utilisée pour l'animation.

---

Le délai avant le démarrage de l'animation en secondes.

#### --answer--

Le nom de l'animation définie par `@keyframes`.

### --question--

#### --text--

Que fait cette at-rule `@keyframe` à l'élément animé ?

```css
@keyframes animation {
  0% {
    transform: translateX(-50px);
  }
  100% {
    transform: translateX(100px);
  }
}
```

#### --distractors--

Elle fait pivoter l'élément de 90 degrés dans le sens horaire.

---

Elle change la couleur de l'élément en bleu.

---

Elle redimensionne l'élément à 50% de sa taille initiale puis à 100% de sa taille initiale.

#### --answer--

Elle déplace l'élément horizontalement de -50px à 100px, par rapport à son point de départ.

### --question--

#### --text--

Quelle propriété CSS définit la manière dont une animation progresse dans le temps ?

#### --distractors--

`animation-delay`

---

`animation-fill-mode`

---

`animation-iteration-count`

#### --answer--

`animation-timing-function`

### --question--

#### --text--

Quelle propriété CSS est utilisée pour préciser qu'une animation doit prendre 5 secondes pour se terminer ?

#### --distractors--

```css
animation-name: 5s;
```

---

```css
animation-delay: 5s;
```

---

```css
animation-timing-function: 5s;
```

#### --answer--

```css
animation-duration: 5s;
```

### --question--

#### --text--

Que représente `50%` dans l'at-rule CSS `@keyframe` suivante ?

```css
@keyframes animation {
  0% {
    transform: translateX(-50px);
  }
  50% {
    transform: translateX(25px);
  }
  100% {
    transform: translateX(100px);
  }
}
```

#### --distractors--

Le point de départ de l'animation.

---

Le point de fin de l'animation.

---

La vitesse de l'animation.

#### --answer--

Le milieu de l'animation.

### --question--

#### --text--

Que se passera-t-il lorsque la propriété `transform: translateX(200px);` sera appliquée ?

#### --distractors--

L'élément se déplacera de 200px vers la gauche.

---

L'élément se déplacera de 200px vers le bas.

---

L'élément pivotera de 200 degrés dans le sens horaire.

#### --answer--

L'élément se déplacera de 200px vers la droite.

### --question--

#### --text--

Comment l'animation se comportera-t-elle si `animation-iteration-count` est défini sur `infinite` ?

#### --distractors--

Elle s'exécutera une fois puis s'arrêtera.

---

Elle se mettra en pause après la première itération.

---

Elle s'arrêtera après trois itérations.

#### --answer--

Elle se répétera indéfiniment.

### --question--

#### --text--

Quel sélecteur `@keyframes` précise le point de départ d'une animation ?

#### --distractors--

`50%`

---

`25%`

---

`100%`

#### --answer--

`0%`

### --question--

#### --text--

Quelles propriétés peuvent être précisées avec la propriété raccourcie CSS `animation` ?

#### --distractors--

Seulement le nom de l'animation.

---

Le nom et la durée de l'animation.

---

Le nom, la durée et le délai de l'animation.

#### --answer--

Toutes les propriétés d'animation.

### --question--

#### --text--

Quelle propriété CSS est utilisée pour appliquer une animation définie par une at-rule `@keyframes` ?

#### --distractors--

`animation-duration`

---

`apply`

---

`translate`

#### --answer--

`animation`

### --question--

#### --text--

Quelle propriété CSS te permet de définir un temps d'attente avant le démarrage de l'animation ?

#### --distractors--

`animation-fill-mode`

---

`animation-timing-function`

---

`animation-iteration-count`

#### --answer--

`animation-delay`

## --quiz--

### --question--

#### --text--

Que fait la propriété CSS `animation-delay` ?

#### --distractors--

Elle définit la durée de l'animation.

---

Elle précise la fonction de temporisation.

---

Elle définit la direction de l'animation.

#### --answer--

Elle retarde le démarrage de l'animation.

### --question--

#### --text--

Quelle propriété d'animation précise comment l'élément doit être stylisé avant et après l'animation ?

#### --distractors--

`animation-delay`

---

`animation-direction`

---

`animation-iteration-count`

#### --answer--

`animation-fill-mode`

### --question--

#### --text--

Pourquoi les animations CSS doivent-elles être utilisées avec modération ?

#### --distractors--

Trop d'animations CSS peuvent casser les styles et créer des incohérences entre différents navigateurs.

---

Trop d'animations CSS peuvent entraîner un classement plus faible ou inexistant dans les résultats des moteurs de recherche.

---

Trop d'animations CSS feront automatiquement planter le serveur et augmenteront les risques de sécurité.

#### --answer--

Trop d'animations CSS peuvent entraîner de mauvaises performances et peuvent distraire ou poser problème aux utilisateurs ayant certains besoins d'accessibilité.

### --question--

#### --text--

Quelle propriété d'animation détermine si l'animation doit être jouée vers l'avant, vers l'arrière ou en alternance ?

#### --distractors--

`animation-fill-mode`

---

`animation-delay`

---

`animation-timing-function`

#### --answer--

`animation-direction`

### --question--

#### --text--

Quelle media query CSS détecte si l'utilisateur a demandé des animations ou des effets de mouvement minimaux ?

#### --distractors--

`reduce-motion`

---

`min-motion-preference`

---

`motion-preferences`

#### --answer--

`prefers-reduced-motion`

### --question--

#### --text--

Quelle propriété définit combien de fois une `animation` se répète ?

#### --distractors--

`animation-duration`

---

`animation-count`

---

`animation-delay`

#### --answer--

`animation-iteration-count`

### --question--

#### --text--

Quelle règle CSS est utilisée pour définir les étapes et les styles d'une animation à différents moments de sa durée ?

#### --distractors--

`@style`

---

`@transition`

---

`@transform`

#### --answer--

`@keyframes`

### --question--

#### --text--

Dans la media query `reduced-motion`, quelle déclaration désactive les transitions ?

#### --distractors--

`animation: none;`

---

`transition: remove;`

---

`animation-play-state: paused;`

#### --answer--

`transition: none;`

### --question--

#### --text--

Que te permet de faire la propriété `animation-play-state` ?

#### --distractors--

Définir combien de fois l'animation se répète.

---

Préciser combien de temps l'animation prend pour se terminer.

---

Déterminer la direction dans laquelle l'animation est jouée.

#### --answer--

Mettre l'animation en pause et la reprendre.

### --question--

#### --text--

Laquelle des pratiques suivantes est une bonne pratique lorsque l'on travaille avec des animations ?

#### --distractors--

Utiliser autant de couleurs clignotantes et de mouvements rapides que possible pour attirer l'attention.

---

Éviter de tester les animations sur différents appareils ou tailles d'écran.

---

Faire durer les animations le plus longtemps possible pour s'assurer que les utilisateurs les remarquent.

#### --answer--

Éviter le contenu qui clignote plus de trois fois par seconde afin d'éviter de déclencher des crises ou de provoquer de l'inconfort.

### --question--

#### --text--

Pourquoi la déclaration `!important` est-elle utilisée dans les règles CSS ?

#### --distractors--

Pour empêcher le chargement des autres media queries.

---

Pour limiter les styles au premier élément enfant.

---

Pour déboguer CSS plus facilement.

#### --answer--

Pour s'assurer que ces règles prennent le dessus sur les autres styles.

### --question--

#### --text--

Que garantit `animation-iteration-count: 1 !important;` en CSS ?

#### --distractors--

Que les animations sont mises en pause.

---

Que les animations s'exécutent à l'infini.

---

Que les animations inversent leur direction à chaque cycle.

#### --answer--

Que les animations en boucle ne soient jouées qu'une seule fois.

### --question--

#### --text--

Quelle propriété CSS est utilisée pour préciser combien de temps une animation doit prendre pour se terminer ?

#### --distractors--

`animation-delay`

---

`animation-timing-function`

---

`animation-iteration-count`

#### --answer--

`animation-duration`

### --question--

#### --text--

Quelle propriété ne fait PAS partie du raccourci `animation` ?

#### --distractors--

`animation-delay`

---

`animation-timing-function`

---

`animation-direction`

#### --answer--

`animation-transform`

### --question--

#### --text--

Que définit la règle `@keyframes` ?

#### --distractors--

La fonction de temporisation d'une animation.

---

L'état par défaut d'un élément.

---

Les media queries pour les animations.

#### --answer--

La séquence de styles à différents moments d'une animation.

### --question--

#### --text--

Que fait cette at-rule `@keyframe` à l'élément animé ?

```css
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

#### --distractors--

Elle agrandit l'élément de 0% à 100%.

---

Elle déplace l'élément de gauche à droite.

---

Elle change la couleur du texte en noir.

#### --answer--

Elle fait apparaître l'élément progressivement en diminuant peu à peu sa transparence.

### --question--

#### --text--

Dans une règle keyframes, que représente `100%` ?

#### --distractors--

Le début de l'animation.

---

Le milieu de l'animation.

---

La fonction d'accélération.

#### --answer--

La fin de l'animation.

### --question--

#### --text--

Quelle propriété contrôle le rythme d'une `animation` pendant sa durée ?

#### --distractors--

`animation-duration`

---

`animation-delay`

---

`animation-iteration-count`

#### --answer--

`animation-timing-function`

### --question--

#### --text--

Que doivent prendre en compte les développeurs lorsqu'ils implémentent des animations pour préserver l'accessibilité ?

#### --distractors--

S'appuyer entièrement sur JavaScript pour toutes les animations.

---

Ajouter des animations fréquentes et intenses pour créer de l'impact.

---

Inclure uniquement des effets marqués, rapides et surprenants.

#### --answer--

Utiliser des effets subtils et intentionnels, respecter les préférences et offrir un contrôle utilisateur.

### --question--

#### --text--

Laquelle des syntaxes suivantes est correcte pour faire apparaître un élément depuis la gauche ?

#### --distractors--

```css
@keyframes slide-in {
  0 { 
    transform: translate(-100%); 
  }
  100 { 
    transform: translate(0); 
  }
}
```

---

```css
@keyframes slide-in {
  from { 
    translateX(-100%); 
  }
  to { 
    translateX(0); 
  }
}
```

---

```css
@keyframes slide-in {
  start { 
    transform: moveX(-100%); 
  }
  end { 
    transform: moveX(0); 
  }
}
```

#### --answer--

```css
@keyframes slide-in {
  0% { 
    transform: translateX(-100%); 
  }
  100% { 
    transform: translateX(0); 
  }
}
```
