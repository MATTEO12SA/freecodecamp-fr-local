import { describe, expect, it } from 'vitest';

import {
  getCoursFrCertificationHref,
  parseCoursFrView
} from './cours-fr-navigation';

describe('cours-fr URL navigation', () => {
  it('maps the root URL to the journey chooser', () => {
    expect(parseCoursFrView('')).toEqual({ v: 'lang' });
  });

  it('restores the certification list from the query string', () => {
    expect(parseCoursFrView('?view=certifications')).toEqual({ v: 'fr-home' });
  });

  it('restores a direct certification URL', () => {
    expect(parseCoursFrView('?cert=javascript-v9')).toEqual({
      v: 'fr-cert',
      cert: 'javascript-v9'
    });
  });

  it('encodes certification links safely', () => {
    expect(getCoursFrCertificationHref('javascript-v9')).toBe(
      '/cours-fr?cert=javascript-v9'
    );
  });
});
