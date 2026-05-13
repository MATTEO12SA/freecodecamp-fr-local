import { chromium } from './node_modules/.pnpm/playwright@1.52.0/node_modules/playwright/index.mjs';
const URL = 'http://localhost:8000/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-1';

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newContext().then(c => c.newPage());
const failed = [];
page.on('response', r => {
  if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
});
page.on('console', msg => {
  if (msg.type() === 'error') console.log('[err]', msg.text().slice(0, 250));
});
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('.monaco-editor', { timeout: 60000 });
await page.waitForTimeout(4000);
const start = page.locator('button').filter({ hasText: /Commencer à coder/i }).first();
if (await start.isVisible().catch(() => false)) await start.click();
await page.waitForTimeout(800);
await page.locator('.monaco-editor').first().click({ force: true });
await page.keyboard.press('Control+A');
await page.keyboard.type('<html>\n<body>\n<h1>CatPhotoApp</h1>\n</body>\n</html>', { delay: 5 });
await page.waitForTimeout(500);
await page.locator('[data-playwright-test-label="independentLowerJaw-check-button"]').click({ force: true });
await page.waitForTimeout(8000);
console.log('\n--- Failed requests ---');
for (const f of failed) console.log(f);
await browser.close();
