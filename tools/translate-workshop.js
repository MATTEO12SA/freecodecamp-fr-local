#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const englishBlocksDir = path.join(
  rootDir,
  'curriculum',
  'challenges',
  'english',
  'blocks'
);
const frenchBlocksDir = path.join(
  rootDir,
  'curriculum',
  'i18n-curriculum',
  'curriculum',
  'challenges',
  'french',
  'blocks'
);
const translationsDir = path.join(rootDir, 'tools', 'translations');

const markerPattern = /^#{1,6}\s+--[a-z0-9-]+--\s*$/;
const codeFencePattern = /```[\s\S]*?```/g;
const proseChunkPattern = /[^\S\n]*[^\n]+(?:\n[^\S\n]*[^\n]+)*/g;
const lectureProseMarkers = new Set([
  '# --description--',
  '# --interactive--',
  '## --text--',
  '## --answers--',
  '### --feedback--'
]);

function usage() {
  console.error(
    'Usage: node tools/translate-workshop.js <extract|apply|verify> <workshop>'
  );
  process.exit(1);
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

function normalizeCopiedWhitespace(text) {
  return text
    .split('\n')
    .map(line =>
      line
        .replace(/^[ \t]+/, indent => indent.replace(/ +(?=\t)/g, ''))
        .replace(/[ \t]+$/g, '')
    )
    .join('\n')
    .replace(/\n+$/u, '\n');
}

function writeText(filePath, text, options = {}) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    options.cleanWhitespace ? normalizeCopiedWhitespace(text) : text,
    'utf8'
  );
}

function getWorkshopPaths(workshop) {
  const sourceDir = path.join(englishBlocksDir, workshop);
  const outputDir = path.join(frenchBlocksDir, workshop);
  const translationPath = path.join(translationsDir, `${workshop}.json`);

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Workshop EN introuvable: ${sourceDir}`);
  }

  return { sourceDir, outputDir, translationPath };
}

function readPhrasebook() {
  const phrasebookPath = path.join(translationsDir, 'phrasebook.json');
  if (!fs.existsSync(phrasebookPath)) return [];

  const raw = JSON.parse(readText(phrasebookPath));
  return raw.map(entry => ({
    en: new RegExp(entry.en),
    fr: entry.fr
  }));
}

function applyPhrasebook(text, phrasebook) {
  for (const entry of phrasebook) {
    if (entry.en.test(text)) {
      entry.en.lastIndex = 0;
      return text.replace(entry.en, entry.fr);
    }
  }
  return '';
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error('Frontmatter YAML introuvable.');
  }

  const frontmatter = match[0];
  const body = raw.slice(frontmatter.length);
  const metadata = {};

  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
    if (kv) metadata[kv[1]] = kv[2];
  }

  return { frontmatter, metadata, body };
}

function splitSections(body) {
  const lines = body.split('\n');
  const sections = [];
  let index = 0;

  while (index < lines.length) {
    if (!markerPattern.test(lines[index])) {
      const start = index;
      while (index < lines.length && !markerPattern.test(lines[index])) index++;
      sections.push({
        marker: null,
        content: lines.slice(start, index).join('\n')
      });
      continue;
    }

    const marker = lines[index];
    index++;
    const start = index;
    while (index < lines.length && !markerPattern.test(lines[index])) index++;
    sections.push({
      marker,
      content: lines.slice(start, index).join('\n')
    });
  }

  return sections;
}

function reassemble(frontmatter, sections) {
  return (
    frontmatter.replace(/\n?$/, '\n') +
    sections
      .map(section =>
        section.marker === null
          ? section.content
          : `${section.marker}\n${section.content}`
      )
      .join('\n')
  );
}

function getSection(sections, marker) {
  return sections.find(section => section.marker === marker);
}

function splitAroundCodeFences(text) {
  const parts = [];
  let cursor = 0;
  let match;
  codeFencePattern.lastIndex = 0;

  while ((match = codeFencePattern.exec(text))) {
    if (match.index > cursor) {
      parts.push({ type: 'prose', value: text.slice(cursor, match.index) });
    }
    parts.push({ type: 'code', value: match[0] });
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    parts.push({ type: 'prose', value: text.slice(cursor) });
  }

  return parts;
}

function extractProseChunks(text) {
  return extractChunks(text, () => true);
}

function isLectureChunkTranslatable(text) {
  const value = text.trim();
  if (!value || value === '---') return false;
  if (/^`[^`]+`$/.test(value)) return false;
  return /[A-Za-zÀ-ÿ]/.test(value);
}

function extractLectureChunks(text) {
  return extractChunks(text, isLectureChunkTranslatable);
}

