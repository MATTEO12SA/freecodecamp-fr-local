import { Button, Spacer } from '@freecodecamp/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { openModal, executeChallenge } from '../redux/actions';

import './tool-panel.css';

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      executeChallenge,
      openVideoModal: () => openModal('video'),
      openResetModal: () => openModal('reset')
    },
    dispatch
  );

interface ToolPanelProps {
  executeChallenge: (options?: { showCompletionModal: boolean }) => void;
  isMobile?: boolean;
  openVideoModal: () => void;
  openResetModal: () => void;
  videoUrl?: string;
}

function ToolPanel({
  executeChallenge,
  isMobile,
  openVideoModal,
  openResetModal,
  videoUrl
}: ToolPanelProps) {
  const handleRunTests = () => {
    executeChallenge({ showCompletionModal: true });
  };
  const { t } = useTranslation();
  return (
    <div
      className={`tool-panel-group ${
        isMobile ? 'tool-panel-group-mobile' : ''
      }`}
    >
      <Button block={true} variant='primary' onClick={handleRunTests}>
        {isMobile ? t('buttons.run') : t('buttons.run-test')}
      </Button>
      <Spacer size='xxs' />
      <Button block={true} variant='primary' onClick={openResetModal}>
        {isMobile ? t('buttons.reset') : t('buttons.reset-lesson')}
      </Button>
      {videoUrl && (
        <>
          <Spacer size='xxs' />
          <Button block={true} variant='primary' onClick={openVideoModal}>
            {t('buttons.watch-video')}
          </Button>
        </>
      )}
    </div>
  );
}

ToolPanel.displayName = 'ToolPanel';

export default connect(null, mapDispatchToProps)(ToolPanel);
