import { chromium, firefox, webkit } from '@playwright/test';

function readOption(name, fallback = '') {
  const prefix = `--${name}=`;
  const value = process.argv.find(argument => argument.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

const baseUrl = readOption('base-url', 'http://localhost:8000').replace(
  /\/$/,
  ''
);
const browserName = readOption('browser', 'chromium');
const browserTypes = { chromium, firefox, webkit };
const browserType = browserTypes[browserName];

if (!browserType) {
  console.error(`Navigateur réseau inconnu : ${browserName}`);
  process.exit(2);
}

const forbiddenDomains = [
  'googletagmanager.com',
  'google-analytics.com',
  'region1.google-analytics.com',
  'js.stripe.com',
  'm.stripe.com',
  'm.stripe.network'
];
const routes = [
  { name: 'home', path: '/', ready: 'body' },
  { name: 'catalog', path: '/catalog', ready: '.catalog-search input' },
  { name: 'learn', path: '/learn', ready: 'main' },
  {
    name: 'exam-download',
    path:
      '/learn/responsive-web-design-v9/' +
      'exam-responsive-web-design-certification/' +
      'exam-responsive-web-design-certification',
    ready: 'h1'
  },
  {
    name: 'exam-fr',
    path: '/exam-fr?cert=responsive-web-design-v9',
    ready: 'h1'
  },
  {
    name: 'challenge-editor',
    path: '/learn/responsive-web-design-v9/workshop-cat-photo-app/step-1',
    ready: '.desktop-layout'
  },
  {
    name: 'video-course',
    path:
      '/learn/data-analysis-with-python/' +
      'data-analysis-with-python-course/introduction-to-data-analysis',
    ready: '.video-wrapper iframe'
  }
];

function isForbidden(urlValue) {
  try {
    const url = new URL(urlValue);
    const hostname = url.hostname.toLowerCase();
    return forbiddenDomains.some(
      domain => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

function isLocalBackend(urlValue) {
  try {
    const url = new URL(urlValue);
    return (
      url.port === '3000' &&
      ['localhost', '127.0.0.1', '::1', '[::1]'].includes(url.hostname)
    );
  } catch {
    return false;
  }
}

function parseRgb(value) {
  const channels = value
    .match(/[\d.]+/g)
    ?.slice(0, 3)
    .map(Number);
  if (!channels || channels.length !== 3) {
    throw new Error(`Couleur CSS non reconnue : ${value}`);
  }
  return channels;
}

function relativeLuminance(color) {
  const [red, green, blue] = parseRgb(color).map(channel => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first, second) {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

const browser = await browserType.launch();
const forbiddenRequests = [];
const backendRequests = [];
const consoleErrors = [];
const consoleWarnings = [];
const auditedWarningPatterns = [
  /plugin named .+ is already registered/i,
  /unrecognized feature: ['"]web-share/i,
  /cookie .+_ga_.+ has been overwritten/i
];
const ignoredConsoleErrors = [];
const failures = [];

async function configureNetworkGuard(targetContext) {
  targetContext.on('request', request => {
    if (isForbidden(request.url())) forbiddenRequests.push(request.url());
    if (isLocalBackend(request.url())) backendRequests.push(request.url());
  });

  await targetContext.route('**/*', async route => {
    const url = route.request().url();
    if (isForbidden(url) || isLocalBackend(url)) {
      await route.abort('blockedbyclient');
      return;
    }
    await route.continue();
  });
}

function observeConsole(targetPage) {
  targetPage.on('console', message => {
    if (message.type() === 'error') {
      const text = message.text();
      if (
        text.includes('/__webpack_hmr') &&
        text.includes('was interrupted while the page was loading')
      ) {
        ignoredConsoleErrors.push(`${targetPage.url()} :: ${text}`);
      } else {
        consoleErrors.push(`${targetPage.url()} :: ${text}`);
      }
    } else if (message.type() === 'warning') {
      const text = message.text();
      if (auditedWarningPatterns.some(pattern => pattern.test(text))) {
        consoleWarnings.push(`${targetPage.url()} :: ${text}`);
      }
    }
  });
  targetPage.on('pageerror', error => {
    consoleErrors.push(`${targetPage.url()} :: ${error.message}`);
  });
}

const context = await browser.newContext();
await configureNetworkGuard(context);

for (const target of routes) {
  const targetPage = await context.newPage();
  observeConsole(targetPage);
  try {
    const response = await targetPage.goto(`${baseUrl}${target.path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    if (!response || response.status() >= 400) {
      throw new Error(`HTTP ${response ? response.status() : 'sans réponse'}`);
    }
    await targetPage.locator(target.ready).first().waitFor({
      state: 'visible',
      timeout: 60000
    });
    await targetPage.waitForTimeout(
      target.name === 'exam-download' ? 2500 : 800
    );
    console.log(`PASS ${target.name} (${response.status()})`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${target.name}: ${message}`);
    console.log(`FAIL ${target.name}: ${message.split('\n')[0]}`);
  } finally {
    await targetPage.close();
  }
}

try {
  for (const theme of ['light', 'dark']) {
    const themeContext = await browser.newContext();
    await configureNetworkGuard(themeContext);
    await themeContext.addInitScript(selectedTheme => {
      window.localStorage.setItem('theme', selectedTheme);
    }, theme);
    const themePage = await themeContext.newPage();
    observeConsole(themePage);

    await themePage.goto(`${baseUrl}/catalog`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    const input = themePage.locator('.catalog-search input');
    await input.waitFor({ state: 'visible', timeout: 60000 });
    await input.fill('javascript');
    await input.focus();

    const styles = await input.evaluate(element => {
      const computed = window.getComputedStyle(element);
      const placeholder = window.getComputedStyle(element, '::placeholder');

      return {
        bodyClass: document.body.className,
        background: computed.backgroundColor,
        border: computed.borderColor,
        boxShadow: computed.boxShadow,
        color: computed.color,
        outline: computed.outlineColor,
        placeholder: placeholder.color
      };
    });

    const textContrast = contrastRatio(styles.color, styles.background);
    const placeholderContrast = contrastRatio(
      styles.placeholder,
      styles.background
    );
    const focusVisible =
      styles.boxShadow !== 'none' ||
      styles.border !== styles.background ||
      styles.outline !== styles.background;

    if (!styles.bodyClass.includes(`${theme}-palette`)) {
      failures.push(`${theme}: palette absente (${styles.bodyClass})`);
    }
    if (textContrast < 4.5) {
      failures.push(
        `${theme}: contraste texte ${textContrast.toFixed(2)} inférieur à 4,5`
      );
    }
    if (placeholderContrast < 4.5) {
      failures.push(
        `${theme}: contraste placeholder ${placeholderContrast.toFixed(2)} inférieur à 4,5`
      );
    }
    if (!focusVisible) failures.push(`${theme}: focus non visible`);

    console.log(
      `PASS catalog-${theme} contrast ` +
        `text=${textContrast.toFixed(2)} ` +
        `placeholder=${placeholderContrast.toFixed(2)}`
    );

    await themeContext.close();
  }
} catch (error) {
  failures.push(
    `catalog themes: ${error instanceof Error ? error.message : String(error)}`
  );
}

await context.close();
await browser.close();

if (forbiddenRequests.length > 0) {
  failures.push(
    `requêtes tierces interdites: ${[...new Set(forbiddenRequests)].join(', ')}`
  );
}
if (backendRequests.length > 0) {
  failures.push(
    `requêtes port 3000: ${[...new Set(backendRequests)].join(', ')}`
  );
}
if (consoleErrors.length > 0) {
  failures.push(`erreurs console: ${[...new Set(consoleErrors)].join(' | ')}`);
}
if (consoleWarnings.length > 0) {
  failures.push(
    `warnings console: ${[...new Set(consoleWarnings)].join(' | ')}`
  );
}

console.log('');
console.log(
  `SUMMARY browser=${browserName} routes=${routes.length} ` +
    `telemetry=${forbiddenRequests.length} backend3000=${backendRequests.length} ` +
    `consoleErrors=${consoleErrors.length} consoleWarnings=${consoleWarnings.length} ` +
    `ignoredDevHmr=${ignoredConsoleErrors.length} failures=${failures.length}`
);

if (failures.length > 0) {
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PASS réseau local, console et contrastes catalogue.');
