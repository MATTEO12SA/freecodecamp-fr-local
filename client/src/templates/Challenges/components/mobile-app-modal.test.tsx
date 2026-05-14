import React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import MobileAppModal from './mobile-app-modal';

describe('MobileAppModal', () => {
  it('does not render in local-only mode', () => {
    render(<MobileAppModal superBlock='responsive-web-design-v9' />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not render during server-side rendering', () => {
    expect(
      renderToString(<MobileAppModal superBlock='responsive-web-design-v9' />)
    ).toBe('');
  });
});
