---
id: 67fe85a3db9bad35f2b6a2bd
title: 'Comment fonctionnent les instructions conditionnelles et les opérateurs logiques ?'
challengeType: 19
dashedName: how-do-conditional-statements-and-logical-operators-work
---

# --description--

Les instructions conditionnelles, ou conditionnelles, te permettent de contrôler le déroulement de ton programme selon que certaines conditions sont vraies ou fausses.

Mais avant d'entrer dans tout ça, passons en revue les éléments de base des instructions conditionnelles, en commençant par les opérateurs de comparaison. Les opérateurs de comparaison te permettent de comparer deux valeurs ou plus, et de renvoyer une valeur booléenne.

Dans une leçon précédente, tu as appris que les booléens sont l'un des types de données en Python, et qu'ils ne peuvent valoir que `True` ou `False`.

Voici un tableau des opérateurs de comparaison en Python :

| Opérateur | Nom | Description |
| --- | --- | --- |
| `==` | Égal | Vérifie si deux valeurs sont égales |
| `!=` | Différent | Vérifie si deux valeurs ne sont pas égales |
| `>` | Supérieur à | Vérifie si la valeur de gauche est supérieure à la valeur de droite |
| `<` | Inférieur à | Vérifie si la valeur de gauche est inférieure à la valeur de droite |
| `>=` | Supérieur ou égal | Vérifie si la valeur de gauche est supérieure ou égale à la valeur de droite |
| `<=` | Inférieur ou égal | Vérifie si la valeur de gauche est inférieure ou égale à la valeur de droite |

Voici quelques-unes de ces expressions qui s'évaluent à `True` ou `False` :

```python
print(3 > 4) # False
print(3 < 4) # True
print(3 == 4) # False
print(4 == 4) # True
print(3 != 4) # True
print(3 >= 4) # False
print(3 <= 4) # True
```

Ces opérateurs peuvent servir dans des conditionnelles pour comparer des valeurs et exécuter du code selon que la conditionnelle s'évalue à `True` ou `False`.

En Python, la conditionnelle la plus basique est l'instruction `if`. Voici la syntaxe de base :

```python
if condition:
    pass # Code to execute if condition is True
```

* Les instructions `if` commencent par le mot-clé `if`.

* `condition` est une expression qui s'évalue à `True` ou `False`, suivie d'un deux-points (`:`).

* Le corps de l'instruction `if` constitue un <dfn>bloc de code</dfn>, c'est-à-dire un groupe d'instructions qui vont ensemble. En Python, c'est le niveau d'indentation qui définit un bloc de code.

Dans l'exemple ci-dessus, le corps de l'instruction `if` contient une instruction `pass`. Quand une instruction `pass` s'exécute, rien ne se passe. C'est un mot-clé spécial qui peut servir d'espace réservé pour du code à venir, et il est utile quand les blocs de code vides ne sont pas autorisés.

Le code dans le corps de l'instruction `if` ne s'exécute que lorsque la condition s'évalue à `True`. Par exemple :

```python
age = 18

if age >= 18:
    print('You are an adult') # You are an adult
```

Remarque l'indentation avant `print('You are an adult')`. Alors que d'autres langages de programmation utilisent des caractères comme les accolades pour définir les blocs de code, et n'utilisent l'indentation que pour la lisibilité, en Python, les blocs de code sont déterminés par l'indentation.

Le code suivant lèverait une `IndentationError`, c'est la façon dont Python signale qu'une indentation est requise à un certain endroit du code :

```py
age = 18

if age >= 18:
print('You are an adult') # IndentationError: expected an indented block after 'if' statement on line 3
```

Même si tu peux utiliser n'importe quel nombre d'espaces (tant que tu restes cohérent) pour déterminer chaque niveau d'indentation, le guide de style Python recommande d'en utiliser quatre.

On trouve aussi des blocs dans les boucles et les fonctions, que tu découvriras dans les leçons à venir.

Pour revenir à notre exemple, si `age` est inférieur à `18`, rien n'est affiché dans le terminal :

```python
age = 12

if age >= 18:
    print('You are an adult') # Nothing shows up in the terminal
```

