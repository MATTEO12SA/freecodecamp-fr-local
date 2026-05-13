import { chromium } from './node_modules/.pnpm/playwright@1.52.0/node_modules/playwright/index.mjs';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:8000';
const OUT = './screenshots';
mkdirSync(OUT, { recursive: true });

const findings = [];
const note = (where, what) => findings.push({ where, what });

const browser = await chromium.launch({ channel: 'msedge' });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

page.on('console', m => {
  const t = m.type();
  if (t === 'error' || t === 'warning') {
    const text = m.text();
    if (!text.includes('GrowthBook') && !text.includes('Failed to load resource')) {
      note('console', `[${t}] ${text.slice(0, 150)}`);
    }
  }
});

async function shot(name) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
}

// 1. Home
await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2500);
await shot('01-home');
const homeText = (await page.locator('body').innerText()).slice(0, 400);
note('home', `text: ${homeText.replace(/\s+/g, ' ').slice(0, 200)}`);
const startBtn = await page.locator('[data-playwright-test-label="start-button"]').count();
note('home', `start button count: ${startBtn}`);

// 2. Click Commencer
await page.locator('[data-playwright-test-label="start-button"]').click();
await page.waitForURL('**/learn', { timeout: 30000 }).catch(() => {});
// Wait for the curriculum map to render
await page.waitForSelector('a[href^="/learn/"]', { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(2000);
note('after-click', `URL: ${page.url()}`);
await shot('02-learn-after-click');

// 3. /learn page — visible content?
const learnText = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 400);
note('learn', `text snippet: ${learnText}`);

// Count curriculum cards/links
const curriLinks = await page.locator('a[href^="/learn/"]').count();
note('learn', `curriculum links: ${curriLinks}`);

// 4. Click first curriculum link
const firstLink = page.locator('a[href^="/learn/"]').first();
const firstHref = await firstLink.getAttribute('href');
note('learn', `first curriculum href: ${firstHref}`);
await firstLink.click();
await page.waitForTimeout(3000);
await shot('03-curriculum-cert');
note('cert-page', `URL: ${page.url()}`);

// 5. Look for any English leftovers on this page (common nav)
const navText = await page.locator('header').innerText().catch(() => '');
note('nav', `nav text: ${navText.replace(/\s+/g, ' ').slice(0, 200)}`);

// 6. Footer check
const footerText = await page.locator('footer').innerText().catch(() => '');
note('footer', `footer text: "${footerText.replace(/\s+/g, ' ').slice(0, 120)}"`);

// 7. Open a known challenge
await page.goto(
  `${BASE}/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-1`,
  { waitUntil: 'domcontentloaded', timeout: 60000 }
);
await page.waitForSelector('.monaco-editor', { timeout: 45000 });
await page.waitForTimeout(3000);
await shot('04-challenge-page');

// Check button labels in French
const checkBtn = page.locator('[data-playwright-test-label="independentLowerJaw-check-button"]');
const checkText = (await checkBtn.innerText().catch(() => '')) || '';
const checkAria = await checkBtn.getAttribute('aria-label').catch(() => '');
note('challenge', `check button text: "${checkText}" aria="${checkAria}"`);

const resetBtn = page.locator('[data-playwright-test-label="independentLowerJaw-reset-button"]');
const resetText = (await resetBtn.innerText().catch(() => '')) || '';
const resetAria = await resetBtn.getAttribute('aria-label').catch(() => '');
note('challenge', `reset button: "${resetText}" aria="${resetAria}"`);

const helpBtn = page.locator('[data-playwright-test-label="independentLowerJaw-help-button"]');
const helpAria = await helpBtn.getAttribute('aria-label').catch(() => '');
note('challenge', `help button aria: "${helpAria}"`);

// Sign-In remnants?
const signInCount = await page.locator('text=/Sign In|Sign Up|Log in/i').count();
note('challenge', `English "Sign In/Up/Log in" remnants: ${signInCount}`);

// Donate remnants?
const donateCount = await page.locator('a[href*="/donate"]').count();
note('challenge', `Links to /donate: ${donateCount}`);

// 8. Try a deleted route
const settings = await page.goto(`${BASE}/settings`, { waitUntil: 'domcontentloaded' });
note('settings', `status: ${settings.status()}`);
await shot('05-settings-404');

// 9. Try /donate
const donate = await page.goto(`${BASE}/donate`, { waitUntil: 'domcontentloaded' });
note('donate', `status: ${donate.status()}`);
await shot('06-donate-404');

// 10. Back home, open nav menu
await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
const menuBtn = page.locator('button[aria-label*="enu"], button[id*="toggle"]').first();
if (await menuBtn.count() > 0) {
  await menuBtn.click().catch(() => {});
  await page.waitForTimeout(800);
  await shot('07-nav-menu-open');
  const menuLinks = await page.locator('ul.nav-list a, ul.nav-list button').allInnerTexts();
  note('nav-menu', `menu items: ${menuLinks.map(s => s.trim()).filter(Boolean).join(' | ')}`);
}

await browser.close();

console.log('\n=== HUMAN-LIKE INSPECTION ===\n');
for (const f of findings) {
  console.log(`[${f.where}] ${f.what}`);
}
console.log(`\nScreenshots saved to ${OUT}/`);
