import React, { ReactNode, useEffect } from 'react';
import Helmet from 'react-helmet';
import { useTranslation, withTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { createSelector } from 'reselect';
import { Spacer } from '@freecodecamp/ui';
import envData, { clientLocale } from '../../../config/env.json';

import latoBoldURL from '../../../static/fonts/lato/Lato-Bold.woff';
import latoLightURL from '../../../static/fonts/lato/Lato-Light.woff';
import latoRegularURL from '../../../static/fonts/lato/Lato-Regular.woff';

import jpSansBoldURL from '../../../static/fonts/noto-sans-japanese/NotoSansJP-Bold.woff';
import jpSansLightURL from '../../../static/fonts/noto-sans-japanese/NotoSansJP-Light.woff';
import jpSansRegularURL from '../../../static/fonts/noto-sans-japanese/NotoSansJP-Regular.woff';

import hackZeroSlashBoldURL from '../../../static/fonts/hack-zeroslash/Hack-ZeroSlash-Bold.woff';
import hackZeroSlashItalicURL from '../../../static/fonts/hack-zeroslash/Hack-ZeroSlash-Italic.woff';
import hackZeroSlashRegularURL from '../../../static/fonts/hack-zeroslash/Hack-ZeroSlash-Regular.woff';

import { isBrowser } from '../../../utils';
import {
  fetchUser,
  initializeTheme,
  onlineStatusChange,
  serverStatusChange
} from '../../redux/actions';
import {
  isSignedInSelector,
  examInProgressSelector,
  userSelector,
  isOnlineSelector,
  isServerOnlineSelector,
  userFetchStateSelector,
  themeSelector
} from '../../redux/selectors';

import { UserFetchState, User } from '../../redux/prop-types';
import BreadCrumb from '../../templates/Challenges/components/bread-crumb';
import Flash from '../Flash';
import { flashMessageSelector, removeFlashMessage } from '../Flash/redux';
import SignoutModal from '../signout-modal';
import StagingWarningModal from '../staging-warning-modal';
import Footer from '../Footer';
import Header from '../Header';
import OfflineWarning from '../OfflineWarning';
import { Loader } from '../helpers';
import {
  MAX_MOBILE_WIDTH,
  EX_SMALL_VIEWPORT_HEIGHT
} from '../../../config/misc';

import '@freecodecamp/ui/dist/base.css';
// preload common fonts
import './fonts.css';
import './global.css';
import './variables.css';
import './rtl-layout.css';
import { LocalStorageThemes } from '../../redux/types';

const mapStateToProps = createSelector(
  isSignedInSelector,
  examInProgressSelector,
  flashMessageSelector,
  isOnlineSelector,
  isServerOnlineSelector,
  userFetchStateSelector,
  userSelector,
  themeSelector,
  (
    isSignedIn,
    examInProgress: boolean,
    flashMessage,
    isOnline: boolean,
    isServerOnline: boolean,
    fetchState: UserFetchState,
    user: User,
    theme: LocalStorageThemes
  ) => ({
    isSignedIn,
    examInProgress,
    flashMessage,
    hasMessage: !!flashMessage.message,
    isOnline,
    isServerOnline,
    fetchState,
    user,
    theme
  })
);

type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchUser,
      removeFlashMessage,
      onlineStatusChange,
      serverStatusChange,
      initializeTheme
    },
    dispatch
  );

type DispatchProps = ReturnType<typeof mapDispatchToProps>;

interface DefaultLayoutProps extends StateProps, DispatchProps {
  children: ReactNode;
  pathname: string;
  showFooter?: boolean;
  isChallenge?: boolean;
  usesMultifileEditor?: boolean;
  block?: string;
  examInProgress: boolean;
  superBlock?: string;
}

