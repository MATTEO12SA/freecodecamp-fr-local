'use strict';
// Source unique pour scanner le curriculum FR : chemins, blocs traduits et
// structure des superblocks. Évite de réimplémenter la même logique dans
// translation-status.js, check-translation-drift.js et ailleurs (la
// divergence entre ces copies faisait dériver le % du dashboard, le filtre
// /catalog et le drift). Module CommonJS pur, sans dépendance.
//
// has-french-intro.ts (preval Babel) et le plugin Gatsby réutilisent ce
// module au build : 100 % n'est plus un simple comptage de fichiers.

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
// EN dans le même bloc. Ce n'est PAS la complétude française à lui seul :
// un fichier FR peut encore être de l'anglais copié, et intro.json a souvent
// une deuxième copie des titres de blocs.
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

const frenchIntroPath = path.join(
  rootDir,
  'client',
  'i18n',
  'locales',
  'french',
  'intro.json'
);
const englishIntroPath = path.join(
  rootDir,
  'client',
  'i18n',
  'locales',
  'english',
  'intro.json'
);

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function normalizeLabel(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim();
}

// Phrase courte identique EN/FR (Python, CSS, JavaScript) : pas un oubli.
// Phrase avec un espace encore identique a l'anglais : label non traduit.
function looksLikeProseLabel(text) {
  const value = normalizeLabel(text);
  return /[A-Za-zÀ-ÿ]/.test(value) && value.includes(' ');
}

function isLabelTranslated(fr, en) {
  const french = normalizeLabel(fr);
  const english = normalizeLabel(en);
  if (!english) return true;
  if (!french) return false;
  if (french !== english) return true;
  return !looksLikeProseLabel(english);
}

function addLabelPair(pairs, labelPath, fr, en) {
  const french = normalizeLabel(fr);
  const english = normalizeLabel(en);
  if (!english && !french) return;
  if (!english) return;
  pairs.push({
    path: labelPath,
    en: english,
    fr: french,
    translated: isLabelTranslated(french, english)
  });
}

function collectIntroEntryPairs(frEntry, enEntry, prefix, blockFilter, pairs) {
  if (frEntry == null && enEntry == null) return;

  const frenchIsString = typeof frEntry === 'string';
  const englishIsString = typeof enEntry === 'string';
  if (frenchIsString && englishIsString) {
    addLabelPair(pairs, prefix, frEntry, enEntry);
    return;
  }
  if (frenchIsString && enEntry && typeof enEntry === 'object') {
    addLabelPair(pairs, prefix, frEntry, enEntry.title);
    return;
  }
  if (englishIsString && frEntry && typeof frEntry === 'object') {
    addLabelPair(pairs, prefix, frEntry.title, enEntry);
    return;
  }
  if (frenchIsString || englishIsString) {
    addLabelPair(pairs, prefix, frEntry, enEntry);
    return;
  }

  const frenchEntry = frEntry && typeof frEntry === 'object' ? frEntry : {};
  const englishEntry = enEntry && typeof enEntry === 'object' ? enEntry : {};

  addLabelPair(pairs, `${prefix}.title`, frenchEntry.title, englishEntry.title);
  addLabelPair(pairs, `${prefix}.note`, frenchEntry.note, englishEntry.note);

  const frenchIntro = Array.isArray(frenchEntry.intro) ? frenchEntry.intro : [];
  const englishIntro = Array.isArray(englishEntry.intro)
    ? englishEntry.intro
    : [];
  const introLength = Math.max(frenchIntro.length, englishIntro.length);
  for (let i = 0; i < introLength; i++) {
    addLabelPair(
      pairs,
      `${prefix}.intro[${i}]`,
      frenchIntro[i],
      englishIntro[i]
    );
  }

  const frenchSummary = Array.isArray(frenchEntry.summary)
    ? frenchEntry.summary
    : [];
  const englishSummary = Array.isArray(englishEntry.summary)
    ? englishEntry.summary
    : [];
  const summaryLength = Math.max(frenchSummary.length, englishSummary.length);
  for (let i = 0; i < summaryLength; i++) {
    addLabelPair(
      pairs,
      `${prefix}.summary[${i}]`,
      frenchSummary[i],
      englishSummary[i]
    );
  }

  const frenchChapters = frenchEntry.chapters || {};
  const englishChapters = englishEntry.chapters || {};
  for (const key of new Set([
    ...Object.keys(frenchChapters),
    ...Object.keys(englishChapters)
  ])) {
    collectIntroEntryPairs(
      frenchChapters[key],
      englishChapters[key],
      `${prefix}.chapters.${key}`,
      null,
      pairs
    );
  }

  const frenchModules = frenchEntry.modules || {};
  const englishModules = englishEntry.modules || {};
  for (const key of new Set([
    ...Object.keys(frenchModules),
    ...Object.keys(englishModules)
  ])) {
    collectIntroEntryPairs(
      frenchModules[key],
      englishModules[key],
      `${prefix}.modules.${key}`,
      null,
      pairs
    );
  }

  const frenchBlocks = frenchEntry.blocks || {};
  const englishBlocks = englishEntry.blocks || {};
  for (const key of new Set([
    ...Object.keys(frenchBlocks),
    ...Object.keys(englishBlocks)
  ])) {
    if (blockFilter && !blockFilter.has(key)) continue;
    collectIntroEntryPairs(
      frenchBlocks[key],
      englishBlocks[key],
      `${prefix}.blocks.${key}`,
      null,
      pairs
    );
  }
}

