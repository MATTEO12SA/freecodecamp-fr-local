import type { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

interface ToolPanelProps {
  guideUrl?: string;
  openHelpModal?: () => void;
  t: TFunction;
}

function ToolPanel(_props: ToolPanelProps): JSX.Element | null {
  return null;
}

ToolPanel.displayName = 'ProjectToolPanel';

export default connect()(withTranslation()(ToolPanel));
