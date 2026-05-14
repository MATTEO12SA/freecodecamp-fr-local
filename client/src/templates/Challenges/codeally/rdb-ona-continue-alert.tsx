import React from 'react';
import { useTranslation } from 'react-i18next';
import { Callout } from '@freecodecamp/ui';

interface RdbOnaContinueAlertProps {
  course: string;
}

function RdbOnaContinueAlert(_props: RdbOnaContinueAlertProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <Callout variant='caution' label={t('misc.caution')}>
      Ce contenu utilise Ona et des services externes. Il est désactivé dans
      cette version locale.
    </Callout>
  );
}

RdbOnaContinueAlert.displayName = 'RdbOnaContinueAlert';

export default RdbOnaContinueAlert;
