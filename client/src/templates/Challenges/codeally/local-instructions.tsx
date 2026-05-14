import React from 'react';
import { useTranslation } from 'react-i18next';
import { Callout } from '@freecodecamp/ui';

interface LocalInstructionsProps {
  copyUrl: () => void;
  copyUserToken: () => void;
  generateUserToken: () => Promise<void>;
  isSignedIn: boolean;
  title: string;
  userToken: string | null;
}

export function LocalInstructions(_props: LocalInstructionsProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <Callout variant='caution' label={t('misc.caution')}>
      Ce contenu utilise un environnement externe. Il est désactivé dans cette
      version locale.
    </Callout>
  );
}
