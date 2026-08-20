---
id: 695cc8f280fef0cc3bed02cc
title: 'Qu''est-ce que le module Stream et comment fonctionne-t-il ?'
challengeType: 19
dashedName: what-is-the-stream-module-and-how-does-it-work
---

# --description--

Le dernier module de base Node.js que nous allons examiner est `stream`. Ce module t'aide à gérer les données efficacement, surtout quand elles sont trop volumineuses pour être chargées d'un coup, comme lire un gros fichier texte ou télécharger une grande vidéo.

Au lieu d'attendre de lire ou d'écrire toutes les données avant de faire quoi que ce soit, les streams traitent des morceaux de données à mesure qu'ils arrivent, un peu comme tu peux commencer à regarder une vidéo YouTube avant que toute la vidéo ait fini de charger.

Il y a quatre types principaux de streams dans Node.js : readable, writable, duplex et transform :

- Les streams Readable te permettent de lire des données par morceaux (par exemple, lire un gros fichier).
- Les streams Writable te permettent d'écrire des données par morceaux (par exemple, enregistrer un fichier).
- Les streams Duplex peuvent à la fois lire et écrire des données.
- Les streams Transform sont un type spécial de stream duplex qui peuvent modifier ou traiter les données pendant qu'elles circulent.

Tu peux importer les classes de stream dont tu as besoin en les déstructurant depuis le module stream :

```js
const { Readable, Writable, Transform } = require("stream");
```

La plupart du temps, tu n'as pas besoin de créer toi-même des classes de stream personnalisées. Pour les opérations fichiers du quotidien, des méthodes intégrées comme `fs.createReadStream()` et `fs.createWriteStream()` suffisent généralement.

Ces deux méthodes prennent le chemin du fichier à lire ou écrire. Cela signifie que tu as aussi besoin des modules `fs` et `path` pour implémenter le streaming dans bien des cas.

Voici comment lire des données depuis un fichier, disons un fichier `input.txt` :

```js
const fs = require("fs");
const path = require("path");

const inputFilePath = path.join(__dirname, "input.txt");

// Readable stream
const readInputFileStream = fs.createReadStream(inputFilePath);
console.log(readInputFileStream);
```

Cela ne fera encore rien, car tu dois utiliser les événements du stream pour lire les données. Par exemple, tu peux écouter l'événement `data` ainsi :

```js
readInputFileStream.on("data", (chunk) => {
  console.log(`Received ${chunk.length} bytes of data`);
}); // Received 622 bytes of data
```

Tu peux aussi journaliser le morceau de données dans la console :

```js
readInputFileStream.on("data", (chunk) => {
  console.log(`Received ${chunk.length} bytes of data`);
  console.log("Received data:", chunk);
});

/*
Received 622 bytes of data
Received data: <Buffer 4c 6f 72 65 6d 20 69 70 73 75 6d
20 64 6f 6c 6f 72 20 73 69 74 20 61 6d 65 74 20 63 6f 6e
73 65 63 74 65 74 75 72 20 61 64 69 70 69 73 69 63 69 6e 67 ... 572 more bytes>
*/
```

Comme il renvoie un buffer, tu peux appeler la méthode `toString()` pour le convertir en texte lisible :

```js
const fs = require("fs");
const path = require("path");

const inputFilePath = path.join(__dirname, "input.txt");

// Readable stream
const readInputFileStream = fs.createReadStream(inputFilePath);

readInputFileStream.on("data", (chunk) => {
  console.log(`Received ${chunk.length} bytes of data`);
  console.log("Received data:", chunk.toString());
});
/*
Received 622 bytes of data
Received data: Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus sint facilis
aliquid. Odio voluptatibus veniam saepe consectetur alias modi non fuga in,
tempore explicabo numquam maiores quod inventore quibusdam! Nam cumque repellat
facere voluptatem nulla aliquam atque ratione numquam ea aperiam porro ducimus
animi tempora laboriosam, labore quae voluptatum? Nam, hic quas dolore
repudiandae placeat eius! Voluptate reiciendis totam hic expedita tenetur. Nisi
ipsa ad facere optio sint debitis. Magni nostrum sit ipsa saepe suscipit facilis
eaque doloribus assumenda, minima fuga tempore, porro, debitis rem harum in
*/
```

