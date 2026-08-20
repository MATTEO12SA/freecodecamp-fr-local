// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { setLocalCompletedChallenges } from './local-progress';
import { setContinuePath, clearContinuePath } from './local-continue';
import {
  exportLocalProfile,
  importLocalProfile,
  serializeLocalProfile
} from './local-profile';

describe('local-profile', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearContinuePath();
    setLocalCompletedChallenges([]);
  });

  it('exports and re-imports completed challenges and continue path', () => {
    setLocalCompletedChallenges([
      { id: 'abc', completedDate: 1 } as never
    ]);
    setContinuePath('/learn/javascript-v9/workshop-music-player/step-1');

    const exported = exportLocalProfile(Date.parse('2026-08-20T12:00:00.000Z'));
    expect(exported.completedChallenges).toHaveLength(1);
    expect(exported.continuePath).toContain('workshop-music-player');

    window.localStorage.clear();
    importLocalProfile(serializeLocalProfile(exported));

    const again = exportLocalProfile();
    expect(again.completedChallenges[0]?.id).toBe('abc');
    expect(again.continuePath).toContain('workshop-music-player');
  });

  it('rejects unsupported versions', () => {
    expect(() =>
      importLocalProfile(
        JSON.stringify({
          version: 99,
          exportedAt: 'x',
          completedChallenges: [],
          continuePath: null
        })
      )
    ).toThrow(/Version/);
  });
});
