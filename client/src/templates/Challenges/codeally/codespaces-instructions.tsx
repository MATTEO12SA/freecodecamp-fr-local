import React from 'react';
import { useTranslation } from 'react-i18next';
import { Callout } from '@freecodecamp/ui';

interface CodespacesInstructionsProps {
  challengeType: number;
  copyUrl: () => void;
  copyUserToken: () => void;
  generateUserToken: () => Promise<void>;
  isSignedIn: boolean;
  title: string;
  userToken: string | null;
}

export function CodespacesInstructions(
  _props: CodespacesInstructionsProps
): JSX.Element {
  const { t } = useTranslation();

  return (
    <Callout variant='caution' label={t('misc.caution')}>
      Ce contenu utilise Codespaces et des services externes. Il est désactivé
      dans cette version locale.
    </Callout>
  );
}
