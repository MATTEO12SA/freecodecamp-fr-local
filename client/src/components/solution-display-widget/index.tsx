import { CompletedChallenge } from '../../redux/prop-types';

interface Props {
  completedChallenge: CompletedChallenge;
  projectTitle: string;
  showUserCode: () => void;
  showProjectPreview?: () => void;
  showExamResults?: () => void;
  displayContext: 'timeline' | 'settings' | 'certification';
}

export function SolutionDisplayWidget(_props: Props): JSX.Element | null {
  return null;
}
