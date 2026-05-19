import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { i18nextCodes } from '@freecodecamp/shared/config/i18n';

import englishTranslations from './locales/english/translations.json';
import englishTrending from './locales/english/trending.json';
import englishIntro from './locales/english/intro.json';
import englishMetaTags from './locales/english/meta-tags.json';
import englishLinks from './locales/english/links.json';
import englishSearchBar from './locales/english/search-bar.json';

import frenchTranslations from './locales/french/translations.json';
import frenchTrending from './locales/french/trending.json';
import frenchIntro from './locales/french/intro.json';
import frenchMetaTags from './locales/french/meta-tags.json';
import frenchLinks from './locales/french/links.json';
import frenchSearchBar from './locales/french/search-bar.json';

import envData from '../config/env.json';

const { clientLocale } = envData;

const i18nextCode = i18nextCodes[clientLocale];

const englishResources = {
  translations: englishTranslations,
  trending: englishTrending,
  intro: englishIntro,
  metaTags: englishMetaTags,
  links: englishLinks,
  'search-bar': englishSearchBar
};

const frenchResources = {
  translations: frenchTranslations,
  trending: frenchTrending,
  intro: frenchIntro,
  metaTags: frenchMetaTags,
  links: frenchLinks,
  'search-bar': frenchSearchBar
};

const localizedResources =
  clientLocale === 'french' ? frenchResources : englishResources;

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: i18nextCode,
  // Keep the local French files in Webpack's dependency graph. The previous
  // preval dynamic require embedded intro.json at startup, so Gatsby did not
  // rebuild module titles when translations changed during development.
  resources: {
    [i18nextCode]: localizedResources,
    en: englishResources
  },
  ns: ['translations', 'trending', 'intro', 'metaTags', 'links', 'search-bar'],
  defaultNS: 'translations',
  returnObjects: true,
  // Uncomment the next line for debug logging
  // debug: true,
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: true
  },
  returnNull: false
});

i18n.languages = clientLocale;

export default i18n;
