#!/usr/bin/env node
'use strict';

// Recopie le français déjà rédigé dans l'arbre v9 d'intro.json vers les
// clés autonomes encore identiques à l'anglais. Ne génère aucune traduction.

const fs = require('fs');
const {
  frenchIntroPath,
  englishIntroPath,
  listSuperblockFiles,
  applyIntroCopies
} = require('./lib/curriculum-fr');

function skipJsonString(text, index) {
  let i = index + 1;
  while (i < text.length) {
    if (text[i] === '\\') {
      i += 2;
      continue;
    }
    if (text[i] === '"') return i + 1;
    i += 1;
  }
  return i;
}

function findObjectAfterKey(text, key, fromIndex = 0) {
  const needle = `"${key}"`;
  let search = fromIndex;
  while (search < text.length) {
    const at = text.indexOf(needle, search);
    if (at === -1) return null;
    let i = at + needle.length;
    while (i < text.length && /\s/.test(text[i])) i += 1;
    if (text[i] !== ':') {
      search = at + 1;
      continue;
    }
    i += 1;
    while (i < text.length && /\s/.test(text[i])) i += 1;
    if (text[i] !== '{') {
      search = at + 1;
      continue;
    }
    const start = i;
    let depth = 0;
    while (i < text.length) {
      const ch = text[i];
      if (ch === '"') {
        i = skipJsonString(text, i);
        continue;
      }
      if (ch === '{') depth += 1;
      else if (ch === '}') {
        depth -= 1;
        if (depth === 0) return { start, end: i + 1 };
      }
      i += 1;
    }
    return null;
  }
  return null;
}

function applyChangeToText(text, change) {
  const match = change.path.match(
    /^([^.]+)\.blocks\.([^.]+)\.(title|intro\[(\d+)\])$/
  );
  if (!match) {
    throw new Error(`Chemin de copie non géré: ${change.path}`);
  }
  const [, standaloneKey, blockName] = match;
  const standalone = findObjectAfterKey(text, standaloneKey);
  if (!standalone) {
    throw new Error(`Clé intro.json introuvable: ${standaloneKey}`);
  }
  const block = findObjectAfterKey(text, blockName, standalone.start);
  if (!block || block.start < standalone.start || block.end > standalone.end) {
    throw new Error(
      `Bloc intro.json introuvable: ${standaloneKey}.blocks.${blockName}`
    );
  }

  const fromLiteral = JSON.stringify(change.from);
  const toLiteral = JSON.stringify(change.to);
  const idx = text.indexOf(fromLiteral, block.start);
  if (idx === -1 || idx >= block.end) {
    throw new Error(`Valeur anglaise introuvable pour ${change.path}`);
  }
  return text.slice(0, idx) + toLiteral + text.slice(idx + fromLiteral.length);
}

function parseArgs(argv) {
  const write = argv.includes('--write');
  const rest = argv.filter(arg => !arg.startsWith('--'));
  return { write, onlyKey: rest[0] || null };
}

function main() {
  const { write, onlyKey } = parseArgs(process.argv.slice(2));
  const frenchIntro = JSON.parse(fs.readFileSync(frenchIntroPath, 'utf8'));
  const englishIntro = JSON.parse(fs.readFileSync(englishIntroPath, 'utf8'));
  let files = listSuperblockFiles('-v9.json');
  if (onlyKey) {
    files = files.filter(file => file.replace(/\.json$/, '') === onlyKey);
    if (files.length === 0) {
      console.error(`Superblock introuvable: ${onlyKey}`);
      process.exit(1);
    }
  }

  const allChanges = [];
  for (const file of files) {
    const key = file.replace(/\.json$/, '');
    const { changes } = applyIntroCopies(frenchIntro, englishIntro, key);
    for (const change of changes) {
      allChanges.push({ key, ...change });
    }
  }

  if (allChanges.length === 0) {
    console.log(
      'Aucune copie intro.json à faire : pas de français déjà rédigé à reporter.'
    );
    return;
  }

  console.log(
    `${allChanges.length} label(s) encore EN, français déjà présent dans l'arbre v9 :`
  );
  for (const change of allChanges) {
    console.log(`  [${change.key}] ${change.path}`);
  }

  if (!write) {
    console.log('\nDry-run. Relancer avec --write pour copier ces labels.');
    return;
  }

  let text = fs.readFileSync(frenchIntroPath, 'utf8');
  for (const change of allChanges) {
    text = applyChangeToText(text, change);
  }
  fs.writeFileSync(frenchIntroPath, text);
  console.log(`Écrit ${frenchIntroPath}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { applyChangeToText, findObjectAfterKey };
