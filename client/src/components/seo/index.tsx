import { useStaticQuery, graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { SuperBlocks } from '@freecodecamp/shared/config/curriculum';

interface SEOProps {
  title?: string;
  children?: React.ReactNode;
}

interface SiteData {
  site: {
    siteMetadata: {
      title: string;
      siteUrl: string;
    };
  };
}

interface Item {
  '@type': 'Course';
  url: string;
  name: string;
  description?: string;
  provider: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
}

export interface ListItem {
  '@type': 'ListItem';
  position: number;
  item: Item;
}

interface StructuredData {
  '@context': string;
  '@type': string;
  itemListElement: ListItem[];
}

const SEO = ({ title, children }: SEOProps) => {
  const { t } = useTranslation();
  const {
    site: {
      siteMetadata: { title: defaultTitle, siteUrl }
    }
  }: SiteData = useStaticQuery(graphql`
    query SEO {
      site {
        siteMetadata {
          title
          siteUrl
        }
      }
    }
  `);

  const baseTitle = title || defaultTitle;
  const localTitle = 'freeCodeCamp FR Local (non officiel)';
  const seo = {
    title: baseTitle.includes('FR Local')
      ? baseTitle
      : `${baseTitle} | ${localTitle}`
  };

  const structuredData: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: []
  };

  Object.values(SuperBlocks).forEach((superBlock, index) => {
    const superBlockIntroObj: {
      title: string;
      intro: string[];
    } = t(`intro:${superBlock}`, { returnObjects: true }) as {
      title: string;
      intro: string[];
    };

    const { title: i18nTitle, intro: introText } = superBlockIntroObj;

    structuredData.itemListElement.push({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        url: `${siteUrl}/learn/${superBlock}`,
        name: i18nTitle,
        description: introText.at(0),
        provider: {
          '@type': 'Organization',
          name: localTitle,
          url: siteUrl
        }
      }
    });
  });

  return (
    <Helmet title={seo.title}>
      <script
        type='application/ld+json'
        data-playwright-test-label='structured-data'
      >
        {JSON.stringify(structuredData)}
      </script>
      {children}
    </Helmet>
  );
};

SEO.displayName = 'SEO';

export default SEO;
