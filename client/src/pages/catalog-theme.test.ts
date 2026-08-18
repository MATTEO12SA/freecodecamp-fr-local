import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./catalog.css', import.meta.url), 'utf8');

describe('catalog search theme styles', () => {
  it('uses palette tokens for background, text, border and caret', () => {
    expect(css).toMatch(
      /\.catalog-search input\s*\{[^}]*background-color: var\(--primary-background\)/
    );
    expect(css).toMatch(
      /\.catalog-search input\s*\{[^}]*color: var\(--primary-color\)/
    );
    expect(css).toMatch(
      /\.catalog-search input\s*\{[^}]*border: 1px solid var\(--quaternary-color\)/
    );
    expect(css).toMatch(
      /\.catalog-search input\s*\{[^}]*caret-color: var\(--primary-color\)/
    );
  });

  it('styles the placeholder and focus state with palette tokens', () => {
    expect(css).toMatch(
      /\.catalog-search input::placeholder\s*\{[^}]*color: var\(--quaternary-color\)/
    );
    expect(css).toMatch(
      /\.catalog-search input:focus-visible\s*\{[^}]*box-shadow: 0 0 0 2px var\(--focus-outline-color\)/
    );
  });

  it('overrides standard and WebKit autofill colors', () => {
    expect(css).toContain('.catalog-search input:-webkit-autofill');
    expect(css).toMatch(/-webkit-text-fill-color: var\(--primary-color\)/);
    expect(css).toMatch(
      /\.catalog-search input:autofill\s*\{[^}]*background-color: var\(--primary-background\)/
    );
  });
});
