# Lexique FR — reference de style (Chantier 0)

> **Reference, pas remplacement automatique.** Ce fichier sert a Claude pour rester
> coherent d'un bloc a l'autre. Aucun outil ne l'applique : la traduction est
> entierement redigee par Claude. (L'ancien `phrasebook.json` n'est plus utilise
> par defaut ; il reste accessible via `--phrasebook` pour un pre-remplissage de
> brouillon, jamais comme traduction finale.)

## Ton et adresse

- **Tutoiement** systematique (« tu », « ton », « tes »). Jamais « vous ».
- Ton mentor, direct et encourageant. Phrases courtes.
- Imperatif a la 2e personne : « Ajoute un element… », « Cree une regle… ».

## Terminologie canonique (EN → FR)

| Anglais            | Francais retenu                         |
| ------------------ | --------------------------------------- |
| array              | tableau                                 |
| string             | chaine (de caracteres)                  |
| object             | objet                                   |
| value              | valeur                                  |
| property           | propriete                               |
| element            | element                                 |
| selector           | selecteur                               |
| attribute          | attribut                                |
| tag                | balise                                  |
| nested             | imbrique                                |
| statement          | instruction                             |
| function           | fonction                                |
| variable           | variable                                |
| loop               | boucle                                  |
| index              | indice (ou index selon contexte)        |
| key / value (pair) | cle / valeur                            |
| to return          | renvoyer (preferer a « retourner »)     |
| to set (a value)   | definir                                 |
| to nest            | imbriquer                               |
| output             | sortie / resultat                       |
| input              | entree / saisie                         |
| whitespace         | espace(s)                               |
| boilerplate        | code de base                            |
| responsive         | responsive (terme courant) ou adaptatif |

## Ce qui RESTE en anglais

- Tout ce qui est entre backticks et **teste par une assertion** : valeurs
  attendues (`Select an option`, `Total Fat`…), noms de balises/proprietes
  (`div`, `display`, `margin-left`), code, selecteurs, IDs, classes, URLs.
- Les mots-cles du langage (`const`, `return`, `flex`, `grid`…).
- Les noms propres (freeCodeCamp, Flexbox quand c'est un nom de produit).

## Pieges recurrents (a relire systematiquement)

- Accord sujet/verbe : « Les elements … **doivent** » (pas « doit »).
- « should » → « devrait/devraient » (jamais laisser « should »).
- « Your … » → « Ton/Ta/Tes … » (jamais laisser « Your »).
- Eviter les calques : « matching the » → « qui correspond a », pas « correspondant
  le ».
- Ne pas sur-traduire une valeur de test en backticks (sinon l'assertion casse).
- Verifier que chaque `$1`, `$2` … d'une assertion est conserve a l'identique.

## Rappel pipeline

`extract` (fr vides) → Claude traduit le JSON (ce lexique en reference) →
`reviewed: true` → `apply` → `verify` (integrite technique) →
`check-translation-quality` (qualite FR). Voir `docs/OPTIMIZE-TRANSLATIONS.md`.
