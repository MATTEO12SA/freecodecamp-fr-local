import { beforeEach, describe, expect, it } from 'vitest';

import { getAllAttempts, getAttempts, saveAttempt } from './exam-history';

const storageKey = 'fcc-exam-history';

const olderAttempt = {
  cert: 'javascript-v9',
  date: '2026-07-20T10:00:00.000Z',
  score: 60,
  total: 80,
  pct: 75
};

const newerAttempt = {
  cert: 'responsive-web-design-v9',
  date: '2026-07-21T10:00:00.000Z',
  score: 70,
  total: 80,
  pct: 88
};

describe('exam history', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('aggregates the current versioned schema by descending date', () => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 1,
        byCert: {
          'javascript-v9': [olderAttempt],
          'responsive-web-design-v9': [newerAttempt]
        }
      })
    );

    expect(getAllAttempts()).toEqual([newerAttempt, olderAttempt]);
  });

  it('continues to read the legacy root schema', () => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        'javascript-v9': [olderAttempt]
      })
    );

    expect(getAttempts('javascript-v9')).toEqual([olderAttempt]);
    expect(getAllAttempts()).toEqual([olderAttempt]);
  });

  it('ignores malformed JSON and invalid attempts', () => {
    window.localStorage.setItem(storageKey, '{broken');
    expect(getAllAttempts()).toEqual([]);

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 1,
        byCert: {
          'javascript-v9': [
            olderAttempt,
            { cert: 'javascript-v9', score: 'wrong' }
          ]
        }
      })
    );
    expect(getAllAttempts()).toEqual([olderAttempt]);
  });

  it('writes the versioned schema used by both exam and dashboard', () => {
    expect(saveAttempt(olderAttempt)).toBe(true);

    expect(JSON.parse(window.localStorage.getItem(storageKey) || '{}')).toEqual(
      {
        version: 1,
        byCert: {
          'javascript-v9': [olderAttempt]
        }
      }
    );
  });

  it('does not duplicate an attempt that already has the same seed', () => {
    const seeded = { ...olderAttempt, seed: 99 };
    expect(saveAttempt(seeded)).toBe(true);
    expect(saveAttempt({ ...seeded, date: '2026-07-21T10:00:00.000Z' })).toBe(
      false
    );
    expect(getAttempts('javascript-v9')).toHaveLength(1);
  });
});
