import { chromium } from './node_modules/.pnpm/playwright@1.52.0/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:8000';
const START = `${BASE}/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-1`;

const log = (...a) => console.log(...a);

const browser = await chromium.launch({ channel: 'msedge' });
const ctx = await browser.newContext();
const page = await ctx.newPage();

const failedRequests = [];
page.on('response', r => {
  if (r.status() >= 400) failedRequests.push(`${r.status()} ${r.url()}`);
});

async function dismissDemoIfOpen() {
  const start = page
    .locator('button')
    .filter({ hasText: /Commencer à coder/i })
    .first();
  if (await start.isVisible().catch(() => false)) {
    await start.click().catch(() => {});
    await page.waitForTimeout(500);
  }
}

async function typeSolution(solution) {
  await page.waitForSelector('.monaco-editor', { timeout: 60000 });
  await page.waitForTimeout(2500);
  await dismissDemoIfOpen();
  await page.locator('.monaco-editor').first().click({ force: true });
  await page.keyboard.press('Control+A');
  await page.waitForTimeout(150);
  await page.keyboard.press('Delete');
  await page.waitForTimeout(150);
  // Use clipboard paste to avoid Monaco auto-indent / auto-close mangling
  await page.evaluate(text => navigator.clipboard.writeText(text), solution);
  await page.keyboard.press('Control+V');
  await page.waitForTimeout(600);
}

async function checkAndSubmit() {
  await page
    .locator('[data-playwright-test-label="independentLowerJaw-check-button"]')
    .click({ force: true });
  // Wait for the submit-and-continue button to appear (success path)
  const submitBtn = page
    .locator('button')
    .filter({ hasText: /Envoyer et continuer|Envoyer et passer/i })
    .first();
  try {
    await submitBtn.waitFor({ state: 'visible', timeout: 15000 });
  } catch {
    return { passed: false, hint: await page.locator('body').innerText().catch(() => '').then(t => t.replace(/\s+/g, ' ').slice(0, 200)) };
  }
  await submitBtn.click({ force: true });
  return { passed: true };
}

// === Step 1 ===
await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE });
await page.goto(START, { waitUntil: 'domcontentloaded', timeout: 60000 });
log('Loaded step-1.');
await typeSolution('<html><body><h1>CatPhotoApp</h1></body></html>');
const r1 = await checkAndSubmit();
log('Step 1 →', r1);
await page.waitForTimeout(2500);
await page.screenshot({ path: 'screenshots/flow-step1-after-submit.png' });
log('URL after submit:', page.url());

// === Step 2: add <h2>Cat Photos</h2> ===
await page.waitForSelector('.monaco-editor', { timeout: 60000 });
await page.waitForTimeout(2500);
await dismissDemoIfOpen();
await page.locator('.monaco-editor').first().click({ force: true });
await page.keyboard.press('Control+A');
await page.keyboard.press('Delete');
await page.waitForTimeout(150);
await page.evaluate(text => navigator.clipboard.writeText(text), '<html><body><h1>CatPhotoApp</h1><h2>Cat Photos</h2></body></html>');
await page.keyboard.press('Control+V');
await page.waitForTimeout(600);
const r2 = await checkAndSubmit();
log('Step 2 →', r2);
await page.waitForTimeout(2500);
await page.screenshot({ path: 'screenshots/flow-step2-after-submit.png' });
log('URL after step-2 submit:', page.url());

// localStorage check
const stored = await page.evaluate(() => window.localStorage.getItem('fcc-local-user'));
const parsed = JSON.parse(stored || '{}');
log('Completed challenges count:', parsed.completedChallenges?.length);
log('Latest IDs:', (parsed.completedChallenges || []).slice(0, 3).map(c => c.id));

log('\n--- Failed requests during flow ---');
if (failedRequests.length === 0) log('(none)');
else failedRequests.forEach(f => log(f));

await browser.close();
