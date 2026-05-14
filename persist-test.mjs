import { chromium } from '@playwright/test';
import { rmSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const BASE = 'http://localhost:8000';
const PROFILE = join(tmpdir(), 'fcc-persist-test-profile');

// Clean any previous test profile so we start fresh
if (existsSync(PROFILE)) rmSync(PROFILE, { recursive: true, force: true });

const results = [];
const pass = (n, d = '') => results.push({ ok: true, n, d });
const fail = (n, d = '') => results.push({ ok: false, n, d });

// === Phase 1: open the browser with a persistent profile, write progress ===
{
  const ctx = await chromium.launchPersistentContext(PROFILE);
  const page = await ctx.newPage();
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2500);
    // Inject a fake completed challenge directly
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
      cur.completedChallenges.unshift(entry);
      window.localStorage.setItem('fcc-local-user', JSON.stringify(cur));
      return cur.completedChallenges[0].id;
    });
    pass('phase 1: wrote a completed challenge', `id=${wrote.slice(-15)}`);
  } catch (e) {
    fail('phase 1: wrote a completed challenge', e.message);
  }
  await ctx.close();
}

// === Phase 2: re-open the SAME profile (simulating browser/PC restart) ===
{
  const ctx = await chromium.launchPersistentContext(PROFILE);
  const page = await ctx.newPage();
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2500);
    const stored = await page.evaluate(() =>
      JSON.parse(window.localStorage.getItem('fcc-local-user') || 'null')
    );
    if (stored?.completedChallenges?.length > 0) {
      pass(
        'phase 2: progress restored after profile reopen',
        `${stored.completedChallenges.length} entry/ies, latest=${stored.completedChallenges[0].id.slice(-15)}`
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

  // === Phase 3: verify Redux store reflects the persisted progress ===
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

  await ctx.close();
}

// === Phase 4: a third open just to be sure (multi-restart resilience) ===
{
  const ctx = await chromium.launchPersistentContext(PROFILE);
  const page = await ctx.newPage();
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
    fail('phase 4: still there after a 2nd reopen', JSON.stringify(stillThere));
  await ctx.close();
}

console.log('\n=== PERSISTENCE-ACROSS-REBOOT TEST ===');
for (const r of results)
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.n}${r.d ? '  — ' + r.d : ''}`);
const okN = results.filter(r => r.ok).length;
console.log(`\n${okN} passed, ${results.length - okN} failed`);
console.log(`Profile dir used: ${PROFILE}`);
process.exit(okN === results.length ? 0 : 1);
