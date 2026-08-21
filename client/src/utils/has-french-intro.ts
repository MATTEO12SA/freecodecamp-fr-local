// Liste générée au build : tous les superblocks/modules qui ont au moins un
// challenge .md traduit en français, plus les certifications dont au moins un
// module est traduit. La couverture d'une cert v9 n'est 100 % que si les
// fichiers ET les labels intro.json (y compris les copies autonomes) sont FR.
declare const preval: (s: TemplateStringsArray) => {
  superblocks: string[];
  blocks: string[];
  coverage: Record<
    string,
    {
      translated: number;
      total: number;
      introTranslated: number;
      introTotal: number;
      pct: number;
      complete: boolean;
    }
  >;
};

const FRENCH_DATA = preval`
  const fs = require('fs');
  const path = require('path');
  const {
    countBlockFiles,
    frBlockHasContent,
    getSuperblockTranslationReport
  } = require(path.resolve(__dirname, '../../../tools/lib/curriculum-fr.js'));

  const frBlocksDir = path.resolve(
    __dirname,
    '../../../curriculum/i18n-curriculum/curriculum/challenges/french/blocks'
  );
  const superblocksDir = path.resolve(
    __dirname,
    '../../../curriculum/structure/superblocks'
  );

  const translatedBlocks = new Set();
  if (fs.existsSync(frBlocksDir)) {
    for (const blockName of fs.readdirSync(frBlocksDir)) {
      if (frBlockHasContent(blockName)) translatedBlocks.add(blockName);
    }
  }

  const translatedSuperBlocks = new Set();
  const coverage = {};

  function addFileCoverage(key, blockNames) {
    let translated = 0;
    let total = 0;
    for (const blockName of blockNames) {
      const count = countBlockFiles(blockName);
      translated += count.translated;
      total += count.total;
    }
    const filePct = total > 0 ? Math.floor((100 * translated) / total) : 0;
    coverage[key] = {
      translated,
      total,
      introTranslated: 0,
      introTotal: 0,
      pct:
        total > 0 && translated === total ? 99 : Math.min(99, filePct),
      complete: false
    };
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
          addFileCoverage(mod.dashedName, blocks);
          const moduleHasTranslated = blocks.some(b =>
            translatedBlocks.has(b)
          );
          if (moduleHasTranslated) {
            translatedSuperBlocks.add(mod.dashedName);
            certHasTranslated = true;
          }
        }
      }
      const report = getSuperblockTranslationReport(superBlockKey, {
        includeTitles: true
      });
      coverage[superBlockKey] = {
        translated: report.filesTranslated,
        total: report.filesTotal,
        introTranslated: report.introsTranslated,
        introTotal: report.introsTotal,
        pct: report.pct,
        complete: report.complete
      };
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
  introTranslated?: number;
  introTotal?: number;
  pct?: number;
  complete?: boolean;
};

export const hasFrenchIntro = (superBlock: string): boolean =>
  FRENCH_TRANSLATED_SUPERBLOCKS.has(superBlock);

export const hasFrenchBlock = (block: string): boolean =>
  FRENCH_TRANSLATED_BLOCKS.has(block);

export const getFrenchFileCoverage = (superBlock: string): FrenchFileCoverage =>
  FRENCH_DATA.coverage[superBlock] ?? {
    translated: 0,
    total: 0,
    introTranslated: 0,
    introTotal: 0,
    pct: 0,
    complete: false
  };
