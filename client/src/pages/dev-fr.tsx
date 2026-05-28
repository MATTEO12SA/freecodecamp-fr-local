import React, { useEffect, useMemo, useState } from 'react';
import { Col, Container, Row, Spacer } from '@freecodecamp/ui';
import LearnLayout from '../components/layouts/learn';
import SEO from '../components/seo';
import { getLocalCompletedChallenges } from '../utils/local-progress';

import './dev-fr.css';

type TranslationRow = {
  key: string;
  translated: number;
  total: number;
  pct: number;
  // Niveau fichier (.md FR/EN) — present dans les rapports recents.
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

const reportUrl = '/local-dev/report.json';

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
  try {
    const raw = window.localStorage.getItem('fcc-exam-history');
    const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    const attempts = Object.values(parsed)
      .filter(Array.isArray)
      .flat() as Array<{ date?: string }>;
    attempts.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    return {
      completedChallenges,
      examAttempts: attempts.length,
      lastExamAttempt: attempts[0]?.date || ''
    };
  } catch {
    return {
      completedChallenges,
      examAttempts: 0,
      lastExamAttempt: ''
    };
  }
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

function DevFrPage(): JSX.Element {
  const [report, setReport] = useState<LocalDevReport | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [browserSummary, setBrowserSummary] = useState<BrowserSummary>({
    completedChallenges: 0,
    examAttempts: 0,
    lastExamAttempt: ''
  });

  const driftCount = report?.drift.totalDrifted ?? report?.drift.drifted.length;
  const isReady = Boolean(
    report && report.server.http.ok && driftCount === 0 && !report.git.dirty
  );

  const generatedAt = useMemo(
    () => (report ? formatDate(report.generatedAt) : ''),
    [report]
  );

  async function loadReport(): Promise<void> {
    setLoading(true);
    setError('');
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
  }

  useEffect(() => {
    void loadReport();
    setBrowserSummary(readBrowserSummary());
  }, []);

  return (
    <LearnLayout>
      <SEO title='Dev FR' />
      <main className='dev-fr-page'>
        <Container>
          <Row>
            <Col md={10} mdOffset={1} sm={12} xs={12}>
              <Spacer size='m' />
              <div className='dev-fr-header'>
                <div>
                  <h1>Dev FR</h1>
                  <p>
                    Tableau de bord local pour le serveur, les traductions, le
                    catalogue et les vérifications avant push.
                  </p>
                </div>
                <button
                  className='btn btn-primary'
                  type='button'
                  onClick={() => void loadReport()}
                >
                  Rafraîchir
                </button>
              </div>

              {loading && <p>Chargement du snapshot local...</p>}

              {error && (
                <section className='dev-fr-section dev-fr-empty'>
                  <h2>Snapshot introuvable</h2>
                  <p>
                    Lance <code>pnpm local:report</code>, puis rafraîchis cette
                    page.
                  </p>
                  <p className='dev-fr-muted'>Détail : {error}</p>
                </section>
              )}

              {report && (
                <>
                  <section className='dev-fr-status-grid'>
                    <div className='dev-fr-metric'>
                      <span>Verdict</span>
                      <strong className={statusClass(isReady ? 'UP' : 'WARN')}>
                        {isReady ? 'READY' : 'À vérifier'}
                      </strong>
                    </div>
                    <div className='dev-fr-metric'>
                      <span>Serveur</span>
                      <strong className={statusClass(report.server.verdict)}>
                        {report.server.verdict}
                      </strong>
                    </div>
                    <div className='dev-fr-metric'>
                      <span>HTTP</span>
                      <strong
                        className={statusClass(
                          report.server.http.ok ? 'UP' : 'DOWN'
                        )}
                      >
                        {report.server.http.statusCode || 'OFF'}
                      </strong>
                    </div>
                    <div className='dev-fr-metric'>
                      <span>Snapshot</span>
                      <strong>{generatedAt}</strong>
                    </div>
                  </section>

                  <section className='dev-fr-section'>
                    <h2>Navigation rapide</h2>
                    <div className='dev-fr-links'>
                      <QuickLink href='/' label='Accueil' note='Home locale' />
                      <QuickLink
                        href='/cours-fr'
                        label='Cours FR'
                        note='Certifications françaises'
                      />
                      <QuickLink
                        href='/catalog'
                        label='Catalogue'
                        note='Filtres globaux'
                      />
                      <QuickLink
                        href='/learn'
                        label='Parcours complet'
                        note='Tous les cours locaux'
                      />
                      <QuickLink
                        href='/exam-fr?cert=responsive-web-design-v9'
                        label='Examen RWD'
                        note='Examen local français'
                      />
                      <QuickLink
                        href='/___graphql'
                        label='GraphQL'
                        note='Explorateur Gatsby'
                      />
                    </div>
                  </section>

                  <section className='dev-fr-section'>
                    <h2>Serveur</h2>
                    <dl className='dev-fr-details'>
                      <dt>URL</dt>
                      <dd>
                        <a href={report.server.url}>{report.server.url}</a>
                      </dd>
                      <dt>Status JSON</dt>
                      <dd>{report.server.reportedStatus}</dd>
                      <dt>Mode</dt>
                      <dd>{report.server.mode || 'inconnu'}</dd>
                      <dt>Dernière mise à jour</dt>
                      <dd>{formatDate(report.server.updatedAt)}</dd>
                      <dt>Run ID</dt>
                      <dd>{report.server.runId || 'inconnu'}</dd>
                    </dl>
                  </section>

                  <section className='dev-fr-section'>
                    <h2>Progression locale navigateur</h2>
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
                  </section>

                  <section className='dev-fr-section'>
                    <h2>Traductions</h2>
                    <div className='dev-fr-table-wrap'>
                      <table className='dev-fr-table'>
                        <thead>
                          <tr>
                            <th>Certification</th>
                            <th>Blocs</th>
                            <th>Fichiers</th>
                            <th>Progression</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.translations.map(row => {
                            const pct = row.pctFiles ?? row.pct;
                            return (
                              <tr key={row.key}>
                                <td>{row.key}</td>
                                <td>
                                  {row.translated}/{row.total}
                                </td>
                                <td>
                                  {row.totalFiles != null
                                    ? `${row.translatedFiles}/${row.totalFiles}`
                                    : '—'}
                                </td>
                                <td>
                                  <div
                                    className='dev-fr-bar'
                                    aria-hidden='true'
                                  >
                                    <span style={{ width: `${pct}%` }} />
                                  </div>
                                  <span>{pct}%</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className='dev-fr-section'>
                    <h2>Drift EN vers FR</h2>
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
                      <pre className='dev-fr-log'>
                        {report.git.changedFiles.join('\n')}
                      </pre>
                    )}
                  </section>

                  <section className='dev-fr-section'>
                    <h2>Derniers logs</h2>
                    <pre className='dev-fr-log'>
                      {report.latestLog.join('\n')}
                    </pre>
                  </section>
                </>
              )}
            </Col>
          </Row>
        </Container>
      </main>
    </LearnLayout>
  );
}

export default DevFrPage;
