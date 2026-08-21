import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

function readOption(name, fallback = '') {
  const prefix = `--${name}=`;
  const argument = process.argv.find(value => value.startsWith(prefix));
  return argument ? argument.slice(prefix.length) : fallback;
}

const baseUrl = readOption(
  'base-url',
  process.env.PRODUCTION_BASE_URL || 'http://localhost:8010'
).replace(/\/$/, '');
const outputPath = readOption('output');
const screenshotPath = readOption('screenshot');
const results = [];

async function record(name, check) {
  try {
    await check();
    results.push({ name, status: 'passed' });
    console.log(`PASS ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ name, status: 'failed', error: message });
    console.error(`FAIL ${name}: ${message}`);
  }
}

const browser = await chromium.launch();
const page = await browser.newPage();

async function navigate(path) {
  const response = await page.goto(`${baseUrl}${path}`, {
    waitUntil: 'domcontentloaded'
  });
  assert.ok(response, `${path}: aucune réponse HTTP`);
  await page.locator('h1').first().waitFor({ state: 'visible' });
  return response;
}

try {
  await record('public home is available without developer menu', async () => {
    const response = await navigate('/');
    assert.equal(response.status(), 200);
    await page
      .locator('[data-playwright-test-label="header-menu-button"]')
      .click();
    assert.equal(await page.getByRole('link', { name: 'Dev FR' }).count(), 0);
  });

  for (const path of ['/dev-fr', '/___graphql']) {
    await record(`${path} is absent from the public build`, async () => {
      const response = await navigate(path);
      assert.equal(response.status(), 404);
      assert.match(
        (await page.locator('h1').textContent()) || '',
        /page (not found|introuvable)/i
      );
    });
  }

  await record('unknown public route uses the user-facing 404', async () => {
    const response = await navigate('/route-audit-inexistante');
    assert.equal(response.status(), 404);
    const body = await page.locator('body').innerText();
    assert.match(body, /page (not found|introuvable)/i);
    assert.doesNotMatch(body, /Gatsby\.js development 404 page/i);

    if (screenshotPath) {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    }
  });
} finally {
  await browser.close();
}

const failed = results.filter(result => result.status === 'failed');
const summary = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  passed: results.length - failed.length,
  failed: failed.length,
  checks: results
};

if (outputPath) {
  await writeFile(outputPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
}

console.log(`SUMMARY passed=${summary.passed} failed=${summary.failed}`);
if (failed.length > 0) process.exit(1);
