---
id: 697a7f71ebfcd9e4cacd69c2
title: Étape 8
challengeType: 20
dashedName: step-8
---

# --description--

L'addition est répartie, mais la division donne souvent de longs nombres décimaux. Comme l'argent est généralement représenté avec deux décimales, tu devrais arrondir le résultat final.

Dans une leçon précédente, tu as appris la fonction `round()`, qui prend deux arguments : le nombre que tu veux arrondir et le nombre de décimales à garder. Voici un exemple :

```py
num = 4.815162342
round(num, 3) # 4.815
```

Utilise la fonction `round()` pour arrondir `final_bill` à deux décimales et assigne le résultat à une nouvelle variable nommée `each_pays`.

Enfin, utilise `print()` pour afficher la chaîne `Each person pays:` suivie d'un espace et de ta variable `each_pays`.

Avec ça, l'atelier du répartiteur d'addition est terminé.

# --hints--

Tu devrais définir une variable nommée `each_pays`.

```js
({
    test: () => assert(runPython(`
    _Node(_code).has_variable('each_pays')
    `))
})
```

Tu devrais utiliser la fonction `round()` pour arrondir `final_bill` à deux décimales et assigner le résultat à ta variable `each_pays`.

```js
({
    test: () => assert(runPython(`
    _Node(_code).find_variable('each_pays').is_equivalent('each_pays = round(final_bill, 2)')
    `))
})
```

Tu devrais utiliser `print()` pour afficher la chaîne `Each person pays:` suivie d'un espace et de ta variable `each_pays`.

```js
({
    test: () => assert(runPython(`
    _Node(_code).has_call("print('Each person pays:', each_pays)") or _Node(_code).has_call("print(f'Each person pays: {each_pays}')")`))
})
```

# --seed--

## --seed-contents--

```py
running_total = 0

num_of_friends = 4

appetizers = 37.89
main_courses = 57.34
desserts = 39.39
drinks = 64.21

running_total += appetizers + main_courses + desserts + drinks
print('Total bill so far:', running_total)

tip = running_total * 0.25
print('Tip amount:', tip)

running_total += tip
print('Total with tip:', running_total)

final_bill = running_total / num_of_friends
print('Bill per person:', final_bill)

--fcc-editable-region--

--fcc-editable-region--
```

# --solutions--

```py
running_total = 0

num_of_friends = 4

appetizers = 37.89
main_courses = 57.34
desserts = 39.39
drinks = 64.21

running_total += appetizers + main_courses + desserts + drinks
print('Total bill so far:', running_total)

tip = running_total * 0.25
print('Tip amount:', tip)

running_total += tip
print('Total with tip:', running_total)

final_bill = running_total / num_of_friends
print('Bill per person:', final_bill)

each_pays = round(final_bill, 2)
print('Each person pays:', each_pays)
```
