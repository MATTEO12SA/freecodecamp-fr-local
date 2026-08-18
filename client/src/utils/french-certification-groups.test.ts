import { describe, expect, test } from 'vitest';
import { groupCertificationsByFrenchAvailability } from './french-certification-groups';

describe('groupCertificationsByFrenchAvailability', () => {
  test('separates available links from upcoming certifications', () => {
    const certifications = [
      { key: 'responsive-web-design-v9', title: 'RWD' },
      { key: 'javascript-v9', title: 'JavaScript' },
      { key: 'python-v9', title: 'Python' }
    ];

    expect(
      groupCertificationsByFrenchAvailability(
        certifications,
        key => key !== 'python-v9'
      )
    ).toEqual({
      available: certifications.slice(0, 2),
      upcoming: certifications.slice(2)
    });
  });
});
