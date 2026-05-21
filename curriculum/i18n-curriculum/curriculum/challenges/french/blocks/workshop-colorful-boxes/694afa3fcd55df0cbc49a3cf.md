---
id: 694afa3fcd55df0cbc49a3cf
title: Étape 2
challengeType: 0
dashedName: step-2
---

# --description--

Maintenant, lie ton fichier `styles.css` au document HTML.

# --hints--

Tu devrais avoir un élément `link` dans l’élément `head`.

```js
assert.exists(document.querySelector('head > link'));
```

Ton élément `link` devrait avoir un attribut `rel`.

```js
const linkEl = document.querySelector('head > link');
assert.exists(linkEl?.getAttribute('rel'));
```

Ton élément `link` devrait avoir un attribut `rel` défini sur `stylesheet`.

```js
const linkEl = document.querySelector('head > link');
assert.equal(linkEl?.getAttribute('rel'), 'stylesheet');
```

Ton élément `link` devrait avoir un attribut `href` défini sur `styles.css`.

```js
const linkHrefValue = document.querySelector('head > link')?.dataset?.href;
assert.match(linkHrefValue, /^(\.\/)?styles\.css$/);
```

# --seed--

## --seed-contents--

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Colored Boxes</title>
--fcc-editable-region--

--fcc-editable-region--
</head>
<body>
	<header>
		<h1>Colored Boxes Layout</h1>
	</header>
</body>
</html>
```
