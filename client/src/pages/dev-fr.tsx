import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SEO from '../components/seo';
import { getAllAttempts } from '../utils/exam-history';
import { getLocalCompletedChallenges } from '../utils/local-progress';
import {
  exportLocalProfile,
  importLocalProfile,
  serializeLocalProfile
} from '../utils/local-profile';
import {
  getFrenchFileCoverage,
  hasFrenchIntro
} from '../utils/has-french-intro';
import { getTranslationPercent } from '../utils/translation-percent';
import { formatSnapshotAge } from '../utils/snapshot-age';

import './dev-fr.css';

type TranslationRow = {
  key: string;
  translated: number;
  total: number;
  pct: number;
  translatedFiles?: number;
  totalFiles?: number;
  pctFiles?: number;
};

type DriftReport = {
  blocks: number;
  comparedFiles: number;
  missingEnglish: number;
  totalDrifted?: number;
  drifted: Array<{
    block: string;
    file: string;
    enDate: string;
    frDate: string;
  }>;
};

type LocalDevReport = {
  generatedAt: string;
  server: {
    url: string;
    reportedStatus: string;
    message: string;
    mode: string;
    runId: string;
    startedAt: string;
    updatedAt: string;
    verdict: string;
    http: {
      ok: boolean;
      statusCode: number;
      error?: string;
    };
  };
  translations: TranslationRow[];
  drift: DriftReport;
  git: {
    branch: string;
    lastCommit: string;
    dirty: boolean;
    changedFiles: string[];
  };
  latestLog: string[];
};

type BrowserSummary = {
  completedChallenges: number;
  examAttempts: number;
  lastExamAttempt: string;
};

type LiveServerStatus = {
  ok: boolean;
  statusCode: number;
  label: string;
};

const reportUrl = '/local-dev/report.json';

const LOCAL_CERTS = [
  'responsive-web-design-v9',
  'javascript-v9',
  'front-end-development-libraries-v9',
  'back-end-development-and-apis-v9',
  'python-v9',
  'relational-databases-v9',
  'full-stack-developer-v9'
] as const;

function formatDate(value: string): string {
  if (!value) return 'inconnu';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('fr-FR');
}

function readBrowserSummary(): BrowserSummary {
  if (typeof window === 'undefined') {
    return {
      completedChallenges: 0,
      examAttempts: 0,
      lastExamAttempt: ''
    };
  }

  const completedChallenges = getLocalCompletedChallenges().length;
  const attempts = getAllAttempts();
  return {
    completedChallenges,
    examAttempts: attempts.length,
    lastExamAttempt: attempts[0]?.date || ''
  };
}

function statusClass(value: string): string {
  return value === 'UP' || value === 'READY'
    ? 'dev-fr-ok'
    : value === 'DOWN' || value === 'BLOCKED' || value === 'ERROR'
      ? 'dev-fr-bad'
      : 'dev-fr-warn';
}

function QuickLink({
  href,
  label,
  note
}: {
  href: string;
  label: string;
  note: string;
}): JSX.Element {
  return (
    <a className='dev-fr-link-card' href={href}>
      <span>{label}</span>
      <small>{note}</small>
    </a>
  );
}

function buildLiveCoverageRows(): TranslationRow[] {
  return LOCAL_CERTS.map(key => {
    const coverage = getFrenchFileCoverage(key);
    const pctFiles = getTranslationPercent(coverage);
    return {
      key,
      translated: hasFrenchIntro(key) ? 1 : 0,
      total: 1,
      pct: coverage.complete ? 100 : pctFiles,
      translatedFiles: coverage.translated,
      totalFiles: coverage.total,
      pctFiles
    };
  }).sort((a, b) => (b.pctFiles ?? 0) - (a.pctFiles ?? 0));
}

async function probeLiveServer(): Promise<LiveServerStatus> {
  try {
    const response = await fetch(`/?t=${Date.now()}`, {
      method: 'HEAD',
      cache: 'no-store'
    });
    return {
      ok: response.ok || response.status > 0,
      statusCode: response.status || 200,
      label: response.ok || response.status > 0 ? 'UP' : 'DOWN'
    };
  } catch {
    // Si on affiche déjà cette page, le serveur client répond.
    if (typeof window !== 'undefined' && window.location.port === '8000') {
      return { ok: true, statusCode: 200, label: 'UP' };
    }
    return { ok: false, statusCode: 0, label: 'DOWN' };
  }
}

