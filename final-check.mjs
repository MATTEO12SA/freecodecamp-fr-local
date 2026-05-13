import { chromium } from './node_modules/.pnpm/playwright@1.52.0/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:8000';
const CHALLENGE = '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-1';

const browser = await chromium.launch({ channel: 'msedge' });
const page = await (await browser.newContext()).newPage();
await page.goto(`${BASE}${CHALLENGE}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForSelector('.monaco-editor', { timeout: 45000 });
await page.waitForTimeout(2500);

// Read the description panel
const descText = (await page.locator('main').innerText().catch(() => '')).slice(0, 800);

await page.screenshot({ path: './screenshots/final-step1-fr.png', fullPage: false });
console.log(descText.replace(/\s+/g, ' '));
await browser.close();
