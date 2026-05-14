import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Footer from '.';

describe('<Footer />', () => {
  it('renders the local-only footer without external links', () => {
    render(<Footer />);

    expect(screen.getByText(/freeCodeCamp/)).toHaveTextContent('freeCodeCamp');
    expect(screen.getByText(/Apprentissage local/)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
