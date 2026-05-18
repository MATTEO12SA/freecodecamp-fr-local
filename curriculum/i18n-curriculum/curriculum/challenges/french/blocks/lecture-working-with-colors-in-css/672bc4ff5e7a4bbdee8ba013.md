---
id: 672bc4ff5e7a4bbdee8ba013
title: Que sont les couleurs nommées en CSS, et quand les utiliser ?
challengeType: 19
dashedName: what-are-named-colors-in-css
---

# --interactive--

En CSS, les couleurs jouent un rôle essentiel dans la conception des pages web, en améliorant la lisibilité, en définissant l'ambiance et en améliorant l'expérience utilisateur. L'une des façons les plus simples de définir les couleurs en CSS est d'utiliser les couleurs nommées. Les couleurs nommées sont des noms de couleurs prédéfinis reconnus par les navigateurs. Voici un exemple d'utilisation d'une couleur nommée pour un élément paragraphe :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<p>This is a paragraph.</p>
```

```css
p {
  color: red;
}
```

:::

Dans cet exemple, on utilise la couleur nommée `red` pour styliser le texte d'un paragraphe.

Les couleurs nommées en CSS sont une collection de 140 noms de couleurs standard comme `red`, `blue`, `yellow`, `aqua`, `fuchsia`, `black`, et ainsi de suite. Ces noms sont simples à utiliser et rendent ton code plus lisible, et ils sont auto-descriptifs.

Les couleurs nommées sont utiles pour le prototypage rapide, les designs simples et l'amélioration de la lisibilité du code. Voici un autre exemple d'utilisation des couleurs nommées pour un sélecteur `h1` :

:::interactive_editor

```html
<link rel="stylesheet" href="styles.css" />
<h1>This is a heading</h1>
```

```css
h1 {
  color: navy;
  background-color: lightgray;
}
```

:::

Dans cet exemple, le texte du titre sera stylisé en navy, avec un arrière-plan gris clair. La lisibilité du code s'améliore puisque les couleurs nommées fournissent une compréhension visuelle immédiate du style prévu.

Les couleurs nommées en CSS sont pratiques mais limitées, avec seulement 140 options disponibles. Elles peuvent ne pas offrir la nuance précise nécessaire pour des designs plus détaillés.

Les couleurs nommées en CSS sont une excellente façon d'appliquer des couleurs rapidement et de manière descriptive. Bien qu'elles soient utiles pour les designs de base, le prototypage et l'amélioration de la lisibilité du code, leur gamme limitée les rend moins adaptées aux designs complexes nécessitant un contrôle précis des couleurs.

En comprenant les forces et les limites des couleurs nommées, tu peux déterminer quand il est préférable de les utiliser plutôt que des modèles de couleurs plus détaillés comme RGB ou HSL, dont tu apprendras plus dans les futures leçons.

# --questions--

## --text--

Quel est un avantage clé de l'utilisation des couleurs nommées en CSS ?

## --answers--

Les couleurs nommées te permettent de créer des dégradés.

### --feedback--

Pense à l'aspect simplicité et lisibilité des couleurs nommées.

---

Les couleurs nommées sont plus simples à écrire et rendent le code plus lisible.

---

Les couleurs nommées offrent une gamme plus large d'options de couleurs que les codes hex.

### --feedback--

Pense à l'aspect simplicité et lisibilité des couleurs nommées.

---

Les couleurs nommées sont la façon la plus précise de définir des couleurs dans le design web.

### --feedback--

Pense à l'aspect simplicité et lisibilité des couleurs nommées.

## --video-solution--

2

## --text--

Dans quel scénario les couleurs nommées pourraient-elles ne pas être le meilleur choix ?

## --answers--

Quand tu dois prototyper rapidement un design.

### --feedback--

Pense aux limitations des couleurs nommées dans les designs plus complexes.

---

Quand ton design nécessite des nuances très spécifiques ou nuancées de couleur.

---

Quand ton design n'implique que des couleurs primaires.

### --feedback--

Pense aux limitations des couleurs nommées dans les designs plus complexes.

---

Quand tu collabores avec d'autres sur un projet simple.

### --feedback--

Pense aux limitations des couleurs nommées dans les designs plus complexes.

## --video-solution--

2

## --text--

Lequel des suivants est un exemple de couleur nommée en CSS ?

## --answers--

`#ff5733`

### --feedback--

Les couleurs nommées sont des mots descriptifs, pas des codes numériques.

---

`rgb(255, 99, 71)`

### --feedback--

Les couleurs nommées sont des mots descriptifs, pas des codes numériques.

---

`tomato`

---

`hsl(120, 100%, 50%)`

### --feedback--

Les couleurs nommées sont des mots descriptifs, pas des codes numériques.

## --video-solution--

3
