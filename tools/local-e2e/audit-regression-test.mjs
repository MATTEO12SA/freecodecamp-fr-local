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
  process.env.AUDIT_BASE_URL || 'http://localhost:8000'
).replace(/\/$/, '');
const outputPath = readOption('output');
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
const context = await browser.newContext();
await context.addInitScript(() => {
  window.localStorage.setItem(
    'fcc-exam-history',
    JSON.stringify({
      version: 1,
      byCert: {
        'responsive-web-design-v9': [
          {
            cert: 'responsive-web-design-v9',
            date: '2026-07-25T12:00:00.000Z',
            score: 72,
            total: 80,
            pct: 90
          }
        ]
      }
    })
  );
});
const page = await context.newPage();

async function open(path) {
  const response = await page.goto(`${baseUrl}${path}`, {
    waitUntil: 'domcontentloaded'
  });
  assert.ok(response, `${path}: aucune réponse HTTP`);
  assert.ok(response.status() < 400, `${path}: HTTP ${response.status()}`);
  await page.locator('h1').first().waitFor({ state: 'visible' });
}

try {
  await record(
    'skip link focuses the unique main on custom pages',
    async () => {
      const paths = [
        '/',
        '/cours-fr',
        '/catalog',
        '/exam-fr?cert=responsive-web-design-v9',
        '/dev-fr'
      ];

      for (const path of paths) {
        await open(path);
        assert.equal(
          await page.locator('main').count(),
          1,
          `${path}: nombre de main`
        );
        assert.equal(
          await page.locator('main#content-start[tabindex="-1"]').count(),
          1,
          `${path}: cible content-start`
        );

        await page.keyboard.press('Tab');
        assert.match(
          (await page.locator(':focus').textContent()) || '',
          /Aller au contenu/i,
          `${path}: premier élément focusé`
        );
        await page.keyboard.press('Enter');
        await page.waitForFunction(
          () => document.activeElement?.id === 'content-start'
        );
      }
    }
  );

  await record('catalog has a title and ordered headings', async () => {
    await open('/catalog');
    assert.match(await page.title(), /Catalogue/i);

    const headingLevels = await page
      .locator('main h1, main h2, main h3, main h4, main h5, main h6')
      .evaluateAll(headings =>
        headings.map(heading => Number(heading.tagName.slice(1)))
      );
    assert.equal(headingLevels[0], 1);
    assert.ok(headingLevels.slice(1).every(level => level === 2));
  });

  await record('dev dashboard reads versioned exam history', async () => {
    await open('/dev-fr');
    const attempts = page
      .locator('.dev-fr-metric')
      .filter({ hasText: 'Tentatives examen' })
      .locator('strong');
    await attempts.waitFor({ state: 'visible' });
    assert.equal((await attempts.textContent())?.trim(), '1');
  });

  await record(
    'dev dashboard exposes one main and focusable logs',
    async () => {
      await open('/dev-fr');
      assert.equal(await page.locator('main').count(), 1);
      const logs = page.locator('pre.dev-fr-log');
      assert.ok((await logs.count()) > 0, 'aucune région de logs');
      for (let index = 0; index < (await logs.count()); index++) {
        const log = logs.nth(index);
        assert.equal(await log.getAttribute('role'), 'region');
        assert.equal(await log.getAttribute('tabindex'), '0');
        assert.ok(await log.getAttribute('aria-label'));
      }
    }
  );

  await record('exam picker lists only certifications with FR quizzes', async () => {
    await open('/exam-fr');
    assert.match(
      (await page.locator('h1').textContent()) ?? '',
      /Choisis une certification/
    );
    const picker = await page.locator('main').innerText();
    assert.match(picker, /JavaScript \(\d+ questions\)/);
    assert.doesNotMatch(picker, /\bPython\b/);
    assert.doesNotMatch(picker, /Bases de données relationnelles/);
    assert.doesNotMatch(picker, /Back-End et APIs/);
  });

  await record('invalid exam certification has a business error', async () => {
    await open('/exam-fr?cert=invalid');
    assert.equal(
      (await page.locator('h1').textContent())?.trim(),
      'Certification inconnue'
    );
    assert.match(await page.title(), /Certification inconnue/i);
    await assert.doesNotReject(async () => {
      await page
        .getByRole('link', { name: /Retour aux certifications/ })
        .waitFor();
    });
    assert.doesNotMatch(
      await page.locator('body').innerText(),
      /Aucun quiz FR/
    );
  });

  await record('developer navigation is visible in develop mode', async () => {
    await open('/');
    await page
      .locator('[data-playwright-test-label="header-menu-button"]')
      .click();
    await page.getByRole('link', { name: 'Dev FR' }).waitFor();
  });

  await record(
    'cours-fr view survives reload and browser history',
    async () => {
      await open('/cours-fr');
      await page
        .getByRole('link', { name: /Cours disponibles en français/ })
        .first()
        .click();
      await page.waitForURL(/view=certifications/);
      await page.getByRole('link', { name: /JavaScript/ }).click();
      await page.waitForURL(/cert=javascript-v9/);

      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.locator('h1').first().waitFor({ state: 'visible' });
      assert.match(await page.locator('main').innerText(), /JavaScript/);

      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.locator('h1').first().waitFor({ state: 'visible' });
      assert.match(page.url(), /view=certifications/);

      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.locator('h1').first().waitFor({ state: 'visible' });
      assert.equal(new URL(page.url()).search, '');
    }
  );

  await record('catalog filters survive URL reload and back', async () => {
    await open('/catalog?q=javascript');
    const search = page.locator('#catalog-search-input');
    assert.equal(await search.inputValue(), 'javascript');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await search.waitFor({ state: 'visible' });
    assert.equal(await search.inputValue(), 'javascript');

    await open('/catalog');
    await page.locator('#topic-filter-dropdown').click();
    await page
      .locator('[role="menu"]')
      .getByText('Français', { exact: true })
      .click();
    await page.waitForURL(/topic=french/);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('#topic-filter-dropdown').click();
    assert.equal(
      await page.locator('input[aria-label*="Français"]').isChecked(),
      true
    );

    await page.goBack({ waitUntil: 'domcontentloaded' });
    assert.equal(new URL(page.url()).search, '');
  });

  await record('snapshot action is truthful and reports age', async () => {
    await open('/dev-fr');
    await page.getByRole('button', { name: 'Relire le snapshot' }).waitFor();
    await page.getByText('Âge du snapshot').waitFor();
  });

  await record(
    'exam resumes, confirms unanswered finish and collapses results',
    async () => {
      await page.evaluate(() => {
        window.localStorage.setItem(
          'fcc-exam-session',
          JSON.stringify({
            version: 2,
            byCert: {
              'responsive-web-design-v9': {
                cert: 'responsive-web-design-v9',
                seed: 123456,
                currentIndex: 79,
                answers: new Array(80).fill(null),
                mode: 'full',
                reviewIndexes: [],
                updatedAt: new Date().toISOString()
              }
            }
          })
        );
      });

      await open('/exam-fr?cert=responsive-web-design-v9');
      await page.getByRole('button', { name: 'Reprendre' }).click();
      await page.locator('.exam-fr-progress').waitFor();
      assert.match(
        (await page.locator('.exam-fr-progress').innerText()).replace(
          /\s+/g,
          ' '
        ),
        /Question 80 \/ 80/
      );
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.locator('h1').first().waitFor({ state: 'visible' });
      await page.getByRole('button', { name: 'Reprendre' }).waitFor();
      await page.getByRole('button', { name: 'Reprendre' }).click();
      await page.locator('.exam-fr-progress').waitFor();
      assert.match(
        (await page.locator('.exam-fr-progress').innerText()).replace(
          /\s+/g,
          ' '
        ),
        /Question 80 \/ 80/
      );

      await page.getByRole('button', { name: 'Terminer' }).click();
      const confirmation = page.getByRole('alertdialog');
      await confirmation.waitFor();
      assert.match(await confirmation.innerText(), /80 questions sans réponse/);

      await page.getByRole('button', { name: "Continuer l'examen" }).click();
      assert.equal(await confirmation.count(), 0);

      await page.getByRole('button', { name: 'Terminer' }).click();
      await page.getByRole('button', { name: 'Terminer quand même' }).click();
      await page.getByRole('heading', { name: /Résultats/ }).waitFor();

      assert.equal(await page.locator('.exam-fr-review details').count(), 80);
      assert.equal(
        await page.locator('.exam-fr-review details[open]').count(),
        0
      );
      assert.ok(
        (await page.evaluate(() => document.documentElement.scrollHeight)) <
          10_000
      );
      assert.equal(
        await page.evaluate(() =>
          window.localStorage.getItem('fcc-exam-session')
        ),
        null
      );
    }
  );

  await record(
    'catalog paginates, uses three columns and keeps French cards in French',
    async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await open('/catalog?topic=french');

      const cards = page.locator('.catalog-item');
      assert.equal(await cards.count(), 12);
      assert.doesNotMatch(
        await page.locator('main').innerText(),
        /Understand when to use|Use pseudo-classes|Work with CSS color|Apply CSS techniques/
      );

      const firstRowColumns = await cards.evaluateAll(elements => {
        const positions = elements.map(element => {
          const rect = element.getBoundingClientRect();
          return { left: Math.round(rect.left), top: Math.round(rect.top) };
        });
        const firstTop = Math.min(...positions.map(position => position.top));
        return new Set(
          positions
            .filter(position => Math.abs(position.top - firstTop) <= 2)
            .map(position => position.left)
        ).size;
      });
      assert.ok(firstRowColumns >= 3, `${firstRowColumns} colonnes détectées`);

      await page
        .getByRole('button', { name: 'Afficher plus de cours' })
        .click();
      assert.ok((await cards.count()) > 12);
      await page.getByRole('link', { name: 'Retour en haut' }).waitFor();
    }
  );

  await record('catalog Escape restores focus to its dropdown', async () => {
    await open('/catalog');
    const toggle = page.locator('#topic-filter-dropdown');
    await toggle.click();
    const menu = page.locator('[role="menu"]').filter({
      has: page.getByText('Français', { exact: true })
    });
    await menu.getByText('Français', { exact: true }).focus();
    await page.keyboard.press('Escape');
    await page.waitForFunction(
      () => document.activeElement?.id === 'topic-filter-dropdown'
    );
  });

  await record('learn, archive and 404 use coherent French copy', async () => {
    await open('/learn');
    assert.doesNotMatch(
      await page.locator('main').innerText(),
      /Bon retour, You|Professional certifications|Prepare for the developer interview|Looking for older coursework/
    );

    await open('/learn/archive');
    assert.doesNotMatch(
      await page.locator('main').innerText(),
      /Archived Coursework|The content in this section|Our archived coursework|Quality Assurance|Scientific Computing with Python/
    );

    await open('/404.html');
    assert.doesNotMatch(
      await page.locator('main, .notfound-page-wrapper').innerText(),
      /Page not found|We couldn't find/
    );
  });

  await record(
    'short pages keep the footer at the viewport bottom',
    async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      for (const path of [
        '/cours-fr',
        '/exam-fr?cert=responsive-web-design-v9'
      ]) {
        await open(path);
        const footerBottom = await page
          .locator('footer')
          .evaluate(element => element.getBoundingClientRect().bottom);
        assert.ok(
          footerBottom >= 899,
          `${path}: footer à ${footerBottom.toFixed(1)} px`
        );
      }
    }
  );

  await record('dev translation table stays usable on mobile', async () => {
    await page.setViewportSize({ width: 360, height: 800 });
    await open('/dev-fr');
    const wrapper = page.locator('.dev-fr-table-wrap');
    const dimensions = await wrapper.evaluate(element => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth
    }));
    assert.ok(dimensions.scrollWidth <= dimensions.clientWidth + 1);
    const firstRow = wrapper.locator('tbody tr').first();
    assert.equal(
      await firstRow.evaluate(element => getComputedStyle(element).display),
      'block'
    );
    assert.equal(
      await firstRow.locator('td').first().getAttribute('data-label'),
      'Certification'
    );
  });

  await record(
    'local project identity is explicit in UI and metadata',
    async () => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await open('/catalog');
      await page.getByText('FR local', { exact: true }).waitFor();
      await page
        .getByText('Projet local non officiel basé sur freeCodeCamp', {
          exact: true
        })
        .waitFor();
      assert.match(await page.title(), /FR Local \(non officiel\)/);
    }
  );

  await record(
    'cours-fr separates available and upcoming certifications',
    async () => {
      await open('/cours-fr?view=certifications');
      await page
        .getByRole('heading', { name: 'Disponibles maintenant' })
        .waitFor();
      await page
        .getByRole('heading', { name: 'Traductions à venir' })
        .waitFor();
      assert.ok(
        (await page.locator('a[href*="?cert="]').count()) > 0,
        'aucune certification disponible'
      );
      const upcoming = page.locator('.cours-fr-upcoming-card');
      assert.ok((await upcoming.count()) > 0, 'aucune traduction à venir');
      assert.equal(await upcoming.locator('a').count(), 0);
    }
  );
} finally {
  await context.close();
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
