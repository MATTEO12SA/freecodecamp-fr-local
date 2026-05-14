/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect } from 'vitest';
import React from 'react';
import { create } from 'react-test-renderer';

import Link from './link';

describe('<Link />', () => {
  const externalLink = create(<Link external={true} to='/home' />).toJSON();
  const gatsbyLink = create(<Link to='/home' />).toJSON();

  it('renders to the DOM', () => {
    expect(gatsbyLink).toBeTruthy();
  });

  it('disables external links in local mode', () => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(externalLink.props.target).toBeFalsy();
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(externalLink.props['data-disabled-external-link']).toEqual('true');
  });

  it('does not specify target in gatsbyLink', () => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(gatsbyLink.props.target).toBeFalsy();
  });
});
