import { describe, expect, test } from 'vitest';
import { getTranslationPercent } from './translation-percent';

describe('getTranslationPercent', () => {
  test('uses the honest pct when present', () => {
    expect(
      getTranslationPercent({
        translated: 1311,
        total: 1311,
        pct: 99,
        complete: false
      })
    ).toBe(99);
  });

  test('never treats file-only coverage as 100', () => {
    expect(
      getTranslationPercent({
        translated: 1311,
        total: 1311,
        complete: false
      })
    ).toBe(99);
  });

  test('returns 0 when there are no English files', () => {
    expect(getTranslationPercent({ translated: 0, total: 0 })).toBe(0);
  });
});
