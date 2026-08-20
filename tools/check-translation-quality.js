#!/usr/bin/env node
'use strict';

// Controle qualite des traductions FR (Chantier 0).
//
// Complete `verify` (qui protege la technique) en verifiant la QUALITE de la
// traduction d'un bloc deja applique : chunks non traduits, restes anglais,
// integrite des placeholders d'assertion et des spans de code inline.
//
// Usage : node tools/check-translation-quality.js <block>
// Sortie : rapport + exit code (0 = pas d'erreur, 1 = erreur bloquante).
//
// Niveaux :
//   - ERREUR     : chunk vide, placeholders $n incoherents, fichier EN manquant,
//                  drift du nombre de chunks. -> exit 1.
//   - attention  : reste anglais probable, chunk identique a l'anglais, nombre de
//                  spans de code inline different. -> n'echoue pas (relecture).

const fs = require('fs');
const path = require('path');
const {
  parseFrontmatter,
  splitSections,
  extractProseChunks,
  extractLectureChunks,
  proseMarkersForKind,
  detectKind,
  getWorkshopPaths,
  readText,
  normalizeCopiedWhitespace
} = require('./translate-workshop');

// Marqueurs forts d'un texte reste en anglais (teste hors code inline).
// Volontairement conservateur pour limiter les faux positifs.
const ENGLISH_LEFTOVER = [
  /\byou should\b/i,
  /\bshould (?:have|be|not|use|contain|see|return|give|add|create|set|match|look)\b/i,
  /\byour\b/i,
  /\bwith (?:the|a|an|your)\b/i,
  /\b(?:and|but|with) the\b/i,
  /\bbut found\b/i,
  /\bmatching the\b/i,
  /\bthe following\b/i,
  /\bmake sure\b/i,
  /\bshould(?:n't| not)\b/i
];

function stripInlineCode(text) {
  return text.replace(/`[^`]*`/g, ' ');
}

function countPlaceholders(text) {
  return (text.match(/\$\d+/g) || []).length;
}

function countInlineCode(text) {
  return (text.match(/`[^`]*`/g) || []).length;
}

// Chunks de prose des sections traduisibles (description / hints / lecture),
// dans l'ordre — meme logique que translate-workshop pour pouvoir apparier EN/FR.
function translatableChunks(body) {
  const sections = splitSections(body);
  const proseMarkers = proseMarkersForKind(detectKind(sections));
  const chunks = [];
  for (const section of sections) {
    const isTranslatable =
      section.marker === '# --description--' ||
      section.marker === '# --hints--' ||
      proseMarkers.has(section.marker);
    if (!isTranslatable) continue;
    const normalizedContent = normalizeCopiedWhitespace(section.content);
    const extracted = proseMarkers.has(section.marker)
      ? extractLectureChunks(normalizedContent)
      : extractProseChunks(normalizedContent);
    for (const text of extracted) chunks.push({ marker: section.marker, text });
  }
  return chunks;
}

function checkFile(enPath, frPath, file, issues) {
  const en = parseFrontmatter(readText(enPath));
  const fr = parseFrontmatter(readText(frPath));

  const enChunks = translatableChunks(en.body);
  const frChunks = translatableChunks(fr.body);

  if (enChunks.length !== frChunks.length) {
    issues.push({
      level: 'error',
      msg: `${file}: nombre de chunks de prose different (EN ${enChunks.length} / FR ${frChunks.length}) — drift technique, lancer "verify".`
    });
    return; // appariement impossible
  }

  for (let i = 0; i < frChunks.length; i++) {
    const enText = enChunks[i].text;
    const frText = frChunks[i].text;
    const frProse = stripInlineCode(frText);
    const where = `${file} ${frChunks[i].marker} #${i + 1}`;

    if (!frText.trim()) {
      // EN may contain whitespace-only prose chunks (e.g. space before a
      // mis-indented ``` fence). Matching empty FR is intentional then.
      if (enText.trim()) {
        issues.push({ level: 'error', msg: `${where}: chunk FR vide.` });
      }
      continue;
    }

    // Identique a l'anglais = probablement non traduit (on ignore les chunks
    // d'un seul mot, souvent identiques de facon legitime : "CSS", "Flexbox"...).
    if (
      frText === enText &&
      /[A-Za-z]/.test(frProse) &&
      frText.trim().includes(' ')
    ) {
      issues.push({
        level: 'warn',
        msg: `${where}: identique a l'anglais (a verifier — non traduit ?).`
      });
    }

    // Restes anglais (hors code inline).
    for (const re of ENGLISH_LEFTOVER) {
      if (re.test(frProse)) {
        issues.push({
          level: 'warn',
          msg: `${where}: reste anglais probable (${re}).`
        });
        break;
      }
    }

    // Integrite des placeholders d'assertion ($1, $2...).
    if (countPlaceholders(enText) !== countPlaceholders(frText)) {
      issues.push({
        level: 'error',
        msg: `${where}: placeholders $n incoherents (EN ${countPlaceholders(
          enText
        )} / FR ${countPlaceholders(frText)}).`
      });
    }

    // Integrite des spans de code inline (`...`).
    if (countInlineCode(enText) !== countInlineCode(frText)) {
      issues.push({
        level: 'warn',
        msg: `${where}: nombre de spans de code inline different (EN ${countInlineCode(
          enText
        )} / FR ${countInlineCode(frText)}).`
      });
    }
  }
}

