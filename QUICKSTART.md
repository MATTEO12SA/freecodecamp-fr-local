# 🚀 Guide de démarrage rapide freeCodeCamp

## ⚡ Démarrage rapide (recommandé)

### Windows PowerShell
```powershell
# Option 1: Utiliser le script PowerShell
.\dev.ps1

# Option 2: Commande directe (à définir NODE_OPTIONS)
$env:NODE_OPTIONS = "--max-old-space-size=7168"
pnpm run develop
```

### macOS / Linux
```bash
# Option 1: Utiliser le script Node.js
pnpm dev

# Option 2: Commande directe (variables Unix)
NODE_OPTIONS="--max-old-space-size=7168" pnpm run develop
```

**Pour arrêter tous les processus proprement: `Ctrl + C`**

---

## 📋 Configuration requise

Un fichier `.env` est **obligatoire** pour le développement. Un fichier exemple est fourni à `.env` avec les variables essentielles:

```bash
# Curriculum Configuration (REQUIS)
CURRICULUM_LOCALE=english

# Autres variables (optionnelles pour le développement)
MONGOHQ_URL=mongodb://127.0.0.1:27017/freecodecamp?directConnection=true
SESSION_SECRET=your_session_secret_here_at_least_32_characters_long
```

⚠️ Si le build échoue avec `CURRICULUM_LOCALE not found`, vérifiez que le fichier `.env` existe dans la racine du projet.

---

## 🎯 Commandes disponibles

```bash
# Démarrage complet
pnpm run develop

# Démarrage par module
pnpm run develop:client    # Frontend (Gatsby)
pnpm run develop:api       # Backend (Node.js/Express)

# Build pour production
pnpm run build
pnpm run build:client
pnpm run build:api
pnpm run build:curriculum

# Tests
pnpm test
pnpm test-client
pnpm test-api
pnpm test-curriculum-content

# Formatage et linting
pnpm run format           # Format tout le code
pnpm run lint             # Vérifier les erreurs
```

---

## 📁 Structure du projet

```
freeCodeCamp/
├── api/              # Backend (Node.js + Prisma + PostgreSQL)
├── client/           # Frontend (Gatsby + React + TypeScript)
├── curriculum/       # Contenu éducatif (Markdown)
├── packages/         # Packages partagés
│   ├── shared/      # Code partagé API/Client
│   ├── eslint-config/
│   └── ...
├── tools/           # Scripts et outils
├── e2e/             # Tests end-to-end (Playwright)
├── .env             # Variables d'environnement (CRÉER DEPUIS .env)
└── dev.ps1          # Script PowerShell pour Windows
```

---

## 🔧 Troubleshooting

### ❌ "pnpm not found"
```bash
npm install -g pnpm@latest
```

### ❌ "CURRICULUM_LOCALE not found"
Créez un fichier `.env` dans la racine avec:
```
CURRICULUM_LOCALE=english
```

### ❌ "Port already in use"
Les serveurs utilisent les ports par défaut. Vérifiez et libérez les ports utilisés.

### ❌ "node_modules missing"
```bash
pnpm install
```

### ❌ Erreurs de cache Turbo
```powershell
# Windows PowerShell
Get-ChildItem -Recurse -Filter ".turbo" -Directory | Remove-Item -Recurse -Force
pnpm run develop
```

### ❌ "Dépendances obsolètes"
```bash
pnpm run clean-and-develop
```

---

## 🌍 Langues du curriculum supportées

Les valeurs possibles pour `CURRICULUM_LOCALE`:
- `english` (défaut)
- `espanol`
- `chinese`
- `chinese-traditional`
- `italian`
- `portuguese`
- `ukrainian`
- `japanese`
- `german`
- `swahili`
- `korean`

Exemple: `CURRICULUM_LOCALE=espanol`

---

## 📚 Pour plus d'informations

- [README principal](README.md)
- [Documentation de contribution](https://contribute.freecodecamp.org/)
- [Forum freeCodeCamp](https://forum.freecodecamp.org/)

---

**💡 Conseil**: Gardez le terminal ouvert pour voir les changements en temps réel!
