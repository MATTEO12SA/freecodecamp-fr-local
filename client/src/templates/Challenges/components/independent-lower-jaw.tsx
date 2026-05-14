import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { useTranslation } from 'react-i18next';
import sanitizeHtml from 'sanitize-html';
import { Button } from '@freecodecamp/ui';
import { useFeature } from '@growthbook/growthbook-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLightbulb,
  faClose,
  faZap,
  faSave,
  faClockRotateLeft,
  faRotateLeft
} from '@fortawesome/free-solid-svg-icons';
import Progress from '../../../components/Progress';
import {
  isSignedInSelector,
  isSocratesOnSelector
} from '../../../redux/selectors';
import { ChallengeMeta, Test } from '../../../redux/prop-types';
import {
  challengeMetaSelector,
  challengeTestsSelector,
  socratesHintStateSelector
} from '../redux/selectors';
import { openModal, executeChallenge, askSocrates } from '../redux/actions';
import { saveChallenge } from '../../../redux/actions';
import { useSubmit } from '../utils/fetch-all-curriculum-data';

import './independent-lower-jaw.css';
import Stars from '../../../assets/icons/stars';

type SocratesHintState = {
  hint: null | string;
  isLoading: boolean;
  error: null | string;
  attempts: null | number;
  limit: null | number;
};

const mapStateToProps = createSelector(
  challengeTestsSelector,
  isSignedInSelector,
  challengeMetaSelector,
  socratesHintStateSelector,
  isSocratesOnSelector,
  (
    tests: Test[],
    isSignedIn: boolean,
    challengeMeta: ChallengeMeta,
    socratesHintState: SocratesHintState,
    hasSocratesAccess: boolean
  ) => ({
    tests,
    isSignedIn,
    challengeMeta,
    socratesHintState,
    hasSocratesAccess
  })
);

const mapDispatchToProps = {
  openResetModal: () => openModal('reset'),
  askSocrates: () => askSocrates(),
  executeChallenge,
  saveChallenge
};