function extractChunks(text, shouldInclude) {
  const chunks = [];
  for (const part of splitAroundCodeFences(text)) {
    if (part.type !== 'prose') continue;

    let match;
    proseChunkPattern.lastIndex = 0;
    while ((match = proseChunkPattern.exec(part.value))) {
      const value = match[0].trim();
      if (shouldInclude(value)) chunks.push(value);
    }
  }
  return chunks;
}

function replaceProseChunks(text, translations) {
  return replaceChunks(text, translations, () => true, 'hint');
}

function replaceLectureChunks(text, translations) {
  return replaceChunks(
    text,
    translations,
    isLectureChunkTranslatable,
    'lecture'
  );
}

function replaceChunks(text, translations, shouldReplace, label) {
  const parts = splitAroundCodeFences(text);
  let index = 0;

  const output = parts.map(part => {
    if (part.type === 'code') return part.value;

    return part.value.replace(proseChunkPattern, match => {
      const original = match.trim();
      if (!original) return match;
      if (!shouldReplace(original)) return match;

      const translated = translations[index++];
      if (!translated) {
        throw new Error(`Traduction ${label} manquante pour: ${original}`);
      }

      const leading = match.match(/^\s*/)[0];
      const trailing = match.match(/\n*$/)[0];
      return `${leading}${translated}${trailing}`;
    });
  });

  if (index !== translations.length) {
    throw new Error(
      `Nombre de traductions ${label} incoherent: ${index} utilisees, ${translations.length} fournies.`
    );
  }

  return output.join('');
}

function detectKind(sections) {
  if (
    sections.some(section =>
      ['# --interactive--', '# --questions--'].includes(section.marker)
    )
  ) {
    return 'lecture';
  }
  return 'workshop';
}

function sortByStep(files) {
  return files.sort((a, b) => {
    const aRaw = readText(a);
    const bRaw = readText(b);
    const aStep = Number(
      parseFrontmatter(aRaw).metadata.dashedName?.split('-')[1]
    );
    const bStep = Number(
      parseFrontmatter(bRaw).metadata.dashedName?.split('-')[1]
    );
    return aStep - bStep || path.basename(a).localeCompare(path.basename(b));
  });
}

function defaultTitleFr(title, dashedName) {
  const titleStep = title.match(/^Step (\d+)$/);
  const dashedStep = dashedName?.match(/^step-(\d+)$/);
  if (titleStep && dashedStep && titleStep[1] === dashedStep[1]) {
    return `Étape ${titleStep[1]}`;
  }
  return '';
}

function yamlScalar(value) {
  if (/[:#{}[\],&*?|\-<>=!%@`]/.test(value)) {
    return `'${value.replace(/'/g, "''")}'`;
  }
  return value;
}

function setFrontmatterTitle(frontmatter, title) {
  if (!/^title:/m.test(frontmatter)) {
    throw new Error('title: introuvable dans le frontmatter.');
  }
  return frontmatter.replace(/^title:\s*.*$/m, `title: ${yamlScalar(title)}`);
}

function loadTranslations(translationPath) {
  if (!fs.existsSync(translationPath)) {
    throw new Error(`Fichier de traduction introuvable: ${translationPath}`);
  }
  return JSON.parse(readText(translationPath));
}

function validateTranslationFile(data, workshop) {
  if (data.workshop !== workshop) {
    throw new Error(
      `Workshop JSON incoherent: attendu ${workshop}, recu ${data.workshop}`
    );
  }
  if (data.reviewed !== true) {
    throw new Error(
      `Le fichier ${workshop}.json doit etre relu puis marque "reviewed": true avant apply.`
    );
  }
  if (!Array.isArray(data.files)) {
    throw new Error('Le champ files doit etre un tableau.');
  }
}

function extract(workshop, options = {}) {
  const { sourceDir, translationPath } = getWorkshopPaths(workshop);
  // Par defaut AUCUNE phrase predefinie : Claude redige chaque champ `fr`.
  // Le phrasebook ne sert qu'en option explicite (`--phrasebook`).
  const phrasebook = options.usePhrasebook ? readPhrasebook() : [];
  const sourceFiles = sortByStep(
    fs
      .readdirSync(sourceDir)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(sourceDir, file))
  );

  const firstFile = sourceFiles[0] ? readText(sourceFiles[0]) : '';
  const kind = firstFile
    ? detectKind(splitSections(parseFrontmatter(firstFile).body))
    : 'workshop';

  const files = sourceFiles.map(filePath => {
    const raw = readText(filePath);
    const { metadata, body } = parseFrontmatter(raw);
    const sections = splitSections(body);
    const title = metadata.title ?? '';

    if (kind === 'lecture') {
      return {
        file: path.basename(filePath),
        id: metadata.id,
        dashedName: metadata.dashedName,
        title: {
          en: title,
          fr: ''
        },
        sections: sections
          .map((section, index) => ({
            index,
            marker: section.marker,
            chunks: lectureProseMarkers.has(section.marker)
              ? extractLectureChunks(section.content).map(text => ({
                  en: text,
                  fr: ''
                }))
              : []
          }))
          .filter(section => section.chunks.length > 0)
      };
    }

    const description = getSection(sections, '# --description--');
    const hints = getSection(sections, '# --hints--');
    const descriptionTexts = description
      ? extractProseChunks(description.content)
      : [];
    const hintTexts = hints ? extractProseChunks(hints.content) : [];

    return {
      file: path.basename(filePath),
      id: metadata.id,
      dashedName: metadata.dashedName,
      title: {
        en: title,
        fr: defaultTitleFr(title, metadata.dashedName)
      },
      description: descriptionTexts.map(text => ({
        en: text,
        fr: applyPhrasebook(text, phrasebook)
      })),
      hints: hintTexts.map(text => ({
        en: text,
        fr: applyPhrasebook(text, phrasebook)
      }))
    };
  });

  const output = {
    workshop,
    kind,
    reviewed: false,
    note:
      kind === 'lecture'
        ? 'Mode lecture: Claude traduit title.fr et chaque chunk.fr. Code, marqueurs, solutions video et frontmatter technique restent copies depuis EN. Reference de style: tools/translations/lexique-fr.md.'
        : 'Claude traduit chaque champ fr (aucune phrase predefinie par defaut). Reference de style: tools/translations/lexique-fr.md. Passer reviewed a true seulement apres relecture + check-translation-quality.',
    files
  };

  writeText(translationPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Extracted ${files.length} files to ${translationPath}`);
}

function ensureAllTranslationsPresent(fileData) {
  if (!fileData.title?.fr?.trim()) {
    throw new Error(`Titre FR manquant: ${fileData.file}`);
  }
  for (const [index, description] of (fileData.description ?? []).entries()) {
    if (!description.fr?.trim()) {
      throw new Error(
        `Description FR manquante: ${fileData.file} #${index + 1}`
      );
    }
  }
  for (const [index, hint] of (fileData.hints ?? []).entries()) {
    if (!hint.fr?.trim()) {
      throw new Error(`Hint FR manquant: ${fileData.file} #${index + 1}`);
    }
  }
}

