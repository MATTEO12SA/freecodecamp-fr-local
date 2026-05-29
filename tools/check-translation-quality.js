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
  lectureProseMarkers,
  getWorkshopPaths,
  readText
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
  const chunks = [];
  for (const section of splitSections(body)) {
    const isTranslatable =
      section.marker === '# --description--' ||
      section.marker === '# --hints--' ||
      lectureProseMarkers.has(section.marker);
    if (!isTranslatable) continue;
    const extracted = lectureProseMarkers.has(section.marker)
      ? extractLectureChunks(section.content)
      : extractProseChunks(section.content);
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
    const where = `${file} ${frChunks[i].marker} #${i + 1}`;

    if (!frText.trim()) {
      issues.push({ level: 'error', msg: `${where}: chunk FR vide.` });
      continue;
    }

    // Identique a l'anglais = probablement non traduit (on ignore les chunks
    // d'un seul mot, souvent identiques de facon legitime : "CSS", "Flexbox"...).
    if (
      frText === enText &&
      /[A-Za-z]/.test(frText) &&
      frText.trim().includes(' ')
    ) {
      issues.push({
        level: 'warn',
        msg: `${where}: identique a l'anglais (a verifier — non traduit ?).`
      });
    }

    // Restes anglais (hors code inline).
    const prose = stripInlineCode(frText);
    for (const re of ENGLISH_LEFTOVER) {
      if (re.test(prose)) {
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

function main() {
  const [block] = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
  if (!block) {
    console.error('Usage: node tools/check-translation-quality.js <block>');
    process.exit(1);
  }

  const { sourceDir, outputDir } = getWorkshopPaths(block);
  if (!fs.existsSync(outputDir)) {
    console.error(`Dossier FR introuvable: ${outputDir}`);
    process.exit(1);
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

  for (const issue of issues) {
    const tag = issue.level === 'error' ? 'ERREUR' : 'attention';
    console.log(`[${tag}] ${issue.msg}`);
  }

  const errors = issues.filter(i => i.level === 'error').length;
  const warns = issues.filter(i => i.level === 'warn').length;
  console.log(
    `\n${block}: ${frFiles.length} fichier(s) FR — ${errors} erreur(s), ${warns} avertissement(s).`
  );

  process.exit(errors > 0 ? 1 : 0);
}

main();
