import { describe, expect, it } from 'vitest';

import {
  getCatalogHref,
  parseCatalogFilters,
  toggleCatalogSelection
} from './catalog-filters';

const levels = ['beginner', 'intermediate'];
const topics = ['french', 'html-css', 'javascript'];

describe('catalog URL filters', () => {
  it('uses all filters by default', () => {
    expect(parseCatalogFilters('', levels, topics)).toEqual({
      query: '',
      levels: ['all'],
      topics: ['all']
    });
  });

  it('restores valid search, levels and topics', () => {
    expect(
      parseCatalogFilters(
        '?q=css&level=beginner,invalid&topic=french,html-css',
        levels,
        topics
      )
    ).toEqual({
      query: 'css',
      levels: ['beginner'],
      topics: ['french', 'html-css']
    });
  });

  it('serializes only active filters', () => {
    expect(
      getCatalogHref({
        query: '  flexbox  ',
        levels: ['beginner'],
        topics: ['french']
      })
    ).toBe('/catalog?q=flexbox&level=beginner&topic=french');
  });

  it('returns to all when the last selected value is removed', () => {
    expect(toggleCatalogSelection(['beginner'], 'beginner')).toEqual(['all']);
    expect(toggleCatalogSelection(['all'], 'intermediate')).toEqual([
      'intermediate'
    ]);
  });
});
