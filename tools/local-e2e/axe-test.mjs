import { writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium, firefox, webkit } from '@playwright/test';

const require = createRequire(import.meta.url);

function readOption(name, fallback = '') {
  const prefix = `--${name}=`;
  const value = process.argv.find(argument => argument.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

const strict = process.argv.includes('--strict');
const baseUrl = readOption(
  'base-url',
  process.env.AXE_BASE_URL || 'http://localhost:8000'
).replace(/\/$/, '');
const customUrl = readOption('url');
const outputPath = readOption('output');
const timeout = Number(readOption('timeout', '60000'));
const browserName = readOption('browser', 'chromium');
const skippedNames = new Set(
  readOption('skip')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean)
);

const browserTypes = { chromium, firefox, webkit };
const browserType = browserTypes[browserName];

if (!browserType) {
  console.error(`Navigateur Axe inconnu : ${browserName}`);
  process.exit(2);
}

if (!Number.isFinite(timeout) || timeout < 1) {
  console.error(`Timeout Axe invalide : ${timeout}`);
  process.exit(2);
}

const defaultTargets = [
  { name: 'home-light', path: '/', theme: 'light', ready: 'h1' },
  {
    name: 'cours-fr-light',
    path: '/cours-fr',
    theme: 'light',
    ready: 'h1'
  },
  {
    name: 'catalog-light',
    path: '/catalog',
    theme: 'light',
    ready: '.catalog-search input'
  },
  {
    name: 'catalog-dark',
    path: '/catalog',
    theme: 'dark',
    ready: '.catalog-search input'
  },
  {
    name: 'learn-light',
    path: '/learn',
    theme: 'light',
    ready: 'main'
  },
  {
    name: 'exam-fr-intro',
    path: '/exam-fr?cert=responsive-web-design-v9',
    theme: 'light',
    ready: 'h1'
  },
  {
    name: 'exam-fr-question',
    path: '/exam-fr?cert=responsive-web-design-v9',
    theme: 'dark',
    ready: 'h1',
    action: 'start-exam'
  },
  {
    name: 'exam-fr-results',
    path: '/exam-fr?cert=responsive-web-design-v9',
    theme: 'light',
    ready: 'h1',
    setup: 'unfinished-exam',
    action: 'finish-unanswered-exam'
  },
  {
    name: 'exam-download-local',
    path:
      '/learn/responsive-web-design-v9/' +
      'exam-responsive-web-design-certification/' +
      'exam-responsive-web-design-certification',
    theme: 'light',
    ready: 'h1'
  },
  {
    name: 'dev-fr-light',
    path: '/dev-fr',
    theme: 'light',
    ready: 'h1'
  }
];

const targets = customUrl
  ? [{ name: 'custom-url', url: customUrl, theme: 'light' }]
  : defaultTargets;
const axePath = require.resolve('axe-core/axe.min.js');
const results = {
  browser: browserName,
  strict,
  requested: targets.length,
  loaded: 0,
  scanned: 0,
  skipped: 0,
  failed: 0,
  serious: 0,
  pages: []
};

async function prepareTarget(page, target) {
  if (target.ready) {
    await page.locator(target.ready).first().waitFor({
      state: 'visible',
      timeout
    });
  } else {
    await page.locator('body').waitFor({ state: 'visible', timeout });
  }

  if (target.action === 'start-exam') {
    await page
      .getByRole('button', { name: "Commencer l'examen" })
      .click({ timeout });
    await page
      .locator('.exam-fr-question')
      .waitFor({ state: 'visible', timeout });
  }

  if (target.action === 'finish-unanswered-exam') {
    await page.getByText('Question 80 / 80').waitFor({ timeout });
    await page.getByRole('button', { name: 'Terminer' }).click({ timeout });
    await page
      .getByRole('button', { name: 'Terminer quand même' })
      .click({ timeout });
    await page.getByRole('heading', { name: /Résultats/ }).waitFor({ timeout });
  }
}

const browser = await browserType.launch();

try {
  for (const target of targets) {
    const pageResult = {
      name: target.name,
      url: target.url || `${baseUrl}${target.path}`,
      theme: target.theme,
      status: 'pending',
      violations: 0,
      serious: 0,
      error: ''
    };
    results.pages.push(pageResult);

    if (skippedNames.has(target.name)) {
      results.skipped++;
      pageResult.status = 'skipped';
      console.log(`SKIP ${target.name} (demandé par --skip)`);
      continue;
    }

    const context = await browser.newContext();
    await context.addInitScript(
      ({ theme, setup }) => {
        window.localStorage.setItem('theme', theme);
        if (setup === 'unfinished-exam') {
          window.localStorage.setItem(
            'fcc-exam-session',
            JSON.stringify({
              version: 1,
              byCert: {
                'responsive-web-design-v9': {
                  cert: 'responsive-web-design-v9',
                  seed: 123456,
                  currentIndex: 79,
                  answers: new Array(80).fill(null),
                  mode: 'full',
                  reviewQuestions: [],
                  updatedAt: new Date().toISOString()
                }
              }
            })
          );
        }
      },
      { theme: target.theme, setup: target.setup }
    );

    const targetOrigin = new URL(pageResult.url).origin;
    await context.route('**/*', async route => {
      const requestUrl = route.request().url();

      try {
        const url = new URL(requestUrl);
        if (/^https?:$/.test(url.protocol) && url.origin !== targetOrigin) {
          await route.abort('blockedbyclient');
          return;
        }
      } catch {
        // Non-HTTP browser resources can continue.
      }

      await route.continue();
    });

    const page = await context.newPage();

    try {
      const response = await page.goto(pageResult.url, {
        waitUntil: 'domcontentloaded',
        timeout
      });

      if (!response || response.status() >= 400) {
        throw new Error(
          `navigation HTTP ${response ? response.status() : 'sans réponse'}`
        );
      }

      await prepareTarget(page, target);
      results.loaded++;

      await page.addScriptTag({ path: axePath });
      const axeResult = await page.evaluate(async () => {
        if (!window.axe) throw new Error('window.axe absent après injection');
        return window.axe.run(document);
      });
      const serious = axeResult.violations.filter(
        violation =>
          violation.impact === 'serious' || violation.impact === 'critical'
      );

      results.scanned++;
      results.serious += serious.length;
      pageResult.status = 'scanned';
      pageResult.violations = axeResult.violations.length;
      pageResult.serious = serious.length;
      pageResult.seriousViolations = serious.map(violation => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.map(node => ({
          target: node.target,
          html: node.html,
          failureSummary: node.failureSummary
        }))
      }));

      const tag = serious.length === 0 ? 'OK  ' : 'WARN';
      console.log(
        `${tag} ${target.name.padEnd(20)} ` +
          `${axeResult.violations.length} violation(s), ` +
          `${serious.length} sérieuse(s)`
      );

      for (const violation of serious) {
        console.log(
          `     - [${violation.impact}] ${violation.id}: ` +
            `${violation.help} (${violation.nodes.length} nœud(s))`
        );
      }
    } catch (error) {
      results.failed++;
      pageResult.status = 'failed';
      pageResult.error =
        error instanceof Error ? error.message.split('\n')[0] : String(error);
      console.log(`FAIL ${target.name.padEnd(20)} ${pageResult.error}`);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}

console.log('');
console.log(
  'SUMMARY ' +
    `requested=${results.requested} loaded=${results.loaded} ` +
    `scanned=${results.scanned} skipped=${results.skipped} ` +
    `failed=${results.failed} serious=${results.serious}`
);

if (outputPath) {
  await writeFile(outputPath, `${JSON.stringify(results, null, 2)}\n`, 'utf8');
}

const infrastructureFailed =
  results.scanned === 0 ||
  results.failed > 0 ||
  results.loaded !== results.scanned ||
  results.scanned + results.skipped !== results.requested;
const strictFailed = strict && (results.skipped > 0 || results.serious > 0);

if (infrastructureFailed || strictFailed) {
  process.exit(1);
}

console.log(
  results.serious === 0
    ? 'Aucune violation Axe sérieuse sur les états scannés.'
    : `${results.serious} violation(s) sérieuse(s), mode rapport non bloquant.`
);
