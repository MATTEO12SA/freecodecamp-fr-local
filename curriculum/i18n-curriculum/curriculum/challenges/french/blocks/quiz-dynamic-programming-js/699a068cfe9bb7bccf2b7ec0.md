---
id: 699a068cfe9bb7bccf2b7ec0
title: Quiz sur la programmation dynamique
challengeType: 8
dashedName: quiz-dynamic-programming-js
---

# --description--

Pour réussir le quiz, tu dois répondre correctement à au moins 9 des 10 questions ci-dessous.

# --quizzes--

## --quiz--

### --question--

#### --text--

Quelles sont les deux propriétés essentielles qui doivent être présentes dans un problème pour que la programmation dynamique soit une approche de solution efficace ?

#### --distractors--

Un temps d'exécution rapide et une utilisation minimale de la mémoire

---

Une capacité de récursion et des boucles itératives

---

Un traitement séquentiel et un calcul parallèle

#### --answer--

Des sous-problèmes qui se chevauchent et une sous-structure optimale

### --question--

#### --text--

Quelle est la principale différence entre les approches de mémoïsation et de tabulation en programmation dynamique ?

#### --distractors--

La mémoïsation utilise des tables de hachage tandis que la tabulation utilise des tableaux, ce qui la rend plus efficace.

---

La mémoïsation est plus rapide mais utilise plus de mémoire et de cycles CPU que la tabulation.

---

La mémoïsation ne peut résoudre que des problèmes plus simples que la tabulation.

#### --answer--

La mémoïsation est une approche top-down utilisant la récursion, tandis que la tabulation est une approche bottom-up utilisant l'itération.

### --question--

#### --text--

Pourquoi les solutions récursives naïves aux problèmes de programmation dynamique ont-elles généralement une complexité temporelle exponentielle ?

#### --distractors--

Parce qu'elles utilisent des quantités exponentielles de mémoire pour stocker des variables.

---

Parce qu'elles nécessitent de trier les données en temps exponentiel.

---

Parce qu'elles doivent vérifier toutes les permutations possibles de l'entrée.

#### --answer--

Parce que chaque appel récursif se ramifie plusieurs fois, ce qui fait que les mêmes sous-problèmes sont recalculés de façon répétée.

### --question--

#### --text--

Que signifie la sous-structure optimale dans le contexte de la programmation dynamique ?

#### --distractors--

L'algorithme doit utiliser la structure de données la plus efficace disponible.

---

La solution doit minimiser simultanément la complexité temporelle et spatiale.

---

Le problème doit avoir une unique solution optimale.

#### --answer--

La solution optimale peut être construite à partir des solutions optimales de ses sous-problèmes.

### --question--

#### --text--

Lors de l'implémentation de la mémoïsation, que se passe-t-il lorsqu'une fonction est appelée avec des arguments déjà calculés ?

#### --distractors--

La fonction recalcule le résultat pour garantir l'exactitude.

---

La fonction fait la moyenne des anciens et nouveaux résultats pour une meilleure précision.

---

Une erreur est levée car les calculs en double ne sont pas autorisés.

#### --answer--

Le résultat mis en cache est renvoyé immédiatement sans recalcul.

### --question--

#### --text--

Quel est un avantage clé d'utiliser la tabulation plutôt que la mémoïsation ?

#### --distractors--

La tabulation nécessite toujours moins de mémoire que la mémoïsation.

---

La tabulation peut résoudre une classe plus large de problèmes.

---

La tabulation est toujours plus facile à implémenter et à comprendre.

#### --answer--

La tabulation évite le surcoût de la récursion et fournit une exécution séquentielle prévisible.

### --question--

#### --text--

Dans une solution de programmation dynamique bottom-up, pourquoi les cas de base sont-ils initialisés en premier ?

#### --distractors--

Pour allouer efficacement la mémoire pour la structure de données.

---

Pour empêcher les boucles infinies dans l'algorithme.

---

Pour améliorer la complexité temporelle de l'algorithme.

#### --answer--

Pour fournir des valeurs fondamentales sur lesquelles tous les sous-problèmes plus grands sont construits.

### --question--

#### --text--

Comment la programmation dynamique transforme-t-elle la complexité temporelle des problèmes qui présentent des sous-problèmes qui se chevauchent ?

#### --distractors--

De polynomiale à logarithmique en divisant le problème efficacement.

---

De quadratique à linéaire en optimisant les structures de boucles.

---

De linéaire à constante en utilisant des tables de hachage.

#### --answer--

D'exponentielle à polynomiale en stockant et réutilisant les solutions des sous-problèmes.

### --question--

#### --text--

Quel compromis la programmation dynamique fait-elle généralement pour obtenir une meilleure complexité temporelle ?

#### --distractors--

Elle sacrifie la lisibilité du code pour une exécution plus rapide.

---

Elle nécessite des algorithmes plus complexes plus difficiles à maintenir.

---

Elle limite la taille des problèmes qui peuvent être résolus.

#### --answer--

Elle utilise de l'espace supplémentaire pour stocker les résultats intermédiaires.

### --question--

#### --text--

Dans quel scénario la programmation dynamique NE serait-elle PAS l'approche algorithmique appropriée ?

#### --distractors--

Lorsque le problème nécessite de trouver une solution optimale.

---

Lorsque le problème peut être décomposé en sous-problèmes plus petits.

---

Lorsque la complexité spatiale doit être minimisée.

#### --answer--

Lorsque les sous-problèmes sont indépendants et ne se chevauchent pas.
