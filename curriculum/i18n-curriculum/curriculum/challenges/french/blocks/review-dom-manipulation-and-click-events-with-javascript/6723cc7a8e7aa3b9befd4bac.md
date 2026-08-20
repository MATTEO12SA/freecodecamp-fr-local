---
id: 6723cc7a8e7aa3b9befd4bac
title: 'Révision : manipulation du DOM et événements de clic avec JavaScript'
challengeType: 31
dashedName: review-dom-manipulation-and-click-events-with-javascript
---

# --interactive--

## Travailler avec le DOM et les API web

- **API** : Une API (Application Programming Interface) est un ensemble de règles et de protocoles qui permettent aux applications de communiquer entre elles et d'échanger des données efficacement.
- **API web** : Les API web sont conçues spécifiquement pour les applications web. Ces types d'API sont souvent divisés en deux catégories principales : les API navigateur et les API tierces.
- **API navigateur** : Ces API exposent des données du navigateur. En tant que développeur web, tu peux accéder à ces données et les manipuler avec JavaScript.
- **API tierces** : Elles ne sont pas intégrées au navigateur par défaut. Tu dois récupérer leur code d'une manière ou d'une autre. Habituellement, elles ont une documentation détaillée expliquant comment utiliser leurs services. Un exemple est l'API Google Maps, que tu peux utiliser pour afficher des cartes interactives sur ton site.
- **DOM** : Le DOM signifie Document Object Model. C'est une interface de programmation qui te permet d'interagir avec des documents HTML. Avec le DOM, tu peux ajouter, modifier ou supprimer des éléments sur une page. La racine de l'arbre DOM est l'élément `html`. C'est le conteneur de plus haut niveau de tout le contenu d'un document HTML. Tous les autres nœuds sont des descendants de ce nœud racine. Ensuite, sous le nœud racine, on trouve d'autres nœuds dans la hiérarchie. Un nœud parent est un élément qui contient d'autres éléments. Un nœud enfant est un élément contenu dans un autre élément.
- **Interface `navigator`** : Elle fournit des informations sur l'environnement du navigateur, comme la chaîne user-agent, la plateforme et la version du navigateur. Une chaîne user-agent est une chaîne de texte qui identifie le navigateur et le système d'exploitation utilisés.
- **Interface `window`** : Elle représente la fenêtre du navigateur qui contient le document DOM. Elle fournit des méthodes et des propriétés pour interagir avec la fenêtre du navigateur, comme redimensionner la fenêtre, ouvrir de nouvelles fenêtres et naviguer vers différentes URL.

## Travailler avec les méthodes `querySelector()`, `querySelectorAll()` et `getElementById()`

- **Méthode `getElementById()`** : Cette méthode sert à obtenir un objet qui représente l'élément HTML avec l'`id` spécifié. Souviens-toi que les ids doivent être uniques dans chaque document HTML, donc cette méthode ne renverra qu'un seul objet Element.

:::interactive_editor

```html
<div id="container"></div>
<script src="./index.js"></script>
```

```js
const container = document.getElementById("container");
console.log(container)
```

:::

- **Méthode `querySelector()`** : Cette méthode sert à obtenir le premier élément du document HTML qui correspond au sélecteur CSS passé en argument.

:::interactive_editor

```html
<section class="section"></section>
<script src="./index.js"></script>
```

```js
const section = document.querySelector(".section");
console.log(section)
```

:::

- **Méthode `querySelectorAll()`** : Tu peux utiliser cette méthode pour obtenir une liste de tous les éléments DOM qui correspondent à un sélecteur CSS spécifique.

:::interactive_editor

```html
<ul class="ingredients">
  <li>Sugar</li>
  <li>Milk</li>
  <li>Eggs</li>
</ul>
<script src="./index.js"></script>
```

```js
const ingredients = document.querySelectorAll('ul.ingredients li');
console.log(ingredients)
```

:::

## Travailler avec les méthodes `innerText()`, `innerHTML()`, `createElement()` et `textContent()`

- **Propriété `innerHTML`** : C'est une propriété de `Element` utilisée pour définir ou mettre à jour des parties du marquage HTML.

:::interactive_editor

```html
<div id="container">
  <!-- Add new elements here -->
</div>
<script src="./index.js"></script>
```

```js
const container = document.getElementById("container");
container.innerHTML = '<ul><li>Cheese</li><li>Tomato</li></ul>';
```

:::

