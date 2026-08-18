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
const routes = [
  { name: 'home', path: '/', ready: 'h1' },
  { name: 'catalog', path: '/catalog', ready: '.catalog-item' },
  {
    name: 'challenge-editor',
    path: '/learn/responsive-web-design-v9/workshop-cat-photo-app/step-1',
    ready: '.desktop-layout'
  }
];

const toMiB = bytes => Number((bytes / 1024 / 1024).toFixed(2));
const browser = await chromium.launch();
const results = [];

try {
  for (const target of routes) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const client = await context.newCDPSession(page);
    await client.send('Performance.enable');

    const response = await page.goto(`${baseUrl}${target.path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 120000
    });
    assert.ok(response, `${target.path}: aucune réponse HTTP`);
    assert.equal(response.status(), 200, `${target.path}: HTTP inattendu`);
    await page.locator(target.ready).first().waitFor({
      state: 'visible',
      timeout: 120000
    });
    await page.waitForTimeout(target.name === 'challenge-editor' ? 2500 : 800);

    const browserMetrics = await client.send('Performance.getMetrics');
    const metricMap = Object.fromEntries(
      browserMetrics.metrics.map(metric => [metric.name, metric.value])
    );
    const pageMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');
      const entries = navigation ? [navigation, ...resources] : resources;
      const sum = (values, field) =>
        values.reduce((total, value) => total + (value[field] || 0), 0);

      return {
        domContentLoadedMs: navigation
          ? navigation.domContentLoadedEventEnd
          : null,
        loadMs: navigation ? navigation.loadEventEnd : null,
        domNodes: document.getElementsByTagName('*').length,
        resourceCount: entries.length,
        transferBytes: sum(entries, 'transferSize'),
        encodedBytes: sum(entries, 'encodedBodySize'),
        decodedBytes: sum(entries, 'decodedBodySize'),
        scriptDecodedBytes: sum(
          entries.filter(entry => entry.initiatorType === 'script'),
          'decodedBodySize'
        )
      };
    });

    const result = {
      name: target.name,
      path: target.path,
      httpStatus: response.status(),
      domContentLoadedMs: Math.round(pageMetrics.domContentLoadedMs || 0),
      loadMs: Math.round(pageMetrics.loadMs || 0),
      domNodes: pageMetrics.domNodes,
      resourceCount: pageMetrics.resourceCount,
      transferMiB: toMiB(pageMetrics.transferBytes),
      encodedMiB: toMiB(pageMetrics.encodedBytes),
      decodedMiB: toMiB(pageMetrics.decodedBytes),
      scriptDecodedMiB: toMiB(pageMetrics.scriptDecodedBytes),
      jsHeapUsedMiB: toMiB(metricMap.JSHeapUsedSize || 0)
    };
    results.push(result);
    console.log(
      `PASS ${target.name} transfer=${result.transferMiB} MiB ` +
        `decoded=${result.decodedMiB} MiB scripts=${result.scriptDecodedMiB} MiB ` +
        `nodes=${result.domNodes}`
    );

    await context.close();
  }
} finally {
  await browser.close();
}

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  mode: 'production-build',
  routes: results
};

if (outputPath) {
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

console.log(`SUMMARY measured=${results.length} mode=production-build`);