function ensureLectureTranslationsPresent(fileData) {
  if (!fileData.title?.fr?.trim()) {
    throw new Error(`Titre FR manquant: ${fileData.file}`);
  }
  for (const section of fileData.sections ?? []) {
    for (const [index, chunk] of (section.chunks ?? []).entries()) {
      if (!chunk.fr?.trim()) {
        throw new Error(
          `Traduction FR manquante: ${fileData.file} ${section.marker} #${
            index + 1
          }`
        );
      }
    }
  }
}

function apply(workshop) {
  const { sourceDir, outputDir, translationPath } = getWorkshopPaths(workshop);
  const data = loadTranslations(translationPath);
  validateTranslationFile(data, workshop);

  const byFile = new Map(data.files.map(file => [file.file, file]));

  const kind = data.kind || 'workshop';

  for (const fileData of data.files) {
    if (kind === 'lecture') {
      ensureLectureTranslationsPresent(fileData);

      const sourcePath = path.join(sourceDir, fileData.file);
      const raw = readText(sourcePath);
      const parsed = parseFrontmatter(raw);
      const sections = splitSections(parsed.body);

      for (const sectionData of fileData.sections ?? []) {
        const section = sections[sectionData.index];
        if (!section || section.marker !== sectionData.marker) {
          throw new Error(
            `${fileData.file}: section ${sectionData.marker} introuvable a l'index ${sectionData.index}.`
          );
        }
        section.content = replaceLectureChunks(
          section.content,
          sectionData.chunks.map(chunk => chunk.fr.trim())
        );
      }

      const frontmatter = setFrontmatterTitle(
        parsed.frontmatter,
        fileData.title.fr.trim()
      );
      const output = reassemble(frontmatter, sections);
      writeText(path.join(outputDir, fileData.file), output, {
        cleanWhitespace: true
      });
      continue;
    }

    ensureAllTranslationsPresent(fileData);

    const sourcePath = path.join(sourceDir, fileData.file);
    const raw = readText(sourcePath);
    const parsed = parseFrontmatter(raw);
    const sections = splitSections(parsed.body);

    const description = getSection(sections, '# --description--');
    if (description) {
      description.content = replaceProseChunks(
        description.content,
        fileData.description.map(part => part.fr.trim())
      );
    }

    const hints = getSection(sections, '# --hints--');
    if (hints) {
      hints.content = replaceProseChunks(
        hints.content,
        fileData.hints.map(hint => hint.fr.trim())
      );
    }

    const frontmatter = setFrontmatterTitle(
      parsed.frontmatter,
      fileData.title.fr.trim()
    );
    const output = reassemble(frontmatter, sections);
    writeText(path.join(outputDir, fileData.file), output, {
      cleanWhitespace: true
    });
  }

  const sourceCount = fs
    .readdirSync(sourceDir)
    .filter(file => file.endsWith('.md')).length;
  if (byFile.size !== sourceCount) {
    throw new Error(
      `Le JSON contient ${byFile.size} fichiers, mais le workshop EN en contient ${sourceCount}.`
    );
  }

  console.log(`Applied ${data.files.length} files to ${outputDir}`);
}

