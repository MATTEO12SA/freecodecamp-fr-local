#!/usr/bin/env node
'use strict';

const { spawnSync } = require('child_process');
const path = require('path');
const { buildReport, writeReport } = require('./local-dev-report');

const rootDir = path.resolve(__dirname, '..');
const isFull = process.argv.includes('--full');

function runStep(name, command, args) {
  const startedAt = Date.now();
  const commandLine = [command, ...args].join(' ');
  const result =
    process.platform === 'win32'
      ? spawnSync(commandLine, {
          cwd: rootDir,
          encoding: 'utf8',
          shell: true,
          stdio: ['ignore', 'pipe', 'pipe']
        })
      : spawnSync(command, args, {
          cwd: rootDir,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe']
        });
  const output = `${result.stdout || ''}${result.stderr || ''}${
    result.error ? result.error.message : ''
  }`.trim();
  const ok = result.status === 0;
  const durationMs = Date.now() - startedAt;
  return {
    name,
    ok,
    durationMs,
    command: commandLine,
    output
  };
}

function printStep(step) {
  const status = step.ok ? 'OK' : 'FAIL';
  console.log(`${status.padEnd(5)} ${step.name} (${step.durationMs}ms)`);
  if (!step.ok && step.output) {
    console.log(step.output.split('\n').slice(-30).join('\n'));
  }
}

async function main() {
  const report = await buildReport();
  writeReport(report);

  const steps = [
    {
      name: 'HTTP local',
      ok: report.server.http.ok,
      durationMs: 0,
      command: report.server.url,
      output: report.server.http.error || ''
    },
    runStep('translation status', 'node', ['tools/translation-status.js']),
    runStep('translation drift', 'node', ['tools/check-translation-drift.js']),
    runStep('catalog tests', 'pnpm', ['-C', 'client', 'test', 'catalog']),
    runStep('javascript-v9 challenge lint', 'pnpm', [
      '-C',
      'curriculum',
      'lint-challenges',
      '--superblock',
      'javascript-v9'
    ])
  ];

  if (isFull) {
    steps.push(runStep('client lint', 'pnpm', ['-C', 'client', 'lint']));
    steps.push(runStep('root lint', 'pnpm', ['lint-root']));
    if (report.server.http.ok) {
      for (const script of [
        'smoke-test.mjs',
        'submit-test.mjs',
        'persist-test.mjs',
        'full-flow-test.mjs'
      ]) {
        steps.push(runStep(script, 'node', [script]));
      }
    }
  }

  for (const step of steps) printStep(step);

  const failed = steps.filter(step => !step.ok);
  console.log('');
  if (failed.length > 0) {
    console.log(`BLOCKED: ${failed.length} verification(s) en erreur.`);
    process.exit(1);
  }

  console.log('READY: toutes les verifications locales sont vertes.');
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
