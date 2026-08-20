// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { sanitizeQuizHtml } from './sanitize-quiz-html';

describe('sanitizeQuizHtml', () => {
  it('keeps safe formatting tags', () => {
    expect(sanitizeQuizHtml('<p>Hello <code>x</code></p>')).toContain(
      '<code>x</code>'
    );
  });

  it('strips script tags', () => {
    const out = sanitizeQuizHtml('<p>ok</p><script>alert(1)</script>');
    expect(out).not.toContain('script');
    expect(out).toContain('ok');
  });

  it('strips event handlers', () => {
    const out = sanitizeQuizHtml('<img src=x onerror="alert(1)">');
    expect(out.toLowerCase()).not.toContain('onerror');
  });
});
