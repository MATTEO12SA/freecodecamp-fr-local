// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  hasSeenLocalOnboarding,
  markLocalOnboardingSeen
} from './local-onboarding';

describe('local-onboarding', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('starts unseen then marks seen', () => {
    expect(hasSeenLocalOnboarding()).toBe(false);
    markLocalOnboardingSeen();
    expect(hasSeenLocalOnboarding()).toBe(true);
  });

  it('treats storage errors as already seen', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(hasSeenLocalOnboarding()).toBe(true);
  });
});
