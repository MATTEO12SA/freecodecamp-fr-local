---
id: 67329fbcfaf5ff5cdaa38a42
title: 'Qu''est-ce que le mot-clé `var`, et pourquoi n''est-il plus recommandé de l''utiliser ?'
challengeType: 19
dashedName: what-is-the-var-keyword-and-why-is-it-no-longer-suggested-to-use-it
---

# --interactive--

Le mot-clé `var` en JavaScript est l'une des premières façons de déclarer des variables. Il fait partie du langage depuis ses débuts et, pendant de nombreuses années, il est resté la méthode principale pour créer des variables. Cependant, à mesure que JavaScript a évolué et que les développeurs ont acquis plus d'expérience avec le langage, certains inconvénients de l'utilisation de `var` sont devenus évidents, ce qui a conduit à l'introduction de `let` et `const` en 2015.

Lorsque tu déclares une variable avec `var`, elle devient limitée à la fonction ou à la portée globale. Cela signifie que si tu déclares une variable à l'intérieur d'une fonction en utilisant `var`, elle n'est accessible que dans cette fonction. Cependant, si tu la déclares en dehors de toute fonction, elle devient une variable globale accessible dans tout ton script. Ce comportement peut parfois conduire à des résultats inattendus et rendre ton code plus difficile à comprendre.

Un problème avec `var` est qu'il te permet de redéclarer la même variable plusieurs fois sans générer d'erreur. Cela peut entraîner des écrasements accidentels et rendre le débogage plus difficile.

:::interactive_editor

```js
var num = 5;
console.log(num); // 5

// This is allowed and doesn't throw an error
var num = 10;
console.log(num); // 10
```

:::

Le problème le plus important avec `var` est son absence de portée de bloc. Les variables déclarées avec `var` à l'intérieur d'un bloc, comme une instruction `if` ou une boucle `for`, restent accessibles en dehors de ce bloc.

:::interactive_editor

```js
if (true) {
  var num = 5;
}
console.log(num); // 5
```

:::

Ce comportement peut entraîner des fuites de variables involontaires et rendre ton code plus susceptible de bugs.

En raison de ces problèmes, le développement JavaScript moderne s'est largement éloigné de `var` au profit de `let` et `const`. Ces mots-clés offrent une portée de bloc qui correspond mieux au fonctionnement de la portée dans de nombreux autres langages de programmation.

Ils n'autorisent pas non plus la redéclaration dans la même portée, ce qui aide à prévenir les écrasements accidentels.

Bien que `var` fasse toujours partie de JavaScript et fonctionne dans tous les navigateurs, il est généralement recommandé d'utiliser `let` et `const` dans le développement JavaScript moderne. Ils fournissent des règles de portée claires, aident à éviter les pièges courants et rendent le comportement de ton code plus prévisible.

# --questions--

## --text--

Quelle est la portée d'une variable déclarée avec `var` en dehors de toute fonction ?

## --answers--

Portée de bloc.

### --feedback--

Réfléchis à l'endroit où une variable `var` déclarée en dehors d'une fonction peut être accessible.

---

Portée de fonction.

### --feedback--

Réfléchis à l'endroit où une variable `var` déclarée en dehors d'une fonction peut être accessible.

---

Portée globale.

---

Portée de module.

### --feedback--

Réfléchis à l'endroit où une variable `var` déclarée en dehors d'une fonction peut être accessible.

## --video-solution--

3

## --text--

Quelle sera la sortie du code suivant ?

```js
var x = 10;

if (true) {
  var x = 20;
  console.log(x);
}

console.log(x);
```

## --answers--

```js
10
10
```

### --feedback--

Rappelle-toi que `var` a une portée de fonction ou globale, et qu'il permet la redéclaration dans la même portée.

---

```js
20
20
```

---

```js
10
20
```

### --feedback--

Rappelle-toi que `var` a une portée de fonction ou globale, et qu'il permet la redéclaration dans la même portée.

---

```js
20
10
```

### --feedback--

Rappelle-toi que `var` a une portée de fonction ou globale, et qu'il permet la redéclaration dans la même portée.

## --video-solution--

2

## --text--

Lequel des éléments suivants N'est PAS une raison d'éviter d'utiliser `var` en JavaScript moderne ?

## --answers--

`var` permet de redéclarer des variables dans la même portée.

### --feedback--

Réfléchis à quelle affirmation est fausse concernant le comportement ou le support de `var`.

---

`var` n'est pas pris en charge dans les navigateurs modernes.

---

Les variables `var` ont une portée de fonction, pas une portée de bloc.

### --feedback--

Réfléchis à quelle affirmation est fausse concernant le comportement ou le support de `var`.

---

Les variables `var` sont hoistées.

### --feedback--

Réfléchis à quelle affirmation est fausse concernant le comportement ou le support de `var`.

## --video-solution--

2
