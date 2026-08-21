/**
 * Shared Playwright helpers for the local human QA suite.
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

export const BASE = process.env.FCC_BASE_URL || 'http://localhost:8000';

const EN_LEAK =
  /\b(Your code should|Hint non traduit|should have a|Click the check|Start by creating)\b/i;

export function createReporter() {
  const results = [];
  const log = (...a) => console.log(...a);
  const pass = (name, detail = '') => {
    results.push({ ok: true, name, detail });
    log(`PASS  ${name}${detail ? ' — ' + detail : ''}`);
  };
  const fail = (name, detail = '') => {
    results.push({ ok: false, name, detail });
    log(`FAIL  ${name}${detail ? ' — ' + detail : ''}`);
  };
  const summary = () => ({
    passed: results.filter(r => r.ok).length,
    failed: results.filter(r => !r.ok).length,
    total: results.length
  });
  const writeReport = (fileName, extra = {}) => {
    const out = path.resolve('dev-logs', fileName);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(
      out,
      JSON.stringify({ summary: summary(), results, ...extra }, null, 2)
    );
    return out;
  };
  return { results, log, pass, fail, summary, writeReport };
}

export async function launchBrowser({
  persistentProfile = null,
  wipePersistent = true,
  viewport = { width: 1400, height: 900 },
  clearLayout = true
} = {}) {
  const initScript = clearLayout
    ? () => {
        try {
          window.localStorage.setItem('fcc-local-onboarding-seen', '1');
          window.localStorage.removeItem('layoutPaneBooleans');
          window.localStorage.removeItem('challenge-layout');
        } catch {
          // ignore
        }
      }
    : () => {
        try {
          window.localStorage.setItem('fcc-local-onboarding-seen', '1');
        } catch {
          // ignore
        }
      };

  if (persistentProfile) {
    if (wipePersistent && fs.existsSync(persistentProfile)) {
      fs.rmSync(persistentProfile, { recursive: true, force: true });
    }
    const ctx = await chromium.launchPersistentContext(persistentProfile, {
      viewport
    });
    await ctx.addInitScript(initScript);
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin: BASE
    });
    const page = ctx.pages()[0] || (await ctx.newPage());
    return { browser: null, ctx, page, persistent: true };
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], {
    origin: BASE
  });
  await ctx.addInitScript(initScript);
  const page = await ctx.newPage();
  return { browser, ctx, page, persistent: false };
}

export async function closeBrowser({ browser, ctx }) {
  if (ctx) await ctx.close().catch(() => {});
  if (browser) await browser.close().catch(() => {});
}

export function attachHttpFailures(page) {
  const failedRequests = [];
  page.on('response', r => {
    if (
      r.status() >= 400 &&
      !/favicon|webpack_hmr|algolia|stripe/i.test(r.url())
    ) {
      failedRequests.push(`${r.status()} ${r.url()}`);
    }
  });
  return failedRequests;
}

export function attachPort3000Guard(page) {
  const apiCallsTo3000 = [];
  page.on('request', req => {
    const url = req.url();
    if (url.includes(':3000') || url.includes('/api/')) {
      apiCallsTo3000.push(`${req.method()} ${url}`);
    }
  });
  return apiCallsTo3000;
}

export async function dismissOverlays(page) {
  const start = page
    .locator('button')
    .filter({ hasText: /Commencer à coder|Start coding/i })
    .first();
  if (await start.isVisible().catch(() => false)) {
    await start.click().catch(() => {});
    await page.waitForTimeout(300);
  }
  const onboarding = page.locator('.local-onboarding');
  if (await onboarding.isVisible().catch(() => false)) {
    const cont = onboarding
      .locator('button')
      .filter({ hasText: /^Continuer$/i });
    if (await cont.isVisible().catch(() => false)) await cont.click();
    else {
      await page.evaluate(() => {
        localStorage.setItem('fcc-local-onboarding-seen', '1');
        document.querySelector('.local-onboarding')?.remove();
      });
    }
    await page.waitForTimeout(300);
  }
}

export function checkButton(page) {
  return page
    .locator(
      '[data-playwright-test-label="independentLowerJaw-check-button"], [data-playwright-test-label="lowerJaw-check-button"]'
    )
    .first();
}

export function submitButton(page) {
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

export function getEditors(page) {
  return page.getByRole('textbox', { name: /editor content/i });
}

export async function focusEditor(page) {
  const editors = getEditors(page);
  await editors.first().waitFor({ state: 'visible', timeout: 60000 });
  await editors.first().focus();
}

export async function clearEditor(page) {
  await focusEditor(page);
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(200);
}

/**
 * Type into Monaco like a human. Prefer insertText for speed/reliability;
 * optionally type the last few chars slowly to prove keyboard input.
 */