- **Méthode `createElement`** : Elle sert à créer un élément HTML.

```js
const img = document.createElement("img");
```

- **`innerText`** : Cela représente le contenu texte visible de l'élément HTML et de ses descendants.

:::interactive_editor

```html
<div id="container">
  <p>Hello, World!</p>
  <p>I'm learning JavaScript</p>
</div>
<script src="./index.js"></script>
```

```js
const container = document.getElementById("container");
console.log(container.innerText);
```

:::

- **`textContent`** : Cela renvoie le contenu texte brut d'un élément, y compris tout le texte de ses descendants.

:::interactive_editor

```html
<div id="container">
  <p>Hello, World!</p>
  <p>I'm learning JavaScript</p>
</div>
<script src="./index.js"></script>
```

```js
const container = document.getElementById("container");
console.log(container.textContent);
```

:::

## Travailler avec les méthodes `appendChild()` et `removeChild()`

- **Méthode `appendChild()`** : Cette méthode sert à ajouter un nœud à la fin de la liste des enfants d'un nœud parent spécifié.

:::interactive_editor

```html
<ul id="desserts">
  <li>Cake</li>
  <li>Pie</li>
</ul>
<script src="./index.js"></script>
```

```js
const dessertsList = document.getElementById("desserts");
const listItem = document.createElement("li");

listItem.textContent = "Cookies";
dessertsList.appendChild(listItem);
```

:::

- **Méthode `removeChild()`** : Cette méthode sert à retirer un nœud du DOM.

:::interactive_editor

```html
<section id="example-section">
  <h2>Example sub heading</h2>
  <p>first paragraph</p>
  <p>second paragraph</p>
</section>
<script src="./index.js"></script>
```

```js
const sectionEl = document.getElementById("example-section");
const lastParagraph = document.querySelector("#example-section p:last-of-type");

sectionEl.removeChild(lastParagraph);
```

:::

## Travailler avec la méthode `setAttribute()`

- **Définition** : Cette méthode sert à définir l'attribut d'un élément donné. Si l'attribut existe déjà, la valeur est mise à jour. Sinon, un nouvel attribut est ajouté avec une valeur.

:::interactive_editor

```html
<p id="para">I am a paragraph</p>
<script src="./index.js"></script>
```

```js
const para = document.getElementById("para");
para.setAttribute("class", "my-class");
```

:::

## Objet Event

- **Définition** : L'objet `Event` est une charge utile déclenchée quand un utilisateur interagit d'une manière ou d'une autre avec ta page. Ces interactions peuvent aller du clic sur un bouton ou de la prise de focus d'un champ jusqu'au secouement d'un appareil mobile. Tous les objets `Event` ont la propriété `type`. Cette propriété révèle le type d'événement qui a déclenché la charge utile, comme keydown ou click. Ces valeurs correspondent aux mêmes valeurs que tu pourrais passer à `addEventListener()`, où tu peux capturer et utiliser l'objet `Event`.

## Méthodes `addEventListener()` et `removeEventListener()`

- **Méthode `addEventListener`** : Cette méthode sert à écouter des événements. Elle prend deux arguments : l'événement que tu veux écouter et une fonction qui sera appelée quand l'événement se produit. Parmi les exemples courants : événements click, input et change.

:::interactive_editor

```html
<button id="btn">Click Me</button>
<script src="./index.js"></script>
```

```js
const btn = document.getElementById("btn");

btn.addEventListener("click", () => alert("You clicked the button"));
```

:::

- **Méthode `removeEventListener()`** : Cette méthode sert à retirer un écouteur d'événement précédemment ajouté à un élément avec `addEventListener()`. C'est utile quand tu veux arrêter d'écouter un événement particulier sur un élément.

:::interactive_editor

```html
<body>
  <p id="para">Hover over me to disable the button's click event</p>
  <button id="btn">Toggle Background Color</button>
</body>
<script src="./index.js"></script>
```

```js
const bodyEl = document.querySelector("body");
const para = document.getElementById("para");
const btn = document.getElementById("btn");

let isBgColorGrey = true;

function toggleBgColor() {
  bodyEl.style.backgroundColor = isBgColorGrey ? "blue" : "grey";
  isBgColorGrey = !isBgColorGrey;
}

btn.addEventListener("click", toggleBgColor);

para.addEventListener("mouseover", () => {
  btn.removeEventListener("click", toggleBgColor);
});
```

:::

