// Mock pour les tests : preval ne s'exécute pas sous vitest.
// La liste retournée doit refléter au moins une superblock présente dans
// le catalogue pour que les tests qui appliquent le filtre Francais
// trouvent des résultats à comparer.
export const hasFrenchIntro = (superBlock: string): boolean =>
  superBlock === 'responsive-design';
