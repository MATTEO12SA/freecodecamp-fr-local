// Audit accessibilite (axe-core) des pages ECRITES A LA MAIN dans ce fork.
// Ces pages contournent les composants relus d'upstream, donc c'est la surface
// la plus a risque pour l'a11y (labels, focus, contrastes des badges).
//
// Prerequis : serveur dev UP (.\dev.ps1) et axe-core disponible. Si axe-core
// n'est pas installe, on tente un CDN ; sinon le test s'arrete proprement sans
// bloquer (exit 0) en affichant la commande d'installation.
//
// Usage:
//   node axe-test.mjs            # rapport, ne bloque pas (warn)
//   node axe-test.mjs --strict   # exit 1 si violations serieuses
import { chromium } from '@playwright/test';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const BASE = 'http://localhost:8000';
const STRICT = process.argv.includes('--strict');

const PAGES = [
  { name: 'cours-fr', path: '/cours-fr' },
  { name: 'catalog', path: '/catalog' },
  { name: 'exam-fr', path: '/exam-fr?cert=responsive-web-design-v9' },
  { name: 'dev-fr', path: '/dev-fr' }
];

// Resout la source axe-core : paquet local d'abord, CDN en repli.
function resolveAxeSource() {
  try {
    return { type: 'path', value: require.resolve('axe-core/axe.min.js') };
  } catch {
    return {
      type: 'url',
      value: 'https://cdn.jsdelivr.net/npm/axe-core@4/axe.min.js'
    };
  }
}

const axeSource = resolveAxeSource();
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

let totalSerious = 0;
let axeLoadFailed = false;

for (const target of PAGES) {
  try {
    await page.goto(`${BASE}${target.path}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    if (axeSource.type === 'path') {
      await page.addScriptTag({ path: axeSource.value });
    } else {
      await page.addScriptTag({ url: axeSource.value });
    }
    // eslint-disable-next-line no-undef
    const results = await page.evaluate(async () => window.axe.run());
    const serious = results.violations.filter(
      v => v.impact === 'serious' || v.impact === 'critical'
    );
    totalSerious += serious.length;
    const tag = serious.length === 0 ? 'OK  ' : 'WARN';
    console.log(
      `${tag} ${target.name.padEnd(10)} ${results.violations.length} violation(s), ` +
        `${serious.length} serieuse(s)`
    );
    for (const v of serious) {
      console.log(`       - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} noeud(s))`);
    }
  } catch (err) {
    if (/addScriptTag|net::|axe/i.test(err.message)) axeLoadFailed = true;
    console.log(`SKIP ${target.name.padEnd(10)} ${err.message.split('\n')[0]}`);
  }
}

await browser.close();

console.log('');
if (axeLoadFailed) {
  console.log(
    'axe-core indisponible (paquet absent et CDN injoignable). ' +
      'Installe-le pour un audit complet : pnpm -C client add -D axe-core'
  );
  process.exit(0);
}

if (totalSerious > 0) {
  console.log(`${totalSerious} violation(s) a11y serieuse(s) au total.`);
  process.exit(STRICT ? 1 : 0);
}
console.log('Aucune violation a11y serieuse sur les pages custom.');
process.exit(0);
