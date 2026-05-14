import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Container, Col, Row, Spacer } from '@freecodecamp/ui';

import Intro from '../components/Intro';
import Map from '../components/Map';
import LearnLayout from '../components/layouts/learn';
import './cours-fr.css';
import { userSelector, userFetchStateSelector } from '../redux/selectors';

interface FetchState {
  pending: boolean;
  complete: boolean;
  errored: boolean;
}

type MaybeUser = {
  name: string;
} | null;

const mapStateToProps = createSelector(
  userFetchStateSelector,
  userSelector,
  (fetchState: FetchState, user: MaybeUser) => ({
    fetchState,
    user
  })
);

interface LearnPageProps {
  fetchState: FetchState;
  user: MaybeUser;
}

function LearnPage({
  fetchState: { pending, complete },
  user
}: LearnPageProps) {
  const { name } = user ?? { name: '' };
  const { t } = useTranslation();

  return (
    <LearnLayout>
      <Helmet title={t('metaTags:title')} />
      <Container>
        <Row>
          <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
            <Intro complete={complete} name={name} pending={pending} />
            <a href='/cours-fr' className='fr-banner'>
              <span>
                <strong>Cours en français</strong> — voir les cours déjà
                traduits avec une explication de ce que chacun t’apprend.
              </span>
              <span className='fr-banner-cta'>Ouvrir le dossier FR →</span>
            </a>
            <Map />
            <Spacer size='l' />
          </Col>
        </Row>
      </Container>
    </LearnLayout>
  );
}

LearnPage.displayName = 'LearnPage';

export default connect(mapStateToProps)(LearnPage);

export const query = graphql`
  query LearnPageQuery {
    challengeNode(
      challenge: {
        superOrder: { eq: 0 }
        order: { eq: 0 }
        challengeOrder: { eq: 0 }
      }
    ) {
      challenge {
        fields {
          slug
        }
      }
    }
  }
`;
