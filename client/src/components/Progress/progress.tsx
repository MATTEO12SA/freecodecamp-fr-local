import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createSelector } from 'reselect';
import { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';

import {
  challengeMetaSelector,
  currentBlockIdsSelector,
  completedChallengesInBlockSelector,
  completedPercentageSelector
} from '../../templates/Challenges/redux/selectors';
import { liveCerts } from '../../../config/cert-and-project-map';
import ProgressInner from './progress-inner';
import { useFetchAllCurriculumData } from '../../templates/Challenges/utils/fetch-all-curriculum-data';

const mapStateToProps = createSelector(
  currentBlockIdsSelector,
  challengeMetaSelector,
  completedChallengesInBlockSelector,
  completedPercentageSelector,
  (
    currentBlockIds: string[],
    {
      id,
      block,
      superBlock
    }: {
      id: string;
      block: string;
      superBlock: string;
    },
    completedChallengesInBlock: number,
    completedPercent: number
  ) => ({
    currentBlockIds,
    id,
    block,
    superBlock,
    completedChallengesInBlock,
    completedPercent
  })
);

const mapDispatchToProps = {};

type PropsFromRedux = ConnectedProps<typeof connector>;

interface ProgressProps extends PropsFromRedux {
  t: TFunction;
  minified?: boolean;
}
function Progress({
  currentBlockIds,
  block,
  id,
  superBlock,
  completedChallengesInBlock,
  completedPercent,
  t,
  minified
}: ProgressProps): JSX.Element {
  useFetchAllCurriculumData(); // needed to compute completedPercent
  const blockTitle = t(`intro:${superBlock}.blocks.${block}.title`);
  // Always false for legacy full stack, since it has no projects.
  const isCertificationProject = liveCerts.some(cert =>
    cert.projects?.some((project: { id: string }) => project.id === id)
  );

  const totalChallengesInBlock = currentBlockIds?.length ?? 0;
  const meta =
    isCertificationProject && totalChallengesInBlock > 0
      ? t('learn.project-complete', {
          completedChallengesInBlock,
          totalChallengesInBlock
        })
      : t('learn.percent-complete', {
          percent: completedPercent
        });
  return (
    <div
      className='progress-bar-container'
      data-playwright-test-label='progress-bar-container'
    >
      <ProgressInner
        title={blockTitle}
        meta={meta}
        completedPercent={completedPercent}
        minified={minified}
      />
    </div>
  );
}

Progress.displayName = 'Progress';

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withTranslation()(Progress));
