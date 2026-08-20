---
id: 67e2a513dbffdc8dcf1700af
title: 'Qu''est-ce que le Hook useOptimistic, et comment fonctionne-t-il ?'
challengeType: 19
dashedName: what-is-the-useoptimistic-hook-and-how-does-it-work
---

# --description--

Les versions récentes de React ont introduit les server components et les server actions pour déplacer une partie du rendu et de la logique vers le serveur.

Avec ces mises à jour, React a ajouté un nouveau Hook appelé `useOptimistic` pour garder les UI réactives en attendant qu'une action asynchrone se termine en arrière-plan.

Bien que ce soit souvent utilisé pour récupérer des données depuis un serveur, ce n'est pas limité à ça. Le Hook est utile en général pour gérer des opérations asynchrones, en assurant que l'UI reste fluide et interactive pendant l'action.

Voyons ce qu'est le Hook `useOptimistic` et comment il contribue à des UI snappy et réactives.

Le Hook `useOptimistic` aide à gérer les « mises à jour optimistes » dans l'UI, une stratégie où tu fournis des mises à jour immédiates à l'UI selon le résultat attendu d'une action, comme attendre une réponse serveur.

Voici la syntaxe de base du Hook `useOptimistic` :

```js
const [optimisticState, addOptimistic] = useOptimistic(actualState, updateFunction);
```

- `optimisticState` est l'état temporaire qui se met à jour tout de suite pour une meilleure expérience utilisateur.

- `addOptimistic` est la fonction qui applique la mise à jour optimiste avant que l'état réel ne change.

- `actualState` est la vraie valeur d'état qui vient du résultat d'une action, comme récupérer des données depuis un serveur.

- `updateFunction` est la fonction qui détermine comment l'état optimiste doit se mettre à jour quand elle est appelée.

À première vue, on pourrait croire que le Hook `useOptimistic` n'est qu'une autre façon de gérer les états de chargement en React. Mais c'est plus que ça.

Un état de chargement contrôle si tu vois un spinner, un message, ou un autre indicateur dans l'UI pendant qu'un truc se passe en arrière-plan.

Cependant, le Hook `useOptimistic` met à jour l'UI instantanément selon un résultat attendu, même avant que tu fasses, par exemple, un appel à une API. Ce Hook te donne une chance d'afficher un indicateur ou un message de chargement, de gérer les erreurs potentielles avec élégance, et de montrer un retour instantané pour que l'UI paraisse snappy.

Cela deviendra plus clair en passant par des exemples qui montrent comment le Hook `useOptimistic` fonctionne.

Voici une action qui simule la sauvegarde d'une tâche sur un serveur. Elle renvoie la tâche après un délai d'1 seconde, comme cela pourrait arriver avec une vraie requête API :

```js
export async function saveTask(task) {
  await new Promise((res) => setTimeout(res, 1000));

  return task;
}
```

Voici le code qui configure le Hook `useOptimistic` en l'important et l'initialisant, avec une fonction `handleSubmit` qui envoie une saisie à l'action :

```jsx
"use client";

import { useOptimistic } from "react";

export default function TaskList({ tasks, addTask }) {
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state, newTask) => [...state, { text: newTask, pending: true }]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    addOptimisticTask(formData.get("task"));

    addTask(formData);
    e.target.reset();
  }

  return <>{/* UI */}</>;
}
```

Dans le code, le Hook `useOptimistic` garde une liste temporaire de tâches qui se met à jour immédiatement quand tu ajoutes une nouvelle tâche.

La ligne `(state, newTask) => [...state, { text: newTask, pending: true }]` assure qu'une nouvelle tâche apparaît avec un statut pending même avant que le serveur confirme que quelque chose vient du formulaire.

Quand le formulaire est soumis, la fonction `handleSubmit` extrait la tâche et l'ajoute « de façon optimiste » avec le paramètre `addOptimisticTask`. Ensuite `addTask` est passé en prop et envoie la tâche au serveur. Enfin, le formulaire est réinitialisé en appelant `e.target.reset()`.

Voici le composant `TaskList` :

```jsx
"use client";
import { useOptimistic, startTransition } from "react";

export default function TaskList({ tasks, addTask }) {
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state, newTask) => [...state, { text: newTask, pending: true }]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    startTransition(() => {
      addOptimisticTask(formData.get("task"));
    });

    addTask(formData);
    e.target.reset();
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h3 className="text-xl font-medium mb-3">Tasks</h3>

      <ul className="space-y-2 mb-4">
        {optimisticTasks.map((task, index) => (
          <li key={index} className="p-2 border-b">
            {task.text}
            {task.pending && (
              <small className="ml-2 text-gray-500 text-sm">
                Adding Task...
              </small>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          name="task"
          placeholder="Type in a task..."
          className="flex-1 p-2 border"
        />
        <button type="submit" className="bg-gray-200 px-3 py-2 cursor-pointer">
          Submit
        </button>
      </form>
    </div>
  );
}
```

Ici, on parcourt le paramètre `optimisticTask` pour afficher la tâche. Quand `task.pending` est `true`, le texte `Adding Task...` s'affiche à côté de la tâche, confirmant qu'elle a été ajoutée de façon optimiste avant la confirmation du serveur.

