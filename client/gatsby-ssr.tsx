import type { GatsbySSR } from 'gatsby';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';

import i18n from './i18n/config';
import { stripe } from './src/utils/stripe';
import { createStore } from './src/redux/create-store';
import layoutSelector from './utils/gatsby/layout-selector';
import { webmanifestComponents } from './src/components/webmanifest';
import {
  getheadTagComponents,
  getPostBodyComponents,
  getPreBodyThemeScript
} from './utils/tags';
import GrowthBookProvider from './src/components/growth-book/growth-book-wrapper';

const store = createStore();

const devConsoleNoiseFilterScript = `
(function() {
  if (window.__fccDevConsoleNoiseFilterInstalled) {
    return;
  }

  window.__fccDevConsoleNoiseFilterInstalled = true;

  var noisyPatterns = [
    'Download the React DevTools',
    'i18next is made possible by our own product, Locize',
    '[HMR] connected',
    "[HMR] bundle 'develop' has",
    'Should not import the named export',
    'Critical dependency: the request of a dependency is an expression'
  ];

  var stringifyArg = function(arg) {
    if (typeof arg === 'string') {
      return arg;
    }

    if (arg && arg.message) {
      return arg.message;
    }

    try {
      return JSON.stringify(arg);
    } catch (error) {
      return String(arg);
    }
  };

  var shouldHideMessage = function(args) {
    var text = Array.prototype.map.call(args, stringifyArg).join(' ');

    return noisyPatterns.some(function(pattern) {
      return text.indexOf(pattern) !== -1;
    });
  };

  ['log', 'info', 'warn'].forEach(function(method) {
    var original = console[method];

    if (typeof original !== 'function') {
      return;
    }

    console[method] = function() {
      if (shouldHideMessage(arguments)) {
        return;
      }

      original.apply(console, arguments);
    };
  });
})();
`;

const getDevConsoleNoiseFilterScript = (): JSX.Element[] =>
  process.env.NODE_ENV === 'development'
    ? [
        <script
          dangerouslySetInnerHTML={{
            __html: devConsoleNoiseFilterScript
          }}
          key='fcc-dev-console-noise-filter'
        />
      ]
    : [];

export const wrapRootElement: GatsbySSR['wrapRootElement'] = ({ element }) => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <GrowthBookProvider>
          <Elements stripe={stripe}>{element}</Elements>
        </GrowthBookProvider>
      </I18nextProvider>
    </Provider>
  );
};

export const wrapPageElement: GatsbySSR['wrapPageElement'] = layoutSelector;

export const onRenderBody: GatsbySSR['onRenderBody'] = ({
  pathname,
  setHeadComponents,
  setPreBodyComponents,
  setPostBodyComponents
}) => {
  setHeadComponents([...getheadTagComponents(), ...webmanifestComponents]);
  setPreBodyComponents([
    ...getPreBodyThemeScript(),
    ...getDevConsoleNoiseFilterScript()
  ]);
  setPostBodyComponents(getPostBodyComponents(pathname));
};

export const onPreRenderHTML: GatsbySSR['onPreRenderHTML'] = ({
  getHeadComponents,
  replaceHeadComponents
}) => {
  const isBootstrapScript = (key: React.Key | null) =>
    key === 'bootstrap-min-preload' || key === 'bootstrap-min';

  const headComponents = getHeadComponents();
  headComponents.sort((x, y) => {
    const xKey = React.isValidElement(x) ? x.key : null;
    const yKey = React.isValidElement(y) ? y.key : null;

    if (isBootstrapScript(xKey)) {
      return -1;
    } else if (isBootstrapScript(yKey)) {
      return 1;
    }
    return 0;
  });
  replaceHeadComponents(headComponents);
};
