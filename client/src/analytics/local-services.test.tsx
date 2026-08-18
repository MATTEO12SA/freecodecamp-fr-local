import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  dataLayer: vi.fn(),
  initialize: vi.fn(),
  loadStripe: vi.fn()
}));

vi.mock('react-gtm-module', () => ({
  default: {
    dataLayer: mocks.dataLayer,
    initialize: mocks.initialize
  }
}));

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: mocks.loadStripe
}));

import analytics from '.';
import { stripe } from '../utils/stripe';

describe('local third-party services', () => {
  it('does not initialize or forward analytics in local mode', async () => {
    await Promise.resolve();
    analytics.dataLayer({ dataLayer: { event: 'test' } });

    expect(mocks.initialize).not.toHaveBeenCalled();
    expect(mocks.dataLayer).not.toHaveBeenCalled();
  });

  it('does not load Stripe in local mode', async () => {
    await Promise.resolve();

    expect(stripe).toBeNull();
    expect(mocks.loadStripe).not.toHaveBeenCalled();
  });
});
