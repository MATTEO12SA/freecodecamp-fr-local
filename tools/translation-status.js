#!/usr/bin/env node
// Bilan de l'avancement des traductions FR par superblock "v9".
// Remplace les commandes PowerShell ad-hoc tapees a chaque session pour
// savoir combien de blocs sont traduits.
//
// Affiche DEUX mesures par certification :
//   - fichiers : .md FR presents / .md EN attendus (vraie completude, sert
//     de barre principale) ;
//   - blocs    : blocs avec au moins un .md FR / total des blocs (signal de
//     presence, utilise par le filtre /catalog).
// Un bloc a moitie traduit ne compte donc plus comme "100%".
//
// Usage:
//   node tools/translation-status.js          # tous les superblocks v9
//   node tools/translation-status.js <key>    # un seul (ex: responsive-web-design-v9)
'use strict';

const {
  frBlockHasContent,
  countBlockFiles,
  listSuperblockFiles,
  readStructure,
  listBlocksInStructure,
  superblocksDir
} = require('./lib/curriculum-fr');

const fs = require('fs');
const onlyKey = process.argv[2] || null;

function bar(pct, width = 24) {
  const filled = Math.round((pct / 100) * width);
  return '[' + '#'.repeat(filled) + '-'.repeat(width - filled) + ']';
}

function pctOf(part, total) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function main() {
  if (!fs.existsSync(superblocksDir)) {
    console.error(`Dossier introuvable: ${superblocksDir}`);
    process.exit(1);
  }

  let files = listSuperblockFiles('-v9.json');
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
    const structure = readStructure(file);
    if (!structure) continue;
    const blocks = listBlocksInStructure(structure);

    let translatedBlocks = 0;
    let translatedFiles = 0;
    let totalFiles = 0;
    for (const block of blocks) {
      if (frBlockHasContent(block)) translatedBlocks += 1;
      const { translated, total } = countBlockFiles(block);
      translatedFiles += translated;
      totalFiles += total;
    }

    rows.push({
      key,
      translatedBlocks,
      totalBlocks: blocks.length,
      translatedFiles,
      totalFiles,
      pctFiles: pctOf(translatedFiles, totalFiles)
    });
  }

  rows.sort((a, b) => b.pctFiles - a.pctFiles || a.key.localeCompare(b.key));

  const keyWidth = Math.max(...rows.map(r => r.key.length), 12);
  console.log('Avancement des traductions FR par certification v9\n');
  for (const row of rows) {
    const label = row.key.padEnd(keyWidth);
    const pct = String(row.pctFiles).padStart(3);
    const fileCount = `${row.translatedFiles}/${row.totalFiles}`.padStart(9);
    const blockCount = `${row.translatedBlocks}/${row.totalBlocks}`;
    console.log(
      `${label}  ${bar(row.pctFiles)} ${pct}%  fichiers ${fileCount}  ` +
        `(blocs ${blockCount})`
    );
  }

  const fullyDone = rows
    .filter(r => r.totalFiles > 0 && r.translatedFiles === r.totalFiles)
    .map(r => r.key);
  const started = rows.filter(
    r => r.translatedFiles > 0 && r.translatedFiles < r.totalFiles
  );
  console.log('');
  console.log(
    `Certifications 100% : ${fullyDone.length ? fullyDone.join(', ') : 'aucune'}`
  );
  if (started.length) {
    console.log(
      `En cours            : ${started
        .map(r => `${r.key} (${r.pctFiles}%)`)
        .join(', ')}`
    );
  }
}

main();
