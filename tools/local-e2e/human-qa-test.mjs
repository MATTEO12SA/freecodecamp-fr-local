/**
 * human-qa-test.mjs — QA local unifié (clics + frappe Monaco + FR).
 *
 * Prérequis : serveur UP (`.\dev.ps1` / `.\dev-check.ps1`).
 *
 * Usage :
 *   node human-qa-test.mjs              # hub + human + persist
 *   node human-qa-test.mjs --hub
 *   node human-qa-test.mjs --human
 *   node human-qa-test.mjs --persist
 *   node human-qa-test.mjs --human --cheat   # Redux updateFile (debug)
 *   node human-qa-test.mjs --js-only         # filtre scénarios éditeur
 *   node human-qa-test.mjs --rwd-only
 *   node human-qa-test.mjs --python
 */
import {
  BASE,
  attachHttpFailures,
  attachPort3000Guard,
  assertFrenchChrome,
  assertFrenchDescription,
  assertMonacoVisible,
  checkAndSubmit,
  checkButton,
  closeBrowser,
  createReporter,
  dismissOverlays,
  launchBrowser,
  openChallenge,
  persistProfileDir,
  readLocalProgress,
  setSolutionCheat,
  shotPath,
  typeInEditor
} from './shared.mjs';
import { editorScenarios, quizScenario } from './scenarios.mjs';

const args = new Set(process.argv.slice(2));
const cheat = args.has('--cheat');
const explicit =
  args.has('--hub') || args.has('--human') || args.has('--persist');
const runHub = !explicit || args.has('--hub');
const runHuman = !explicit || args.has('--human');
const runPersist = !explicit || args.has('--persist');

const filterJsOnly = args.has('--js-only');
const filterRwdOnly = args.has('--rwd-only');
const filterPython = args.has('--python');

function selectEditorScenarios() {
  let list = editorScenarios;
  if (filterJsOnly) {
    list = list.filter(s => s.path.includes('/javascript-v9/'));
  } else if (filterRwdOnly) {
    list = list.filter(s => s.path.includes('/responsive-web-design-v9/'));
  } else if (filterPython) {
    list = list.filter(s => s.path.includes('/python-v9/'));
  }
  return list;
}

const { log, pass, fail, summary, writeReport, results } = createReporter();

async function runHubMode() {
  log('\n=== HUB (ex-smoke) ===');
  const { browser, ctx, page } = await launchBrowser();
  const apiCallsTo3000 = attachPort3000Guard(page);
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('header, nav, [class*="universal-nav"]', {
      timeout: 30000
    });
    pass('home loads', `title="${await page.title()}"`);
  } catch (e) {
    fail('home loads', e.message);
  }

  const signInVisible = await page
    .locator('[data-playwright-test-label="sign-in-button"]')
    .count();
  if (signInVisible === 0) pass('no Sign-In button in header');
  else fail('no Sign-In button in header', `found ${signInVisible}`);

  const settingsLinks = await page.locator('a[href*="/settings"]').count();
  if (settingsLinks === 0) pass('no /settings link');
  else fail('no /settings link', `found ${settingsLinks}`);

  const donateLinks = await page.locator('a[href*="/donate"]').count();
  if (donateLinks === 0) pass('no /donate link');
  else fail('no /donate link', `found ${donateLinks}`);

  const curriculumLinks = await page.locator('a[href="/learn"]').count();
  if (curriculumLinks > 0)
    pass('Curriculum link present', `${curriculumLinks} matches`);
  else fail('Curriculum link present', 'none found');

  try {
    await page.goto(`${BASE}/learn`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.waitForSelector('main, [class*="learn"]', { timeout: 30000 });
    await page.waitForTimeout(2000);
    const certCount = await page.locator('a[href*="/learn/"]').count();
    if (certCount > 5)
      pass('/learn shows curriculum items', `${certCount} links`);
    else fail('/learn shows curriculum items', `only ${certCount} links`);
  } catch (e) {
    fail('/learn loads', e.message);
  }

  try {
    const r = await page.goto(`${BASE}/settings`, {
      waitUntil: 'domcontentloaded'
    });
    if (r.status() === 404) pass('/settings returns 404');
    else fail('/settings returns 404', `got ${r.status()}`);
  } catch (e) {
    fail('/settings returns 404', e.message);
  }

  try {
    const r = await page.goto(`${BASE}/donate`, {
      waitUntil: 'domcontentloaded'
    });
    if (r.status() === 404) pass('/donate returns 404');
    else fail('/donate returns 404', `got ${r.status()}`);
  } catch (e) {
    fail('/donate returns 404', e.message);
  }

  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1500);
  const stored = await page.evaluate(() =>
    window.localStorage.getItem('fcc-local-user')
  );
  if (stored) pass('fcc-local-user written to localStorage', stored.slice(0, 80));
  else fail('fcc-local-user written to localStorage', 'not found');

  if (apiCallsTo3000.length === 0) pass('no requests to :3000');
  else fail('no requests to :3000', apiCallsTo3000.slice(0, 5).join('; '));

  if (consoleErrors.length > 0) {
    log('\n--- Browser console errors (first 10) ---');
    consoleErrors.slice(0, 10).forEach(e => log('  ' + e));
  }

  await closeBrowser({ browser, ctx });
}

