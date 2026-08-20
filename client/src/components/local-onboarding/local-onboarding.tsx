import React, { useEffect, useState } from 'react';
import { Link } from '../helpers';
import {
  hasSeenLocalOnboarding,
  markLocalOnboardingSeen
} from '../../utils/local-onboarding';

import './local-onboarding.css';

export default function LocalOnboarding(): JSX.Element | null {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasSeenLocalOnboarding()) {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  const dismiss = () => {
    markLocalOnboardingSeen();
    setOpen(false);
  };

  return (
    <div
      className='local-onboarding'
      role='dialog'
      aria-modal='true'
      aria-labelledby='local-onboarding-title'
    >
      <div className='local-onboarding__panel'>
        <h2 id='local-onboarding-title'>Bienvenue sur freeCodeCamp FR local</h2>
        <p>
          Ce fork fonctionne entièrement hors ligne côté compte : ta progression
          reste dans ce navigateur. Aucun login ni serveur distant n&apos;est
          requis pour apprendre.
        </p>
        <ul>
          <li>
            Utilise <strong>Continuer</strong> dans le menu pour reprendre le
            dernier défi ouvert.
          </li>
          <li>
            Sur <Link to='/dev-fr'>Dev FR</Link>, tu peux exporter ou importer
            ton profil local.
          </li>
          <li>Le catalogue filtre les parcours déjà traduits en français.</li>
        </ul>
        <div className='local-onboarding__actions'>
          <Link
            className='local-onboarding__primary'
            to='/learn'
            onClick={dismiss}
          >
            Voir le cursus
          </Link>
          <button
            type='button'
            className='local-onboarding__secondary'
            onClick={dismiss}
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}
