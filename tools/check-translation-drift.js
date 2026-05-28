#!/usr/bin/env node
// Detecte le "drift" des traductions FR : un fichier .md EN qui a ete modifie
// APRES son equivalent FR. Dans ce cas, la traduction FR est potentiellement
// obsolete et merite une relecture.
//
// Mesure : date du dernier commit git touchant chaque fichier (EN vs FR), par
// chemin relatif identique (meme bloc, meme nom = meme id). Si un fichier n'a
// PAS d'historique git (jamais commit, ou checkout sans .git), on retombe sur
// la date de modification disque (mtime) pour ne pas l'ignorer silencieusement.
//
// Usage:
//   node tools/check-translation-drift.js            # tous les blocs FR
//   node tools/check-translation-drift.js <block>    # un seul bloc
//
// Sortie: liste des fichiers en drift, total. Exit 0 si aucun drift, 1 sinon.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  rootDir,
  enBlocksDir,
  frBlocksDir,
  listMdFiles,
  listFrBlockDirs
} = require('./lib/curriculum-fr');

const onlyBlock = process.argv[2] || null;
let usedMtimeFallback = false;

function normalizeGitPath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function buildLastCommitMap() {
  const map = new Map();
  let output = '';
  try {
    output = execFileSync(
      'git',
      [
        'log',
        '--format=@@%cI',
        '--name-only',
        '--',
        'curriculum/challenges/english/blocks',
        'curriculum/i18n-curriculum/curriculum/challenges/french/blocks'
      ],
      { cwd: rootDir, encoding: 'utf8' }
    ).trim();
  } catch {
    return map;
  }

  let currentTime = null;
  for (const line of output.split('\n')) {
    if (!line) continue;
    if (line.startsWith('@@')) {
      currentTime = new Date(line.slice(2)).getTime();
      continue;
    }
    const normalized = normalizeGitPath(line);
    if (currentTime !== null && !map.has(normalized)) {
      map.set(normalized, currentTime);
    }
  }
  return map;
}

const lastCommitMap = buildLastCommitMap();

// Date de reference d'un fichier : dernier commit git, sinon mtime disque.
function fileTimestamp(filePath) {
  const fromGit = lastCommitMap.get(
    normalizeGitPath(path.relative(rootDir, filePath))
  );
  if (typeof fromGit === 'number') return fromGit;
  try {
    usedMtimeFallback = true;
    return fs.statSync(filePath).mtimeMs;
  } catch {
    return null;
  }
}

function getBlocks() {
  const all = listFrBlockDirs();
  return onlyBlock ? all.filter(name => name === onlyBlock) : all;
}

function main() {
  const blocks = getBlocks();
  if (blocks.length === 0) {
    console.error(
      onlyBlock
        ? `Bloc FR introuvable: ${onlyBlock}`
        : `Aucun bloc FR sous ${frBlocksDir}`
    );
    process.exit(1);
  }

  const drifted = [];
  let comparedFiles = 0;
  let missingEn = 0;

  for (const block of blocks.sort()) {
    const frDir = path.join(frBlocksDir, block);
    const enDir = path.join(enBlocksDir, block);

    for (const file of listMdFiles(frDir)) {
      const frPath = path.join(frDir, file);
      const enPath = path.join(enDir, file);

      if (!fs.existsSync(enPath)) {
        missingEn++;
        continue;
      }

      comparedFiles++;
      const enTime = fileTimestamp(enPath);
      const frTime = fileTimestamp(frPath);
      if (enTime === null || frTime === null) continue;

      if (enTime > frTime) {
        drifted.push({
          block,
          file,
          enDate: new Date(enTime).toISOString().slice(0, 10),
          frDate: new Date(frTime).toISOString().slice(0, 10)
        });
      }
    }
  }

  console.log(`Blocs analyses     : ${blocks.length}`);
  console.log(`Fichiers compares  : ${comparedFiles}`);
  if (missingEn > 0) {
    console.log(`Sans equivalent EN : ${missingEn} (ignores)`);
  }
  console.log(`En drift           : ${drifted.length}`);
  console.log(
    `Reference          : dernier commit git${
      usedMtimeFallback ? ' (mtime disque en repli pour les non-commit)' : ''
    }`
  );

  if (drifted.length > 0) {
    console.log(
      '\n--- Fichiers FR potentiellement obsoletes (EN modifie apres FR) ---'
    );
    let currentBlock = null;
    for (const item of drifted) {
      if (item.block !== currentBlock) {
        currentBlock = item.block;
        console.log(`\n[${item.block}]`);
      }
      console.log(`  ${item.file}  EN=${item.enDate} > FR=${item.frDate}`);
    }
    console.log(
      '\nRelire ces fichiers FR contre leur version EN avant de continuer.'
    );
    process.exit(1);
  }

  console.log(
    '\nAucun drift detecte. Toutes les traductions FR sont a jour vs EN.'
  );
  process.exit(0);
}

main();