async function applySolution(page, scenario) {
  if (cheat) {
    const set = await setSolutionCheat(page, scenario.solution);
    return { ok: !!set.ok, via: 'cheat-redux', detail: set };
  }
  await typeInEditor(page, scenario.solution, {
    slowTail: scenario.slowTail || 0
  });
  // Confirm Monaco/Redux picked up content
  const after = await page.evaluate(() => {
    const files = window.__store__?.getState()?.challenge?.challengeFiles;
    return files?.[0]?.contents || '';
  });
  const normalize = s => s.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
  const needles = scenario.solution
    .split(/\n/)
    .map(l => l.trim())
    .filter(l => l.length > 2);
  const normAfter = normalize(after);
  const ok =
    needles.every(n => normAfter.includes(normalize(n))) ||
    normAfter.includes(normalize(scenario.solution).slice(0, 40));
  return { ok, via: 'human-type', detail: { after: after.slice(0, 120) } };
}

async function runEditorScenario(page, scenario) {
  const { label } = scenario;
  await openChallenge(page, scenario.path, pass, fail, label);
  await page
    .waitForSelector('.monaco-editor', { timeout: 60000 })
    .catch(() => {});
  await page.waitForTimeout(1500);
  await dismissOverlays(page);
  if (!(await assertMonacoVisible(page, pass, fail, label))) return;
  await assertFrenchChrome(page, pass, fail, label);
  await assertFrenchDescription(
    page,
    pass,
    fail,
    label,
    scenario.frMarkers || []
  );

  if (scenario.expectWrongFail && scenario.wrongSolution) {
    if (cheat) await setSolutionCheat(page, scenario.wrongSolution);
    else await typeInEditor(page, scenario.wrongSolution);
    const bad = await checkAndSubmit(page, {
      expectFail: true,
      allowCheat: cheat
    });
    if (bad.passed) pass(`${label}: wrong code rejected`);
    else fail(`${label}: wrong code rejected`, 'submit unlocked');
  }

  const set = await applySolution(page, scenario);
  if (!set.ok) fail(`${label}: set solution (${set.via})`, JSON.stringify(set.detail));
  else pass(`${label}: solution set`, set.via);

  const r = await checkAndSubmit(page, { allowCheat: cheat });
  if (r.passed)
    pass(`${label}: check + submit`, `${r.via || ''} ${r.after || ''}`.trim());
  else fail(`${label}: check + submit`, r.hint || '');

  if (scenario.shotName) {
    await page
      .screenshot({ path: shotPath(scenario.shotName), fullPage: false })
      .catch(() => {});
  }
}

async function runQuizScenario(page, scenario) {
  const { label } = scenario;
  await openChallenge(page, scenario.path, pass, fail, label);

  const bodyText = await page.locator('main').innerText().catch(() => '');
  const missing = (scenario.frMarkers || []).filter(m => !bodyText.includes(m));
  if (missing.length) {
    fail(`${label}: FR copy`, `missing [${missing.join(', ')}]`);
  } else {
    pass(`${label}: FR copy`, scenario.frMarkers.join(' | '));
  }

  if (scenario.questionMarker && !bodyText.includes(scenario.questionMarker)) {
    fail(`${label}: FR question`, `missing "${scenario.questionMarker}"`);
  } else if (scenario.questionMarker) {
    pass(`${label}: FR question`, scenario.questionMarker);
  }

  const answer = page.locator('.quiz-answer-label, [class*="quiz-answer"]').first();
  if (await answer.isVisible().catch(() => false)) {
    await answer.click();
    pass(`${label}: clicked an answer`);
  } else {
    // Fallback: first radio / option
    const radio = page.locator('input[type="radio"]').first();
    if (await radio.count()) {
      await radio.check({ force: true }).catch(() => radio.click({ force: true }));
      pass(`${label}: selected radio answer`);
    } else {
      fail(`${label}: click answer`, 'no quiz answer control found');
    }
  }

  if (scenario.shotName) {
    await page
      .screenshot({ path: shotPath(scenario.shotName), fullPage: false })
      .catch(() => {});
  }
}