Voici le composant `Task` qui gère l'état du formulaire. Il appelle la fonction `saveTask` de l'action pour pouvoir ajouter la tâche, et ajoute la nouvelle tâche une fois reçue par le serveur :

```jsx
"use client";

import { useState } from "react";
import TaskList from "./TaskList";
import { saveTask } from "./actions";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  async function addTask(formData) {
    const newTaskText = formData.get("task");

    const savedTask = await saveTask(newTaskText);
    setTasks((prev) => [...prev, { text: savedTask, pending: false }]);
  }

  return <TaskList tasks={tasks} addTask={addTask} />;
}
```

Cela assure des mises à jour UI snappy en montrant un retour instantané au lieu d'attendre une réponse. Une fois la tâche sauvegardée, la propriété `pending` est retirée, et la liste finale des tâches se met à jour en conséquence.

Dans l'UI, deux choses se passent qui ne devraient pas. D'abord, tu ne peux pas voir le texte `Adding Task...` car il apparaît et disparaît trop vite. Ensuite, une erreur survient après l'ajout de la tâche.

Il y a deux choses à faire pour corriger ces problèmes.

D'abord, on doit importer `startTransition` depuis React et l'utiliser pour envelopper la ligne `addOptimisticTask(formData.get('task'))` :

```js
startTransition(() => {
  addOptimisticTask(formData.get("task"));
});
```

Ensuite, on doit rendre le texte `Adding Task...` visible un moment avant qu'il disparaisse.

Pour cela, on peut modifier la fonction `addTask` avec un état pending et simuler un délai de quelques secondes avant de marquer la tâche comme terminée. `setTimeout()` est idéal pour ça :

```js
async function addTask(formData) {
  const newTaskText = formData.get("task");

  // Add an optimistic task with a pending state
  const tempTask = { id: Date.now(), text: newTaskText, pending: true };
  setTasks((prev) => [...prev, tempTask]);

  // Simulate a 3 seconds delay before marking the task as completed
  setTimeout(async () => {
    const savedTask = await saveTask(newTaskText);

    setTasks((prev) =>
      prev.map((task) =>
        task.id === tempTask.id
          ? { ...task, text: savedTask, pending: false }
          : task
      )
    );
  }, 3000);
}
```

Et une fois que tu fais ça, tout fonctionne bien.

# --questions--

## --text--

Quel est le but du Hook `useOptimistic` ?

## --answers--

Il permet aux composants de récupérer des données du serveur avant de rendre l'UI.

### --feedback--

Ce Hook assure que l'UI reflète les changements attendus avant qu'une opération asynchrone se termine.

---

Il aide à gérer les mises à jour optimistes en mettant à jour l'UI immédiatement en attendant une opération asynchrone, comme une réponse serveur.

---

Il active la gestion automatique des erreurs et le rollback pour les requêtes API échouées dans les apps React.

### --feedback--

Ce Hook assure que l'UI reflète les changements attendus avant qu'une opération asynchrone se termine.

---

Il optimise les mises à jour d'état en les regroupant pour améliorer les performances.

### --feedback--

Ce Hook assure que l'UI reflète les changements attendus avant qu'une opération asynchrone se termine.

## --video-solution--

2

## --text--

En quoi le Hook `useOptimistic` diffère-t-il d'un état de chargement ?

## --answers--

Un état de chargement montre un retour UI en attendant une réponse, alors que `useOptimistic` met à jour l'UI immédiatement selon un résultat attendu.

---

Un état de chargement modifie instantanément les données serveur tandis que `useOptimistic` ne met à jour que l'UI client.

### --feedback--

L'un met à jour l'UI avant même que le serveur sache pour la requête.

---

Le Hook `useOptimistic` sert à gérer les erreurs, tandis qu'un état de chargement ne sert qu'à montrer des spinners.

### --feedback--

L'un met à jour l'UI avant même que le serveur sache pour la requête.

---

Les deux sont la même chose, mais `useOptimistic` fournit des nouvelles tentatives automatiques pour les requêtes échouées.

### --feedback--

L'un met à jour l'UI avant même que le serveur sache pour la requête.

## --video-solution--

1

## --text--

Que fait `addOptimistic` dans la syntaxe du Hook `useOptimistic` ci-dessous ?

```js
const [optimisticState, addOptimistic] = useOptimistic(actualState, updateFunction);
```

## --answers--

Il applique la mise à jour optimiste avant que l'état réel ne change, offrant une expérience utilisateur plus fluide.

---

Il récupère l'état réel depuis le serveur et met à jour l'UI en conséquence.

### --feedback--

Cette fonction met à jour l'UI avant que l'état réel ne change.

---

Il remplace l'état réel par un état temporaire après avoir reçu une réponse serveur.

### --feedback--

Cette fonction met à jour l'UI avant que l'état réel ne change.

---

Il valide les données serveur avant d'appliquer la mise à jour optimiste à l'UI.

### --feedback--

Cette fonction met à jour l'UI avant que l'état réel ne change.

## --video-solution--

1
