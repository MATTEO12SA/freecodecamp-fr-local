import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CatalogItem from './catalog-item';

describe('CatalogItem', () => {
  it('uses a level-two heading below the catalog page heading', () => {
    render(
      <CatalogItem
        superBlock='javascript-v9'
        level='beginner'
        hours={10}
        topic='javascript'
      />
    );

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});
