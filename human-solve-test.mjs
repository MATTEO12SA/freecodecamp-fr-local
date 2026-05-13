import { chromium } from './node_modules/.pnpm/playwright@1.52.0/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:8000';
const URL = `${BASE}/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-1`;

const out = [];
const log = (...a) => { console.log(...a); out.push(a.join(' ')); };

const browser = await chromium.launch({ channel: 'msedge', headless: false });
const ctx = await browser.newContext();
const page = await ctx.newPage();

page.on('console', msg => {
  if (msg.type() === 'error' || msg.type() === 'warning') {
    log(`[console ${msg.type()}]`, msg.text().slice(0, 200));
  }
});

await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
log('Loaded:', page.url());

// Wait for Monaco editor to be ready
await page.waitForSelector('.monaco-editor', { timeout: 60000 });
await page.waitForTimeout(3000);
log('Monaco editor present.');

// Dismiss demo preview modal if open ("Commencer à coder !")
const startBtn = page
  .locator('button')
  .filter({ hasText: /Commencer à coder|Start coding/i })
  .first();
if (await startBtn.isVisible().catch(() => false)) {
  await startBtn.click().catch(() => {});
  await page.waitForTimeout(800);
  log('Dismissed demo modal.');
}

// Get current editor content (seed)
const initialContent = await page.evaluate(() => {
  const ta = document.querySelector('.monaco-editor textarea.inputarea');
  return ta ? 'textarea present' : 'no textarea';
});
log('Editor state:', initialContent);

// Click into the editor
const editor = page.locator('.monaco-editor').first();
await editor.click({ force: true });
await page.waitForTimeout(500);

// Select all and type the solution
await page.keyboard.press('Control+A');
await page.waitForTimeout(200);
const solution = `<html>
  <body>
    <h1>CatPhotoApp</h1>
  </body>
</html>`;
await page.keyboard.type(solution, { delay: 8 });
await page.waitForTimeout(600);
log('Typed solution.');

// Click "Vérifier votre code"
const checkBtn = page.locator(
  '[data-playwright-test-label="independentLowerJaw-check-button"]'
);
await checkBtn.click({ force: true });
log('Clicked "Vérifier votre code".');

// Wait for either: completion modal (success) OR a hint shown (failure)
const successSel = '[data-playwright-test-label="completion-success-icon"]';
const failureSel = '[data-playwright-test-label="independentLowerJaw-failing-hint"]';
try {
  const res = await Promise.race([
    page.waitForSelector(successSel, { timeout: 20000 }).then(() => 'success'),
    page.waitForSelector(failureSel, { timeout: 20000 }).then(() => 'failure')
  ]);
  log('RESULT:', res);
  if (res === 'failure') {
    const hint = await page
      .locator(failureSel)
      .innerText()
      .catch(() => '(no hint text)');
    log('FAILURE HINT:', hint.replace(/\s+/g, ' ').slice(0, 400));
  } else {
    log('✅ Tests passed!');
  }
} catch (e) {
  log('TIMEOUT — neither success nor failure modal appeared.');
  const bodySnippet = await page
    .locator('body')
    .innerText()
    .catch(() => '');
  log('Page text (200 chars):', bodySnippet.replace(/\s+/g, ' ').slice(0, 200));
}

await page.waitForTimeout(2500);
await page.screenshot({ path: 'screenshots/solve-result.png', fullPage: false });
log('Saved screenshot to screenshots/solve-result.png');
await browser.close();
