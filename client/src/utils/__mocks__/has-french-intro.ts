// Mock pour les tests : preval ne s'exécute pas sous vitest.
// Couverture alignée sur les certifications v9 du catalogue fork FR.
const COVERAGE: Record<string, { translated: number; total: number }> = {
  'responsive-web-design-v9': { translated: 1553, total: 1553 },
  'javascript-v9': { translated: 1311, total: 1311 },
  'front-end-development-libraries-v9': { translated: 532, total: 532 },
  'back-end-development-and-apis-v9': { translated: 48, total: 48 },
  'python-v9': { translated: 0, total: 527 },
  'relational-databases-v9': { translated: 0, total: 64 },
  'full-stack-developer-v9': { translated: 0, total: 1 }
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
): { translated: number; total: number } =>
  COVERAGE[superBlock] ?? { translated: 0, total: 0 };
