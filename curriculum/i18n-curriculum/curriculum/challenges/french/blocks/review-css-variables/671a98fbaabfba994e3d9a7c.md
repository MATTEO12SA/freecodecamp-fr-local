---
id: 671a98fbaabfba994e3d9a7c
title: Révision des variables CSS
challengeType: 31
dashedName: review-css-variables
---

# --interactive--

## Propriétés personnalisées CSS (variables CSS)

- **Définition** : Les propriétés personnalisées CSS, aussi appelées variables CSS, sont des entités définies par les auteurs CSS qui contiennent des valeurs précises à réutiliser dans tout un document. C'est une fonctionnalité puissante qui permet de créer des feuilles de style plus efficaces, maintenables et flexibles. Les propriétés personnalisées sont particulièrement utiles pour créer des designs thématisables. Tu peux définir un ensemble de propriétés pour différents thèmes :

```css
:root {
  --bg-color: white;
  --text-color: black;
}

.dark-theme {
  --bg-color: #333;
  --text-color: white;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

## La règle `@property`

- **Définition** : La règle `@property` est une fonctionnalité CSS puissante qui permet aux développeurs de définir des propriétés personnalisées avec un contrôle plus précis sur leur comportement, notamment leur animation et leurs valeurs initiales.

```css
@property --property-name {
  syntax: '<type>';
  inherits: true | false;
  initial-value: <value>;
}
```

- **`--property-name`** : C'est le nom de la propriété personnalisée que tu définis. Comme toutes les propriétés personnalisées, elle doit commencer par deux tirets.
  **`syntax`** : Cela définit le type de la propriété, qui peut être par exemple `<color>`, `<length>`, `<number>`, `<percentage>`, ou des types plus complexes.
- **`inherits`** : Cela précise si la propriété doit hériter sa valeur de son élément parent.
- **`initial-value`** : Cela définit la valeur par défaut de la propriété.
- **Exemple de dégradé avec la règle `@property`** : Cet exemple crée un dégradé qui s'anime fluidement quand l'élément est survolé.

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css">

<div class="gradient-box"></div>
```

```css
@property --gradient-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.gradient-box {
  width: 100px;
  height: 100px;
  background: linear-gradient(var(--gradient-angle), red, blue);
  transition: --gradient-angle 0.5s;
}

.gradient-box:hover {
  --gradient-angle: 90deg;
}
```

:::

- **Fallbacks** : Quand tu utilises une propriété personnalisée, tu peux fournir une valeur de fallback avec la fonction `var()`, comme tu le ferais avec des propriétés personnalisées standard :

```css
.button {
  background-color: var(--main-color, #3498db);
}
```

# --assignment--

Révise les sujets et concepts des variables CSS.
