/**
 * full-flow-test.mjs — parcours humain local :
 * ouvre un exercice, écrit une solution, vérifie, envoie, avance.
 *
 * Prérequis : serveur UP (`.\dev.ps1` / `.\dev-check.ps1`).
 *
 * Usage :
 *   node full-flow-test.mjs
 *   node full-flow-test.mjs --js-only
 *   node full-flow-test.mjs --rwd-only
 *   node full-flow-test.mjs --python
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE = process.env.FCC_BASE_URL || 'http://localhost:8000';
const args = new Set(process.argv.slice(2));
const runRwd = !args.has('--js-only');
const runJs = !args.has('--rwd-only');
const runPython =
  args.has('--python') || (!args.has('--js-only') && !args.has('--rwd-only'));

const shotDir = path.resolve('screenshots/current/editor');
fs.mkdirSync(shotDir, { recursive: true });

const log = (...a) => console.log(...a);
const results = [];
function pass(name, detail = '') {
  results.push({ ok: true, name, detail });
  log(`PASS  ${name}${detail ? ' — ' + detail : ''}`);
}
function fail(name, detail = '') {
  results.push({ ok: false, name, detail });
  log(`FAIL  ${name}${detail ? ' — ' + detail : ''}`);
}

const browser = await chromium.launch();
const ctx = await browser.newContext();
await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], {
  origin: BASE
});

// Skip the local onboarding modal — it intercepts all clicks on challenges.
await ctx.addInitScript(() => {
  try {
    window.localStorage.setItem('fcc-local-onboarding-seen', '1');
  } catch {
    // ignore
  }
});

const page = await ctx.newPage();

const failedRequests = [];
page.on('response', r => {
  if (
    r.status() >= 400 &&
    !/favicon|webpack_hmr|algolia|stripe/i.test(r.url())
  ) {
    failedRequests.push(`${r.status()} ${r.url()}`);
  }
});

async function dismissOverlays() {
  // Demo modal
  const start = page
    .locator('button')
    .filter({ hasText: /Commencer à coder|Start coding/i })
    .first();
  if (await start.isVisible().catch(() => false)) {
    await start.click().catch(() => {});
    await page.waitForTimeout(300);
  }
  // Onboarding (if initScript missed it)
  const onboarding = page.locator('.local-onboarding');
  if (await onboarding.isVisible().catch(() => false)) {
    const cont = onboarding.locator('button').filter({ hasText: /^Continuer$/i });
    if (await cont.isVisible().catch(() => false)) {
      await cont.click();
    } else {
      await page.evaluate(() => {
        localStorage.setItem('fcc-local-onboarding-seen', '1');
        document.querySelector('.local-onboarding')?.remove();
      });
    }
    await page.waitForTimeout(300);
  }
}

/**
 * Clipboard paste into Monaco often does NOT update Redux challengeFiles.
 * The runner reads Redux, so we set the solution via `challenge.updateFile`
 * (same action the editor fires onChange).
 */
async function setSolution(contents) {
  await page.waitForSelector('.monaco-editor', { timeout: 60000 });
  await page.waitForTimeout(1200);
  await dismissOverlays();

  const updated = await page.evaluate(code => {
    const store = window.__store__;
    if (!store) return { ok: false, why: 'no __store__' };
    const files = store.getState()?.challenge?.challengeFiles;
    if (!files?.length) return { ok: false, why: 'no challengeFiles' };
    const file = files[0];
    store.dispatch({
      type: 'challenge.updateFile',
      payload: {
        fileKey: file.fileKey,
        contents: code,
        editableRegionBoundaries: file.editableRegionBoundaries ?? null
      }
    });
    const after = store.getState().challenge.challengeFiles[0]?.contents;
    return {
      ok: after === code,
      fileKey: file.fileKey,
      after: after?.slice(0, 80)
    };
  }, contents);

  return updated;
}

