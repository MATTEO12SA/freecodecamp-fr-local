// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(() => Promise.resolve())
}));

import confetti from 'canvas-confetti';
import { fireConfetti } from './fire-confetti';

describe('fireConfetti', () => {
  const matchMedia = vi.fn();

  beforeEach(() => {
    vi.mocked(confetti).mockClear();
    matchMedia.mockReset();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: matchMedia
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not fire when prefers-reduced-motion is reduce', () => {
    matchMedia.mockReturnValue({ matches: true });
    fireConfetti();
    expect(confetti).not.toHaveBeenCalled();
  });

  it('fires when reduced motion is not preferred', () => {
    matchMedia.mockReturnValue({ matches: false });
    fireConfetti();
    expect(confetti).toHaveBeenCalled();
  });
});
