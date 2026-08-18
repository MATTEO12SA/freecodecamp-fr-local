import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Loader } from '../../components/helpers';
import { userFetchStateSelector } from '../../redux/selectors';

import './prism.css';
import './prism-night.css';
import 'react-reflex/styles.css';
import './learn.css';

type FetchState = {
  pending: boolean;
  complete: boolean;
  errored: boolean;
};

const mapStateToProps = createSelector(
  userFetchStateSelector,
  (fetchState: FetchState) => ({
    fetchState
  })
);

type LearnLayoutProps = {
  fetchState: FetchState;
  children?: React.ReactNode;
  className?: string;
  contentId?: string;
};

function LearnLayout({
  fetchState,
  children,
  className,
  contentId = 'learn-app-wrapper'
}: LearnLayoutProps): JSX.Element {
  useEffect(() => {
    return () => {
      const metaTag = document.querySelector(`meta[name="robots"]`);
      if (metaTag) {
        metaTag.remove();
      }
    };
  }, []);

  if (fetchState.pending && !fetchState.complete) {
    return <Loader fullScreen={true} />;
  }

  return (
    <>
      <Helmet>
        <meta content='noindex' name='robots' />
      </Helmet>
      <main
        id={contentId}
        className={`learn-app-wrapper${className ? ` ${className}` : ''}`}
        tabIndex={contentId === 'content-start' ? -1 : undefined}
      >
        {children}
      </main>
    </>
  );
}

export default connect(mapStateToProps)(LearnLayout);