function DefaultLayout({
  children,
  hasMessage,
  examInProgress,
  fetchState,
  flashMessage,
  isOnline,
  isServerOnline,
  isSignedIn,
  removeFlashMessage,
  showFooter = true,
  isChallenge = false,
  usesMultifileEditor,
  block,
  superBlock,
  theme,
  user,
  pathname,
  fetchUser,
  initializeTheme
}: DefaultLayoutProps): JSX.Element {
  const { t } = useTranslation();
  const isMobileLayout = useMediaQuery({ maxWidth: MAX_MOBILE_WIDTH });
  const isProject = /project$/.test(block as string);
  const isRenderBreadcrumbOnMobile =
    isMobileLayout && (isProject || !usesMultifileEditor);
  const isRenderBreadcrumb = !isMobileLayout || isRenderBreadcrumbOnMobile;
  const isExSmallViewportHeight = useMediaQuery({
    maxHeight: EX_SMALL_VIEWPORT_HEIGHT
  });

  useEffect(() => {
    initializeTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // componentDidMount
    if (!isSignedIn) {
      fetchUser();
    }

    const isAllowedLocalHref = (href: string) => {
      try {
        const url = new URL(href, window.location.origin);
        return (
          !/^https?:$/.test(url.protocol) ||
          url.origin === window.location.origin ||
          ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
        );
      } catch {
        return true;
      }
    };

    const disableExternalAnchors = () => {
      document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || isAllowedLocalHref(href)) return;

        link.removeAttribute('href');
        link.removeAttribute('target');
        link.setAttribute('aria-disabled', 'true');
        link.setAttribute('data-disabled-external-link', 'true');
        link.title = 'Lien externe désactivé en local';
      });
    };

    const preventExternalNavigation = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest?.('a[href]');
      const href = link?.getAttribute('href');
      if (!href || isAllowedLocalHref(href)) return;

      event.preventDefault();
      event.stopPropagation();
    };

    disableExternalAnchors();
    const observer = new MutationObserver(disableExternalAnchors);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('click', preventExternalNavigation, true);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      // componentWillUnmount.
      observer.disconnect();
      document.removeEventListener('click', preventExternalNavigation, true);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOnlineStatus = () => {
    const isOnline =
      isBrowser() && 'navigator' in window ? window.navigator.onLine : null;
    return typeof isOnline === 'boolean' ? onlineStatusChange(isOnline) : null;
  };

  const isJapanese = clientLocale === 'japanese';
  const fontResourceHint =
    envData.environment === 'development' ? 'prefetch' : 'preload';

  if (!fetchState.complete) {
    return <Loader fullScreen={true} messageDelay={5000} />;
  } else {
    return (
      <div className='page-wrapper'>
        {envData.deploymentEnv === 'staging' &&
          envData.environment === 'production' && <StagingWarningModal />}
        <Helmet
          bodyAttributes={{
            class: `${theme}-palette`
          }}
          meta={[
            {
              name: 'description',
              content: t('metaTags:description')
            },
            { name: 'keywords', content: t('metaTags:keywords') }
          ]}
        >
          <link
            as='font'
            crossOrigin='anonymous'
            href={latoRegularURL}
            rel={fontResourceHint}
            type='font/woff'
          />
          <link
            as='font'
            crossOrigin='anonymous'
            href={latoLightURL}
            rel={fontResourceHint}
            type='font/woff'
          />
          <link
            as='font'
            crossOrigin='anonymous'
            href={latoBoldURL}
            rel={fontResourceHint}
            type='font/woff'
          />
          {isJapanese && (
            <link
              as='font'
              crossOrigin='anonymous'
              href={jpSansRegularURL}
              rel={fontResourceHint}
              type='font/woff'
            />
          )}
          {isJapanese && (
            <link
              as='font'
              crossOrigin='anonymous'
              href={jpSansLightURL}
              rel={fontResourceHint}
              type='font/woff'
            />
          )}
          {isJapanese && (
            <link
              as='font'
              crossOrigin='anonymous'
              href={jpSansBoldURL}
              rel={fontResourceHint}
              type='font/woff'
            />
          )}

          <link
            as='font'
            crossOrigin='anonymous'
            href={hackZeroSlashRegularURL}
            rel={fontResourceHint}
            type='font/woff'
          />
          <link
            as='font'
            crossOrigin='anonymous'
            href={hackZeroSlashBoldURL}
            rel={fontResourceHint}
            type='font/woff'
          />
          <link
            as='font'
            crossOrigin='anonymous'
            href={hackZeroSlashItalicURL}
            rel={fontResourceHint}
            type='font/woff'
          />
        </Helmet>
        <div className={`default-layout`}>
          <Header
            fetchState={fetchState}
            user={user}
            pathname={pathname}
            skipButtonText={t('learn.skip-to-content')}
          />
          <OfflineWarning
            isOnline={isOnline}
            isServerOnline={isServerOnline}
            isSignedIn={isSignedIn}
          />
          {hasMessage && flashMessage ? (
            <Flash
              flashMessage={flashMessage}
              removeFlashMessage={removeFlashMessage}
            />
          ) : null}
          <SignoutModal />
          {isChallenge &&
            !examInProgress &&
            (isRenderBreadcrumb ? (
              <div className='breadcrumbs-demo'>
                <BreadCrumb
                  block={block as string}
                  superBlock={superBlock as string}
                />
              </div>
            ) : (
              <Spacer size={isExSmallViewportHeight ? 'xxs' : 'xs'} />
            ))}
          {fetchState.complete && children}
        </div>
        {showFooter && <Footer />}
      </div>
    );
  }
}

DefaultLayout.displayName = 'DefaultLayout';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(DefaultLayout));
