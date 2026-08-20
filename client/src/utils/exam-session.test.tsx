import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearExamSession,
  getExamSession,
  saveExamSession
} from './exam-session';

const storageKey = 'fcc-exam-session';
const now = new Date('2026-07-26T12:00:00.000Z').getTime();
const session = {
  cert: 'javascript-v9',
  seed: 1234,
  currentIndex: 4,
  answers: [1, null, 0, 2, null],
  mode: 'full' as const,
  reviewIndexes: [] as number[]
};

describe('exam session', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves and restores a versioned session without solutions', () => {
    saveExamSession(session, now);

    const stored = JSON.parse(
      window.localStorage.getItem(storageKey) || '{}'
    ) as {
      version: number;
      byCert: Record<string, unknown>;
    };
    expect(stored.version).toBe(2);
    expect(stored.byCert['javascript-v9']).not.toHaveProperty(
      'reviewQuestions'
    );
    expect(getExamSession('javascript-v9', now)).toEqual({
      ...session,
      updatedAt: '2026-07-26T12:00:00.000Z'
    });
  });

  it('keeps sessions isolated by certification', () => {
    saveExamSession(session, now);
    saveExamSession(
      {
        ...session,
        cert: 'responsive-web-design-v9',
        currentIndex: 2
      },
      now
    );

    clearExamSession('javascript-v9');
    expect(getExamSession('javascript-v9', now)).toBeNull();
    expect(getExamSession('responsive-web-design-v9', now)?.currentIndex).toBe(
      2
    );
  });

  it('discards expired sessions', () => {
    saveExamSession(session, now - 8 * 24 * 60 * 60 * 1000);

    expect(getExamSession('javascript-v9', now)).toBeNull();
  });

  it('ignores legacy v1 sessions that stored correct answers', () => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 1,
        byCert: {
          'javascript-v9': {
            ...session,
            reviewQuestions: [
              {
                questionText: 'secret',
                choices: [{ text: 'a', isAnswer: true }],
                correctChoiceIndex: 0,
                sourceBlock: 'quiz-x'
              }
            ],
            updatedAt: '2026-07-26T12:00:00.000Z'
          }
        }
      })
    );

    expect(getExamSession('javascript-v9', now)).toBeNull();
  });

  it('ignores malformed or structurally invalid storage', () => {
    window.localStorage.setItem(storageKey, '{broken');
    expect(getExamSession('javascript-v9', now)).toBeNull();

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 2,
        byCert: {
          'javascript-v9': {
            ...session,
            currentIndex: -1,
            updatedAt: '2026-07-26T12:00:00.000Z'
          }
        }
      })
    );
    expect(getExamSession('javascript-v9', now)).toBeNull();
  });
});
