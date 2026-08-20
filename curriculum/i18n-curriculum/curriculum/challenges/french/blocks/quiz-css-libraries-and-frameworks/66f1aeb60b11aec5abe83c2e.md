---
id: 66f1aeb60b11aec5abe83c2e
title: Quiz sur les bibliothèques et frameworks CSS
challengeType: 8
dashedName: quiz-css-libraries-and-frameworks
---

# --description--

Pour réussir le quiz, tu dois répondre correctement à au moins 9 des 10 questions ci-dessous.

# --quizzes--

## --quiz--

### --question--

#### --text--

Qu'est-ce qu'un framework CSS ?

#### --distractors--

Un outil pour corriger les erreurs CSS.

---

Un outil pour linter les fichiers CSS.

---

Un formateur pour les fichiers CSS.

#### --answer--

Une bibliothèque pour les styles CSS.

### --question--

#### --text--

Lequel des suivants est un framework CSS utility-first populaire ?

#### --distractors--

Template CSS

---

Loading CSS

---

Minimal CSS

#### --answer--

Tailwind CSS

### --question--

#### --text--

Quel est un inconvénient des frameworks CSS ?

#### --distractors--

Trop peu de composants.

---

Aucune option de personnalisation.

---

Un meilleur support navigateur.

#### --answer--

Peut alourdir les fichiers CSS.

### --question--

#### --text--

Que signifie SCSS ?

#### --distractors--

Super Cascading Style Sheets.

---

Structured CSS.

---

Simple CSS.

#### --answer--

Sassy CSS.

### --question--

#### --text--

Laquelle des options suivantes est une fonctionnalité de Sass ?

#### --distractors--

Comments

---

CSS linting.

---

Inline CSS.

#### --answer--

Mixins

### --question--

#### --text--

Quelle est la bonne façon d'utiliser les classes utilitaires dans Tailwind CSS ?

#### --distractors--

```html
<button class="color-blue text-color font-size allow-hover round-btn">
  Button
</button>
```

---

```html
<button class="blue text font-size hover round-btn margin-full">
  Button
</button>
```

---


```html
<button class="set-blue set-text set-font set-hover round-btn padding-full">
  Button
</button>
```

#### --answer--


```html
<button class="bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700">
  Button
</button>
```

### --question--

#### --text--

Quels sont les deux types de frameworks CSS ?

#### --distractors--

Frameworks CSS tablet first et frameworks CSS component-based.

---

Frameworks CSS utility-first et frameworks CSS lazy loading.

---

Frameworks CSS minimal et frameworks CSS utility-first.

#### --answer--

Frameworks CSS utility-first et frameworks CSS component-based.

### --question--

#### --text--

Quelle est l'extension de fichier pour SCSS ?

#### --distractors--

`.sass`

---

`.scsss`

---

`.css`

#### --answer--

`.scss`

### --question--

#### --text--

Quelle est la bonne façon de définir une variable en SCSS ?

#### --distractors--

```css
#primary-color: #3498eb;

header {
  background-color: #primary-color;
}
```

---

```css
>primary-color: #3498eb;

header {
  background-color: >primary-color;
}
```

---

```css
?primary-color: #3498eb;

header {
  background-color: ?primary-color;
}
```

#### --answer--

```css
$primary-color: #3498eb;

header {
  background-color: $primary-color;
}
```

### --question--

#### --text--

Quelle est la bonne façon de définir un mixin ?

#### --distractors--

```css
--mixin center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

---

```css
>mixin center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

---

```css
mixin center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

#### --answer--

```css
@mixin center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
```