function collectIntroLabelPairs(superblockKey) {
  const frenchIntro = readJson(frenchIntroPath) || {};
  const englishIntro = readJson(englishIntroPath) || {};
  const structure = readStructure(`${superblockKey}.json`);
  const blockNames = new Set(listBlocksInStructure(structure));
  const pairs = [];

  collectIntroEntryPairs(
    frenchIntro[superblockKey],
    englishIntro[superblockKey],
    superblockKey,
    null,
    pairs
  );

  const keys = new Set([
    ...Object.keys(frenchIntro),
    ...Object.keys(englishIntro)
  ]);
  for (const key of keys) {
    if (key === superblockKey) continue;
    const frenchEntry = frenchIntro[key];
    const englishEntry = englishIntro[key];
    if (
      !frenchEntry ||
      typeof frenchEntry !== 'object' ||
      !frenchEntry.blocks
    ) {
      continue;
    }
    const standaloneBlocks = Object.keys(frenchEntry.blocks);
    const overlap = standaloneBlocks.filter(block => blockNames.has(block));
    if (overlap.length === 0) continue;
    // Ne compter que les copies module (tous les blocs appartiennent à la cert).
    // Un autre cursus qui partage un nom de bloc (ex. full-stack-open) ne doit
    // pas empêcher le 100 % de RWD/JS.
    if (overlap.length !== standaloneBlocks.length) continue;
    const standaloneChapters = Object.keys(frenchEntry.chapters || {});
    if (standaloneChapters.length > 0) {
      const certChapters = new Set(
        ((structure && structure.chapters) || []).map(
          chapter => chapter.dashedName
        )
      );
      const chapterOverlap = standaloneChapters.filter(chapter =>
        certChapters.has(chapter)
      );
      if (chapterOverlap.length !== standaloneChapters.length) continue;
    }

    addLabelPair(pairs, `${key}.title`, frenchEntry.title, englishEntry?.title);
    addLabelPair(pairs, `${key}.note`, frenchEntry.note, englishEntry?.note);
    const frenchIntroLines = Array.isArray(frenchEntry.intro)
      ? frenchEntry.intro
      : [];
    const englishIntroLines = Array.isArray(englishEntry?.intro)
      ? englishEntry.intro
      : [];
    const introLength = Math.max(
      frenchIntroLines.length,
      englishIntroLines.length
    );
    for (let i = 0; i < introLength; i++) {
      addLabelPair(
        pairs,
        `${key}.intro[${i}]`,
        frenchIntroLines[i],
        englishIntroLines[i]
      );
    }
    const frenchSummary = Array.isArray(frenchEntry.summary)
      ? frenchEntry.summary
      : [];
    const englishSummary = Array.isArray(englishEntry?.summary)
      ? englishEntry.summary
      : [];
    const summaryLength = Math.max(frenchSummary.length, englishSummary.length);
    for (let i = 0; i < summaryLength; i++) {
      addLabelPair(
        pairs,
        `${key}.summary[${i}]`,
        frenchSummary[i],
        englishSummary[i]
      );
    }
    for (const block of overlap) {
      collectIntroEntryPairs(
        frenchEntry.blocks[block],
        englishEntry?.blocks?.[block],
        `${key}.blocks.${block}`,
        null,
        pairs
      );
    }
  }

  return pairs;
}

