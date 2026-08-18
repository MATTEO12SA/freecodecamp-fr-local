// Liste générée au build : tous les superblocks/modules qui ont au moins un
// challenge .md traduit en français, plus les certifications dont au moins un
// module est traduit. Évite les faux positifs (titre traduit dans intro.json
// mais aucun challenge traduit) et la maintenance manuelle.
declare const preval: (s: TemplateStringsArray) => {
  superblocks: string[];
  blocks: string[];
  coverage: Record<string, { translated: number; total: number }>;
};

const FRENCH_DATA = preval`
  const fs = require('fs');
  const path = require('path');

  const frBlocksDir = path.resolve(
    __dirname,
    '../../../curriculum/i18n-curriculum/curriculum/challenges/french/blocks'
  );
  const enBlocksDir = path.resolve(
    __dirname,
    '../../../curriculum/challenges/english/blocks'
  );
  const superblocksDir = path.resolve(
    __dirname,
    '../../../curriculum/structure/superblocks'
  );

  function listMd(dir) {
    if (!fs.existsSync(dir)) return [];
    try {
      return fs.readdirSync(dir).filter(file => file.endsWith('.md'));
    } catch (_) {
      return [];
    }
  }

  function countBlockFiles(blockName) {
    const enFiles = new Set(listMd(path.join(enBlocksDir, blockName)));
    const frFiles = listMd(path.join(frBlocksDir, blockName));
    return {
      translated: frFiles.filter(file => enFiles.has(file)).length,
      total: enFiles.size
    };
  }

  const translatedBlocks = new Set();
  if (fs.existsSync(frBlocksDir)) {
    for (const blockName of fs.readdirSync(frBlocksDir)) {
      const blockPath = path.join(frBlocksDir, blockName);
      try {
        if (!fs.statSync(blockPath).isDirectory()) continue;
      } catch (_) {
        continue;
      }
      if (listMd(blockPath).length > 0) translatedBlocks.add(blockName);
    }
  }

  const translatedSuperBlocks = new Set();
  const coverage = {};

  function addCoverage(key, blockNames) {
    let translated = 0;
    let total = 0;
    for (const blockName of blockNames) {
      const count = countBlockFiles(blockName);
      translated += count.translated;
      total += count.total;
    }
    coverage[key] = { translated, total };
  }

  if (fs.existsSync(superblocksDir)) {
    for (const file of fs.readdirSync(superblocksDir)) {
      if (!file.endsWith('.json')) continue;
      const superBlockKey = file.replace(/\\.json$/, '');
      let structure;
      try {
        structure = JSON.parse(
          fs.readFileSync(path.join(superblocksDir, file), 'utf8')
        );
      } catch (_) {
        continue;
      }
      let certHasTranslated = false;
      const certBlocks = [];
      const chapters = structure.chapters || [];
      for (const chapter of chapters) {
        const modules = chapter.modules || [];
        for (const mod of modules) {
          const blocks = mod.blocks || [];
          certBlocks.push(...blocks);
          addCoverage(mod.dashedName, blocks);
          const moduleHasTranslated = blocks.some(b =>
            translatedBlocks.has(b)
          );
          if (moduleHasTranslated) {
            translatedSuperBlocks.add(mod.dashedName);
            certHasTranslated = true;
          }
        }
      }
      addCoverage(superBlockKey, certBlocks);
      if (certHasTranslated) translatedSuperBlocks.add(superBlockKey);
    }
  }

  module.exports = {
    superblocks: Array.from(translatedSuperBlocks),
    blocks: Array.from(translatedBlocks),
    coverage
  };
`;

const FRENCH_TRANSLATED_SUPERBLOCKS = new Set<string>(FRENCH_DATA.superblocks);
const FRENCH_TRANSLATED_BLOCKS = new Set<string>(FRENCH_DATA.blocks);

export type FrenchFileCoverage = {
  translated: number;
  total: number;
};

export const hasFrenchIntro = (superBlock: string): boolean =>
  FRENCH_TRANSLATED_SUPERBLOCKS.has(superBlock);

export const hasFrenchBlock = (block: string): boolean =>
  FRENCH_TRANSLATED_BLOCKS.has(block);

export const getFrenchFileCoverage = (superBlock: string): FrenchFileCoverage =>
  FRENCH_DATA.coverage[superBlock] ?? { translated: 0, total: 0 };
