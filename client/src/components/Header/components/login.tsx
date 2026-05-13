import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LoginProps {
  block?: boolean;
  children?: ReactNode;
  'data-test-label'?: string;
}

const Login = ({
  block,
  children,
  'data-test-label': dataTestLabel
}: LoginProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <a
      className={(block ? 'btn-cta-big btn-block' : '') + ' signup-btn btn-cta'}
      data-test-label={dataTestLabel}
      data-playwright-test-label={
        dataTestLabel ? dataTestLabel : 'start-learning-button'
      }
      href='/learn'
    >
      <span className='login-btn-icon' aria-hidden='true'>
        <FontAwesomeIcon icon={faRightToBracket} />
      </span>
      <span className='login-btn-text'>
        {children || t('buttons.curriculum')}
      </span>
    </a>
  );
};

Login.displayName = 'Login';

export default Login;