function readMdTitle(filePath) {
  if (!fs.existsSync(filePath)) return '';
  let raw = '';
  try {
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(4096);
    const bytes = fs.readSync(fd, buf, 0, 4096, 0);
    fs.closeSync(fd);
    raw = buf.slice(0, bytes).toString('utf8');
  } catch {
    return '';
  }
  const match = raw.match(/^title:\s*(.*)$/m);
  if (!match) return '';
  let value = match[1].trim();
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    value = value.slice(1, -1).replace(/''/g, "'");
  }
  return value;
}

function collectChallengeTitlePairs(blocks) {
  const pairs = [];
  for (const block of blocks) {
    const englishDir = path.join(enBlocksDir, block);
    const frenchDir = path.join(frBlocksDir, block);
    for (const file of listMdFiles(englishDir)) {
      const englishTitle = readMdTitle(path.join(englishDir, file));
      if (!englishTitle) continue;
      const frenchTitle = readMdTitle(path.join(frenchDir, file));
      addLabelPair(pairs, `${block}/${file}#title`, frenchTitle, englishTitle);
    }
  }
  return pairs;
}

function summarizePairs(pairs) {
  const leftovers = pairs.filter(pair => !pair.translated);
  return {
    translated: pairs.length - leftovers.length,
    total: pairs.length,
    leftovers
  };
}

function completenessPercent({
  filesTranslated,
  filesTotal,
  introsTranslated,
  introsTotal,
  titlesTranslated,
  titlesTotal
}) {
  if (filesTotal <= 0) return 0;
  const filesDone = filesTranslated === filesTotal;
  const introsDone = introsTotal === 0 || introsTranslated === introsTotal;
  const titlesDone = titlesTotal === 0 || titlesTranslated === titlesTotal;
  if (filesDone && introsDone && titlesDone) return 100;
  const filePct = Math.floor((100 * filesTranslated) / filesTotal);
  return Math.min(99, filePct);
}

function getSuperblockTranslationReport(superblockKey, options = {}) {
  const includeTitles = options.includeTitles !== false;
  const structure = readStructure(`${superblockKey}.json`);
  const blocks = listBlocksInStructure(structure);

  let filesTranslated = 0;
  let filesTotal = 0;
  for (const block of blocks) {
    const counts = countBlockFiles(block);
    filesTranslated += counts.translated;
    filesTotal += counts.total;
  }

  const introPairs = collectIntroLabelPairs(superblockKey);
  const intros = summarizePairs(introPairs);
  const titlePairs = includeTitles ? collectChallengeTitlePairs(blocks) : [];
  const titles = summarizePairs(titlePairs);
  const pct = completenessPercent({
    filesTranslated,
    filesTotal,
    introsTranslated: intros.translated,
    introsTotal: intros.total,
    titlesTranslated: includeTitles ? titles.translated : titles.total,
    titlesTotal: includeTitles ? titles.total : 0
  });
  const complete =
    filesTotal > 0 &&
    filesTranslated === filesTotal &&
    intros.translated === intros.total &&
    (!includeTitles || titles.translated === titles.total);

  return {
    key: superblockKey,
    filesTranslated,
    filesTotal,
    introsTranslated: intros.translated,
    introsTotal: intros.total,
    introLeftovers: intros.leftovers,
    titlesTranslated: titles.translated,
    titlesTotal: titles.total,
    titleLeftovers: titles.leftovers,
    pct,
    complete
  };
}