function checkBlock(block) {
  const { sourceDir, outputDir } = getWorkshopPaths(block);
  if (!fs.existsSync(outputDir)) {
    return {
      block,
      files: 0,
      issues: [
        {
          level: 'error',
          msg: `${block}: dossier FR introuvable (${outputDir}).`
        }
      ]
    };
  }

  const frFiles = fs
    .readdirSync(outputDir)
    .filter(f => f.endsWith('.md'))
    .sort();

  const issues = [];
  for (const file of frFiles) {
    const enPath = path.join(sourceDir, file);
    if (!fs.existsSync(enPath)) {
      issues.push({ level: 'error', msg: `${file}: pas d'equivalent EN.` });
      continue;
    }
    checkFile(enPath, path.join(outputDir, file), file, issues);
  }

  return { block, files: frFiles.length, issues };
}

function listBlocksToCheck() {
  const raw = process.argv.slice(2);
  const checkAll = raw.includes('--all');
  let superblock = null;
  const rest = [];

  for (let i = 0; i < raw.length; i++) {
    const arg = raw[i];
    if (arg === '--all') continue;
    if (arg === '--superblock') {
      superblock = raw[i + 1] || null;
      i += 1;
      continue;
    }
    if (arg.startsWith('--superblock=')) {
      superblock = arg.slice('--superblock='.length);
      continue;
    }
    if (arg.startsWith('--')) continue;
    rest.push(arg);
  }

  if (checkAll || superblock) {
    const {
      listSuperblockFiles,
      readStructure,
      listBlocksInStructure,
      frBlockHasContent
    } = require('./lib/curriculum-fr');
    const files = superblock
      ? [`${superblock.replace(/\.json$/, '')}.json`]
      : listSuperblockFiles('-v9.json');
    const blocks = [];
    for (const file of files) {
      const structure = readStructure(file);
      for (const block of listBlocksInStructure(structure)) {
        if (frBlockHasContent(block)) blocks.push(block);
      }
    }
    return [...new Set(blocks)];
  }

  return rest[0] ? [rest[0]] : [];
}

function main() {
  const blocks = listBlocksToCheck();
  if (blocks.length === 0) {
    console.error(
      'Usage: node tools/check-translation-quality.js <block>\n' +
        '       node tools/check-translation-quality.js --superblock javascript-v9'
    );
    process.exit(1);
  }

  let errorCount = 0;
  let warnCount = 0;
  let fileCount = 0;

  for (const block of blocks) {
    const result = checkBlock(block);
    fileCount += result.files;
    for (const issue of result.issues) {
      const tag = issue.level === 'error' ? 'ERREUR' : 'attention';
      console.log(`[${tag}] ${block} ${issue.msg}`);
    }
    const errors = result.issues.filter(i => i.level === 'error').length;
    const warns = result.issues.filter(i => i.level === 'warn').length;
    errorCount += errors;
    warnCount += warns;
    if (blocks.length === 1) {
      console.log(
        `\n${block}: ${result.files} fichier(s) FR — ${errors} erreur(s), ${warns} avertissement(s).`
      );
    }
  }

  if (blocks.length > 1) {
    console.log(
      `\n${blocks.length} bloc(s), ${fileCount} fichier(s) FR — ${errorCount} erreur(s), ${warnCount} avertissement(s).`
    );
  }

  process.exit(errorCount > 0 ? 1 : 0);
}

main();
