---
id: 6999ad1cdc249e185aaeedbd
title: Étape 8
challengeType: 1
dashedName: step-8
---

# --description--

Dans cette étape, tu vas créer une fonction qui ajoute une nouvelle propriété à un objet.

Voici un exemple d'ajout d'une propriété à l'intérieur d'une fonction :

```js
const cat = {
  species: "Cat"
};

const addColor = (pet, color) => {
  pet.color = color; // add new property using dot notation
  return pet; // return the updated object
}

console.log(addColor(cat, "White"));
// {
//   species: 'Cat',
//   color: 'White'
// }
```

Dans cet exemple, la propriété `color` est ajoutée à l'objet `cat`.

Maintenant, crée une fonction appelée `addHabitat`. La fonction doit prendre deux paramètres : `animal` et `habitat`.

À l'intérieur de la fonction, ajoute une nouvelle propriété appelée `habitat` à l'objet `animal`. Définis sa valeur égale au paramètre `habitat`.

Retourne l'objet `animal` mis à jour.

Après avoir créé la fonction, utilise `console.log` pour appeler `addHabitat(tiger, "Rainforest")` afin de voir l'objet `tiger` mis à jour dans la console.

# --hints--

Tu dois créer une fonction nommée `addHabitat`.

```js
assert.isFunction(addHabitat);
```

La fonction `addHabitat` doit avoir deux paramètres : `animal` et `habitat`.

```js
const regex = __helpers.functionRegex('addHabitat', ['animal', 'habitat']);
assert.match(__helpers.removeJSComments(code), regex);
```

`addHabitat` doit utiliser la notation par point pour ajouter la propriété `habitat`.

```js
assert.match(code, /animal\.habitat\s*=\s*habitat/);
```

La fonction `addHabitat` doit retourner l'objet `animal` mis à jour.

```js
const testAnimal = { species: "Cat" };
const result = addHabitat(testAnimal, "Forest");
assert.strictEqual(result, testAnimal);
```

Tu dois afficher `addHabitat(tiger, "Rainforest")` dans la console.

```js
assert.match(
  code,
  /console\s*\.\s*log\s*\(\s*addHabitat\s*\(\s*tiger\s*,\s*["']Rainforest["']\s*\)\s*\)/
);
```

Appeler `addHabitat(tiger, "Rainforest")` doit ajouter une propriété habitat à tiger.

```js
const updatedTiger = addHabitat(tiger, "Rainforest");

assert.deepEqual(updatedTiger, {
  species: "Tiger",
  age: 5,
  isEndangered: true,
  habitat: "Rainforest"
});
```

`addHabitat` doit utiliser les paramètres de la fonction et fonctionner avec n'importe quel objet.

```js
const lion = { species: "Lion" };
const updatedLion = addHabitat(lion, "Savanna");

assert.strictEqual(updatedLion.habitat, "Savanna");
```

# --seed--

## --seed-contents--

```js
const tiger = {
  species: "Tiger",
  age: 5,
  isEndangered: true
};

const elephant = {
  species: "Elephant",
  age: 10,
  isEndangered: true
};

const getSpecies = (animal) => {
  return animal.species;
};

console.log(getSpecies(tiger));

const getAge = (animal) => {
  return animal.age;
};

console.log(getAge(tiger));

--fcc-editable-region--

--fcc-editable-region--
```