export async function typeInEditor(page, contents, { slowTail = 0 } = {}) {
  await clearEditor(page);
  const body =
    slowTail > 0 && contents.length > slowTail
      ? contents.slice(0, -slowTail)
      : contents;
  const tail = slowTail > 0 ? contents.slice(-slowTail) : '';
  if (body) await page.keyboard.insertText(body);
  if (tail) await page.keyboard.type(tail, { delay: 25 });
  await page.waitForTimeout(400);
}

/** Redux injection — only for --cheat mode. */
export async function setSolutionCheat(page, contents) {
  await page.waitForSelector('.monaco-editor', { timeout: 60000 });
  await page.waitForTimeout(800);
  await dismissOverlays(page);
  return page.evaluate(code => {
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
      ok: after === code || (after && after.includes(code.trim())),
      fileKey: file.fileKey,
      after: after?.slice(0, 80)
    };
  }, contents);
}

export async function assertMonacoVisible(page, pass, fail, label) {
  const box = await page.evaluate(() => {
    const el = document.querySelector('.monaco-editor');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  });
  if (!box || box.h < 80) {
    fail(`${label}: monaco visible`, JSON.stringify(box));
    return false;
  }
  pass(`${label}: monaco visible`, `${box.w}x${box.h}`);
  return true;
}

export async function assertFrenchChrome(page, pass, fail, label) {
  const btn = checkButton(page);
  const aria = await btn.getAttribute('aria-label').catch(() => null);
  const text = (await btn.innerText().catch(() => '')).trim();
  const ok =
    aria === 'Vérifier votre code' ||
    /Vérifier votre code/i.test(text) ||
    /Vérifier/i.test(aria || '');
  if (ok) pass(`${label}: FR chrome`, `aria="${aria}"`);
  else fail(`${label}: FR chrome`, `aria="${aria}" text="${text}"`);
  return ok;
}

export async function assertFrenchDescription(
  page,
  pass,
  fail,
  label,
  markers = []
) {
  const desc = page.locator(
    '[data-playwright-test-label="challenge-description"], .challenge-instructions'
  );
  await desc.first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
  const text = (await desc.first().innerText().catch(() => '')).trim();
  if (!text) {
    fail(`${label}: FR description`, 'empty instructions');
    return false;
  }
  if (EN_LEAK.test(text)) {
    fail(`${label}: FR description`, `EN leak: ${text.slice(0, 120)}`);
    return false;
  }
  const missing = markers.filter(m => !text.includes(m));
  if (missing.length) {
    fail(
      `${label}: FR description`,
      `missing [${missing.join(', ')}] in: ${text.slice(0, 140)}`
    );
    return false;
  }
  pass(`${label}: FR description`, markers.join(' | ') || text.slice(0, 60));
  return true;
}

export async function openChallenge(page, urlPath, pass, fail, label) {
  const url = urlPath.startsWith('http') ? urlPath : `${BASE}${urlPath}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('.monaco-editor, h1, main, .quiz-challenge-container', {
    timeout: 60000
  });
  await page.waitForTimeout(800);
  await dismissOverlays(page);
  const title = await page
    .locator('h1')
    .first()
    .innerText()
    .catch(() => '');
  pass(`${label}: page loaded`, title.slice(0, 80) || page.url());
  return title;
}

/**
 * Click Check then Submit via UI only (no Redux fallback unless allowCheat).
 */
export async function checkAndSubmit(
  page,
  { expectFail = false, allowCheat = false } = {}
) {
  await dismissOverlays(page);
  const btn = checkButton(page);
  await btn.waitFor({ state: 'visible', timeout: 20000 });
  await btn.click();

  if (expectFail) {
    await page.waitForTimeout(2500);
    const visible = await submitButton(page).isVisible().catch(() => false);
    return { passed: !visible, mode: 'expect-fail' };
  }

  try {
    await submitButton(page).waitFor({ state: 'visible', timeout: 25000 });
    const before = page.url();
    await submitButton(page).click();
    await page.waitForTimeout(2000);
    return { passed: true, via: 'ui-submit', before, after: page.url() };
  } catch (err) {
    if (!allowCheat) {
      return {
        passed: false,
        hint: `submit UI missing (${err.message?.slice(0, 80) || 'timeout'})`
      };
    }
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
      hint: fallback.why || JSON.stringify(fallback.tests || []).slice(0, 200)
    };
  }
}

export async function readLocalProgress(page) {
  return page.evaluate(() => {
    try {
      return JSON.parse(window.localStorage.getItem('fcc-local-user') || 'null');
    } catch {
      return null;
    }
  });
}

export function shotPath(name) {
  const dir = path.resolve('screenshots/current/human-qa');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, name);
}

export function persistProfileDir() {
  return path.join(tmpdir(), 'fcc-human-qa-persist-profile');
}
