import React, { useRef, useState } from 'react';
import {
  exportLocalProfile,
  importLocalProfile,
  serializeLocalProfile,
  wipeLocalLearningData
} from '../../utils/local-profile';

import './local-data-panel.css';

export default function LocalDataPanel(): JSX.Element {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onExport = () => {
    const blob = new Blob([serializeLocalProfile(exportLocalProfile())], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fcc-fr-local-profile-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Profil exporté.');
  };

  const onImportClick = () => fileRef.current?.click();

  const onImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importLocalProfile(String(reader.result || ''));
        setMessage(
          'Profil importé. Recharge la page pour voir la progression.'
        );
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : 'Import impossible.'
        );
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const onWipe = () => {
    const ok = window.confirm(
      'Effacer toute la progression locale, Continuer, et l’historique d’examen sur ce navigateur ?'
    );
    if (!ok) return;
    wipeLocalLearningData();
    setMessage('Données locales effacées. Recharge la page.');
  };

  return (
    <section className='local-data-panel' aria-labelledby='local-data-title'>
      <h2 id='local-data-title' className='local-data-panel__title'>
        Données locales
      </h2>
      <p className='local-data-panel__text'>
        Mode local : pas de compte. Ta progression reste dans ce navigateur.
        Aucun certificat officiel freeCodeCamp n’est délivré ici — l’examen
        local est un entraînement honor-system.
      </p>
      <div className='local-data-panel__actions'>
        <button type='button' onClick={onExport}>
          Exporter ma progression
        </button>
        <button type='button' onClick={onImportClick}>
          Importer un profil
        </button>
        <button
          type='button'
          className='local-data-panel__danger'
          onClick={onWipe}
        >
          Tout effacer
        </button>
      </div>
      <input
        ref={fileRef}
        type='file'
        accept='application/json,.json'
        hidden
        onChange={onImportFile}
      />
      {message ? <p className='local-data-panel__msg'>{message}</p> : null}
    </section>
  );
}