Et si tu veux aussi afficher quelque chose si `age` est inférieur à `18` ? C'est là qu'intervient la clause `else`. La clause `else` s'exécute quand la condition du `if` est fausse. Voici la syntaxe d'une instruction `if…else` :

```python
if condition:
   pass # Code to execute if condition is True
else:
   pass # Code to execute if condition is False
```

Par exemple :

```python
age = 12

if age >= 18:
    print('You are an adult')
else:
    print('You are not an adult yet') # You are not an adult yet
```

Note que tu ne peux placer aucune instruction entre le bloc `if` et la clause `else`. Le code suivant lèverait une `SyntaxError` :

```python
age = 12

if age >= 18:
    print('You are an adult')
print('Almost there!')
else: # SyntaxError: invalid syntax
    print('You are not an adult yet')
```

Il peut y avoir des situations où tu veux prendre en compte plusieurs conditions. Pour cela, Python te permet d'étendre ton instruction if avec le mot-clé `elif` (else if, sinon si).

Voici la syntaxe :

```python
if condition1:
   pass # Code to execute if condition1 is True
elif condition2:
   pass # Code to execute if condition1 is False and condition2 is True
else:
   pass # Code to execute if all conditions are False
```

Par exemple :

```python
age = 12

if age >= 18:
    print('You are an adult')
elif age >= 13:
    print('You are a teenager')
else:
    print('You are a child') # You are a child
```

Note que tu peux utiliser autant de clauses `elif` que tu veux :

```python
age = 2

if age >= 65:
    print('You are a senior citizen')
elif age >= 30:
    print('You are an adult in your prime')
elif age >= 18:
    print('You are a young adult')
elif age >= 13:
    print('You are a teenager')
elif age >= 3:
    print('You are a young child')
else:
    print('You are a toddler or an infant') # You are a toddler or an infant
```

Maintenant que tu comprends comment fonctionnent les opérateurs de comparaison et les instructions conditionnelles en Python, tu peux commencer à écrire des programmes qui prennent des décisions en fonction de la logique et des entrées. Que tu compares des valeurs ou que tu suives différentes branches selon plusieurs conditions, ces outils sont la base pour écrire du code souple et réactif.

# --questions--

## --text--

Que font les opérateurs de comparaison ?

## --answers--

Effectuer des calculs mathématiques avec des valeurs booléennes

### --feedback--

Ces opérateurs vérifient des choses comme l'égalité ou quelle valeur est plus grande, et le résultat est soit `True`, soit `False`.

---

Convertir des chaînes en valeurs booléennes.

### --feedback--

Ces opérateurs vérifient des choses comme l'égalité ou quelle valeur est plus grande, et le résultat est soit `True`, soit `False`.

---

Comparer deux valeurs et renvoyer une valeur booléenne.

---

Créer des boucles et des itérations.

### --feedback--

Ces opérateurs vérifient des choses comme l'égalité ou quelle valeur est plus grande, et le résultat est soit `True`, soit `False`.

## --video-solution--

3

## --text--

Quel sera le résultat du code suivant ?

```python
age = 12

if age >= 18:
    print('You are an adult')
elif age >= 13:
    print('You are a teenager')
else:
    print('You are a child')
```

## --answers--

`You are an adult` sera affiché dans la console.

### --feedback--

Relis la dernière partie de la leçon pour trouver la bonne réponse.

---

`You are a teenager` sera affiché dans la console.

### --feedback--

Relis la dernière partie de la leçon pour trouver la bonne réponse.

---

`You are a child` sera affiché dans la console.

---

Une erreur sera affichée dans la console.

### --feedback--

Relis la dernière partie de la leçon pour trouver la bonne réponse.

## --video-solution--

3

## --text--

À quoi s'évaluera l'expression `3 >= 4` ?

## --answers--

`True`

### --feedback--

3 n'est pas supérieur ou égal à 4.

---

`SyntaxError`

### --feedback--

3 n'est pas supérieur ou égal à 4.

---

`None`

### --feedback--

3 n'est pas supérieur ou égal à 4.

---

`False`

## --video-solution--

4
