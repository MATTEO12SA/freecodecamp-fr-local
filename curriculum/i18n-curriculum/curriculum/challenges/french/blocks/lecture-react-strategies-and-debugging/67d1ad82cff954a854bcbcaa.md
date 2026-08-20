---
id: 67d1ad82cff954a854bcbcaa
title: 'Qu''est-ce que le prop drilling ?'
challengeType: 19
dashedName: what-is-prop-drilling
---

# --description--

Le prop drilling est l'approche la plus basique de la gestion d'état dans les applications React. Elle paraît simple, mais peut vite devenir désordonnée, et est très difficile à faire évoluer.

Voyons ce qu'est le prop drilling, pourquoi c'est un problème, et un bon remplacement quand une application grandit.

Le prop drilling est le processus de passer des props d'un composant parent à des composants enfants profondément imbriqués, même quand certains des composants enfants n'ont pas besoin des props.

Par exemple, disons que tu as trois composants nommés `Parent`, `Child` et `Grandchild`. Si tu veux utiliser des données dans le composant `Grandchild`, mais qu'elles sont dans le composant `Parent`, tu devrais les passer du `Parent` au composant `Child`, puis du `Child` au composant `Grandchild`.

Ou si les données sont encore plus haut dans la chaîne, elles pourraient aussi devoir être passées au composant `Parent`.

Ici, les données que je veux afficher sont la chaîne `Hello, Prop Drilling!`. Elle est assignée à la variable `greeting` dans le composant racine `App` :

```jsx
import "./App.css";
import Parent from "./Parent";

function App() {
  const greeting = "Hello, Prop Drilling!";

  return <Parent greeting={greeting} />;
}

export default App;
```

Tu peux voir que le composant `Parent` reçoit aussi la variable `greeting` comme valeur d'une prop `greeting`. Voici le composant `Parent` qui la passe dans le composant `Child` comme valeur d'une autre prop `greeting` dans le `Child` :

```jsx
import Child from "./Child";

const Parent = ({ greeting }) => {
  return <Child greeting={greeting} />;
};

export default Parent;
```

Et voici le composant `Child` qui la passe au composant `Grandchild` :

```jsx
import Grandchild from "./Grandchild";

const Child = ({ greeting }) => {
  return <Grandchild greeting={greeting} />;
};

export default Child;
```

Et enfin le composant `Grandchild` reçoit le greeting et l'utilise comme contenu d'un élément `h1` :

```jsx
const Grandchild = ({ greeting }) => {
  return <h1>{greeting}</h1>;
};

export default Grandchild;
```

Dans le navigateur, tu verras une page avec un seul élément `h1` qui a le texte `Hello, Prop Drilling!`.

Au début, le prop drilling peut ne pas sembler si grave. Mais à mesure que ton app grandit, il devient plus dur à comprendre, déboguer et maintenir.

Si tu dois passer des props, essaie de les garder toutes dans un seul composant parent. Cette approche de centraliser toutes les données nécessaires s'appelle la « single source of truth ».

Par exemple, disons que tu veux ajouter une nouvelle `response` pour accompagner ton `greeting`, et que tu veux utiliser les deux dans le composant `Grandchild`. Comme `greeting` est déjà dans le composant `App`, il est logique de mettre `response` là aussi, et de les passer tous les deux le long de la chaîne :

```jsx
function App() {
  const greeting = "Hello, Prop Drilling!";
  const response = "I'm not here to play!";

  return <Parent greeting={greeting} response={response} />;
}

const Parent = ({ greeting, response }) => {
  return <Child greeting={greeting} response={response} />;
};

const Child = ({ greeting, response }) => {
  return <Grandchild greeting={greeting} response={response} />;
};

const Grandchild = ({ greeting, response }) => {
  return (
    <>
      <h1>{greeting}</h1>
      <h2>{response}</h2>
    </>
  );
};

export default App;
```

Dans le navigateur, tu verras une page avec un élément `h1` qui a le texte `Hello, Prop Drilling!` et un élément `h2` qui a le texte `I'm not here to play!`.

Pour éviter le prop drilling, surtout dans de grandes applications complexes, envisage d'utiliser l'API Context ou des bibliothèques de gestion d'état comme Redux et Redux Toolkit, Zustand, Recoil, et d'autres.

Tu en apprendras plus dans les prochaines leçons.

# --questions--

## --text--

Comment une prop circulerait-elle d'un parent à un composant petit-enfant ?

## --answers--

En définissant la prop à l'intérieur du composant petit-enfant.

### --feedback--

La prop doit passer par l'enfant avant d'atteindre le petit-enfant.

---

En la passant du parent à l'enfant, puis de l'enfant au petit-enfant.

---

En utilisant le Hook `useEffect` pour récupérer la prop dynamiquement.

### --feedback--

La prop doit passer par l'enfant avant d'atteindre le petit-enfant.

---

En utilisant le Hook `useState` dans le petit-enfant.

### --feedback--

La prop doit passer par l'enfant avant d'atteindre le petit-enfant.

## --video-solution--

2

## --text--

Qu'est-ce que le prop drilling en React ?

## --answers--

Passer des props directement seulement aux composants qui en ont besoin.

### --feedback--

Cela arrive quand des props sont passées à travers plusieurs niveaux inutilement.

---

Utiliser le context pour partager l'état entre composants.

### --feedback--

Cela arrive quand des props sont passées à travers plusieurs niveaux inutilement.

---

Passer des props d'un parent à des composants enfants profondément imbriqués.

---

Forer dans l'état du composant en utilisant des Hooks.

### --feedback--

Cela arrive quand des props sont passées à travers plusieurs niveaux inutilement.

## --video-solution--

3

## --text--

Pourquoi le prop drilling est-il considéré comme un problème dans les plus grandes applications ?

## --answers--

Il facilite la gestion de l'état.

### --feedback--

Trop de props passant par plusieurs composants peuvent rendre le code désordonné.

---

Il améliore les performances en réduisant les re-rendus.

### --feedback--

Trop de props passant par plusieurs composants peuvent rendre le code désordonné.

---

Il rend le code plus dur à lire, déboguer et maintenir.

---

Il élimine le besoin de bibliothèques de gestion d'état.

### --feedback--

Trop de props passant par plusieurs composants peuvent rendre le code désordonné.

## --video-solution--

3
