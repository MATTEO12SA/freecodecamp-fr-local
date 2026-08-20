---
id: 67d301cc87b84eaa42bdcdbe
title: 'Qu’est-ce qu’un fichier tsconfig, et pourquoi est-il important de l’inclure dans tes projets TypeScript ?'
challengeType: 19
dashedName: what-is-a-tsconfig-file-and-why-is-it-important-to-include-in-your-typescript-projects
---

# --description--

Les réglages du compilateur TypeScript peuvent être configurés pour répondre aux besoins de ton projet. Cette configuration se trouve dans un fichier `tsconfig.json` à la racine de ton projet. En fait, sans lui, le compilateur ne s’exécutera pas sauf si tu lui passes des flags de commande directement. Mais que fait exactement ce fichier ? Eh bien, regardons un exemple de fichier :

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./prod",
    "lib": ["ES2023"],
    "target": "ES2023",
    "module": "ES2022",
    "moduleResolution": "Node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true
  },
  "exclude": ["test/"]
}
```

Ça semble beaucoup ! Alors décortiquons. La propriété `compilerOptions` va contenir le « cœur » de ta configuration — c’est là que tu contrôles le comportement du compilateur TypeScript. En regardant cet objet imbriqué…

Les propriétés `rootDir` et `outDir` indiquent à TypeScript quel répertoire contient tes fichiers source, et quel répertoire doit contenir le code JavaScript transpilé.

La propriété `lib` détermine quelles définitions de types le compilateur utilise, et te permet d’inclure le support de versions ES spécifiques, du DOM, et plus encore.

`module` et `moduleResolution` travaillent effectivement de concert pour gérer la façon dont ton package utilise les modules — CommonJS ou ECMAScript.

`esModuleInterop` permet une meilleure interopérabilité entre CommonJS et les modules ES en créant automatiquement des objets namespace pour les imports, ce qui facilite l’utilisation de modules de systèmes différents ensemble dans tes projets TypeScript, et l’option `skipLibCheck` saute la validation des fichiers `.d.ts` qui ne sont pas référencés par des imports dans ton code.

Et enfin, nous arrivons au mode `strict`. On pourrait soutenir que TypeScript n’est pas vraiment utile sans ce flag activé, car il bascule plusieurs autres vérifications, comme t’obliger à gérer correctement les types nullable, ou avertir quand TypeScript ne peut pas déduire un type et retombe sur any.

Avant de terminer, une note rapide sur la propriété de premier niveau `exclude` — quand tu as défini un répertoire source, tu peux avoir du code TypeScript hors de ce répertoire que tu ne veux pas compiler dans ton code de production. Par exemple, ton code de tests. Le tableau `exclude` dit au compilateur d’ignorer ces fichiers TypeScript pendant la compilation, tout en permettant aux outils comme Intellisense de signaler d’éventuels problèmes.

Il y a une tonne d’autres options de compilateur que tu peux explorer — plus de 50 ! Je t’encourage à explorer la documentation et à expérimenter pour trouver la configuration qui convient aux besoins de ton projet.

# --questions--

## --text--

Quelle propriété dans le fichier `tsconfig.json` affecte le comportement du compilateur ?

## --answers--

`rootDir`

### --feedback--

Cette propriété est un objet contenant des options pour le compilateur.

---

`compilerOptions`

---

`exclude`

### --feedback--

Cette propriété est un objet contenant des options pour le compilateur.

---

`lib`

### --feedback--

Cette propriété est un objet contenant des options pour le compilateur.

## --video-solution--

2

## --text--

Que fait l’option `strict` dans le fichier `tsconfig.json` ?

## --answers--

Elle vérifie uniquement les types nullable.

### --feedback--

Cette option active diverses vérifications, y compris la gestion des types nullable.

---

Elle impose l’utilisation des modules CommonJS.

### --feedback--

Cette option active diverses vérifications, y compris la gestion des types nullable.

---

Elle bascule plusieurs options de vérification de types.

---

Elle exclut les fichiers de test de la compilation.

### --feedback--

Cette option active diverses vérifications, y compris la gestion des types nullable.

## --video-solution--

3

## --text--

Quel est le rôle du tableau `exclude` dans le fichier `tsconfig.json` ?

## --answers--

Spécifier quels fichiers compiler.

### --feedback--

Tu peux l’utiliser pour exclure le code de tests de la compilation.

---

Lister des bibliothèques supplémentaires à inclure.

### --feedback--

Tu peux l’utiliser pour exclure le code de tests de la compilation.

---

Ignorer certains fichiers pendant la compilation.

---

Définir les répertoires de sortie pour les fichiers compilés.

### --feedback--

Tu peux l’utiliser pour exclure le code de tests de la compilation.

## --video-solution--

3
