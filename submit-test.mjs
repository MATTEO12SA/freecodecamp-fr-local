import { chromium } from './node_modules/.pnpm/playwright@1.52.0/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:8000';
const CHALLENGE =
  '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-1';

const results = [];
const pass = (n, d = '') => results.push({ ok: true, n, d });
const fail = (n, d = '') => results.push({ ok: false, n, d });

const browser = await chromium.launch({ channel: 'msedge' });
const ctx = await browser.newContext();
const page = await ctx.newPage();

const apiCalls = [];
page.on('request', req => {
  if (req.url().includes(':3000')) apiCalls.push(req.url());
});

// 1. Open challenge page
try {
  await page.goto(`${BASE}${CHALLENGE}`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.waitForSelector('.monaco-editor', { timeout: 45000 });
  await page.waitForTimeout(2500);
  pass('challenge page + Monaco editor loaded');
} catch (e) {
  fail('challenge page + Monaco editor loaded', e.message);
  await browser.close();
  process.exit(1);
}

// 2. Verify the UI is in French
const checkBtn = page.locator(
  '[data-playwright-test-label="independentLowerJaw-check-button"]'
);
const checkLabel = await checkBtn.getAttribute('aria-label').catch(() => null);
if (checkLabel === 'Vérifier votre code')
  pass('UI is in French', `check button aria="${checkLabel}"`);
else fail('UI is in French', `aria="${checkLabel}"`);

// 3. Verify the Redux store is reachable and shows the local user
const storeState = await page.evaluate(() => {
  const s = window.__store__;
  if (!s) return { ok: false, why: 'window.__store__ missing' };
  const state = s.getState();
  const sessionUser = state?.app?.user?.sessionUser;
  return {
    ok: !!sessionUser,
    username: sessionUser?.username,
    completedCount: sessionUser?.completedChallenges?.length ?? 0
  };
});

if (storeState.ok)
  pass(
    'Redux store has local user',
    `username=${storeState.username}, completed=${storeState.completedCount}`
  );
else fail('Redux store has local user', storeState.why);

// 4. Read the current challenge ID from the URL/state, then dispatch
// submitComplete directly via the store. This mirrors what the completion
// epic dispatches after a successful submission.
const submitResult = await page.evaluate(() => {
  const s = window.__store__;
  if (!s) return { ok: false, why: 'no store' };
  const state = s.getState();
  // Walk challenge meta from Redux
  const challengeMeta = state?.challengeMeta;
  const challengeId = challengeMeta?.id ?? state?.app?.currentChallengeId;
  if (!challengeId) return { ok: false, why: 'no challengeId in state' };

  // Dispatch the same shape as completion-epic's `submitComplete(...)`
  s.dispatch({
    type: 'app.submitComplete',
    payload: {
      submittedChallenge: {
        id: challengeId,
        challengeType: challengeMeta?.challengeType ?? 0,
        solution: 'standalone-test-solution',
        challengeFiles: []
      },
      savedChallenges: [],
      completedDailyCodingChallenges: [],
      examResults: null
    }
  });
  return { ok: true, challengeId };
});

if (submitResult.ok)
  pass('dispatched submitComplete via store', `id=${submitResult.challengeId.slice(-12)}`);
else fail('dispatched submitComplete via store', submitResult.why);

// 5. Wait for the localStorage persistence epic to write
await page.waitForTimeout(500);
const stored = await page.evaluate(() => {
  const raw = window.localStorage.getItem('fcc-local-user');
  return raw ? JSON.parse(raw) : null;
});

if (stored?.completedChallenges?.length > 0) {
  pass(
    'localStorage persisted the completed challenge',
    `${stored.completedChallenges.length} entry/ies, latest=${stored.completedChallenges[0].id?.slice(-12)}`
  );
} else {
  fail('localStorage persisted the completed challenge', JSON.stringify(stored));
}

// 6. Reload and verify the entry survived
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
const afterReload = await page.evaluate(() => {
  const raw = window.localStorage.getItem('fcc-local-user');
  return raw ? JSON.parse(raw) : null;
});
if (afterReload?.completedChallenges?.length > 0)
  pass('progress survives a page reload', `${afterReload.completedChallenges.length} entry/ies`);
else fail('progress survives a page reload', JSON.stringify(afterReload));

// 7. After reload, the Redux store should also reflect the completed challenge
//    (since fetch-user-saga reads from localStorage and seeds the user).
const reloadedStore = await page.evaluate(() => {
  const s = window.__store__;
  if (!s) return { ok: false };
  const user = s.getState()?.app?.user?.sessionUser;
  return {
    ok: !!user,
    completed: user?.completedChallenges?.length ?? 0
  };
});
if (reloadedStore.ok && reloadedStore.completed > 0)
  pass('Redux user rehydrated with completed list from localStorage', `${reloadedStore.completed}`);
else
  fail(
    'Redux user rehydrated with completed list from localStorage',
    JSON.stringify(reloadedStore)
  );

// 8. No API calls to :3000
if (apiCalls.length === 0) pass('no API calls to :3000 in the whole flow');
else fail('no API calls to :3000 in the whole flow', apiCalls.slice(0, 3).join('; '));

await browser.close();

const okN = results.filter(r => r.ok).length;
const failN = results.length - okN;
console.log('\n=== SUBMIT FLOW (Redux+localStorage) RESULTS ===');
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.n}${r.d ? '  — ' + r.d : ''}`);
console.log(`\n${okN} passed, ${failN} failed`);
process.exit(failN === 0 ? 0 : 1);
