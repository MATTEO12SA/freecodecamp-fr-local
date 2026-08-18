import { describe, expect, it } from 'vitest';

import {
  getExamCertificationTitle,
  listExamCertifications,
  listReadyExamCertifications
} from './exam-certifications';

describe('exam certification allowlist', () => {
  it('returns the display title of a known certification', () => {
    expect(getExamCertificationTitle('javascript-v9')).toBe('JavaScript');
  });

  it('rejects an unknown or missing certification', () => {
    expect(getExamCertificationTitle('invalid')).toBeNull();
    expect(getExamCertificationTitle(null)).toBeNull();
  });

  it('lists the local exam certifications in display order', () => {
    expect(listExamCertifications()[0]).toEqual({
      key: 'responsive-web-design-v9',
      title: 'Responsive Web Design'
    });
    expect(listExamCertifications().map(item => item.key)).toContain(
      'javascript-v9'
    );
  });

  it('keeps only certifications that actually have quiz questions', () => {
    expect(
      listReadyExamCertifications([
        {
          superBlock: 'javascript-v9',
          quizzes: [{ questions: [{}, {}] }]
        },
        {
          superBlock: 'python-v9',
          quizzes: [{ questions: [] }]
        }
      ])
    ).toEqual([
      {
        key: 'javascript-v9',
        title: 'JavaScript',
        questions: 2
      }
    ]);
  });

  it('sums quiz questions across several challenges of the same cert', () => {
    expect(
      listReadyExamCertifications([
        {
          superBlock: 'javascript-v9',
          quizzes: [{ questions: [{}] }]
        },
        {
          superBlock: 'javascript-v9',
          quizzes: [{ questions: [{}, {}, {}] }]
        }
      ])[0].questions
    ).toBe(4);
  });
});