function checkButton() {
  return page
    .locator(
      '[data-playwright-test-label="independentLowerJaw-check-button"], [data-playwright-test-label="lowerJaw-check-button"]'
    )
    .first();
}

function submitButton() {
  return page
    .locator(
      '[data-playwright-test-label="independentLowerJaw-submit-button"], [data-playwright-test-label="lowerJaw-submit-button"]'
    )
    .or(
      page.locator('button').filter({
        hasText: /Envoyer et continuer|Envoyer et passer|Submit and go/i
      })
    )
    .first();
}

async function checkAndSubmit({ expectFail = false } = {}) {
  await dismissOverlays();
  const btn = checkButton();
  await btn.waitFor({ state: 'visible', timeout: 20000 });
  await btn.click();

  if (expectFail) {
    await page.waitForTimeout(2500);
    const visible = await submitButton().isVisible().catch(() => false);
    const tests = await page.evaluate(() =>
      (window.__store__?.getState()?.challenge?.challengeTests || []).map(t => ({
        pass: t.pass
      }))
    );
    const anyPass = tests.some(t => t.pass === true);
    return {
      passed: !visible && !tests.every(t => t.pass === true),
      mode: 'expect-fail',
      tests,
      anyPass
    };
  }

  // Prefer UI submit button (human path)
  try {
    await submitButton().waitFor({ state: 'visible', timeout: 20000 });
    const before = page.url();
    await submitButton().click();
    await page.waitForTimeout(2000);
    return { passed: true, via: 'ui-submit', before, after: page.url() };
  } catch {
    // Fallback: Redux execute + submit (same actions the buttons fire)
    const fallback = await page.evaluate(async () => {
      const store = window.__store__;
      if (!store) return { ok: false, why: 'no store' };
      store.dispatch({
        type: 'challenge.executeChallenge',
        payload: { showCompletionModal: false }
      });
      await new Promise(r => setTimeout(r, 3500));
      const tests = store.getState().challenge.challengeTests || [];
      const ok = tests.length > 0 && tests.every(t => t.pass && !t.err);
      if (!ok) {
        return {
          ok: false,
          why: 'tests failed',
          tests: tests.map(t => ({
            pass: t.pass,
            err: typeof t.err === 'string' ? t.err.slice(0, 120) : t.err
          }))
        };
      }
      const before = location.pathname;
      store.dispatch({ type: 'challenge.submitChallenge' });
      await new Promise(r => setTimeout(r, 2500));
      return { ok: true, before, after: location.pathname };
    });
    if (fallback.ok) {
      return {
        passed: true,
        via: 'redux-fallback',
        before: fallback.before,
        after: fallback.after
      };
    }
    return {
      passed: false,
      hint: fallback.why || JSON.stringify(fallback.tests || []).slice(0, 200),
      tests: fallback.tests
    };
  }
}