- **Gestionnaires d'événements en ligne** : Les gestionnaires d'événements en ligne sont des attributs spéciaux sur un élément HTML utilisés pour exécuter du code JavaScript quand un événement se produit. En JavaScript moderne, ils ne sont pas considérés comme une bonne pratique. Il est préférable d'utiliser la méthode `addEventListener` à la place.


:::interactive_editor

```html
<button onclick="alert('Hello World!')">Show alert</button>
```

:::

## L'événement change

- **Définition** : L'événement change est un événement spécial déclenché quand l'utilisateur modifie la valeur de certains éléments de saisie. Par exemple quand une case à cocher ou un bouton radio est coché, ou quand l'utilisateur fait une sélection dans un sélecteur de date ou un menu déroulant.

:::interactive_editor

```html
<label>
  Choose a programming language:
  <select class="language" name="language">
    <option value="">---Select One---</option>
    <option value="JavaScript">JavaScript</option>
    <option value="Python">Python</option>
    <option value="C++">C++</option>
  </select>
</label>

<p class="result"></p>
<script src="./index.js"></script>
```

```js
const selectEl = document.querySelector(".language");
const result = document.querySelector(".result");

selectEl.addEventListener("change", (e) => {
  result.textContent = `You enjoy programming in ${e.target.value}.`;
});
```

:::

## Bubbling d'événements

- **Définition** : Le bubbling (ou propagation) d'événements désigne la façon dont un événement « remonte » vers les objets parents quand il est déclenché.
- **Méthode `stopPropagation()`** : Cette méthode empêche la propagation ultérieure d'un événement.

## Délégation d'événements

- **Définition** : La délégation d'événements est le processus d'écouter des événements qui ont remonté vers un parent, plutôt que de les gérer directement sur l'élément qui les a déclenchés.

## DOMContentLoaded

- **Définition** : L'événement `DOMContentLoaded` est déclenché quand tout le document HTML a été chargé et analysé. S'il y a des feuilles de style externes ou des images, `DOMContentLoaded` n'attendra pas qu'elles soient chargées. Il n'attendra que le HTML.

## Travailler avec `style` et `classList`

- **Propriété `Element.style`** : Cette propriété en lecture seule représente le style en ligne d'un élément. Tu peux l'utiliser pour obtenir ou définir le style d'un élément.

:::interactive_editor

```html
<p id="para">This paragraph will turn red.</p>
<script src="./index.js"></script>
```

```js
const paraEl = document.getElementById("para");
paraEl.style.color = "red";
```

:::

- **Propriété `Element.classList`** : Cette propriété en lecture seule peut servir à ajouter, retirer ou basculer des classes sur un élément.

:::interactive_editor

```html
<link rel="stylesheet" href="./styles.css"/>
<p id="para" class="blue-background">This paragraph will have classes added and removed.</p>
<div id="menu" class="menu">Menu Content</div>
<button id="toggle-btn">Toggle Menu</button>
<script src="./index.js"></script>
```

```css
.highlight {
  background-color: yellow;
}

.blue-background {
  background-color: lightblue;
}

.menu {
  display: none;
  padding: 10px;
  background-color: #f0f0f0;
}

.menu.show {
  display: block;
}
```

```js
// Example adding a class
const paraEl = document.getElementById("para");
paraEl.classList.add("highlight");

// Example removing a class
paraEl.classList.remove("blue-background");

// Example toggling a class
const menu = document.getElementById("menu");
const toggleBtn = document.getElementById("toggle-btn");

toggleBtn.addEventListener("click", () => menu.classList.toggle("show"));
```

:::


## Travailler avec les méthodes `setTimeout()` et `setInterval()`

- **Méthode `setTimeout()`** : Cette méthode te permet de retarder une action pendant un temps donné.

:::interactive_editor

```js
setTimeout(() => {
 console.log('This runs after 3 seconds');
}, 3000);
```

:::

- **Méthode `setInterval()`** : Cette méthode exécute un morceau de code de façon répétée à un intervalle fixe. Comme `setInterval()` continue d'exécuter la fonction fournie à l'intervalle indiqué, tu pourrais vouloir l'arrêter. Pour cela, tu dois utiliser `clearInterval()`.

:::interactive_editor

```js
setInterval(() => {
 console.log('This runs every 2 seconds');
}, 2000);

// Example using clearInterval
const intervalID = setInterval(() => {
 console.log('This will stop after 5 seconds');
}, 1000);

setTimeout(() => {
 clearInterval(intervalID);
}, 5000);
```

