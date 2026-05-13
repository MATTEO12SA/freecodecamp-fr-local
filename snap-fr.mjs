import { chromium } from './node_modules/.pnpm/playwright@1.52.0/node_modules/playwright/index.mjs';
const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newContext({ viewport: { width: 1100, height: 1500 } }).then(c => c.newPage());

await page.goto('http://localhost:8000/learn', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(5000);
await page.screenshot({ path: 'screenshots/learn-with-fr-banner.png', fullPage: false });
console.log('learn page captured. URL:', page.url());

await page.goto('http://localhost:8000/cours-fr', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(4000);
await page.screenshot({ path: 'screenshots/cours-fr.png', fullPage: true });
console.log('cours-fr page captured.');

await browser.close();
