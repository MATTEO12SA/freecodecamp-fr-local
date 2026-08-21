import assert from 'node:assert/strict';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);
const outDir = path.join(rootDir, 'screenshots', 'current');
const baseUrl = (
  process.env.AUDIT_BASE_URL || 'http://localhost:8000'
).replace(/\/$/, '');

const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };

const shots = [];

async function assertServerUp() {
  const response = await fetch(`${baseUrl}/`).catch(() => null);
  if (!response || !response.ok) {
    throw new Error(
      `Serveur injoignable sur ${baseUrl}. Lance .\\dev.ps1 puis reessaie.`
    );
  }
}

async function waitReady(page, selector = 'h1') {
  await page.locator(selector).first().waitFor({ state: 'visible' });
}

async function waitMenuClosed(page) {
  await page
    .locator('.nav-list.display-menu')
    .waitFor({ state: 'hidden', timeout: 5000 })
    .catch(() => {});
}

async function shot(page, relativePath, note, { fullPage = false } = {}) {
  const filePath = path.join(outDir, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await page.screenshot({
    path: filePath,
    fullPage,
    animations: 'disabled'
  });
  shots.push({
    file: relativePath.replaceAll('\\', '/'),
    url: page.url().replace(baseUrl, '') || '/',
    title: await page.title(),
    note,
    fullPage
  });
  console.log(`OK  ${relativePath}`);
}

async function openMenu(page) {
  await page
    .locator('[data-playwright-test-label="header-menu-button"]')
    .click();
  await page.getByRole('link', { name: 'Parcours', exact: true }).waitFor();
}

async function goto(page, urlPath, ready = 'h1') {
  const response = await page.goto(`${baseUrl}${urlPath}`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  if (!response || response.status() >= 400) {
    throw new Error(`${urlPath}: HTTP ${response?.status() ?? 'aucune'}`);
  }
  await waitReady(page, ready);
}

async function run() {
  await assertServerUp();
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();

  try {
    const light = await browser.newContext({
      viewport: desktop,
      locale: 'fr-FR'
    });
    await light.addInitScript(() => {
      window.localStorage.setItem('theme', 'light');
    });
    const page = await light.newPage();

    await goto(page, '/');
    await page.getByRole('link', { name: 'Voir les cours' }).waitFor();
    await shot(page, 'desktop/01-accueil.png', 'Accueil : un CTA clair, deux raccourcis.');

    await openMenu(page);
    await shot(
      page,
      'desktop/02-menu.png',
      'Menu : Cursus = carte complète, Parcours = hub FR, Catalogue = recherche.'
    );
    await page.getByRole('link', { name: 'Parcours', exact: true }).click();
    await page.waitForURL(/\/cours-fr\/?$/);
    await waitMenuClosed(page);
    await waitReady(page);
    await shot(
      page,
      'desktop/03-parcours.png',
      'Hub : trois portes d’entrée, la carte française est mise en avant.'
    );

    await page
      .getByRole('link', { name: /Cours disponibles en français/ })
      .first()
      .click();
    await page.waitForURL(/view=certifications/);
    await waitReady(page);
    await shot(
      page,
      'desktop/04-certifications.png',
      'Liste des certifications traduites, sans doublon catalogue.'
    );

    await page.getByRole('link', { name: /JavaScript/ }).click();
    await page.waitForURL(/cert=javascript-v9/);
    await waitReady(page);
    await page.getByRole('link', { name: /Passer l'examen/ }).waitFor();
    const certProgress = await page.locator('.cours-fr-progress-label').innerText();
    assert.match(certProgress, /\d+\/\d+ exercices/);
    await shot(
      page,
      'desktop/05-javascript.png',
      'Page certification : titre réel + bouton Passer l’examen. Compteur aligné sur l’accordéon.'
    );

    await goto(page, '/catalog', '#catalog-search-input');
    await shot(page, 'desktop/06-catalogue.png', 'Catalogue au repos (viewport, page trop longue pour fullPage).');
    await page.locator('#catalog-search-input').fill('javascript');
    await page.waitForURL(/q=javascript/);
    await page.locator('#topic-filter-dropdown').click();
    await page
      .locator('[role="menu"]')
      .getByText('Français', { exact: true })
      .click();
    await page.waitForURL(/topic=french/);
    assert.match(page.url(), /q=javascript/);
    assert.match(page.url(), /topic=french/);
    await shot(
      page,
      'desktop/07-catalogue-filtre.png',
      'Recherche javascript + filtre Français, URL conservée.'
    );

    await goto(page, '/exam-fr');
    const examPicker = await page.locator('main').innerText();
    assert.match(examPicker, /JavaScript \(\d+ questions\)/);
    assert.doesNotMatch(examPicker, /\bPython\b/);
    assert.doesNotMatch(examPicker, /Bases de données relationnelles/);
    assert.doesNotMatch(examPicker, /Back-End et APIs/);
    await shot(
      page,
      'desktop/08-examen-choix.png',
      'Sans cert : seulement les parcours qui ont des quiz FR, avec le nombre de questions.'
    );

    await page.getByRole('link', { name: /^JavaScript/ }).click();
    await waitReady(page);
    await shot(
      page,
      'desktop/09-examen-intro.png',
      'Intro d’examen avec Commencer.'
    );
    await page.getByRole('button', { name: "Commencer l'examen" }).click();
    await page.getByText(/Question 1/).waitFor();
    await shot(
      page,
      'desktop/10-examen-question.png',
      'Première question, comme un vrai passage.'
    );

    await goto(page, '/learn');
    await shot(
      page,
      'desktop/11-cursus.png',
      'Carte complète + bannière vers le parcours FR (viewport).'
    );

    await goto(page, '/404.html');
    await shot(page, 'desktop/12-404.png', 'Page 404 utilisateur.');

    await goto(page, '/dev-fr');
    await shot(
      page,
      'desktop/13-dev-fr.png',
      'Hub dev (visible seulement en développement, viewport).'
    );

    await light.close();

    const resume = await browser.newContext({
      viewport: desktop,
      locale: 'fr-FR'
    });
    await resume.addInitScript(() => {
      window.localStorage.setItem('theme', 'light');
      window.localStorage.setItem(
        'fcc-exam-session',
        JSON.stringify({
          version: 2,
          byCert: {
            'javascript-v9': {
              cert: 'javascript-v9',
              seed: 42,
              currentIndex: 12,
              answers: Array(80).fill(null),
              mode: 'full',
              reviewIndexes: [],
              updatedAt: new Date().toISOString()
            }
          }
        })
      );
    });
    const resumePage = await resume.newPage();
    await goto(resumePage, '/exam-fr?cert=javascript-v9');
    await resumePage.getByRole('button', { name: 'Reprendre' }).waitFor();
    await resumePage.getByRole('button', { name: 'Recommencer' }).waitFor();
    await shot(
      resumePage,
      'desktop/14-examen-reprise.png',
      'Session en cours : Reprendre (primaire) ou Recommencer (danger).'
    );
    await resume.close();

    const dark = await browser.newContext({
      viewport: desktop,
      locale: 'fr-FR'
    });
    await dark.addInitScript(() => {
      window.localStorage.setItem('theme', 'dark');
    });
    const darkPage = await dark.newPage();
    await goto(darkPage, '/');
    await shot(darkPage, 'dark/01-accueil.png', 'Accueil sombre, CTA contrasté.');
    await goto(darkPage, '/catalog', '#catalog-search-input');
    await shot(darkPage, 'dark/02-catalogue.png', 'Recherche catalogue en sombre (viewport).');
    await goto(darkPage, '/exam-fr?cert=javascript-v9');
    await shot(darkPage, 'dark/03-examen.png', 'Intro examen en sombre.');
    await dark.close();

    const phone = await browser.newContext({
      viewport: mobile,
      locale: 'fr-FR',
      isMobile: true,
      hasTouch: true
    });
    await phone.addInitScript(() => {
      window.localStorage.setItem('theme', 'light');
    });
    const mobilePage = await phone.newPage();
    await goto(mobilePage, '/');
    await shot(mobilePage, 'mobile/01-accueil.png', 'Accueil 390×844.');
    await goto(mobilePage, '/cours-fr');
    await shot(mobilePage, 'mobile/02-parcours.png', 'Hub parcours mobile.');
    await goto(mobilePage, '/catalog', '#catalog-search-input');
    await shot(mobilePage, 'mobile/03-catalogue.png', 'Catalogue mobile (viewport).');
    await goto(mobilePage, '/exam-fr?cert=responsive-web-design-v9');
    await shot(mobilePage, 'mobile/04-examen.png', 'Intro examen mobile.');
    await phone.close();
  } finally {
    await browser.close();
  }

  const takenAt = new Date().toISOString();
  const manifest = {
    takenAt,
    baseUrl,
    count: shots.length,
    shots
  };
  await writeFile(
    path.join(outDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8'
  );

  const gallery = [
    '# Captures actuelles',
    '',
    `Générées le ${takenAt} contre \`${baseUrl}\`.`,
    '',
    `${shots.length} PNG dans ce dossier. Ce README **n’embarque pas** les images : les ouvrir une par une, sinon l’éditeur devient inutilisable.`,
    '',
    'Relancer : `pnpm screenshots` (serveur déjà UP). Les pages longues sont en viewport, pas en fullPage.',
    '',
    '| Fichier | URL | Note |',
    '| --- | --- | --- |',
    ...shots.map(
      item => `| [${item.file}](./${item.file}) | \`${item.url}\` | ${item.note} |`
    ),
    ''
  ].join('\n');
  await writeFile(path.join(outDir, 'README.md'), gallery, 'utf8');

  console.log(`\n${shots.length} captures dans screenshots/current/`);
}

run().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