:::

## La méthode `requestAnimationFrame()`

- **Définition** : Cette méthode te permet de planifier la prochaine étape de ton animation avant le prochain rafraîchissement de l'écran, pour une expérience fluide et agréable. Le prochain rafraîchissement de l'écran désigne le moment où le navigateur actualise l'affichage visuel de la page. Cela se produit plusieurs fois par seconde, généralement autour de 60 fois (ou 60 images par seconde) sur la plupart des écrans.

```js
function animate() {
 // Update the animation...
 // for example, move an element, change a style, and more.
 update();
 // Request the next frame
 requestAnimationFrame(animate);
}
```

## Web Animations API

- **Définition** : La Web Animations API te permet de créer et de contrôler des animations directement en JavaScript.

:::interactive_editor

```html
<link rel="stylesheet" href="./styles.css"/>
<div id="square"></div>
<script src="./index.js"></script>
```

```css
#square {
  width: 100px;
  height: 100px;
  background: red;
}

```

```js
const square = document.querySelector('#square');

const animation = square.animate(
 [{ transform: 'translateX(0px)' }, { transform: 'translateX(100px)' }],
 {
   duration: 2000, // makes animation lasts 2 seconds
   iterations: Infinity, // loops indefinitely
   direction: 'alternate', // moves back and forth
   easing: 'ease-in-out', // smooth easing
 }
);
```

:::

## L'API Canvas

- **Définition** : L'API Canvas est un outil puissant qui te permet de manipuler des graphiques directement dans ton fichier JavaScript. Pour travailler avec l'API Canvas, tu dois d'abord fournir un élément `canvas` en HTML. Cet élément sert de surface de dessin que tu peux manipuler avec les méthodes et propriétés d'instance des interfaces de l'API Canvas. Cette API a des interfaces comme `HTMLCanvasElement`, `CanvasRenderingContext2D`, `CanvasGradient`, `CanvasPattern` et `TextMetrics` qui contiennent des méthodes et propriétés pour créer des graphiques dans ton JavaScript.

:::interactive_editor

```html
<canvas id="my-canvas" width="400" height="400"></canvas>
<script src="./index.js"></script>
```

```js
const canvas = document.getElementById('my-canvas');

// Access the drawing context of the canvas.
// "2d" allows you to draw in two dimensions
const ctx = canvas.getContext('2d');

// Set the background color
ctx.fillStyle = 'crimson';

// Draw a rectangle
ctx.fillRect(1, 1, 150, 100);
```

:::

## Ouvrir et fermer des dialogs et des modales avec JavaScript

- **Définitions modal et dialog** : Les dialogs te permettent d'afficher des informations ou des actions importantes aux utilisateurs. Avec l'élément HTML intégré dialog, tu peux facilement créer ces dialogs (modaux et non modaux) dans tes applications web. Un dialog modal force l'utilisateur à interagir avec lui avant de pouvoir accéder au reste de l'application ou de la page. À l'inverse, un dialog non modal permet à l'utilisateur de continuer à interagir avec d'autres parties de la page même quand le dialog est ouvert. Il n'empêche pas l'accès au reste du contenu.
- **Méthode `showModal()`** : Cette méthode sert à ouvrir une modale.

:::interactive_editor

```html
<dialog id="my-modal">
   <p>This is a modal dialog.</p>
</dialog>
<button id="open-modal">Open Modal Dialog</button>
<script src="./index.js"></script>
```

```js
const dialog = document.getElementById('my-modal');
const openButton = document.getElementById('open-modal');

openButton.addEventListener('click', () => {
  dialog.showModal();
});
```

:::

- **Méthode `close()`** : Cette méthode sert à fermer la modale.

:::interactive_editor

```html
<dialog id="my-modal">
   <p>This is a modal dialog.</p>
   <button id="close-modal">Close Modal</button>
</dialog>
<button id="open-modal">Open Modal Dialog</button>
<script src="./index.js"></script>
```

```js
const dialog = document.getElementById('my-modal');
const openButton = document.getElementById('open-modal');
const closeButton = document.getElementById('close-modal');

openButton.addEventListener('click', () => {
  dialog.show();
});

closeButton.addEventListener('click', () => {
  dialog.close();
});
```

:::

# --assignment--

Révise les sujets et concepts de manipulation du DOM et d'événements de clic avec JavaScript.
