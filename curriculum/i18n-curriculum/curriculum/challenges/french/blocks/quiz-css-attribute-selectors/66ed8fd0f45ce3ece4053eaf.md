---
id: 66ed8fd0f45ce3ece4053eaf
title: Quiz sur les sélecteurs d'attribut CSS
challengeType: 8
dashedName: quiz-css-attribute-selectors
---

# --description--

Pour réussir le quiz, tu dois répondre correctement à au moins 9 des 10 questions ci-dessous.

# --quizzes--

## --quiz--

### --question--

#### --text--

À quoi servent les sélecteurs d'attribut CSS ?

#### --distractors--

À appliquer des styles aux éléments selon leur nom de balise.

---

À appliquer des styles aux éléments selon leur nom de classe.

---

À appliquer des styles aux éléments selon leur élément parent.

#### --answer--

À appliquer des styles aux éléments selon leurs attributs.

### --question--

#### --text--

Lequel des éléments suivants ne sera PAS sélectionné par ce sélecteur CSS ?

```css
[title~="flower"] {
  border: 5px solid yellow;
}
```

#### --distractors--

```html
<img src="img1.jpg" title="clematis flower" width="150" height="113">
```

---

```html
<img src="img2.jpg" title="flower" width="150" height="113">
```

---

```html
<img src="img2.jpg" title="FLOWERS of flower" width="150" height="113">
```

#### --answer--

```html
<img src="img2.jpg" title="flowers" width="150" height="113">
```

### --question--

#### --text--

Quel sélecteur CSS correspond à tous les éléments `p` avec un attribut `lang` défini sur `"fr"` ?

#### --distractors--

```css
p[lang-="fr"] { color: blue; }
```

---

```css
p[lang~="fr"] { color: blue; }
```

---

```css
p[lang=="fr"] { color: blue; }
```

#### --answer--

```css
p[lang="fr"] { color: blue; }
```

### --question--

#### --text--

Quel sélecteur CSS correspond à tous les éléments `a` avec un attribut `href` ?

#### --distractors--

```css
a(href) { color: green; }
```

---

```css
a { color: green; }
```

---

```css
a[href~=""] { color: green; }
```

#### --answer--

```css
a[href] { color: blue; }
```

### --question--

#### --text--

Quel sélecteur CSS correspond à toutes les listes ordonnées avec des chiffres romains en majuscules ?

#### --distractors--

```css
ol[type="a"] { border-color: black; }
```

---

```css
ol[type="A"] { border-color: black; }
```

---

```css
ol[type="i"] { border-color: black; }
```

#### --answer--

```css
ol[type="I"] { border-color: black; }
```

### --question--

#### --text--

À quoi l'attribut `data-lang` est-il couramment utilisé ?

#### --distractors--

À préciser la langue du document.

---

À définir l'encodage des caractères du document.

---

À définir la langue d'un élément selon son élément parent.

#### --answer--

À appliquer des styles aux éléments selon cet attribut de données personnalisé.

### --question--

#### --text--

Quel sélecteur CSS devrais-tu utiliser pour styliser les éléments `img` uniquement si leur attribut `alt` est égal à `"code"` ?

#### --distractors--

```css
img[alt~="code"] { border: 1px solid red; }
```

---

```css
img[alt=="code"] { border: 1px solid red; }
```

---

```css
img[alt*="code"] { border: 1px solid red; }
```

#### --answer--

```css
img[alt="code"] { border: 1px solid red; }
```

### --question--

#### --text--

Quel sélecteur CSS correspond aux listes ordonnées avec un type de numérotation numérique ?

#### --distractors--

```css
ol[type="i"] { color: purple; }
```

---

```css
ol[type="I"] { color: purple; }
```

---

```css
ol[type="a"] { color: purple; }
```

#### --answer--

```css
ol[type="1"] { color: purple; }
```

### --question--

#### --text--

Lequel des sélecteurs CSS suivants utiliserais-tu pour styliser les éléments `a` avec à la fois les attributs `href` et `title` ?

#### --distractors--

```css
a[href] a[title] { text-decoration: underline dotted; }
```

---

```css
a[href]a[title] { text-decoration: underline dotted; }
```

---

```css
a[href].[title] { text-decoration: underline dotted; }
```

#### --answer--

```css
a[href][title] { text-decoration: underline dotted; }
```

### --question--

#### --text--

Quel sélecteur CSS utiliserais-tu si tu développes un site web pour un restaurant et que tu veux styliser tous les éléments avec la classe `menu-item` qui ont un attribut `data-special` ?

#### --distractors--

```css
menu-item[data-special] { background-color: blue; }
```

---

```css
#menu-item[data-special] { background-color: blue; }
```

---

```css
[data-special="menu-item"] { background-color: blue; }
```

#### --answer--

```css
.menu-item[data-special] { background-color: blue; }
```
