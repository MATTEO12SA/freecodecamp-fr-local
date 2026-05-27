#!/usr/bin/env node
// Detecte le "drift" des traductions FR : un fichier .md EN qui a ete modifie
// APRES la derniere modification de son equivalent FR. Dans ce cas, la
// traduction FR est potentiellement obsolete et merite une relecture.
//
// Compare la date du dernier commit git touchant chaque fichier (EN vs FR),
// par chemin relatif identique (meme bloc, meme nom de fichier = meme id).
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

const rootDir = path.resolve(__dirname, '..');
const enBlocksDir = path.join(
  rootDir,
  'curriculum',
  'challenges',
  'english',
  'blocks'
);
const frBlocksDir = path.join(
  rootDir,
  'curriculum',
  'i18n-curriculum',
  'curriculum',
  'challenges',
  'french',
  'blocks'
);

const onlyBlock = process.argv[2] || null;

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

function lastCommitTimestamp(filePath) {
  return lastCommitMap.get(normalizeGitPath(path.relative(rootDir, filePath)));
}

function listMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(file => file.endsWith('.md'));
}

function getBlocks() {
  if (!fs.existsSync(frBlocksDir)) return [];
  const all = fs
    .readdirSync(frBlocksDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
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
      const enTime = lastCommitTimestamp(enPath);
      const frTime = lastCommitTimestamp(frPath);
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