function copyTranslatedString(
  target,
  key,
  sourceValue,
  englishValue,
  labelPath,
  changes
) {
  if (typeof sourceValue !== 'string' || typeof englishValue !== 'string') {
    return;
  }
  const current = typeof target[key] === 'string' ? target[key] : '';
  if (isLabelTranslated(current, englishValue)) return;
  if (!isLabelTranslated(sourceValue, englishValue)) return;
  if (normalizeLabel(sourceValue) === normalizeLabel(current)) return;
  target[key] = sourceValue;
  changes.push({
    path: labelPath,
    from: current,
    to: sourceValue
  });
}

function copyTranslatedArray(
  targetArr,
  sourceArr,
  englishArr,
  pathPrefix,
  changes
) {
  if (!Array.isArray(targetArr) || !Array.isArray(sourceArr)) return;
  const english = Array.isArray(englishArr) ? englishArr : [];
  const length = Math.min(targetArr.length, sourceArr.length);
  for (let i = 0; i < length; i++) {
    if (typeof sourceArr[i] !== 'string' || typeof targetArr[i] !== 'string') {
      continue;
    }
    if (isLabelTranslated(targetArr[i], english[i] || '')) continue;
    if (!isLabelTranslated(sourceArr[i], english[i] || '')) continue;
    if (normalizeLabel(sourceArr[i]) === normalizeLabel(targetArr[i])) continue;
    changes.push({
      path: `${pathPrefix}[${i}]`,
      from: targetArr[i],
      to: sourceArr[i]
    });
    targetArr[i] = sourceArr[i];
  }
}

// Recopie le français DÉJÀ écrit dans l'arbre v9 vers les clés intro.json
// autonomes encore identiques à l'anglais. Ne traduit rien : copie seulement.
function applyIntroCopies(
  frenchIntro,
  englishIntro,
  superblockKey,
  blockNames
) {
  const changes = [];
  const blocks =
    blockNames ||
    new Set(listBlocksInStructure(readStructure(`${superblockKey}.json`)));
  const canonicalFr = frenchIntro[superblockKey];
  const canonicalEn = englishIntro[superblockKey];
  if (!canonicalFr || !canonicalFr.blocks) return { changes };

  for (const key of Object.keys(frenchIntro)) {
    if (key === superblockKey) continue;
    const entry = frenchIntro[key];
    const englishEntry = englishIntro[key];
    if (!entry || typeof entry !== 'object' || !entry.blocks) continue;
    if (
      !englishEntry ||
      typeof englishEntry !== 'object' ||
      !englishEntry.blocks
    ) {
      continue;
    }

    const standaloneBlocks = Object.keys(entry.blocks);
    const overlap = standaloneBlocks.filter(block => blocks.has(block));
    if (overlap.length === 0 || overlap.length !== standaloneBlocks.length) {
      continue;
    }

    for (const block of overlap) {
      const targetBlock = entry.blocks[block];
      const sourceBlock = canonicalFr.blocks[block];
      const englishBlock =
        englishEntry.blocks[block] || canonicalEn?.blocks?.[block];
      if (!targetBlock || !sourceBlock || !englishBlock) continue;

      copyTranslatedString(
        targetBlock,
        'title',
        sourceBlock.title,
        englishBlock.title,
        `${key}.blocks.${block}.title`,
        changes
      );
      copyTranslatedArray(
        targetBlock.intro,
        sourceBlock.intro,
        englishBlock.intro,
        `${key}.blocks.${block}.intro`,
        changes
      );
    }
  }

  return { changes };
}

module.exports = {
  rootDir,
  enBlocksDir,
  frBlocksDir,
  superblocksDir,
  frenchIntroPath,
  englishIntroPath,
  listMdFiles,
  frBlockHasContent,
  listFrBlockDirs,
  countBlockFiles,
  listSuperblockFiles,
  readStructure,
  listBlocksInStructure,
  normalizeLabel,
  looksLikeProseLabel,
  isLabelTranslated,
  collectIntroLabelPairs,
  collectChallengeTitlePairs,
  completenessPercent,
  getSuperblockTranslationReport,
  applyIntroCopies
};
