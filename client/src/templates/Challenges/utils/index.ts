import i18next from 'i18next';

interface GuideData {
  forumTopicId?: number;
  title?: string;
}

export function getGuideUrl(_guideData: GuideData): string {
  return '';
}

export function isGoodXHRStatus(status?: string): boolean {
  if (!status) return false;
  const statusInt = parseInt(status, 10);
  return (statusInt >= 200 && statusInt < 400) || statusInt === 402;
}

export function transformEditorLink(url: string): string {
  return url
    .replace(
      /(\/\/)(?<projectname>[^.]+)\.(?<username>[^.]+)\.repl\.co\/?/,
      '//replit.com/@$<username>/$<projectname>'
    )
    .replace(
      /(\/\/)(?<projectname>[^.]+)\.glitch\.me\/?/,
      '//glitch.com/edit/#!/$<projectname>'
    );
}

export function enhancePrismAccessibility(
  prismEnv: Prism.hooks.ElementHighlightedEnvironment
): void {
  const langs: { [key: string]: string } = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    css: 'CSS',
    html: 'HTML',
    python: 'python',
    py: 'python',
    xml: 'XML',
    jsx: 'JSX',
    scss: 'SCSS',
    sql: 'SQL',
    http: 'HTTP',
    json: 'JSON',
    pug: 'pug',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    tsx: 'TSX',
    csharp: 'C#',
    clike: 'CLike',
    c: 'C',
    cpp: 'C++'
  };
  const parent = prismEnv?.element?.parentElement;
  if (
    !parent ||
    parent.nodeName !== 'PRE' ||
    parent.tabIndex !== 0 ||
    parent.dataset.noAria === 'true'
  ) {
    return;
  }

  parent.setAttribute('role', 'region');
  const codeType = prismEnv.element?.className
    .replace(/language-(.*)/, '$1')
    .toLowerCase();
  const codeName = langs[codeType] || '';
  parent.setAttribute(
    'aria-label',
    i18next.t('aria.code-example', {
      codeName
    })
  );
}

export function makePrismCollapsible(
  prismEnv: Prism.hooks.ElementHighlightedEnvironment
): void {
  const preElem = prismEnv?.element?.parentElement;
  const sectionElem = preElem?.parentElement;
  if (
    !preElem ||
    preElem.nodeName !== 'PRE' ||
    preElem.tabIndex !== 0 ||
    !sectionElem ||
    sectionElem.nodeName !== 'SECTION'
  ) {
    return;
  }

  const details = document.createElement('details');
  details.classList.add('code-details');

  const summary = document.createElement('summary');
  summary.classList.add('code-details-summary');
  summary.innerHTML = i18next.t('learn.example-code');

  details.appendChild(summary);
  details.appendChild(preElem.cloneNode(true));
  details.open = true;

  sectionElem.replaceChild(details, preElem);
}

export function setScrollbarArrowStyles(scrollbarWidth: number): void {
  const root = document.documentElement;

  root.style.setProperty(
    '--monaco-scrollbar-arrow-box-size',
    `${scrollbarWidth}px`
  );

  const iconSize = scrollbarWidth < 11 ? scrollbarWidth : scrollbarWidth - 5;
  const iconFontSize =
    scrollbarWidth < 11 ? scrollbarWidth : scrollbarWidth - 5;
  root.style.setProperty('--monaco-scrollbar-arrow-icon-size', `${iconSize}px`);
  root.style.setProperty(
    '--monaco-scrollbar-arrow-icon-font-size',
    `${iconFontSize}px`
  );

  const iconTopBottom =
    scrollbarWidth < 11 ? 0 : scrollbarWidth / 2 - iconFontSize / 2 - 1;
  const iconLeftPosition =
    scrollbarWidth < 11 ? 0 : (scrollbarWidth - iconFontSize) / 2;
  root.style.setProperty(
    '--monaco-scrollbar-arrow-icon-top-bottom',
    `${iconTopBottom}px`
  );
  root.style.setProperty(
    '--monaco-scrollbar-arrow-icon-left',
    `${iconLeftPosition}px`
  );
}
