---
id: 68eca3cfeebef2cd8cc5f814
title: Étape 14
challengeType: 0
dashedName: step-14
---

# --description--

Ajoute un attribut `id` à ton deuxième élément ayant une classe `card` et définis sa valeur sur `dave-cooking-book`. Souviens-toi que chaque `id` doit être unique.

# --hints--

Ton deuxième élément ayant une classe `card` doit avoir un attribut `id`.

```js
const cards = document.querySelectorAll('.card');
assert.isTrue(cards[1]?.hasAttribute('id'));
```

Ton deuxième élément ayant une classe `card` doit avoir un `id` avec la valeur `dave-cooking-book`.

```js
const cards = document.querySelectorAll('.card');
assert.equal(cards[1]?.id, 'dave-cooking-book');
```
# --seed--

## --seed-contents--

```html
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>XYZ Bookstore Page</title>
</head>

<body>
  <h1>XYZ Bookstore</h1>
  <p>Browse our collection of amazing books!</p>
  
  <div class="card-container">
    <div class="card" id="sally-adventure-book">
      <h2>Sally's SciFi Adventure</h2>
      <p>This is an epic story of Sally and her dog Rex as they navigate through other worlds.</p>
      <button class="btn">Buy Now</button>
    </div>
    
  --fcc-editable-region--
    <div class="card">
  --fcc-editable-region--
      
    </div>
  </div>
</body>

</html>
```
