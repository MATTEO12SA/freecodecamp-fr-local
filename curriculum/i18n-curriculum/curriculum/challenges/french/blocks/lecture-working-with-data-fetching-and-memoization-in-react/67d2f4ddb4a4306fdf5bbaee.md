---
id: 67d2f4ddb4a4306fdf5bbaee
title: 'Qu''est-ce que la mémoïsation, et comment fonctionne le Hook useMemo ?'
challengeType: 19
dashedName: what-is-memoization-and-how-does-the-usememo-hook-work
---

# --description--

À mesure que ton app React grossit, des re-rendus inutiles et des calculs coûteux peuvent ralentir les performances, causant des mises à jour UI lentes et une consommation de ressources accrue.

Cela peut être surtout problématique dans des apps avec une gestion d'état complexe, de grandes listes, des fonctions à calculs lourds, et de nombreux composants avec un seul parent.

D'où le besoin d'optimiser ton app React pour de meilleures performances en minimisant les calculs redondants et en assurant des interactions plus fluides.

React résout ce problème avec un processus appelé mémoïsation, une technique qui met en cache valeurs et fonctions pour éviter des recalculs inutiles, afin que ton app soit plus rapide et plus réactive.

Par définition, la mémoïsation est une technique d'optimisation où le résultat d'appels de fonctions coûteux est mis en cache (mémorisé) selon des arguments précis. Quand les mêmes arguments sont fournis à nouveau, le résultat en cache est renvoyé au lieu de recalculer la fonction.

Le processus de mémoïsation se déroule ainsi :

- Stocker les résultats des appels de fonction avec leurs arguments d'entrée.

- Avant d'exécuter la fonction, vérifier si le résultat pour les arguments actuels existe déjà dans le cache.

- S'il existe, renvoyer le résultat en cache au lieu de relancer le calcul.

- S'il n'existe pas, calculer le résultat, le stocker dans le cache, puis le renvoyer.

Pour améliorer l'expérience développeur avec la mémoïsation, React fournit trois outils – `React.memo` (ou `memo`), `useMemo` et `useCallback`.

Comme tu peux le deviner, `useMemo` et `useCallback` sont des Hooks, mais `React.memo` est un wrapper de composant, un higher-order component (HOC).

Dans la prochaine leçon, nous verrons comment le Hook `useCallback` et `React.memo` fonctionnent.

`useMemo` te permet de mémoïser des valeurs calculées tandis que `useCallback` fait de même pour les références de fonctions.

Si tu te demandes ce que sont les valeurs calculées et les références de fonctions : les valeurs calculées désignent le résultat d'exécution d'une fonction, tandis que les références de fonctions sont les pointeurs vers les fonctions – l'objet fonction en mémoire.

Voyons d'abord comment utiliser le Hook `useMemo`. Voici la syntaxe de base du Hook `useMemo` :

```js
const memoizedValue = useMemo(
  function () {
    return computeExpensiveValue(a, b);
  },
  [a, b]
);
```

Tu vois que tout ce qu'il faut, c'est envelopper le Hook `useMemo` autour de la fonction.

Ce composant `ExpensiveSquare` recevra une prop `num` qu'il utilisera pour calculer le carré :

```jsx
function ExpensiveSquare({ num }) {
  function calculateSquare(n) {
    console.log("Calculating square...");
    return n * n;
  }

  const squared = calculateSquare(num);
  return (
    <p>
      Square of {num}: {squared}
    </p>
  );
}
export default ExpensiveSquare;
```

Voici le composant `App` où `ExpensiveSquare` est utilisé :

```jsx
import { useState, useEffect } from "react";
import ExpensiveSquare from "./components/ExpensiveSquare";

function App() {
 const [timer, setTimer] = useState(0);
 const [num, setNum] = useState(0);

 useEffect(() => {
   const interval = setInterval(() => setTimer((c) => c + 1), 1000);
   return () => clearInterval(interval);
 }, []);

 return (
   <div>
     <h1>Timer: {timer} seconds gone</h1>
     <ExpensiveSquare num={num} />
     <button onClick={() => setNum((n) => n + 1)}>Increase Number</button>
   </div>
 );
}

export default App;
```

Le `timer` dans le `useEffect`, qui tourne chaque seconde, fera exécuter la fonction `calculateSquare` à chaque fois qu'il tourne, même quand tu n'augmentes pas la variable d'état `num`.

Pour résoudre ce problème, on peut utiliser le Hook `useMemo` en enveloppant l'appel de fonction dedans et en spécifiant la variable `num` comme dépendance :

```jsx
// import the useMemo hook
import { useMemo } from "react";

function ExpensiveSquare({ num }) {
  function calculateSquare(n) {
    console.log("Calculating square...");
    return n * n;
  }

  // const squared = calculateSquare(num);
  // Wrap the function call in useMemo instead
  const squared = useMemo(() => calculateSquare(num), [num]);

  return (
    <p>
      Square of {num}: {squared}
    </p>
  );
}

export default ExpensiveSquare;
```

Cela garantit que la fonction est mémoïsée en mettant le résultat en cache, donc le calcul n'a lieu que quand la variable `num` change, pas quand n'importe quoi change dans le composant où elle est utilisée.

L'appel à `calculateSquare` ne s'exécute plus à chaque changement de `timer`, mais au rendu initial et quand `num` change.

# --questions--

## --text--

Qu'est-ce que la mémoïsation en React ?

## --answers--

Une technique qui met en cache valeurs et fonctions pour éviter des recalculs inutiles.

---

Une technique qui te laisse gérer les mises à jour d'état du composant pour éviter des recalculs inutiles.

### --feedback--

Elle aide à optimiser les performances en stockant des résultats déjà calculés.

---

Un processus de réconciliation du Virtual DOM avec le DOM réel.

### --feedback--

Elle aide à optimiser les performances en stockant des résultats déjà calculés.

---

Une façon de gérer les effets de bord dans les composants fonctionnels.

### --feedback--

Elle aide à optimiser les performances en stockant des résultats déjà calculés.

## --video-solution--

1

## --text--

Quelle est la différence entre valeurs calculées et références de fonctions ?

## --answers--

Les valeurs calculées sont des objets fonction, tandis que les références de fonctions sont des résultats d'exécution.

### --feedback--

L'une est la sortie d'une fonction, tandis que l'autre n'est qu'un pointeur vers elle.

---

Les valeurs calculées sont le résultat d'exécution d'une fonction, tandis que les références de fonctions sont les objets fonction en mémoire.

---

Les valeurs calculées et les références de fonctions sont la même chose.

### --feedback--

L'une est la sortie d'une fonction, tandis que l'autre n'est qu'un pointeur vers elle.

---

Les références de fonctions stockent des valeurs calculées.

### --feedback--

L'une est la sortie d'une fonction, tandis que l'autre n'est qu'un pointeur vers elle.

## --video-solution--

2

## --text--

Lequel de ces éléments N'EST PAS un des outils que React fournit pour la mémoïsation ?

## --answers--

`React.memo`

### --feedback--

Les outils de mémoïsation se concentrent sur la mise en cache de valeurs et de fonctions, tandis que cette option gère les effets de bord.

---

`useMemo`

### --feedback--

Les outils de mémoïsation se concentrent sur la mise en cache de valeurs et de fonctions, tandis que cette option gère les effets de bord.

---

`useCallback`

### --feedback--

Les outils de mémoïsation se concentrent sur la mise en cache de valeurs et de fonctions, tandis que cette option gère les effets de bord.

---

`useEffect`

## --video-solution--

4
