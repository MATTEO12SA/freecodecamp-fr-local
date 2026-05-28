#!/usr/bin/env node
// Garde anti-regression : ce fork neutralise les liens de navigation externes
// au RENDU (le layout retire href/target). Mais rien n'empeche un nouveau
// composant d'introduire un lien externe en dur. Ce script scanne client/src
// pour les attributs de navigation `href`/`to` pointant vers http(s)://, et
// echoue si une URL n'est pas dans l'allowlist baseline.
//
// Les URLs techniques (images, CDN, schema.org dans les <meta>, exemples de
// code) ne sont PAS de la navigation : elles n'utilisent pas href/to et ne
// sont donc pas detectees. L'allowlist couvre les cas legitimes restants.
//
// Usage:
//   node tools/check-external-links.js           # echoue si lien externe non-allowliste
//   node tools/check-external-links.js --update  # regenere la baseline allowlist
'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const scanDir = path.join(rootDir, 'client', 'src');
const allowlistPath = path.join(
  rootDir,
  'tools',
  'external-links-allowlist.json'
);
const isUpdate = process.argv.includes('--update');

const EXT = new Set(['.ts', '.tsx', '.js', '.jsx']);
// href/to = "http://..." | {'http://...'} | {"http://..."}
const NAV_LINK_RE = /(?:href|to)\s*=\s*\{?\s*['"`](https?:\/\/[^'"`]+)['"`]/g;

function walk(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXT.has(path.extname(entry.name))) out.push(full);
  }
}

function collectFindings() {
  const files = [];
  walk(scanDir, files);
  const findings = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    NAV_LINK_RE.lastIndex = 0;
    while ((match = NAV_LINK_RE.exec(content)) !== null) {
      findings.push({
        file: path.relative(rootDir, file).replace(/\\/g, '/'),
        url: match[1]
      });
    }
  }
  return findings;
}

function loadAllowlist() {
  try {
    const data = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
    return new Set(Array.isArray(data.urls) ? data.urls : []);
  } catch {
    return new Set();
  }
}

function main() {
  const findings = collectFindings();

  if (isUpdate) {
    const urls = [...new Set(findings.map(f => f.url))].sort();
    fs.writeFileSync(
      allowlistPath,
      JSON.stringify(
        {
          comment:
            'URLs de navigation externes connues/tolerees dans client/src. ' +
            'Regenerer avec: node tools/check-external-links.js --update',
          urls
        },
        null,
        2
      ) + '\n',
      'utf8'
    );
    console.log(`Allowlist mise a jour: ${urls.length} URL(s).`);
    process.exit(0);
  }

  const allowed = loadAllowlist();
  const violations = findings.filter(f => !allowed.has(f.url));

  console.log(`Fichiers client/src scannes pour liens de navigation externes.`);
  console.log(`Liens externes trouves : ${findings.length}`);
  console.log(
    `Allowlistes            : ${findings.length - violations.length}`
  );
  console.log(`Non allowlistes        : ${violations.length}`);

  if (violations.length > 0) {
    console.log(
      '\n--- Nouveaux liens de navigation externes (a retirer ou allowlister) ---'
    );
    for (const v of violations) {
      console.log(`  ${v.file}  -> ${v.url}`);
    }
    console.log(
      '\nLe fork ne doit pas exposer de lien de navigation externe. Retire le ' +
        'lien, ou si legitime: node tools/check-external-links.js --update'
    );
    process.exit(1);
  }

  console.log('\nOK: aucun lien de navigation externe non allowliste.');
  process.exit(0);
}

main();
