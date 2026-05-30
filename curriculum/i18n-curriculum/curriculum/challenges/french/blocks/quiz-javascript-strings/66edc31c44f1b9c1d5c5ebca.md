---
id: 66edc31c44f1b9c1d5c5ebca
title: Quiz sur les chaînes JavaScript
challengeType: 8
dashedName: quiz-javascript-strings
---

# --description--

Pour réussir le quiz, tu dois répondre correctement à au moins 18 des 20 questions ci-dessous.

# --quizzes--

## --quiz--

### --question--

#### --text--

Quelle est la valeur de retour de la méthode `includes()` ?

#### --distractors--

Si la sous-chaîne est trouvée dans la chaîne, la méthode renvoie la chaîne. Sinon, elle renvoie `undefined`.

---

Si la sous-chaîne est trouvée dans la chaîne, la méthode renvoie `true`. Sinon, elle renvoie une chaîne vide.

---

Si la sous-chaîne est trouvée dans la chaîne, la méthode renvoie la chaîne. Sinon, elle renvoie `null`.

#### --answer--

Si la sous-chaîne est trouvée dans la chaîne, la méthode renvoie `true`. Sinon, elle renvoie `false`.

### --question--

#### --text--

Quelle option illustre l'interpolation de chaînes ?

#### --distractors--

`"Hello, " + user + "!"`

---

`"Hello, $user!"`

---

`` `Hello, {user}!` ``

#### --answer--

`` `Hello, ${user}!` ``

### --question--

#### --text--

Laquelle des options suivantes est le caractère de nouvelle ligne ?

#### --distractors--

`\newline`

---

`\new`

---

`\line`

#### --answer--

`\n`

### --question--

#### --text--

Laquelle des affirmations suivantes est correcte à propos des chaînes ?

#### --distractors--

Les chaînes sont mutables et peuvent être modifiées après leur création.

---

Les chaînes sont des types de données non primitifs.

---

Les chaînes ne peuvent être créées qu'à l'aide de guillemets simples.

#### --answer--

Les chaînes sont immuables.

### --question--

#### --text--

Que signifie ASCII ?

#### --distractors--

American Standard Code for Internet Information

---

Advanced Systematic Code for Internal Interchange

---

Automatic Standard Code for Internal Information

#### --answer--

American Standard Code for Information Interchange

### --question--

#### --text--

Laquelle des méthodes suivantes extrait une portion d'une chaîne et renvoie une nouvelle chaîne ?

#### --distractors--

`trim()`

---

`indexOf()`

---

`prompt()`

#### --answer--

`slice()`

### --question--

#### --text--

Quel est le but de la méthode `prompt()` ?

#### --distractors--

Elle affiche un message dans la console.

---

Elle affiche une boîte d'alerte avec un message.

---

Elle affiche une boîte de confirmation avec un message.

#### --answer--

Elle affiche une boîte de dialogue qui attend la saisie de l'utilisateur.

### --question--

#### --text--

Laquelle des propositions suivantes est la façon correcte d'accéder au troisième caractère d'une chaîne ?

#### --distractors--

```js
const developer = "Jessica";
developer[3];
```

---

```js
const developer = "Jessica";
developer[-1];
```

---

```js
const developer = "Jessica";
developer[0];
```

#### --answer--

```js
const developer = "Jessica";
developer[2];
```

### --question--

#### --text--

Comment peux-tu obtenir la valeur ASCII du premier caractère de la chaîne `"hello"` ?

#### --distractors--

`"hello".charCode(0)`

---

`"hello".codeAt(0)`

---

`"hello".getCharIndex(0)`

#### --answer--

`"hello".charCodeAt(0)`

### --question--

#### --text--

Quelle méthode peux-tu utiliser pour obtenir le caractère correspondant à une valeur ASCII ?

#### --distractors--

`toASCII()`

---

`toChar()`

---

`toCode()`

#### --answer--

`fromCharCode()`

### --question--

#### --text--

Lequel des exemples `indexOf` suivants affichera `-1` dans la console ?

#### --distractors--

```js
const organization = "freeCodeCamp";
console.log(organization.indexOf("e"));
```

---

```js
const organization = "freeCodeCamp";
console.log(organization.indexOf("f"));
```

---

```js
const organization = "freeCodeCamp";
console.log(organization.indexOf("C"));
```

#### --answer--

```js
const organization = "freeCodeCamp";
console.log(organization.indexOf("c"));
```

### --question--

#### --text--

Comment peux-tu vérifier si la chaîne `"JavaScript"` contient `"Script"` ?

#### --distractors--

`"JavaScript".has("Script")`

---

`"JavaScript".contains("Script")`

---

`"JavaScript".exists("Script")`

#### --answer--

`"JavaScript".includes("Script")`

### --question--

#### --text--

Laquelle des propositions suivantes extrait la sous-chaîne `"Script"` de la chaîne `"JavaScript"` ?

#### --distractors--

`"JavaScript".find(5)`

---

`"JavaScript".extract(4)`

---

`"JavaScript".cut(5)`

#### --answer--

`"JavaScript".slice(4)`

### --question--

#### --text--

Comment convertis-tu la chaîne `"JavaScript"` en majuscules ?

#### --distractors--

`"JavaScript".upper()`

---

`"JavaScript".toUpper()`

---

`"JavaScript".convertUpper()`

#### --answer--

`"JavaScript".toUpperCase()`

### --question--

#### --text--

Comment convertis-tu la chaîne `"JavaScript"` en minuscules ?

#### --distractors--

`"JavaScript".lower()`

---

`"JavaScript".toLower()`

---

`"JavaScript".convertLower()`

#### --answer--

`"JavaScript".toLowerCase()`

### --question--

#### --text--

Laquelle des propositions suivantes remplacera `"dogs"` par `"cats"` dans la chaîne `"I love dogs"`.

#### --distractors--

`"I love dogs".slice("dogs", "cats")`

---

`"I love dogs".replaceWith("dogs", "cats")`

---

`"I love dogs".find("dogs", "cats")`

#### --answer--

`"I love dogs".replace("dogs", "cats")`

### --question--

#### --text--

Quelle méthode est utilisée pour répéter une chaîne un nombre de fois spécifié ?

#### --distractors--

`times()`

---

`repeatTimes()`

---

`repeatNumber()`

#### --answer--

`repeat()`

### --question--

#### --text--

Que renverra le code suivant : `"abc".repeat(3)` ?

#### --distractors--

`"abcabc"`

---

`"abcabcabcabc"`

---

Il déclenchera une erreur.

#### --answer--

`"abcabcabc"`

### --question--

#### --text--

Quelle méthode supprimera les espaces au début et à la fin d'une chaîne ?

#### --distractors--

`strip()`

---

`removeWhitespace()`

---

`trimWhitespace()`

#### --answer--

`trim()`

### --question--

#### --text--

Laquelle des propositions suivantes est la syntaxe correcte pour échapper les guillemets ?

#### --distractors--

```js
"She said, ?"Hello!?""
```

---

```js
"She said, ."Hello!.""
```

---

```js
"She said, //"Hello!//""
```

#### --answer--

```js
"She said, \"Hello!\""
```
