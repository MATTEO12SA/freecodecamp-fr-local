#!/usr/bin/env node
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  superblocksDir,
  enBlocksDir,
  frBlocksDir,
  listMdFiles,
  frBlockHasContent,
  countBlockFiles,
  listFrBlockDirs,
  listSuperblockFiles,
  readStructure,
  listBlocksInStructure
} = require('./lib/curriculum-fr');

const rootDir = path.resolve(__dirname, '..');
const statusFile = path.join(rootDir, 'dev-logs', 'status.json');
const latestLogFile = path.join(rootDir, 'dev-logs', 'latest.log');
const reportPath = path.join(
  rootDir,
  'client',
  'static',
  'local-dev',
  'report.json'
);

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function readTail(filePath, limit = 60) {
  try {
    return fs
      .readFileSync(filePath, 'utf8')
      .replace(/\r\n/g, '\n')
      .split('\n')
      .filter(Boolean)
      .slice(-limit);
  } catch {
    return [];
  }
}

function execGit(args) {
  try {
    return execFileSync('git', args, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return '';
  }
}

function normalizeGitPath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function getTranslationStatus() {
  if (!fs.existsSync(superblocksDir)) return [];

  return listSuperblockFiles('-v9.json')
    .sort()
    .map(file => {
      const key = file.replace(/\.json$/, '');
      const structure = readStructure(file);
      const blocks = structure ? listBlocksInStructure(structure) : [];
      // Niveau bloc (presence) — conserve pour la compat du schema /dev-fr.
      const translated = blocks.filter(frBlockHasContent).length;
      const total = blocks.length;
      const pct = total > 0 ? Math.round((translated / total) * 100) : 0;
      // Niveau fichier (vraie completude) — champs additifs.
      let translatedFiles = 0;
      let totalFiles = 0;
      for (const block of blocks) {
        const counts = countBlockFiles(block);
        translatedFiles += counts.translated;
        totalFiles += counts.total;
      }
      const pctFiles =
        totalFiles > 0 ? Math.round((translatedFiles / totalFiles) * 100) : 0;
      return {
        key,
        translated,
        total,
        pct,
        translatedFiles,
        totalFiles,
        pctFiles
      };
    })
    .sort((a, b) => b.pctFiles - a.pctFiles || a.key.localeCompare(b.key));
}

function getLastCommitMap(paths) {
  const map = new Map();
  const output = execGit([
    'log',
    '--format=@@%cI',
    '--name-only',
    '--',
    ...paths
  ]);
  let currentTime = null;

  for (const line of output.split('\n')) {
    if (!line) continue;
    if (line.startsWith('@@')) {
      currentTime = new Date(line.slice(2)).getTime();
      continue;
    }
    const normalized = normalizeGitPath(line);
    if (currentTime !== null && !map.has(normalized)) {
      map.set(normalized, currentTime);
    }
  }

  return map;
}

// Date de reference d'un fichier : dernier commit git, sinon mtime disque.
function fileTimestamp(lastCommitMap, filePath) {
  const fromGit = lastCommitMap.get(
    normalizeGitPath(path.relative(rootDir, filePath))
  );
  if (typeof fromGit === 'number') return fromGit;
  try {
    return fs.statSync(filePath).mtimeMs;
  } catch {
    return null;
  }
}

function getTranslationDrift(limit = 30) {
  if (!fs.existsSync(frBlocksDir)) {
    return { blocks: 0, comparedFiles: 0, missingEnglish: 0, drifted: [] };
  }

  const blocks = listFrBlockDirs().sort();
  const drifted = [];
  let comparedFiles = 0;
  let missingEnglish = 0;
  const lastCommitMap = getLastCommitMap([
    'curriculum/challenges/english/blocks',
    'curriculum/i18n-curriculum/curriculum/challenges/french/blocks'
  ]);

  for (const block of blocks) {
    const frDir = path.join(frBlocksDir, block);
    const enDir = path.join(enBlocksDir, block);

    for (const file of listMdFiles(frDir)) {
      const frPath = path.join(frDir, file);
      const enPath = path.join(enDir, file);
      if (!fs.existsSync(enPath)) {
        missingEnglish++;
        continue;
      }

      comparedFiles++;
      const enTime = fileTimestamp(lastCommitMap, enPath);
      const frTime = fileTimestamp(lastCommitMap, frPath);
      if (enTime !== null && frTime !== null && enTime > frTime) {
        drifted.push({
          block,
          file,
          enDate: new Date(enTime).toISOString(),
          frDate: new Date(frTime).toISOString()
        });
      }
    }
  }

  return {
    blocks: blocks.length,
    comparedFiles,
    missingEnglish,
    drifted: drifted.slice(0, limit),
    totalDrifted: drifted.length
  };
}

function checkHttp(url) {
  return new Promise(resolve => {
    const req = http.request(url, { method: 'HEAD', timeout: 5000 }, res => {
      res.resume();
      resolve({ ok: res.statusCode > 0, statusCode: res.statusCode });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, statusCode: 0, error: 'timeout' });
    });
    req.on('error', error => {
      resolve({ ok: false, statusCode: 0, error: error.message });
    });
    req.end();
  });
}

function getGitStatus() {
  const short = execGit(['status', '--short']).split('\n').filter(Boolean);
  return {
    branch: execGit(['branch', '--show-current']),
    lastCommit: execGit(['log', '-1', '--oneline']),
    dirty: short.length > 0,
    changedFiles: short
  };
}

async function buildReport() {
  const status = readJson(statusFile);
  const url = status?.url || 'http://localhost:8000';
  const httpCheck = await checkHttp(url);
  const translations = getTranslationStatus();
  const drift = getTranslationDrift();

  return {
    generatedAt: new Date().toISOString(),
    server: {
      url,
      reportedStatus: status?.status || 'UNKNOWN',
      message: status?.message || '',
      mode: status?.mode || '',
      runId: status?.runId || '',
      startedAt: status?.startedAt || '',
      updatedAt: status?.updatedAt || '',
      http: httpCheck,
      verdict: httpCheck.ok ? 'UP' : status?.status || 'DOWN'
    },
    translations,
    drift,
    git: getGitStatus(),
    latestLog: readTail(latestLogFile)
  };
}

function writeReport(report) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

async function main() {
  const shouldWrite = process.argv.includes('--write');
  const report = await buildReport();
  if (shouldWrite) {
    writeReport(report);
    console.log(`Wrote ${path.relative(rootDir, reportPath)}`);
  } else {
    console.log(JSON.stringify(report, null, 2));
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  buildReport,
  writeReport,
  reportPath
};
