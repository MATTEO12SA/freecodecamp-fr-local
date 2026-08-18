import React from 'react';
import { useTranslation } from 'react-i18next';
import { Spacer } from '@freecodecamp/ui';
import { Loader } from '../helpers';

import './intro.css';

interface IntroProps {
  complete?: boolean;
  name?: string;
  pending?: boolean;
}

const Intro = ({ name, pending, complete }: IntroProps): JSX.Element => {
  const { t } = useTranslation();
  const displayName = name === 'You' ? '' : name;
  if (pending && !complete) {
    return (
      <>
        <Spacer size='m' />
        <Loader />
        <Spacer size='m' />
      </>
    );
  }
  return (
    <>
      <Spacer size='m' />
      <h1 id='content-start' className='text-center'>
        {displayName
          ? `${t('learn.welcome-1', { name: displayName })}`
          : `${t('learn.heading')}`}
      </h1>
      <Spacer size='m' />
    </>
  );
};

Intro.displayName = 'Intro';

export default Intro;
