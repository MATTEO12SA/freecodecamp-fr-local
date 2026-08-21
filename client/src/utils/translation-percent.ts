import type { FrenchFileCoverage } from './has-french-intro';

export function getTranslationPercent(coverage: FrenchFileCoverage): number {
  if (typeof coverage.pct === 'number') return coverage.pct;
  if (coverage.total <= 0) return 0;
  const filePct = Math.floor((100 * coverage.translated) / coverage.total);
  if (coverage.complete === false) return Math.min(99, filePct);
  return filePct;
}
