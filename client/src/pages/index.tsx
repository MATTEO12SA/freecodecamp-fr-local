import React from 'react';
import SEO from '../components/seo';

import './index.css';

function IndexPage(): JSX.Element {
  return (
    <>
      <SEO title='Apprendre à coder' />
      <main
        id='landing-content'
        data-testid='landing-content'
        className='home-wrap'
      >
        <h1 className='home-title'>Apprendre à coder.</h1>

        <p className='home-lead'>
          Des exercices pratiques pour apprendre le web, étape par étape,
          directement dans ton navigateur.
        </p>

        <a
          href='/cours-fr'
          data-playwright-test-label='start-button'
          className='home-btn'
        >
          Commencer →
        </a>

        <p className='home-note'>
          Pas de compte. Ta progression reste sur ton ordinateur.
        </p>
      </main>
    </>
  );
}

IndexPage.displayName = 'IndexPage';

export default IndexPage;
