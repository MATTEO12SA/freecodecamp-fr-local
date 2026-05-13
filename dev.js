#!/usr/bin/env node

/**
 * Script de développement pour freeCodeCamp
 * Lance tous les serveurs de développement et gère l'arrêt propre avec Ctrl+C
 */

const { spawn, spawnSync } = require('child_process');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const IS_WINDOWS = process.platform === 'win32';
const projectRoot = __dirname;

let devProcess = null;

// Couleurs pour la sortie console
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(message) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(message, 'cyan');
  log(`${'='.repeat(60)}\n`, 'cyan');
}

function removeProjectPath(relativePath) {
  const targetPath = path.join(projectRoot, relativePath);

  if (!fs.existsSync(targetPath)) {
    return;
  }

  const resolvedPath = fs.realpathSync(targetPath);
  const resolvedRoot = fs.realpathSync(projectRoot);

  if (!resolvedPath.toLowerCase().startsWith(resolvedRoot.toLowerCase())) {
    throw new Error(`Refus de supprimer en dehors du repo: ${resolvedPath}`);
  }

  fs.rmSync(resolvedPath, { recursive: true, force: true });
}

function hasStaleGatsbyCache() {
  const cacheFiles = [
    path.join(
      projectRoot,
      'client',
      '.cache',
      'async-requires.js'
    ),
    path.join(
      projectRoot,
      'client',
      '.cache',
      '_this_is_virtual_fs_path_',
      '$virtual',
      'async-requires.js'
    ),
  ];

  return cacheFiles.some(
    filePath =>
      fs.existsSync(filePath) &&
      fs.readFileSync(filePath, 'utf8').includes('src/pages/certification')
  );
}

function clearGatsbyCache() {
  log('Nettoyage du cache Gatsby...', 'cyan');
  removeProjectPath(path.join('client', '.cache'));
  removeProjectPath(path.join('client', 'public'));
  log('Cache Gatsby nettoye', 'green');
}

/**
 * Exécuter une commande de manière synchrone
 */
function runCommand(command, args, options = {}) {
  try {
    const result = spawnSync(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      ...options,
    });
    return result.status === 0;
  } catch (error) {
    return false;
  }
}

/**
 * Arrêter tous les processus proprement
 */
function stopAllProcesses() {
  log('\n⏹️  Arrêt de tous les processus...', 'yellow');

  if (devProcess) {
    if (IS_WINDOWS) {
      try {
        execSync(`taskkill /pid ${devProcess.pid} /t /f`, { stdio: 'ignore' });
      } catch (e) {
        // Ignorer les erreurs
      }
    } else {
      devProcess.kill('SIGTERM');
      setTimeout(() => {
        if (!devProcess.killed) {
          devProcess.kill('SIGKILL');
        }
      }, 2000);
    }
  }

  log('✅ Tous les processus ont été arrêtés.', 'green');
  process.exit(0);
}

/**
 * Afficher les instructions
 */
function showInstructions() {
  log('\n📋 Instructions:', 'cyan');
  log('  • Appuyez sur Ctrl+C pour arrêter tous les processus', 'gray');
  log('  • Les serveurs se relanceront automatiquement lors des changements de fichiers', 'gray');
  log('  • Ouvrez votre navigateur pour voir le projet', 'gray');
  log('  • Lancez node dev.js --clean si Gatsby garde un vieux cache', 'gray');
  log('');
}

/**
 * Lancer le développement
 */
function startDevelopment() {
  logSection('🚀 Démarrage de freeCodeCamp en mode développement');

  try {
    // Vérifier pnpm
    log('📦 Vérification de pnpm...', 'cyan');
    try {
      const version = execSync('pnpm --version', { encoding: 'utf8' });
      log(`✅ pnpm ${version.trim()} détecté`, 'green');
    } catch (error) {
      log('❌ pnpm non trouvé. Installez pnpm avec: npm install -g pnpm', 'red');
      process.exit(1);
    }

    // Vérifier si node_modules existe
    if (!fs.existsSync(path.join(projectRoot, 'node_modules'))) {
      log('📥 Installation des dépendances...', 'cyan');
      if (!runCommand('pnpm', ['install'])) {
        log('❌ Erreur lors de l\'installation des dépendances', 'red');
        process.exit(1);
      }
      log('✅ Dépendances installées', 'green');
    } else {
      log('✅ Dépendances déjà installées', 'green');
    }

    if (process.argv.includes('--clean') || hasStaleGatsbyCache()) {
      clearGatsbyCache();
    }

    // Lancer uniquement le client Gatsby standalone.
    log('⚡ Lancement du client de développement...', 'cyan');
    showInstructions();

    devProcess = spawn('pnpm', ['run', 'develop:client'], {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: IS_WINDOWS,
    });

    devProcess.on('error', (error) => {
      log(`❌ Erreur: ${error.message}`, 'red');
      process.exit(1);
    });

    devProcess.on('close', (code) => {
      if (code !== 0 && code !== null) {
        log(`\n❌ Le processus s'est arrêté avec le code ${code}`, 'red');
      }
      process.exit(code || 0);
    });
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Gestion des signaux d'arrêt
process.on('SIGINT', stopAllProcesses);
process.on('SIGTERM', stopAllProcesses);

// Lancer le développement
startDevelopment();
