#!/usr/bin/env node
// Bilan de l'avancement des traductions FR par superblock "v9".
// Remplace les commandes PowerShell ad-hoc tapees a chaque session pour
// savoir combien de blocs sont traduits.
//
// Pour chaque curriculum/structure/superblocks/*-v9.json, compte les blocs
// dont le dossier FR existe sous
// curriculum/i18n-curriculum/curriculum/challenges/french/blocks/.
//
// Usage:
//   node tools/translation-status.js          # tous les superblocks v9
//   node tools/translation-status.js <key>    # un seul (ex: responsive-web-design-v9)
'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const superblocksDir = path.join(
  rootDir,
  'curriculum',
  'structure',
  'superblocks'
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

const onlyKey = process.argv[2] || null;

function listBlocks(structure) {
  const blocks = [];
  for (const chapter of structure.chapters || []) {
    for (const mod of chapter.modules || []) {
      for (const block of mod.blocks || []) {
        blocks.push(block);
      }
    }
  }
  return blocks;
}

function frBlockHasContent(block) {
  const dir = path.join(frBlocksDir, block);
  if (!fs.existsSync(dir)) return false;
  return fs.readdirSync(dir).some(file => file.endsWith('.md'));
}

function bar(pct, width = 24) {
  const filled = Math.round((pct / 100) * width);
  return '[' + '#'.repeat(filled) + '-'.repeat(width - filled) + ']';
}

function main() {
  if (!fs.existsSync(superblocksDir)) {
    console.error(`Dossier introuvable: ${superblocksDir}`);
    process.exit(1);
  }

  let files = fs
    .readdirSync(superblocksDir)
    .filter(file => file.endsWith('-v9.json'));
  if (onlyKey) {
    files = files.filter(file => file.replace(/\.json$/, '') === onlyKey);
    if (files.length === 0) {
      console.error(`Superblock introuvable: ${onlyKey}`);
      process.exit(1);
    }
  }

  files.sort();

  const rows = [];
  for (const file of files) {
    const key = file.replace(/\.json$/, '');
    let structure;
    try {
      structure = JSON.parse(
        fs.readFileSync(path.join(superblocksDir, file), 'utf8')
      );
    } catch {
      continue;
    }
    const blocks = listBlocks(structure);
    const translated = blocks.filter(frBlockHasContent).length;
    const total = blocks.length;
    const pct = total > 0 ? Math.round((translated / total) * 100) : 0;
    rows.push({ key, translated, total, pct });
  }

  rows.sort((a, b) => b.pct - a.pct || a.key.localeCompare(b.key));

  const keyWidth = Math.max(...rows.map(r => r.key.length), 12);
  console.log('Avancement des traductions FR par certification v9\n');
  for (const row of rows) {
    const label = row.key.padEnd(keyWidth);
    const count = `${row.translated}/${row.total}`.padStart(8);
    console.log(
      `${label}  ${bar(row.pct)} ${String(row.pct).padStart(3)}%  ${count}`
    );
  }

  const fullyDone = rows.filter(r => r.pct === 100).map(r => r.key);
  const started = rows.filter(r => r.pct > 0 && r.pct < 100);
  console.log('');
  console.log(
    `Certifications 100% : ${fullyDone.length ? fullyDone.join(', ') : 'aucune'}`
  );
  if (started.length) {
    console.log(
      `En cours            : ${started
        .map(r => `${r.key} (${r.pct}%)`)
        .join(', ')}`
    );
  }
}

main();
