import { GatsbyLinkProps, Link as GatsbyLink } from 'gatsby';
import React from 'react';

interface LinkProps extends Omit<
  GatsbyLinkProps<Record<string, unknown>>,
  'ref'
> {
  children?: React.ReactNode;
  external?: boolean;
  sameTab?: boolean;
  to: string;
}

const Link = ({
  children,
  to,
  external,
  sameTab,
  ...other
}: LinkProps): JSX.Element => {
  const isExternalHttpLink = /^https?:\/\//i.test(to);
  void sameTab;

  if (!external && /^\/(?!\/)/.test(to)) {
    return (
      <GatsbyLink to={to} {...other}>
        {children}
      </GatsbyLink>
    );
  } else if (isExternalHttpLink) {
    return (
      <span
        {...other}
        aria-disabled='true'
        data-disabled-external-link='true'
        title='Lien externe désactivé en local'
      >
        {children}
      </span>
    );
  }

  return (
    <span
      {...other}
      aria-disabled='true'
      data-disabled-external-link='true'
      title='Lien externe désactivé en local'
    >
      {children}
    </span>
  );
};

export default Link;
