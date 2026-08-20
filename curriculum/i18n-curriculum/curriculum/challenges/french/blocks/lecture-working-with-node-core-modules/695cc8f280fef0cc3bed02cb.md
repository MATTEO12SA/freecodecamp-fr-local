---
id: 695cc8f280fef0cc3bed02cb
title: 'Qu''est-ce que le module Process et comment fonctionne-t-il ?'
challengeType: 19
dashedName: what-is-the-process-module-and-how-does-it-work
---

# --description--

`process` est l'un des modules de base Node.js les plus importants. Il te donne accès aux informations sur le processus Node.js actuel, et te permet de le contrôler pendant que ton app s'exécute.

Quand tu exécutes une commande comme `node script.js` dans le terminal, Node.js démarre un processus, qui est une instance en cours d'exécution du programme Node qui exécute le fichier `script.js`. Ce processus a sa propre mémoire, son environnement et son contexte d'exécution.

Le processus actuel est exposé globalement via le module `process`, tu n'as même pas besoin de l'importer. Tant que Node.js est installé, tu peux l'appeler n'importe où.

Le module `process` expose des propriétés et méthodes pour obtenir certaines informations sur le contexte d'exécution actuel.

`process.env` te donne des informations sur l'environnement actuel sur lequel Node s'exécute. Cela renvoie toujours un énorme objet avec de nombreux paramètres, voici donc comment accéder directement à certaines des infos les plus importantes :

```js
// Gets all environment variables available to the current Node.js process
console.log(process.env);

// Gets the current Node.js environment mode (like 'development' or 'production')
console.log(process.env.NODE_ENV); // development

// Gets the path of the shell program running the Node.js process
console.log(process.env.SHELL); // /bin/bash

// Gets the system PATH variable where executables are searched for
console.log(process.env.PATH); // /usr/local/bin:/usr/bin:/bin

// Gets the present working directory from where the process was started
console.log(process.env.PWD); // /Users/johndoe/projects/myapp

// Gets the username of the user running the current process
console.log(process.env.USER); // johndoe
```

`process.argv` te permet de lire les arguments de la ligne de commande :

```js
console.log(process.argv);
/*
script.js --watch
Hello world
[
  '/Users/user/.nvm/versions/node/v22.17.0/bin/node',
  '/Users/user/Desktop/fCC/script-code/node/node-process/script.js',
  '--watch'
]
*/
```

La méthode `cwd()` affiche le répertoire de travail actuel :

```js
console.log(process.cwd());
```

Les événements de processus sont une fonctionnalité centrale de Node.js qui permettent à ton app de réagir aux moments clés de son cycle de vie, comme juste avant de quitter, en cas d'erreur, ou à la réception d'un signal système.

L'événement `exit`, par exemple, s'exécute juste avant que le processus Node.js se termine :

```js
process.on("exit", (code) => {
  console.log(`Process exiting with code: ${code}`);
});

// Process exiting with code: 0
```

L'événement `uncaughtException` est déclenché quand une erreur n'est pas capturée dans ton code, ce qui peut t'aider à prévenir les plantages :

```js
process.on("uncaughtException", (err) => {
  console.error("Uncaught error:", err.message);
});
```

Enfin, l'événement `warning` est déclenché quand Node.js émet un avertissement de processus :

```js
process.on("warning", (warning) => {
  console.warn("Warning name:", warning.name);
  console.warn("Warning message:", warning.message);
});
```

Tu peux ensuite utiliser la méthode `emitWarning()` pour déclencher un avertissement personnalisé :

```js
// Example warning with the emitWarning() method
process.emitWarning('This is a custom warning message', 'CustomWarning');

/*
  Warning name: CustomWarning
  Warning message: This is a custom warning message
*/
```

# --questions--

## --text--

Que fait la méthode `process.emitWarning()` ?

## --answers--

Elle arrête le processus quand un avertissement personnalisé survient.

### --feedback--

Pense à comment Node.js gère les avertissements personnalisés via les événements.

---

Elle déclenche un événement d'avertissement personnalisé qui peut être géré par l'écouteur warning.

---

Elle journalise une erreur et quitte le processus immédiatement.

### --feedback--

Pense à comment Node.js gère les avertissements personnalisés via les événements.

---

Elle redémarre le processus Node.js après avoir affiché un avertissement.

### --feedback--

Pense à comment Node.js gère les avertissements personnalisés via les événements.

## --video-solution--

2

## --text--

Comment utilises-tu le module process ?

## --answers--

En l'appelant directement puisqu'il s'agit d'un objet global.

---

En l'activant dans le fichier de configuration de Node.js.

### --feedback--

Pense à pourquoi tu peux accéder à process n'importe où sans configuration.

---

En l'installant manuellement avec npm avant de l'appeler.

### --feedback--

Pense à pourquoi tu peux accéder à process n'importe où sans configuration.

---

En l'important avec require('process') avant chaque utilisation.

### --feedback--

Pense à pourquoi tu peux accéder à process n'importe où sans configuration.

## --video-solution--

1

## --text--

À quoi servent les événements de processus ?

## --answers--

À définir des variables d'environnement pour l'application.

### --feedback--

Pense à comment Node.js réagit aux changements du cycle de vie pendant l'exécution.

---

À créer de nouveaux processus pour l'exécution parallèle.

### --feedback--

Pense à comment Node.js réagit aux changements du cycle de vie pendant l'exécution.

---

À écouter et répondre aux moments importants du cycle de vie comme la sortie, les erreurs ou les signaux système.

---

À gérer les chemins de fichiers et les extensions dans le système.

### --feedback--

Pense à comment Node.js réagit aux changements du cycle de vie pendant l'exécution.

## --video-solution--

3