function parseComparable(filePath) {
  const raw = readText(filePath);
  const parsed = parseFrontmatter(raw);
  return {
    raw,
    ...parsed,
    sections: splitSections(parsed.body)
  };
}

function codeBlocks(text) {
  return [...text.matchAll(codeFencePattern)].map(match => match[0]);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message);
  }
}

function verifyFrontmatter(en, fr, file) {
  for (const [key, value] of Object.entries(en.metadata)) {
    if (key === 'title') continue;
    assertEqual(
      fr.metadata[key],
      value,
      `${file}: frontmatter technique modifie (${key}).`
    );
  }
}

function verifySections(enSections, frSections, file) {
  assertEqual(
    frSections.length,
    enSections.length,
    `${file}: nombre de sections modifie.`
  );

  for (let index = 0; index < enSections.length; index++) {
    const en = enSections[index];
    const fr = frSections[index];
    assertEqual(fr.marker, en.marker, `${file}: ordre des sections modifie.`);

    const isTranslatableSection =
      en.marker === '# --description--' ||
      en.marker === '# --hints--' ||
      lectureProseMarkers.has(en.marker);

    if (isTranslatableSection) {
      const enCode = codeBlocks(en.content);
      const frCode = codeBlocks(fr.content);
      assertEqual(
        frCode.length,
        enCode.length,
        `${file}: nombre de blocs de code dans ${en.marker} modifie.`
      );
      for (let codeIndex = 0; codeIndex < enCode.length; codeIndex++) {
        assertEqual(
          normalizeCopiedWhitespace(frCode[codeIndex]),
          normalizeCopiedWhitespace(enCode[codeIndex]),
          `${file}: bloc de code ${en.marker} #${codeIndex + 1} modifie.`
        );
      }
      assertEqual(
        (lectureProseMarkers.has(en.marker)
          ? extractLectureChunks(fr.content)
          : extractProseChunks(fr.content)
        ).length,
        (lectureProseMarkers.has(en.marker)
          ? extractLectureChunks(en.content)
          : extractProseChunks(en.content)
        ).length,
        `${file}: nombre de blocs de prose dans ${en.marker} modifie.`
      );
      continue;
    }

    assertEqual(
      normalizeCopiedWhitespace(fr.content),
      normalizeCopiedWhitespace(en.content),
      `${file}: section technique ${en.marker ?? '<prelude>'} modifiee.`
    );
  }
}

function verify(workshop) {
  const { sourceDir, outputDir } = getWorkshopPaths(workshop);
  if (!fs.existsSync(outputDir)) {
    throw new Error(`Dossier FR introuvable: ${outputDir}`);
  }

  const sourceFiles = fs
    .readdirSync(sourceDir)
    .filter(file => file.endsWith('.md'))
    .sort();
  const outputFiles = fs
    .readdirSync(outputDir)
    .filter(file => file.endsWith('.md'))
    .sort();

  assertEqual(
    outputFiles.join('\n'),
    sourceFiles.join('\n'),
    `${workshop}: liste de fichiers FR differente de EN.`
  );

  for (const file of sourceFiles) {
    const en = parseComparable(path.join(sourceDir, file));
    const fr = parseComparable(path.join(outputDir, file));
    verifyFrontmatter(en, fr, file);
    verifySections(en.sections, fr.sections, file);
  }

  console.log(`Verified ${sourceFiles.length} files for ${workshop}`);
}

function main() {
  const args = process.argv.slice(2);
  const usePhrasebook = args.includes('--phrasebook');
  const [command, workshop] = args.filter(arg => !arg.startsWith('--'));
  if (!command || !workshop) usage();

  if (command === 'extract') return extract(workshop, { usePhrasebook });
  if (command === 'apply') return apply(workshop);
  if (command === 'verify') return verify(workshop);
  usage();
}

// Helpers reutilises par tools/check-translation-quality.js. Le pipeline ne
// s'execute en CLI que lorsqu'il est lance directement (pas a l'import).
module.exports = {
  parseFrontmatter,
  splitSections,
  splitAroundCodeFences,
  extractProseChunks,
  extractLectureChunks,
  isLectureChunkTranslatable,
  lectureProseMarkers,
  getSection,
  getWorkshopPaths,
  readText
};

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
