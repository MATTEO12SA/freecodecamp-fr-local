// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  clearContinuePath,
  getContinuePath,
  isLearnChallengePath,
  setContinuePath
} from './local-continue';

describe('local-continue', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('recognizes challenge learn paths', () => {
    expect(
      isLearnChallengePath(
        '/learn/javascript-v9/workshop-calorie-counter/step-1'
      )
    ).toBe(true);
    expect(isLearnChallengePath('/learn/javascript-v9')).toBe(false);
    expect(isLearnChallengePath('/cours-fr')).toBe(false);
  });

  it('stores and restores a continue path', () => {
    const path = '/learn/javascript-v9/workshop-calorie-counter/step-3';
    setContinuePath(path);
    expect(getContinuePath()).toBe(path);
  });

  it('ignores non-challenge paths', () => {
    setContinuePath('/learn/javascript-v9');
    expect(getContinuePath()).toBeNull();
  });

  it('clears the continue path', () => {
    setContinuePath('/learn/javascript-v9/workshop-calorie-counter/step-1');
    clearContinuePath();
    expect(getContinuePath()).toBeNull();
  });
});
