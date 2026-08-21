// Mock pour les tests : preval ne s'exécute pas sous vitest.
// Couverture alignée sur les certifications v9 du catalogue fork FR.
const COVERAGE: Record<
  string,
  {
    translated: number;
    total: number;
    introTranslated: number;
    introTotal: number;
    pct: number;
    complete: boolean;
  }
> = {
  'responsive-web-design-v9': {
    translated: 1553,
    total: 1553,
    introTranslated: 1,
    introTotal: 1,
    pct: 100,
    complete: true
  },
  'javascript-v9': {
    translated: 1311,
    total: 1311,
    introTranslated: 1,
    introTotal: 1,
    pct: 100,
    complete: true
  },
  'front-end-development-libraries-v9': {
    translated: 532,
    total: 532,
    introTranslated: 1,
    introTotal: 1,
    pct: 100,
    complete: true
  },
  'back-end-development-and-apis-v9': {
    translated: 48,
    total: 48,
    introTranslated: 1,
    introTotal: 1,
    pct: 100,
    complete: true
  },
  'python-v9': {
    translated: 0,
    total: 527,
    introTranslated: 0,
    introTotal: 1,
    pct: 0,
    complete: false
  },
  'relational-databases-v9': {
    translated: 0,
    total: 64,
    introTranslated: 0,
    introTotal: 1,
    pct: 0,
    complete: false
  },
  'full-stack-developer-v9': {
    translated: 0,
    total: 1,
    introTranslated: 0,
    introTotal: 1,
    pct: 0,
    complete: false
  }
};

export const hasFrenchIntro = (superBlock: string): boolean => {
  const coverage = COVERAGE[superBlock];
  return Boolean(coverage && coverage.translated > 0);
};

export const hasFrenchBlock = (block: string): boolean =>
  block.startsWith('quiz-javascript') ||
  block.startsWith('quiz-css') ||
  block.startsWith('quiz-html') ||
  block.startsWith('quiz-basic-') ||
  block.startsWith('quiz-semantic-') ||
  block.startsWith('quiz-responsive-') ||
  block.startsWith('quiz-computer-') ||
  block.startsWith('quiz-design-') ||
  block.startsWith('quiz-styling-');

export const getFrenchFileCoverage = (
  superBlock: string
): {
  translated: number;
  total: number;
  introTranslated: number;
  introTotal: number;
  pct: number;
  complete: boolean;
} =>
  COVERAGE[superBlock] ?? {
    translated: 0,
    total: 0,
    introTranslated: 0,
    introTotal: 0,
    pct: 0,
    complete: false
  };
