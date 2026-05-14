interface HelpModalProps {
  challengeTitle?: string;
  challengeBlock?: string;
  superBlock?: string;
  guideUrl?: string;
  videoUrl?: string;
}

export const generateSearchLink = (
  _challengeTitle?: string,
  _challengeBlock?: string,
  _superBlock?: string
) => '';

function HelpModal(_props: HelpModalProps): JSX.Element | null {
  return null;
}

HelpModal.displayName = 'HelpModal';

export default HelpModal;