Pour implémenter un stream writable, en particulier quand tu lis depuis un fichier et écris vers un autre, tu dois d'abord créer le read stream, puis le write stream :

```js
const fs = require("fs");
const path = require("path");

const inputFilePath = path.join(__dirname, "input.txt");
const outputFilePath = path.join(__dirname, "output.txt");

// Create the read stream first
const readInputFileStream = fs.createReadStream(inputFilePath);

// Create the write stream
const writeOutputFileStream = fs.createWriteStream(outputFilePath);
```

Ensuite, utilise la méthode `.pipe()` pour connecter le stream readable au stream writable. Cela permet à Node.js de lire automatiquement les données depuis la source et de les écrire vers la destination, morceau par morceau :

```js
const fs = require("fs");
const path = require("path");

const inputFilePath = path.join(__dirname, "input.txt");
const outputFilePath = path.join(__dirname, "output.txt");

// Create the read stream first
const readInputFileStream = fs.createReadStream(inputFilePath);

// Create the write stream
const writeOutputFileStream = fs.createWriteStream(outputFilePath);

// Pipe the read stream to the write stream
readInputFileStream.pipe(writeOutputFileStream);
```

Tu peux ensuite écouter les événements `finish` et `error` sur le stream writable pour savoir quand le streaming est terminé ou si quelque chose tourne mal :

```js
const fs = require("fs");
const path = require("path");

const inputFilePath = path.join(__dirname, "input.txt");
const outputFilePath = path.join(__dirname, "output.txt");

// Create the read stream first
const readInputFileStream = fs.createReadStream(inputFilePath);

// Create the write stream
const writeOutputFileStream = fs.createWriteStream(outputFilePath);

readInputFileStream.pipe(writeOutputFileStream);

writeOutputFileStream.on("finish", () => {
  console.log("All data has been written to the file");
});

writeOutputFileStream.on("error", (err) => {
  console.error("Error writing to file:", err);
});
```

L'événement `finish` t'indique que le stream est terminé et qu'il n'y a plus de données à écrire, tandis que l'événement error t'aide à capturer les problèmes qui peuvent survenir pendant l'écriture, comme des problèmes de permissions ou des répertoires manquants.

# --questions--

## --text--

Lesquels de ceux-ci sont les quatre types principaux de streams ?

## --answers--

Streams Request, Response, Event et Error.

### --feedback--

Pense à comment Node.js gère la lecture, l'écriture et la transformation des données.

---

Streams Readable, Editable, Duplex et Transform.

### --feedback--

Pense à comment Node.js gère la lecture, l'écriture et la transformation des données.

---

Streams Data, File, HTTP et Buffer.

### --feedback--

Pense à comment Node.js gère la lecture, l'écriture et la transformation des données.

---

Streams Readable, Writable, Duplex et Transform.

## --video-solution--

4

## --text--

Qu'est-ce qui te permet d'implémenter un stream readable et writable personnalisé ?

## --answers--

Le module `stream` en utilisant les classes Readable et Writable.

---

Le module `http`.

### --feedback--

Pense au module qui fournit les classes de base pour créer des streams personnalisés.

---

Le module `fs` en utilisant `createReadStream()` et `createWriteStream()`.

### --feedback--

Pense à comment Node.js gère la lecture, l'écriture et la transformation des données.

---

Le module events.

### --feedback--

Pense à comment Node.js gère la lecture, l'écriture et la transformation des données.

## --video-solution--

1

## --text--

Quels événements peux-tu utiliser sur un stream writable pour savoir quand le streaming se termine ou qu'une erreur survient ?

## --answers--

`end` et `close`.

### --feedback--

Pense aux événements du stream writable qui signalent la fin et l'échec.

---

`finish` et `error`.

---

`start` et `stop`.

### --feedback--

Pense aux événements du stream writable qui signalent la fin et l'échec.

---

`done` et `fail`.

### --feedback--

Pense aux événements du stream writable qui signalent la fin et l'échec.

## --video-solution--

2
