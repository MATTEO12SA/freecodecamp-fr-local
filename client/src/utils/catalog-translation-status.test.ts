import { describe, expect, test } from 'vitest';
import { getCatalogTranslationStatus } from './catalog-translation-status';

describe('getCatalogTranslationStatus', () => {
  test('reports absent when no French challenge files exist', () => {
    expect(
      getCatalogTranslationStatus({
        translatedFiles: 0,
        totalFiles: 10,
        frenchIntro: {
          title: 'Cours traduit',
          intro: ['Résumé traduit.']
        },
        englishIntro: {
          title: 'Translated course',
          intro: ['Translated summary.']
        }
      })
    ).toBe('absent');
  });

  test('reports partial when only some challenge files are translated', () => {
    expect(
      getCatalogTranslationStatus({
        translatedFiles: 3,
        totalFiles: 10,
        frenchIntro: {
          title: 'Certification JavaScript',
          intro: ['Ce cours t’enseigne JavaScript.']
        },
        englishIntro: {
          title: 'JavaScript Certification',
          intro: ['This course teaches JavaScript.']
        }
      })
    ).toBe('partial');
  });

  test('reports partial when files are complete but the intro is still English', () => {
    expect(
      getCatalogTranslationStatus({
        translatedFiles: 10,
        totalFiles: 10,
        frenchIntro: {
          title: 'Cours traduit',
          intro: ['English fallback summary.']
        },
        englishIntro: {
          title: 'Translated course',
          intro: ['English fallback summary.']
        }
      })
    ).toBe('partial');
  });

  test('reads intro.json intro arrays, not a summary field', () => {
    expect(
      getCatalogTranslationStatus({
        translatedFiles: 10,
        totalFiles: 10,
        frenchIntro: {
          title: 'Cours traduit',
          intro: ['Résumé traduit.']
        },
        englishIntro: {
          title: 'Translated course',
          intro: ['Translated summary.']
        }
      })
    ).toBe('complete');
  });

  test('reports partial when files and the card intro are done but leftover labels remain', () => {
    expect(
      getCatalogTranslationStatus({
        translatedFiles: 10,
        totalFiles: 10,
        frenchIntro: {
          title: 'Cours traduit',
          intro: ['Résumé traduit.']
        },
        englishIntro: {
          title: 'Translated course',
          intro: ['Translated summary.']
        },
        labelsComplete: false
      })
    ).toBe('partial');
  });

  test('still accepts summary as a fallback key', () => {
    expect(
      getCatalogTranslationStatus({
        translatedFiles: 10,
        totalFiles: 10,
        frenchIntro: {
          title: 'Cours traduit',
          summary: ['Résumé traduit.']
        },
        englishIntro: {
          title: 'Translated course',
          summary: ['Translated summary.']
        }
      })
    ).toBe('complete');
  });
});