interface IndependentLowerJawProps {
  openHelpModal?: () => void;
  openResetModal: () => void;
  executeChallenge: () => void;
  askSocrates: () => void;
  saveChallenge: () => void;
  tests: Test[];
  isSignedIn: boolean;
  challengeMeta: ChallengeMeta;
  completedPercent?: number;
  completedChallengeIds?: string[];
  currentBlockIds?: string[];
  socratesHintState: SocratesHintState;
  hasSocratesAccess: boolean;
}
export function IndependentLowerJaw({
  openResetModal,
  askSocrates,
  executeChallenge,
  saveChallenge,
  tests,
  isSignedIn,
  challengeMeta,
  socratesHintState,
  hasSocratesAccess
}: IndependentLowerJawProps): JSX.Element {
  const { t } = useTranslation();
  const showSocratesFlag = useFeature('show-socrates').on;
  const submitChallenge = useSubmit();
  const firstFailedTest = tests.find(test => !!test.err);
  const hint = firstFailedTest?.message;
  const [showHint, setShowHint] = React.useState(false);
  const [showSocratesResults, setShowSocratesResults] = React.useState(false);
  const [showSubmissionHint, setShowSubmissionHint] = React.useState(true);
  const submitButtonRef = React.useRef<HTMLButtonElement>(null);
  const [wasCheckButtonClicked, setWasCheckButtonClicked] =
    React.useState(false);

  const isChallengeComplete = tests.every(test => test.pass);
  React.useEffect(() => {
    setShowHint(!!hint);
  }, [hint]);

  React.useEffect(() => {
    if (!isChallengeComplete || !wasCheckButtonClicked) return;

    submitButtonRef.current?.focus();
    setWasCheckButtonClicked(false);
  }, [isChallengeComplete, wasCheckButtonClicked]);

  const handleCheckButtonClick = () => {
    setWasCheckButtonClicked(true);
    setShowSocratesResults(false);
    executeChallenge();
  };

  const isMacOS = navigator.userAgent.includes('Mac OS');
  const showRevertButton = isSignedIn && challengeMeta.saveSubmissionToDB;
  const checkButtonText = isMacOS
    ? t('buttons.command-enter')
    : t('buttons.ctrl-enter');

  const askSocratesAttempt = () => {
    setShowSocratesResults(true);
    setShowHint(false);
    setShowSubmissionHint(false);
    if (socratesHintState.isLoading) return;
    askSocrates();
  };

  return (
    <div
      className='independent-lower-jaw'
      data-playwright-test-label='independentLowerJaw-container'
      tabIndex={-1}
    >
      {showHint && hint && (
        <div
          className='hint-container'
          data-playwright-test-label='independentLowerJaw-failing-hint'
        >
          <div className='hint-header'>
            <FontAwesomeIcon icon={faLightbulb} />
            <button
              className={'tooltip'}
              data-playwright-test-label='independentLowerJaw-hint-close-button'
              onClick={() => setShowHint(false)}
              aria-label={t('buttons.close')}
            >
              <FontAwesomeIcon icon={faClose} />
              <span className='tooltiptext'> {t('buttons.close')}</span>
            </button>
          </div>
          <div
            className='hint-body'
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(hint, {
                allowedTags: ['b', 'i', 'em', 'strong', 'code', 'wbr']
              })
            }}
          />
        </div>
      )}
      {showSocratesResults && (
        <div className='hint-container'>
          <div className='hint-header'>
            <Stars />
            <button
              className={'tooltip'}
              onClick={() => setShowSocratesResults(false)}
            >
              <FontAwesomeIcon icon={faClose} />
              <span className='tooltiptext'> {t('buttons.close')}</span>
            </button>
          </div>
          {socratesHintState.isLoading ? (
            <div className='socrates-skeleton'>
              <div className='skeleton-line skeleton-line-1' />
              <div className='skeleton-line skeleton-line-2' />
            </div>
          ) : (
            <div
              className='hint-body'
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(
                  socratesHintState.hint || socratesHintState.error || '',
                  {
                    allowedTags: ['b', 'i', 'em', 'strong', 'code', 'wbr']
                  }
                )
              }}
            />
          )}
          {socratesHintState.attempts !== null &&
            socratesHintState.limit !== null && (
              <div className='socrates-usage-info'>
                {socratesHintState.attempts}/{socratesHintState.limit}{' '}
                {t('learn.hints-used-today')}
              </div>
            )}
        </div>
      )}
      {isChallengeComplete && showSubmissionHint && (
        <div
          className='hint-container'
          data-playwright-test-label='independentLowerJaw-submission-hint'
        >
          <div className='hint-header'>
            <FontAwesomeIcon icon={faZap} />
            <button
              className={'tooltip'}
              aria-label={t('buttons.close')}
              data-playwright-test-label='independentLowerJaw-submission-hint-close-button'
              onClick={() => setShowSubmissionHint(false)}
            >
              <FontAwesomeIcon icon={faClose} />
              <span className='tooltiptext'> {t('buttons.close')}</span>
            </button>
          </div>
          <b>{t('learn.congratulations-code-passes')}</b>
          <div className='progress-bar-container'>
            <Progress minified={true} />
          </div>
        </div>
      )}

      <div className='buttons-row-container'>
        <div className='action-row-left'>
          {isChallengeComplete ? (
            <Button
              block
              className={`${isSignedIn && 'btn-cta'} tooltip`}
              id='independent-lower-jaw-submit-button'
              data-playwright-test-label='independentLowerJaw-submit-button'
              aria-label={t('buttons.submit-continue')}
              onClick={() => submitChallenge()}
              ref={submitButtonRef}
            >
              {t('buttons.submit-continue')}
              <span className='tooltiptext left-tooltip'>
                {checkButtonText}
              </span>
            </Button>
          ) : (
            <button
              type='button'
              className='btn-cta tooltip'
              data-playwright-test-label='independentLowerJaw-check-button'
              aria-label={t('buttons.check-code')}
              onClick={handleCheckButtonClick}
            >
              {t('buttons.check-code')}
              <span className='tooltiptext left-tooltip'>
                {checkButtonText}
              </span>
            </button>
          )}
        </div>
        <div className='action-row-right'>
          {hasSocratesAccess && showSocratesFlag && (
            <button
              type='button'
              className='icon-button tooltip socrates-button'
              onClick={askSocratesAttempt}
            >
              <Stars />
              <span className='tooltiptext'>{t('buttons.ask-socrates')}</span>
            </button>
          )}
          {showRevertButton ? (
            <>
              <button
                type='button'
                className='icon-botton tooltip'
                data-playwright-test-label='independentLowerJaw-save-button'
                aria-label={t('buttons.save')}
                onClick={() => saveChallenge()}
              >
                <FontAwesomeIcon icon={faSave} />
                <span className='tooltiptext'> {t('buttons.save')}</span>
              </button>
              <button
                type='button'
                className='icon-botton tooltip'
                data-playwright-test-label='independentLowerJaw-revert-button'
                aria-label={t('buttons.revert')}
                onClick={openResetModal}
              >
                <FontAwesomeIcon icon={faClockRotateLeft} />
                <span className='tooltiptext'> {t('buttons.revert')}</span>
              </button>
            </>
          ) : (
            <button
              type='button'
              className='icon-botton tooltip'
              data-playwright-test-label='independentLowerJaw-reset-button'
              aria-label={t('buttons.reset')}
              onClick={openResetModal}
            >
              <FontAwesomeIcon icon={faRotateLeft} />
              <span className='tooltiptext'> {t('buttons.reset')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

IndependentLowerJaw.displayName = 'IndependentLowerJaw';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndependentLowerJaw);
