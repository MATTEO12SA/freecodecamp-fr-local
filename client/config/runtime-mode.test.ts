import { describe, expect, it } from 'vitest';

import {
  getRuntimeMode,
  isDevelopmentMode,
  isLocalMode,
  isLoopbackUrl
} from './runtime-mode';

describe('runtime mode', () => {
  it.each([
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://[::1]:8000'
  ])('recognizes loopback URL %s', url => {
    expect(isLoopbackUrl(url)).toBe(true);
  });

  it('rejects invalid and public URLs', () => {
    expect(isLoopbackUrl('not-a-url')).toBe(false);
    expect(isLoopbackUrl('https://www.freecodecamp.org')).toBe(false);
  });

  it('prioritizes local URLs over staging labels', () => {
    const environment = {
      homeLocation: 'http://localhost:8000',
      deploymentEnv: 'staging',
      environment: 'development'
    };

    expect(getRuntimeMode(environment)).toBe('local');
    expect(isLocalMode(environment)).toBe(true);
  });

  it('recognizes an explicit local deployment', () => {
    expect(
      getRuntimeMode({
        homeLocation: 'https://example.test',
        deploymentEnv: 'local',
        environment: 'production'
      })
    ).toBe('local');
  });

  it('distinguishes development and public deployments', () => {
    expect(
      getRuntimeMode({
        homeLocation: 'https://staging.example.test',
        deploymentEnv: 'staging',
        environment: 'development'
      })
    ).toBe('development');
    expect(
      getRuntimeMode({
        homeLocation: 'https://example.test',
        deploymentEnv: 'production',
        environment: 'production'
      })
    ).toBe('public');
  });

  it('exposes developer tools only outside production builds', () => {
    const environment = {
      homeLocation: 'http://localhost:8000',
      deploymentEnv: 'staging',
      environment: 'development'
    };

    expect(isDevelopmentMode(environment, 'development')).toBe(true);
    expect(isDevelopmentMode(environment, 'test')).toBe(true);
    expect(isDevelopmentMode(environment, 'production')).toBe(false);
  });

  it('does not expose developer tools from a public environment', () => {
    expect(
      isDevelopmentMode(
        {
          homeLocation: 'https://example.test',
          deploymentEnv: 'production',
          environment: 'production'
        },
        'development'
      )
    ).toBe(false);
  });
});
