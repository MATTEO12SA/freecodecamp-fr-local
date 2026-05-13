import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, SkeletonSprite } from '../../helpers';
import FreeCodeCampLogo from '../../../assets/icons/freecodecamp-logo';
import MenuButton from './menu-button';
import NavLinks from './nav-links';

import './universal-nav.css';

type UniversalNavProps = {
  displayMenu: boolean;
  showMenu: () => void;
  hideMenu: () => void;
  menuButtonRef: React.RefObject<HTMLButtonElement>;
  user: {
    isDonating: boolean;
    username: string;
    picture: string;
    yearsTopContributor: string[];
  };
  fetchState: { pending: boolean };
  searchBarRef: React.RefObject<HTMLDivElement>;
  pathname: string;
};

const UniversalNav = ({
  displayMenu,
  showMenu,
  hideMenu,
  menuButtonRef,
  user,
  fetchState
}: UniversalNavProps): JSX.Element => {
  const { pending } = fetchState;
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t('aria.primary-nav')}
      className='universal-nav'
      id='universal-nav'
      data-playwright-test-label='header-universal-nav'
    >
      <Link
        className='universal-nav-logo'
        id='universal-nav-logo'
        to='/learn'
        data-playwright-test-label='header-universal-nav-logo'
      >
        <FreeCodeCampLogo aria-label={t('aria.fcc-curriculum')} />
      </Link>
      <div className='universal-nav-right main-nav'>
        {pending ? (
          <div className='nav-skeleton'>
            <SkeletonSprite />
          </div>
        ) : (
          <>
            <MenuButton
              displayMenu={displayMenu}
              hideMenu={hideMenu}
              innerRef={menuButtonRef}
              showMenu={showMenu}
            />
            <NavLinks
              displayMenu={displayMenu}
              hideMenu={hideMenu}
              menuButtonRef={menuButtonRef}
              showMenu={showMenu}
              user={user}
            />
          </>
        )}
      </div>
    </nav>
  );
};

UniversalNav.displayName = 'UniversalNav';
export default UniversalNav;