async function runHumanMode() {
  log(`\n=== HUMAN exercises${cheat ? ' (--cheat)' : ''} ===`);
  const { browser, ctx, page } = await launchBrowser();
  const failedRequests = attachHttpFailures(page);

  const scenarios = selectEditorScenarios();
  for (const scenario of scenarios) {
    log(`\n--- ${scenario.label} ---`);
    try {
      await runEditorScenario(page, scenario);
    } catch (e) {
      fail(scenario.label, e.message);
    }
  }

  // Quiz only when not filtering to a single non-python track
  const includeQuiz =
    !filterJsOnly &&
    !filterRwdOnly &&
    (filterPython || (!filterJsOnly && !filterRwdOnly));
  if (includeQuiz) {
    log(`\n--- ${quizScenario.label} ---`);
    try {
      await runQuizScenario(page, quizScenario);
    } catch (e) {
      fail(quizScenario.label, e.message);
    }
  }

  log('\n=== Progress after human ===');
  const stored = await readLocalProgress(page);
  const n = stored?.completedChallenges?.length ?? 0;
  if (n > 0) pass('localStorage progress', `${n} completed`);
  else fail('localStorage progress', JSON.stringify(stored));

  log('\n--- Failed requests ---');
  if (failedRequests.length === 0) log('(none)');
  else failedRequests.forEach(f => log(f));

  await closeBrowser({ browser, ctx });
  return failedRequests;
}

async function runPersistMode() {
  log('\n=== PERSIST (profile reopen) ===');
  const PROFILE = persistProfileDir();

  {
    const { browser, ctx, page } = await launchBrowser({
      persistentProfile: PROFILE,
      wipePersistent: true,
      clearLayout: false
    });
    try {
      await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(2500);
      await dismissOverlays(page);
      const wrote = await page.evaluate(() => {
        const entry = {
          id: 'persist-test-challenge-' + Date.now(),
          completedDate: Date.now(),
          challengeType: 0,
          solution: '<h1>CatPhotoApp</h1>'
        };
        const cur = JSON.parse(
          window.localStorage.getItem('fcc-local-user') ||
            '{"completedChallenges":[]}'
        );
        cur.completedChallenges = cur.completedChallenges || [];
        cur.completedChallenges.unshift(entry);
        window.localStorage.setItem('fcc-local-user', JSON.stringify(cur));
        return cur.completedChallenges[0].id;
      });
      pass('phase 1: wrote a completed challenge', `id=${wrote.slice(-15)}`);
    } catch (e) {
      fail('phase 1: wrote a completed challenge', e.message);
    }
    await closeBrowser({ browser, ctx });
  }

  {
    const { browser, ctx, page } = await launchBrowser({
      persistentProfile: PROFILE,
      wipePersistent: false,
      clearLayout: false
    });
    try {
      await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(2500);
      const stored = await page.evaluate(() =>
        JSON.parse(window.localStorage.getItem('fcc-local-user') || 'null')
      );
      if (stored?.completedChallenges?.length > 0) {
        pass(
          'phase 2: progress restored after profile reopen',
          `${stored.completedChallenges.length} entry/ies`
        );
      } else {
        fail(
          'phase 2: progress restored after profile reopen',
          JSON.stringify(stored)
        );
      }
    } catch (e) {
      fail('phase 2: progress restored after profile reopen', e.message);
    }

    try {
      await page.waitForTimeout(1500);
      const reduxState = await page.evaluate(() => {
        const s = window.__store__;
        const user = s?.getState()?.app?.user?.sessionUser;
        return {
          ok: !!user,
          username: user?.username,
          completed: user?.completedChallenges?.length ?? 0
        };
      });
      if (reduxState.ok && reduxState.completed > 0) {
        pass(
          'phase 3: Redux store rehydrated from persisted localStorage',
          `username=${reduxState.username}, completed=${reduxState.completed}`
        );
      } else {
        fail(
          'phase 3: Redux store rehydrated from persisted localStorage',
          JSON.stringify(reduxState)
        );
      }
    } catch (e) {
      fail(
        'phase 3: Redux store rehydrated from persisted localStorage',
        e.message
      );
    }
    await closeBrowser({ browser, ctx });
  }

  {
    const { browser, ctx, page } = await launchBrowser({
      persistentProfile: PROFILE,
      wipePersistent: false,
      clearLayout: false
    });
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2500);
    const stillThere = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem('fcc-local-user') || 'null')
    );
    if (stillThere?.completedChallenges?.length > 0)
      pass(
        'phase 4: still there after a 2nd reopen',
        `${stillThere.completedChallenges.length} entry/ies`
      );
    else
      fail(
        'phase 4: still there after a 2nd reopen',
        JSON.stringify(stillThere)
      );
    await closeBrowser({ browser, ctx });
  }
}

let failedRequests = [];
if (runHub) await runHubMode();
if (runHuman) failedRequests = (await runHumanMode()) || [];
if (runPersist) await runPersistMode();

const s = summary();
log('\n=== SUMMARY ===');
log(JSON.stringify(s));
writeReport('human-qa-report.json', {
  modes: { hub: runHub, human: runHuman, persist: runPersist, cheat },
  failedRequests
});
process.exit(s.failed > 0 ? 1 : 0);
