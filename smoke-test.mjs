import { chromium } from '@playwright/test';

const BASE = 'http://localhost:8000';
const results = [];
let apiCallsTo3000 = [];

function pass(name, detail = '') {
  results.push({ name, ok: true, detail });
}
function fail(name, detail = '') {
  results.push({ name, ok: false, detail });
}

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

page.on('request', req => {
  const url = req.url();
  if (url.includes(':3000') || url.includes('/api/')) {
    apiCallsTo3000.push(`${req.method()} ${url}`);
  }
});

const consoleErrors = [];
page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});

// 1. Home page loads
try {
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('header, nav, [class*="universal-nav"]', {
    timeout: 30000
  });
  pass('home loads', `title="${await page.title()}"`);
} catch (e) {
  fail('home loads', e.message);
}

// 2. No "Sign In" button visible
const signInVisible = await page
  .locator('[data-playwright-test-label="sign-in-button"]')
  .count();
if (signInVisible === 0) pass('no Sign-In button in header');
else fail('no Sign-In button in header', `found ${signInVisible}`);

// 3. No /settings link in nav
const settingsLinks = await page.locator('a[href*="/settings"]').count();
if (settingsLinks === 0) pass('no /settings link');
else fail('no /settings link', `found ${settingsLinks}`);

// 4. No /donate link in nav
const donateLinks = await page.locator('a[href*="/donate"]').count();
if (donateLinks === 0) pass('no /donate link');
else fail('no /donate link', `found ${donateLinks}`);

// 5. Curriculum link present
const curriculumLinks = await page.locator('a[href="/learn"]').count();
if (curriculumLinks > 0)
  pass('Curriculum link present', `${curriculumLinks} matches`);
else fail('Curriculum link present', 'none found');

// 6. /learn loads and shows certifications
try {
  await page.goto(`${BASE}/learn`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.waitForSelector('main, [class*="learn"]', { timeout: 30000 });
  await page.waitForTimeout(2000);
  const certCount = await page.locator('a[href*="/learn/"]').count();
  if (certCount > 5)
    pass('/learn shows curriculum items', `${certCount} links`);
  else fail('/learn shows curriculum items', `only ${certCount} links`);
} catch (e) {
  fail('/learn loads', e.message);
}

// 7. /settings 404s
try {
  const r = await page.goto(`${BASE}/settings`, {
    waitUntil: 'domcontentloaded'
  });
  if (r.status() === 404) pass('/settings returns 404');
  else fail('/settings returns 404', `got ${r.status()}`);
} catch (e) {
  fail('/settings returns 404', e.message);
}

// 8. /donate 404s
try {
  const r = await page.goto(`${BASE}/donate`, {
    waitUntil: 'domcontentloaded'
  });
  if (r.status() === 404) pass('/donate returns 404');
  else fail('/donate returns 404', `got ${r.status()}`);
} catch (e) {
  fail('/donate returns 404', e.message);
}

// 9. localStorage local user is created
await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(1500); // give saga time to fire
const stored = await page.evaluate(() =>
  window.localStorage.getItem('fcc-local-user')
);
if (stored) pass('fcc-local-user written to localStorage', stored.slice(0, 80));
else fail('fcc-local-user written to localStorage', 'not found');

// 10. No API calls to port 3000 during navigation
if (apiCallsTo3000.length === 0) pass('no requests to :3000');
else fail('no requests to :3000', apiCallsTo3000.slice(0, 5).join('; '));

await browser.close();

// Report
const okCount = results.filter(r => r.ok).length;
const failCount = results.length - okCount;
console.log('\n=== SMOKE TEST RESULTS ===');
for (const r of results) {
  console.log(
    `${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? '  — ' + r.detail : ''}`
  );
}
console.log(`\n${okCount} passed, ${failCount} failed`);
if (consoleErrors.length > 0) {
  console.log('\n--- Browser console errors (first 10) ---');
  consoleErrors.slice(0, 10).forEach(e => console.log('  ' + e));
}
process.exit(failCount === 0 ? 0 : 1);
