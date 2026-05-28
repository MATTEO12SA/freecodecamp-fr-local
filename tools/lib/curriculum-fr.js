'use strict';
// Source unique pour scanner le curriculum FR : chemins, blocs traduits et
// structure des superblocks. Évite de réimplémenter la même logique dans
// translation-status.js, check-translation-drift.js et ailleurs (la
// divergence entre ces copies faisait dériver le % du dashboard, le filtre
// /catalog et le drift). Module CommonJS pur, sans dépendance.
//
// NB: client/src/utils/has-french-intro.ts et le plugin Gatsby gardent leur
// propre scan car ils tournent dans des contextes spéciaux (preval Babel au
// build, chemin fourni au runtime par Gatsby) — mais ce fichier reste la
// référence canonique de la logique.

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..', '..');

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
const superblocksDir = path.join(
  rootDir,
  'curriculum',
  'structure',
  'superblocks'
);

function listMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(file => file.endsWith('.md'));
}

// Un bloc est "traduit" s'il a au moins un .md FR. Bon signal de présence pour
// le filtre catalogue, mais pas une mesure de complétude (voir countFiles*).
function frBlockHasContent(block) {
  return listMdFiles(path.join(frBlocksDir, block)).length > 0;
}

// Liste les dossiers de blocs présents sous french/blocks.
function listFrBlockDirs() {
  if (!fs.existsSync(frBlocksDir)) return [];
  return fs
    .readdirSync(frBlocksDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

// Comptage fichier par fichier : combien de .md FR existent vs combien de .md
// EN dans le même bloc. Donne une vraie complétude (un bloc à moitié traduit
// n'est plus compté comme "100%").
function countBlockFiles(block) {
  const enFiles = new Set(listMdFiles(path.join(enBlocksDir, block)));
  const frFiles = listMdFiles(path.join(frBlocksDir, block));
  // On ne compte que les FR qui ont un équivalent EN (même id/filename).
  const translated = frFiles.filter(file => enFiles.has(file)).length;
  return { translated, total: enFiles.size };
}

function listSuperblockFiles(suffix) {
  if (!fs.existsSync(superblocksDir)) return [];
  return fs
    .readdirSync(superblocksDir)
    .filter(file => file.endsWith('.json'))
    .filter(file => (suffix ? file.endsWith(suffix) : true));
}

function readStructure(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(superblocksDir, file), 'utf8'));
  } catch {
    return null;
  }
}

// Aplati la structure d'un superblock en liste de blocs.
function listBlocksInStructure(structure) {
  const blocks = [];
  for (const chapter of (structure && structure.chapters) || []) {
    for (const mod of chapter.modules || []) {
      for (const block of mod.blocks || []) {
        blocks.push(block);
      }
    }
  }
  return blocks;
}

module.exports = {
  rootDir,
  enBlocksDir,
  frBlocksDir,
  superblocksDir,
  listMdFiles,
  frBlockHasContent,
  listFrBlockDirs,
  countBlockFiles,
  listSuperblockFiles,
  readStructure,
  listBlocksInStructure
};
