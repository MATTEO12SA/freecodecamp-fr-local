import React from 'react';
import { useTranslation } from 'react-i18next';
import { Callout, Spacer, Container, Row, Col } from '@freecodecamp/ui';
import {
  archivedSuperBlocks,
  SuperBlocks
} from '@freecodecamp/shared/config/curriculum';
import { SuperBlockIcon } from '../../../assets/superblock-icon';
import { Link } from '../../../components/helpers';
import CapIcon from '../../../assets/icons/cap';
import DumbbellIcon from '../../../assets/icons/dumbbell';
import CommunityIcon from '../../../assets/icons/community';
import ArchivedWarning from '../../../components/archived-warning';

interface ConditionalDonationAlertProps {
  superBlock: SuperBlocks;
  onCertificationDonationAlertClick: () => void;
  isDonating: boolean;
}

interface SuperBlockIntroProps extends ConditionalDonationAlertProps {
  hasNotstarted: boolean;
  nextChallengeSlug: string | null;
}

export const ConditionalDonationAlert = (
  _props: ConditionalDonationAlertProps
): JSX.Element | null => null;

function SuperBlockIntro({
  superBlock,
  onCertificationDonationAlertClick,
  isDonating,
  hasNotstarted,
  nextChallengeSlug
}: SuperBlockIntroProps): JSX.Element {
  const { t } = useTranslation();
  const superBlockIntroObj: {
    title: string;
    intro: string[] | string;
    note: string;
  } = t(`intro:${superBlock}`, { returnObjects: true }) as {
    title: string;
    intro: string[] | string;
    note: string;
  };

  const {
    title: i18nSuperBlock,
    intro: introRaw,
    note: superBlockNoteText
  } = superBlockIntroObj;

  // Ensure intro is always an array
  const superBlockIntroText = Array.isArray(introRaw)
    ? introRaw
    : typeof introRaw === 'string'
      ? [introRaw]
      : [''];

  const IntroTopDefault = ({ fsd }: { fsd: boolean }) => (
    <>
      {archivedSuperBlocks.includes(superBlock) && <ArchivedWarning />}
      <Spacer size='s' />
      <SuperBlockIcon className='cert-header-icon' superBlock={superBlock} />
      <Spacer size='m' />
      <h1 id='content-start' className='text-center big-heading'>
        {i18nSuperBlock}
      </h1>
      <Spacer size='l' />
      {fsd && (
        <Container
          fluid={true}
          className='full-width-container super-benefits-container'
        >
          <Container>
            <Row>
              <Col xs={12} className='super-block-benefits'>
                <div>
                  <CommunityIcon />
                  <div className='benefit-text'>
                    <h3>{t('misc.fsd-b-benefit-1-title')}</h3>
                    <p>{t('misc.fsd-b-benefit-1-description')}</p>
                  </div>
                </div>
                <div>
                  <CapIcon />
                  <div className='benefit-text'>
                    <h3>{t('misc.fsd-b-benefit-2-title')}</h3>
                    <p>{t('misc.fsd-b-benefit-2-description')}</p>
                  </div>
                </div>
                <div>
                  <DumbbellIcon />
                  <div className='benefit-text'>
                    <h3>{t('misc.fsd-b-benefit-3-title')}</h3>
                    <p>{t('misc.fsd-b-benefit-3-description')}</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Container>
      )}
      {nextChallengeSlug && !fsd && (
        <Link
          className={'btn-cta-big btn-block signup-btn btn-cta intro-top-cta'}
          to={nextChallengeSlug}
          data-test-label={
            hasNotstarted ? 'start-learning' : 'continue-learning'
          }
        >
          {hasNotstarted ? t('misc.fsd-b-cta') : t('misc.continue-learning')}
        </Link>
      )}
      <Spacer size='l' />
      {superBlockIntroText.map((str, i) => (
        <p dangerouslySetInnerHTML={{ __html: str }} key={i} />
      ))}
      {superBlockNoteText && (
        <>
          <Spacer size='m' />
          <Callout variant='note' label={t('misc.note')}>
            {superBlockNoteText}
          </Callout>
        </>
      )}
    </>
  );

  return (
    <>
      <IntroTopDefault fsd={superBlock === SuperBlocks.FullStackDeveloperV9} />
      <ConditionalDonationAlert
        superBlock={superBlock}
        onCertificationDonationAlertClick={onCertificationDonationAlertClick}
        isDonating={isDonating}
      />
    </>
  );
}

SuperBlockIntro.displayName = 'SuperBlockIntro';

export default SuperBlockIntro;
