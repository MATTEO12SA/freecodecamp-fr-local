import React from 'react';
import SEO from '../components/seo';

import './index.css';

function IndexPage(): JSX.Element {
  return (
    <>
      <SEO title='Apprendre à coder' />
      <main
        id='content-start'
        tabIndex={-1}
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
          Voir les cours
        </a>
        <p className='home-secondary'>
          <a href='/catalog'>Catalogue</a>
          <span aria-hidden='true'> · </span>
          <a href='/learn'>Tous les parcours</a>
        </p>

        <p className='home-note'>
          Pas de compte. Ta progression reste sur ton ordinateur.
        </p>
      </main>
    </>
  );
}

IndexPage.displayName = 'IndexPage';

export default IndexPage;
