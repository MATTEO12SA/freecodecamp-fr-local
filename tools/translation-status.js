#!/usr/bin/env node
// Bilan de l'avancement des traductions FR par superblock "v9".
//
// Le % affiché n'est 100 que si :
//   - tous les .md FR existent ;
//   - tous les labels intro.json (arbre v9 + copies autonomes) sont en français ;
//   - tous les titres de challenges FR diffèrent de l'anglais (sauf noms uniques).
// Un 100 % fichiers avec des titres encore EN n'est plus affiché comme 100 %.
//
// Usage:
//   node tools/translation-status.js
//   node tools/translation-status.js javascript-v9
//   node tools/translation-status.js --leftover [superblock]
'use strict';

const {
  listSuperblockFiles,
  getSuperblockTranslationReport,
  superblocksDir
} = require('./lib/curriculum-fr');

const fs = require('fs');

function bar(pct, width = 24) {
  const filled = Math.round((pct / 100) * width);
  return '[' + '#'.repeat(filled) + '-'.repeat(width - filled) + ']';
}

function parseArgs(argv) {
  const leftover = argv.includes('--leftover');
  const rest = argv.filter(arg => !arg.startsWith('--'));
  return { leftover, onlyKey: rest[0] || null };
}

function main() {
  if (!fs.existsSync(superblocksDir)) {
    console.error(`Dossier introuvable: ${superblocksDir}`);
    process.exit(1);
  }

  const { leftover, onlyKey } = parseArgs(process.argv.slice(2));
  let files = listSuperblockFiles('-v9.json');
  if (onlyKey) {
    files = files.filter(file => file.replace(/\.json$/, '') === onlyKey);
    if (files.length === 0) {
      console.error(`Superblock introuvable: ${onlyKey}`);
      process.exit(1);
    }
  }
  files.sort();

  const rows = files.map(file =>
    getSuperblockTranslationReport(file.replace(/\.json$/, ''), {
      includeTitles: true
    })
  );

  rows.sort((a, b) => b.pct - a.pct || a.key.localeCompare(b.key));

  const keyWidth = Math.max(...rows.map(r => r.key.length), 12);
  console.log(
    'Avancement des traductions FR par certification v9\n' +
      '(100 % = fichiers + labels intro + titres de challenges, toutes copies)\n'
  );
  for (const row of rows) {
    const label = row.key.padEnd(keyWidth);
    const pct = String(row.pct).padStart(3);
    const fileCount = `${row.filesTranslated}/${row.filesTotal}`.padStart(9);
    const introCount = `${row.introsTranslated}/${row.introsTotal}`.padStart(8);
    const titleCount = `${row.titlesTranslated}/${row.titlesTotal}`.padStart(9);
    console.log(
      `${label}  ${bar(row.pct)} ${pct}%  ` +
        `fichiers ${fileCount}  labels ${introCount}  titres ${titleCount}` +
        `${row.complete ? '  COMPLET' : ''}`
    );
  }

  const fullyDone = rows.filter(r => r.complete).map(r => r.key);
  const started = rows.filter(
    r => !r.complete && (r.filesTranslated > 0 || r.introsTranslated > 0)
  );
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

  const leftoverRows = rows.filter(
    r => r.introLeftovers.length > 0 || r.titleLeftovers.length > 0
  );
  if (leftoverRows.length && !leftover) {
    const leftoverCount = leftoverRows.reduce(
      (sum, row) => sum + row.introLeftovers.length + row.titleLeftovers.length,
      0
    );
    console.log(
      `Labels encore EN : ${leftoverCount} — relancer avec --leftover pour la liste.`
    );
  }
  if (leftover) {
    if (leftoverRows.length === 0) {
      console.log('\nAucun label intro ni titre encore identique à l’anglais.');
      return;
    }
    console.log('\nLabels encore en anglais (intro.json ou titres):');
    for (const row of leftoverRows) {
      const items = [...row.introLeftovers, ...row.titleLeftovers].slice(0, 40);
      for (const item of items) {
        console.log(`  [${row.key}] ${item.path}`);
      }
      const extra =
        row.introLeftovers.length + row.titleLeftovers.length - items.length;
      if (extra > 0) {
        console.log(`  [${row.key}] … ${extra} de plus`);
      }
    }
  }
}

main();
