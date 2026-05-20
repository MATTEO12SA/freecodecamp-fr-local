// Liste générée au build : tous les superblocks/modules qui ont au moins un
// challenge .md traduit en français, plus les certifications dont au moins un
// module est traduit. Évite les faux positifs (titre traduit dans intro.json
// mais aucun challenge traduit) et la maintenance manuelle.
declare const preval: (s: TemplateStringsArray) => string[];

const FRENCH_TRANSLATED_SUPERBLOCKS = new Set<string>(preval`
  const fs = require('fs');
  const path = require('path');

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
      const blockPath = path.join(frBlocksDir, blockName);
      try {
        if (!fs.statSync(blockPath).isDirectory()) continue;
      } catch (_) {
        continue;
      }
      const hasMd = fs
        .readdirSync(blockPath)
        .some(file => file.endsWith('.md'));
      if (hasMd) translatedBlocks.add(blockName);
    }
  }

  const translatedSuperBlocks = new Set();
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
      const chapters = structure.chapters || [];
      for (const chapter of chapters) {
        const modules = chapter.modules || [];
        for (const mod of modules) {
          const blocks = mod.blocks || [];
          const moduleHasTranslated = blocks.some(b =>
            translatedBlocks.has(b)
          );
          if (moduleHasTranslated) {
            translatedSuperBlocks.add(mod.dashedName);
            certHasTranslated = true;
          }
        }
      }
      if (certHasTranslated) translatedSuperBlocks.add(superBlockKey);
    }
  }

  module.exports = Array.from(translatedSuperBlocks);
`);

export const hasFrenchIntro = (superBlock: string): boolean =>
  FRENCH_TRANSLATED_SUPERBLOCKS.has(superBlock);