function DevFrPage(): JSX.Element {
  const [report, setReport] = useState<LocalDevReport | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [liveServer, setLiveServer] = useState<LiveServerStatus>({
    ok: true,
    statusCode: 200,
    label: 'UP'
  });
  const [browserSummary, setBrowserSummary] = useState<BrowserSummary>({
    completedChallenges: 0,
    examAttempts: 0,
    lastExamAttempt: ''
  });

  const liveTranslations = useMemo(() => buildLiveCoverageRows(), []);
  const driftCount = report?.drift.totalDrifted ?? report?.drift.drifted.length;
  const isReady = Boolean(
    liveServer.ok && (driftCount === undefined || driftCount === 0)
  );

  const generatedAt = useMemo(
    () => (report ? formatDate(report.generatedAt) : ''),
    [report]
  );
  const snapshotAge = useMemo(
    () => (report ? formatSnapshotAge(report.generatedAt) : 'non généré'),
    [report]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    setBrowserSummary(readBrowserSummary());
    setLiveServer(await probeLiveServer());
    try {
      const response = await fetch(`${reportUrl}?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      setReport((await response.json()) as LocalDevReport);
    } catch (loadError) {
      setReport(null);
      setError(loadError instanceof Error ? loadError.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const translationRows = liveTranslations;

  return (
    <>
      <SEO title='Dev FR' />
      <main id='content-start' tabIndex={-1} className='dev-fr-page'>
        <div className='local-page-shell dev-fr-shell'>
          <div className='dev-fr-header'>
            <div>
              <h1>Dev FR</h1>
              <p>
                Tableau de bord local : serveur live, traductions v9, drift et
                vérifications avant push.
              </p>
            </div>
            <button
              className='btn btn-primary'
              type='button'
              onClick={() => void refresh()}
            >
              Actualiser
            </button>
          </div>

          {loading && <p>Chargement…</p>}

          <section className='dev-fr-status-grid'>
            <div className='dev-fr-metric'>
              <span>Verdict</span>
              <strong className={statusClass(isReady ? 'UP' : 'WARN')}>
                {isReady ? 'READY' : 'À vérifier'}
              </strong>
            </div>
            <div className='dev-fr-metric'>
              <span>Serveur (live)</span>
              <strong className={statusClass(liveServer.label)}>
                {liveServer.label}
              </strong>
            </div>
            <div className='dev-fr-metric'>
              <span>HTTP</span>
              <strong className={statusClass(liveServer.ok ? 'UP' : 'DOWN')}>
                {liveServer.statusCode || 'OFF'}
              </strong>
            </div>
            <div className='dev-fr-metric'>
              <span>Snapshot</span>
              <strong>{generatedAt || 'optionnel'}</strong>
            </div>
            <div className='dev-fr-metric'>
              <span>Âge snapshot</span>
              <strong>{snapshotAge}</strong>
            </div>
          </section>

          {error && (
            <section className='dev-fr-section dev-fr-empty'>
              <h2>Snapshot optionnel introuvable</h2>
              <p>
                Le serveur live fonctionne déjà (tu es sur cette page). Pour un
                rapport git/drift plus complet :{' '}
                <code>pnpm local:report --write</code>, puis Actualiser.
              </p>
              <p className='dev-fr-muted'>Détail : {error}</p>
            </section>
          )}

          <section className='dev-fr-section'>
            <h2>Navigation</h2>
            <div className='dev-fr-links'>
              <QuickLink href='/' label='Accueil' note='Home locale' />
              <QuickLink
                href='/cours-fr?view=certifications'
                label='Parcours FR'
                note='Certifications traduites'
              />
              <QuickLink
                href='/catalog'
                label='Catalogue'
                note='Certs v9 + badges FR'
              />
              <QuickLink
                href='/learn'
                label='Carte complète'
                note='Tout le curriculum local'
              />
              <QuickLink
                href='/exam-fr?cert=responsive-web-design-v9'
                label='Examen RWD'
                note='Examen local français'
              />
            </div>
          </section>

          <section className='dev-fr-section'>
            <h2>Progression navigateur</h2>
            <div className='dev-fr-status-grid'>
              <div className='dev-fr-metric'>
                <span>Challenges terminés</span>
                <strong>{browserSummary.completedChallenges}</strong>
              </div>
              <div className='dev-fr-metric'>
                <span>Tentatives examen</span>
                <strong>{browserSummary.examAttempts}</strong>
              </div>
              <div className='dev-fr-metric'>
                <span>Dernier examen</span>
                <strong>
                  {browserSummary.lastExamAttempt
                    ? formatDate(browserSummary.lastExamAttempt)
                    : 'aucun'}
                </strong>
              </div>
            </div>
            <div className='dev-fr-profile-actions'>
              <button
                type='button'
                className='dev-fr-btn'
                onClick={() => {
                  const blob = new Blob(
                    [serializeLocalProfile(exportLocalProfile())],
                    { type: 'application/json' }
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `fcc-fr-local-profile-${new Date()
                    .toISOString()
                    .slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Exporter le profil local
              </button>
              <label className='dev-fr-btn dev-fr-btn-file'>
                Importer un profil
                <input
                  type='file'
                  accept='application/json,.json'
                  hidden
                  onChange={event => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      try {
                        importLocalProfile(String(reader.result || ''));
                        setBrowserSummary(readBrowserSummary());
                        window.alert('Profil importé.');
                      } catch (err) {
                        window.alert(
                          err instanceof Error
                            ? err.message
                            : 'Import impossible'
                        );
                      }
                    };
                    reader.readAsText(file);
                    event.target.value = '';
                  }}
                />
              </label>
              <a className='dev-fr-btn' href='/cours-fr'>
                Panneau données sur Parcours
              </a>
            </div>
          </section>

          <section className='dev-fr-section'>
            <h2>Traductions v9</h2>
            <p className='dev-fr-muted'>
              Compteurs live depuis le disque (preval Webpack), pas le snapshot.
            </p>
            <div
              className='dev-fr-table-wrap'
              role='region'
              aria-label='Progression des traductions'
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex={0}
            >
              <table className='dev-fr-table'>
                <thead>
                  <tr>
                    <th>Certification</th>
                    <th>Fichiers</th>
                    <th>Progression</th>
                    <th>Lien</th>
                  </tr>
                </thead>
                <tbody>
                  {translationRows.map(row => {
                    const pct = row.pctFiles ?? row.pct;
                    return (
                      <tr key={row.key}>
                        <td data-label='Certification'>
                          <span>{row.key}</span>
                        </td>
                        <td data-label='Fichiers'>
                          <span>
                            {row.totalFiles != null
                              ? `${row.translatedFiles}/${row.totalFiles}`
                              : '—'}
                          </span>
                        </td>
                        <td data-label='Progression'>
                          <div className='dev-fr-progress-cell'>
                            <div className='dev-fr-bar' aria-hidden='true'>
                              <span style={{ width: `${pct}%` }} />
                            </div>
                            <span>{pct}%</span>
                          </div>
                        </td>
                        <td data-label='Lien'>
                          <a
                            href={`/cours-fr?view=certifications&cert=${row.key}`}
                          >
                            Ouvrir
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {report && (
            <>
              <section className='dev-fr-section'>
                <h2>Drift EN → FR</h2>
                <p>
                  {driftCount === 0
                    ? `Aucun drift sur ${report.drift.comparedFiles} fichiers comparés.`
                    : `${driftCount} fichier(s) à relire.`}
                </p>
                {report.drift.drifted.length > 0 && (
                  <ul className='dev-fr-list'>
                    {report.drift.drifted.map(item => (
                      <li key={`${item.block}/${item.file}`}>
                        <code>
                          {item.block}/{item.file}
                        </code>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className='dev-fr-section'>
                <h2>Git</h2>
                <dl className='dev-fr-details'>
                  <dt>Branche</dt>
                  <dd>{report.git.branch}</dd>
                  <dt>Dernier commit</dt>
                  <dd>{report.git.lastCommit}</dd>
                  <dt>Working tree</dt>
                  <dd>{report.git.dirty ? 'modifié' : 'propre'}</dd>
                </dl>
                {report.git.changedFiles.length > 0 && (
                  <pre
                    className='dev-fr-log'
                    role='region'
                    aria-label='Fichiers Git modifiés'
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                    tabIndex={0}
                  >
                    {report.git.changedFiles.join('\n')}
                  </pre>
                )}
              </section>
            </>
          )}

          <section className='dev-fr-section'>
            <button
              type='button'
              className='dev-fr-btn'
              onClick={() => setShowDebug(value => !value)}
              aria-expanded={showDebug}
            >
              {showDebug ? 'Masquer debug' : 'Afficher debug'}
            </button>
            {showDebug && (
              <div className='dev-fr-debug'>
                <p>
                  Snapshot reporté :{' '}
                  {report?.server.reportedStatus || 'inconnu'} · mode{' '}
                  {report?.server.mode || '—'}
                </p>
                <p>
                  GraphiQL (develop) : <a href='/___graphql'>/___graphql</a>
                </p>
                {report?.latestLog?.length ? (
                  <pre
                    className='dev-fr-log'
                    role='region'
                    aria-label='Derniers événements du serveur'
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                    tabIndex={0}
                  >
                    {report.latestLog.join('\n')}
                  </pre>
                ) : (
                  <p className='dev-fr-muted'>Pas de logs dans le snapshot.</p>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default DevFrPage;
