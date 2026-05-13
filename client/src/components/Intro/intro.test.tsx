import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createStore } from '../../redux/create-store';

import Intro from '.';

vi.mock('../../analytics');
vi.mock('@growthbook/growthbook-react', () => ({
  useFeature: () => ({ on: false, value: undefined }),
  useFeatureIsOn: () => false
}));
vi.mock('../../utils/get-words');

function renderWithRedux(
  ui: JSX.Element,
  preloadedState: Record<string, unknown> = {}
) {
  return render(<Provider store={createStore(preloadedState)}>{ui}</Provider>);
}

describe('<Intro />', () => {
  it('renders a heading when no name is given', () => {
    renderWithRedux(<Intro complete={true} pending={false} name='' />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders a heading with the user name when provided', () => {
    renderWithRedux(
      <Intro complete={true} pending={false} name='Development User' />
    );
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
