import { chromium } from './node_modules/.pnpm/playwright@1.52.0/node_modules/playwright/index.mjs';
const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newContext({ viewport: { width: 900, height: 1300 } }).then(c => c.newPage());
await page.goto('http://localhost:8000/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: 'screenshots/home-with-folder.png', fullPage: true });
console.log('Saved. Title:', await page.title());
await browser.close();