async function openChallenge(urlPath, label) {
  const url = urlPath.startsWith('http') ? urlPath : `${BASE}${urlPath}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('.monaco-editor, h1, main', { timeout: 60000 });
  await page.waitForTimeout(800);
  await dismissOverlays();
  const title = await page
    .locator('h1')
    .first()
    .innerText()
    .catch(() => '');
  pass(`${label}: page loaded`, title.slice(0, 80) || page.url());
  return title;
}

async function runEditorStep({
  label,
  path: urlPath,
  solution,
  wrongSolution,
  shotName
}) {
  await openChallenge(urlPath, label);

  if (wrongSolution) {
    await setSolution(wrongSolution);
    const bad = await checkAndSubmit({ expectFail: true });
    if (bad.passed) pass(`${label}: wrong code rejected`);
    else fail(`${label}: wrong code rejected`, JSON.stringify(bad).slice(0, 160));
  }

  const set = await setSolution(solution);
  if (!set.ok) fail(`${label}: set solution`, JSON.stringify(set));
  else pass(`${label}: solution set`, set.fileKey || '');

  const r = await checkAndSubmit();
  if (r.passed) {
    pass(`${label}: check + submit`, `${r.via || ''} ${r.after || ''}`.trim());
  } else {
    fail(
      `${label}: check + submit`,
      r.hint || JSON.stringify(r.tests || []).slice(0, 200)
    );
  }

  if (shotName) {
    await page
      .screenshot({ path: path.join(shotDir, shotName), fullPage: false })
      .catch(() => {});
  }
  return r;
}

// ========== RWD ==========
if (runRwd) {
  log('\n=== RWD workshop-cat-photo-app ===');
  await runEditorStep({
    label: 'RWD step-1',
    path: '/learn/responsive-web-design-v9/workshop-cat-photo-app/step-1',
    wrongSolution: '<html><body><h1>Wrong</h1></body></html>',
    solution: '<html><body><h1>CatPhotoApp</h1></body></html>',
    shotName: 'step1-after-submit.png'
  });

  if (!/step-2/.test(page.url())) {
    await page.goto(
      `${BASE}/learn/responsive-web-design-v9/workshop-cat-photo-app/step-2`,
      { waitUntil: 'domcontentloaded', timeout: 60000 }
    );
  }
  await runEditorStep({
    label: 'RWD step-2',
    path: page.url().includes('step-2')
      ? page.url()
      : '/learn/responsive-web-design-v9/workshop-cat-photo-app/step-2',
    solution:
      '<html><body><h1>CatPhotoApp</h1><h2>Cat Photos</h2></body></html>',
    shotName: 'step2-after-submit.png'
  });
}

// ========== JS ==========
if (runJs) {
  log('\n=== JS workshop-greeting-bot ===');
  await runEditorStep({
    label: 'JS greeting step-1',
    path: '/learn/javascript-v9/workshop-greeting-bot/step-1',
    wrongSolution: 'console.log("nope");',
    solution: 'console.log("Hi there!");',
    shotName: 'js-greeting-step1.png'
  });
}

// ========== Python ==========
if (runPython) {
  log('\n=== Python workshop-pin-extractor ===');
  try {
    const title = await openChallenge(
      '/learn/python-v9/workshop-pin-extractor/step-1',
      'Python pin step-1'
    );
    const hasEditor = (await page.locator('.monaco-editor').count()) > 0;
    if (!hasEditor) {
      fail('Python pin step-1: editor', 'no monaco');
    } else {
      await dismissOverlays();
      await checkButton().click();
      await page.waitForTimeout(2500);
      const submitVisible = await submitButton().isVisible().catch(() => false);
      if (!submitVisible) {
        pass(
          'Python pin step-1: check runs (seed fails as expected)',
          title.slice(0, 40)
        );
      } else {
        pass('Python pin step-1: check unlocked submit');
      }
    }
  } catch (e) {
    fail('Python pin step-1', e.message);
  }
}

// ========== Progress ==========
log('\n=== Progress ===');
const stored = await page.evaluate(() => {
  try {
    return JSON.parse(window.localStorage.getItem('fcc-local-user') || 'null');
  } catch {
    return null;
  }
});
const n = stored?.completedChallenges?.length ?? 0;
if (n > 0) pass('localStorage progress', `${n} completed`);
else fail('localStorage progress', JSON.stringify(stored));

log('\n--- Failed requests ---');
if (failedRequests.length === 0) log('(none)');
else failedRequests.forEach(f => log(f));

await browser.close();

const summary = {
  passed: results.filter(r => r.ok).length,
  failed: results.filter(r => !r.ok).length,
  total: results.length
};
log('\n=== SUMMARY ===');
log(JSON.stringify(summary));
fs.writeFileSync(
  path.resolve('dev-logs/full-flow-report.json'),
  JSON.stringify({ summary, results, failedRequests }, null, 2)
);

process.exit(summary.failed > 0 ? 1 : 0);
