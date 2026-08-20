---
id: 695cc8f280fef0cc3bed02ca
title: 'Qu''est-ce que le module Path et comment fonctionne-t-il ?'
challengeType: 19
dashedName: what-is-the-path-module-and-how-does-it-work
---

# --description--

Le module Node.js `path` te permet de travailler avec les chemins de fichiers et de répertoires. Il fournit plusieurs méthodes utiles pour gérer et transformer les chemins, notamment joindre, normaliser et résoudre les chemins sur différentes plateformes et systèmes d'exploitation.

Pour utiliser le module `path`, tu peux l'importer ainsi :

```js
const path = require("path");
```

Regardons quelques méthodes fournies par le module `path` et comment elles fonctionnent.

D'abord, tu dois connaître les variables globales Node.js `__filename` et `__dirname`, aussi appelées variables « common JS ». Tu n'as pas besoin du module `path` pour y accéder, c'est pourquoi elles sont appelées variables globales.

`__filename` est le chemin absolu du fichier actuel et `__dirname` est le chemin absolu du répertoire contenant le fichier actuel.

Par exemple, j'ai un fichier `script.js` avec lequel je travaille actuellement. Voici ce que renvoient les deux :

```js
console.log(__filename);
// /Users/user/Desktop/fCC/script-code/node/node-path/script.js

console.log(__dirname);
// /Users/user/Desktop/fCC/script-code/node/node-path
```

Tu dois aussi connaître les chemins relatifs et absolus.

Un chemin relatif pointe vers un fichier ou dossier par rapport à ton répertoire de travail actuel. Par exemple, `./assets/src/text-files`.

Un chemin absolu, en revanche, donne l'adresse complète d'un fichier ou dossier depuis la racine de ton système, comme `/Users/johndoe/projects/app/assets/src/text-files.`

La méthode `basename()` affiche la dernière partie du fichier, c'est-à-dire le nom de fichier :

```js
console.log(path.basename(__filename)); // script.js
```

`dirname()` renvoie le nom du répertoire d'un chemin :

```js
console.log(path.dirname(__dirname)); // node-path
```

`extname()` renvoie l'extension du fichier actuel :

```js
console.log(path.extname(__filename)); // .js
```

Tu peux aussi spécifier un autre fichier dont renvoyer l'extension :

```js
console.log(path.extname('text-files/text1.txt')); // .txt
```

La méthode `join()` prend tous les segments de chemin que tu passes et les joint en un seul chemin propre et normalisé.

Cela peut être utile si tu veux fusionner des fichiers liés dans différents dossiers pour travailler avec eux ensemble :

```js
const joinedPath = path.join("src", "assets", "text-files");
console.log(joinedPath); // src/assets/text-files
```

Windows utilise des backslashes pour séparer les chemins, donc le résultat sera `src\assets\text-files`.

De plus, la méthode `join()` corrige automatiquement les mauvais slashs et supprime les slashs en trop :

```js
const wrongPath = path.join("/src//", "assets", "text-files");
console.log(wrongPath); // /src/assets/text-files
```

La méthode `resolve()` transforme une séquence de segments de chemin en un chemin absolu. Elle part de ton répertoire de travail actuel et produit un chemin complet qui pointe vers l'emplacement exact sur l'appareil :

```js
const absolutePath = path.resolve("assets", "src", "text-files");
console.log(absolutePath);
// /Users/user/Desktop/fCC/script-code/node/node-path/assets/src/text-files
```

La différence entre `join()` et `resolve()` est que `join()` crée un chemin relatif, tandis que `resolve()` renvoie un chemin absolu.

Enfin, il y a les méthodes `parse()` et `format()`.

`parse()` prend un répertoire ou un fichier et renvoie un objet qui contient la décomposition de ses parties, comme la racine système, son répertoire, l'extension et le nom de fichier :

```js
const parsedFile = path.parse(__filename);

console.log(parsedFile);
/*
{
 root: '/',
 dir: '/Users/user/Desktop/fCC/script-code/node/node-path',
 base: 'script.js',
 ext: '.js',
 name: 'script'
}
*/
```

`format()`, en revanche, construit un chemin à partir d'un objet contenant le répertoire, le nom et l'extension :

```js
const formattedDirectory = path.format({
  dir: "/users/johndoe/docs",
  name: "file",
  ext: ".txt",
});

console.log(formattedDirectory); // /users/johndoe/docs/file.txt
```

# --questions--

## --text--

Quelle est la différence entre `path.dirname()` et `path.extname()` dans Node.js ?

## --answers--

`dirname()` retire l'extension du fichier, tandis que `extname()` retire le nom du répertoire.

### --feedback--

Concentre-toi sur laquelle traite les répertoires et laquelle traite les extensions de fichiers.

---

`dirname()` renvoie le chemin complet du fichier, tandis que `extname()` renvoie le nom du répertoire.

### --feedback--

Concentre-toi sur laquelle traite les répertoires et laquelle traite les extensions de fichiers.

---

`dirname()` renvoie le nom du répertoire d'un chemin, tandis que `extname()` renvoie l'extension du fichier.

---

`dirname()` et `extname()` renvoient toutes deux la même valeur mais dans des formats différents.

### --feedback--

Concentre-toi sur laquelle traite les répertoires et laquelle traite les extensions de fichiers.

## --video-solution--

3

## --text--

Quelle méthode `path` construit un chemin de fichier complet à partir d'un objet contenant les propriétés directory, name et extension ?

## --answers--

`path.parse()`

### --feedback--

Pense à ce qu'est l'opposé de `parse()`.

---

`path.format()`

---

`path.resolve()`

### --feedback--

Pense à ce qu'est l'opposé de `parse()`.

---

`path.join()`

### --feedback--

Pense à ce qu'est l'opposé de `parse()`.

## --video-solution--

2

## --text--

À quoi donnent accès les variables globales Node.js `__filename` et `__dirname` ?

## --answers--

Le chemin absolu du fichier actuel et de son répertoire parent.

---

Le nom du module actuel et ses dépendances.

### --feedback--

Pense aux variables qui te donnent automatiquement les chemins complets des fichiers et dossiers sans utiliser le module path.

---

Le chemin relatif vers le répertoire d'installation de Node.js.

### --feedback--

Pense aux variables qui te donnent automatiquement les chemins complets des fichiers et dossiers sans utiliser le module path.

---

L'URL du serveur web en cours d'exécution et son nom d'hôte.

### --feedback--

Pense aux variables qui te donnent automatiquement les chemins complets des fichiers et dossiers sans utiliser le module path.

## --video-solution--

1
