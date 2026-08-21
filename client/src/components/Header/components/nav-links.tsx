import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { toggleTheme } from '../../../redux/actions';
import { Link } from '../../helpers';
import { LocalStorageThemes } from '../../../redux/types';
import { themeSelector } from '../../../redux/selectors';
import { isDevelopmentMode } from '../../../../config/runtime-mode';
import { getContinuePath } from '../../../utils/local-continue';

export interface NavLinksProps {
  displayMenu: boolean;
  showMenu: () => void;
  hideMenu: () => void;
  user?: { isDonating: boolean; username: string };
  menuButtonRef: React.RefObject<HTMLButtonElement>;
  theme: LocalStorageThemes;
  toggleTheme: () => void;
}

const mapDispatchToProps = { toggleTheme };

const mapStateToProps = createSelector(
  themeSelector,
  (theme: LocalStorageThemes) => ({ theme })
);

function NavLinks({
  menuButtonRef,
  hideMenu,
  displayMenu,
  theme,
  toggleTheme
}: NavLinksProps) {
  const { t } = useTranslation();
  const [continuePath, setContinuePathState] = useState<string | null>(null);

  useEffect(() => {
    setContinuePathState(getContinuePath());
  }, [displayMenu]);

  const closeAndFocus = () => {
    menuButtonRef.current?.classList.add('force-show');
    hideMenu();
    setTimeout(() => {
      menuButtonRef.current?.focus();
      menuButtonRef.current?.classList.remove('force-show');
    }, 100);
  };

  const handleMenuKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeAndFocus();
    }
  };

  return (
    <ul
      aria-labelledby='toggle-button-nav'
      data-playwright-test-label='header-menu'
      className={`nav-list${displayMenu ? ' display-menu' : ''}`}
    >
      {continuePath && (
        <li key='continue'>
          <Link
            className='nav-link'
            onClick={hideMenu}
            onKeyDown={handleMenuKeyDown}
            to={continuePath}
            title='Reprendre le dernier défi ouvert'
            data-playwright-test-label='nav-continue'
          >
            {t('buttons.continue')}
          </Link>
        </li>
      )}
      <li key='learn'>
        <Link
          className='nav-link'
          onClick={hideMenu}
          onKeyDown={handleMenuKeyDown}
          to='/learn'
          title='Carte complète du curriculum local'
        >
          Carte
        </Link>
      </li>
      <li key='cours-fr'>
        <Link
          className='nav-link'
          onClick={hideMenu}
          onKeyDown={handleMenuKeyDown}
          to='/cours-fr'
          title='Certifications déjà traduites en français'
        >
          Parcours
        </Link>
      </li>
      <li key='catalog'>
        <Link
          className='nav-link'
          onClick={hideMenu}
          onKeyDown={handleMenuKeyDown}
          to='/catalog'
          title='Recherche et filtres, y compris le thème Français'
        >
          Catalogue
        </Link>
      </li>
      <li className='nav-line' key='theme'>
        <button
          type='button'
          className={'nav-link nav-link-flex'}
          onClick={() => toggleTheme()}
          onKeyDown={handleMenuKeyDown}
        >
          <span>{t('settings.labels.night-mode')}</span>
          {theme === LocalStorageThemes.Dark ? (
            <FontAwesomeIcon icon={faCheckSquare} />
          ) : (
            <FontAwesomeIcon icon={faSquare} />
          )}
        </button>
      </li>
      {isDevelopmentMode() && (
        <li key='dev-fr'>
          <Link
            className='nav-link nav-link-tools'
            onClick={hideMenu}
            onKeyDown={handleMenuKeyDown}
            to='/dev-fr'
            title='Outils développeur locaux'
          >
            Outils
          </Link>
        </li>
      )}
    </ul>
  );
}

NavLinks.displayName = 'NavLinks';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(NavLinks));
