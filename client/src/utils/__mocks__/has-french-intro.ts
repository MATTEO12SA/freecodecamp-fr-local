// Mock pour les tests : preval ne s'exécute pas sous vitest.
// La liste retournée doit refléter au moins une superblock présente dans
// le catalogue pour que les tests qui appliquent le filtre Francais
// trouvent des résultats à comparer.
export const hasFrenchIntro = (superBlock: string): boolean =>
  superBlock === 'responsive-design';

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
  superBlock === 'responsive-design'
    ? { translated: 12, total: 12 }
    : { translated: 0, total: 8 };
