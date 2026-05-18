---
id: 672bbe9171a5cca90f2edeea
title: Quels sont des exemples de pseudo-classes d'action utilisateur sur les éléments ?
challengeType: 19
dashedName: what-are-examples-of-element-user-action-pseudo-classes
---

# --interactive--

Le retour utilisateur est un élément essentiel du design web. Par exemple, il est important pour les utilisateurs de recevoir des indices visuels quand ils interagissent avec des éléments sur un site web, comme survoler un bouton ou cliquer sur un lien. Ce retour aide les utilisateurs à comprendre l'état des éléments interactifs, comme indiquer si un lien a été visité ou non.

Les pseudo-classes d'action utilisateur en CSS sont des mots-clés spéciaux qui te permettent de fournir ce genre de retour sans avoir besoin de JavaScript ou d'autres langages de programmation.

Ces pseudo-classes incluent `:hover`, `:active`, `:focus`, et `:visited`, entre autres. Elles te permettent de changer l'apparence des éléments en fonction des interactions utilisateur, améliorant l'expérience utilisateur globale.

Plongeons dans certaines des pseudo-classes d'action utilisateur que nous avons et voyons comment elles fonctionnent.

La pseudo-classe `:active` applique des styles quand un élément est activé par l'utilisateur. Par exemple, quand l'utilisateur clique sur un bouton ou un lien, elle fournit un retour visuel immédiat, montrant aux utilisateurs que leurs actions sont reconnues.

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<a href="#">Example link</a>
```

```css
a:active {
  color: crimson;
}
```

:::

La pseudo-classe `:hover` est déclenchée quand un utilisateur survole un élément avec sa souris ou un autre périphérique de pointage. Les développeurs l'utilisent souvent pour créer un retour visuel pour les boutons, les liens, ou tout élément qui devrait répondre à l'attention de l'utilisateur. Voici un bouton qu'un utilisateur survolerait avant de cliquer :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<button class="btn">Hover Over Me</button>
```

```css
.btn:hover {
  background-color: darkgreen;
  color: white;
  cursor: pointer;
}
```

:::

La pseudo-classe `:focus` applique des styles quand un élément reçoit le focus, généralement via la navigation au clavier ou quand un utilisateur clique sur un champ de saisie de formulaire. Ce n'est pas seulement pour le retour mais aussi essentiel pour l'accessibilité. Ça garantit que les utilisateurs qui dépendent fortement des claviers peuvent facilement identifier avec quel élément ils interagissent.

Voici un exemple d'un champ de saisie qui reçoit le focus quand on clique ou y navigue via le clavier :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<form>
  <input type="text" />
</form>
```

```css
input:focus {
  outline: 2px solid darkgreen;
  border-radius: 4px;
}
```

:::

La pseudo-classe `:visited` cible un lien que l'utilisateur a visité. Ça peut être utile pour aider les utilisateurs à distinguer entre les pages qu'ils ont déjà visitées et celles qu'ils n'ont pas encore visitées. Voici un exemple de changement de la couleur du texte d'ancrage en cyan quand le lien est visité :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<a href="https://www.example.com" target="_blank">Visit Example.com</a>
```

```css
a:visited {
  color: cyan;
}
```

:::

La pseudo-classe `:checked` en CSS te permet de styliser les éléments de formulaire comme les cases à cocher et les boutons radio quand ils sont sélectionnés (cochés). Cette pseudo-classe est utile pour personnaliser l'apparence de ces éléments pour améliorer l'expérience utilisateur, même si les navigateurs fournissent des styles par défaut pour eux.

Voici un exemple avec une case à cocher pour accepter les conditions sur un site web.

**NOTE** : Une partie du CSS dans cet exemple utilise des propriétés qui n'ont pas encore été couvertes. C'est juste pour te donner une idée de comment créer une case à cocher personnalisée. Tu apprendras comment tout cela fonctionne dans les futures leçons et ateliers.

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<form>
  <label>
  Agree <input class="checkbox" type="checkbox" />
  </label>
</form>
```

```css
.checkbox {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #ccc;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  transition: all 0.25s ease;
  vertical-align: middle; 
}

.checkbox:hover {
  border-color: #888;
}

.checkbox:checked {
  background-color: #4caf50;
  border-color: #4caf50;
}

.checkbox:checked::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 0px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox:focus {
  outline: 2px solid #90caf9;
  outline-offset: 2px;
}

```

:::

Dans cet exemple, on utilise la propriété `appearance` définie à `none` pour enlever le style par défaut appliqué par le navigateur aux entrées checkbox. Quand l'utilisateur coche la case, elle aura une couleur d'arrière-plan `green`.

D'autres exemples de pseudo-classes d'action sont :

- `:focus-within` : pour appliquer des styles à un élément quand lui ou n'importe lequel de ses descendants a le focus.
- `:enabled` : pour cibler les boutons de formulaire ou autres éléments qui sont actuellement activés.
- `:disabled` : pour cibler les boutons de formulaire ou autres éléments qui sont désactivés.
- `:target` : pour appliquer des styles à un élément qui est la cible d'un fragment d'URL (la partie d'une URL après le symbole `#`).

# --questions--

## --text--

Que te permettent de faire les pseudo-classes d'action utilisateur ?

## --answers--

Elles permettent les animations et les transitions.

### --feedback--

Pense à comment tu peux interagir avec les utilisateurs uniquement avec CSS.

---

Elles te permettent de modifier la structure du DOM dynamiquement.

### --feedback--

Pense à comment tu peux interagir avec les utilisateurs uniquement avec CSS.

---

Elles te permettent de fournir un retour à l'utilisateur sans dépendre de JavaScript.

---

Elles te permettent de styliser le dernier élément d'une liste.

### --feedback--

Pense à comment tu peux interagir avec les utilisateurs uniquement avec CSS.

## --video-solution--

3

## --text--

Que fait la pseudo-classe `:checked` en CSS ?

## --answers--

Elle sélectionne un élément quand il est désactivé.

### --feedback--

Pense à comment les formulaires gèrent les sélections utilisateur.

---

Elle sélectionne un élément quand il est survolé.

### --feedback--

Pense à comment les formulaires gèrent les sélections utilisateur.

---

Elle stylise les éléments comme les cases à cocher ou les boutons radio qui sont cochés.

---

Elle stylise un élément quand il reçoit le focus.

### --feedback--

Pense à comment les formulaires gèrent les sélections utilisateur.

## --video-solution--

3

## --text--

Que fait la pseudo-classe `:focus` ?

## --answers--

Elle sélectionne un élément quand il est survolé par une souris.

### --feedback--

Pense à comment les utilisateurs naviguent dans les formulaires en utilisant un clavier.

---

Elle applique des styles quand un élément reçoit le focus, généralement via la navigation au clavier ou un clic.

---

Elle sélectionne un élément après qu'un formulaire est soumis.

### --feedback--

Pense à comment les utilisateurs naviguent dans les formulaires en utilisant un clavier.

---

Elle applique des styles à un élément quand il est désactivé.

### --feedback--

Pense à comment les utilisateurs naviguent dans les formulaires en utilisant un clavier.

## --video-solution--

2
