import React, { useState, useMemo, useEffect } from 'react';
import { graphql } from 'gatsby';
import type { PageProps } from 'gatsby';
import { Container, Col, Row, Spacer, Button } from '@freecodecamp/ui';
import LearnLayout from '../components/layouts/learn';
import SEO from '../components/seo';
import { getAttempts, saveAttempt } from '../utils/exam-history';

import './exam-fr.css';

type Question = {
  text: string;
  distractors: string[];
  answer: string;
};

type QuizChallenge = {
  id: string;
  block: string;
  superBlock: string;
  title: string;
  quizzes: { questions: Question[] }[];
};

type ChallengeNode = { challenge: QuizChallenge };

type PageData = {
  allChallengeNode: { nodes: ChallengeNode[] };
};

type Choice = {
  text: string;
  isAnswer: boolean;
};

type PreparedQuestion = {
  questionText: string;
  choices: Choice[];
  correctChoiceIndex: number;
  sourceBlock: string;
};

function getAccessibleChoiceText(html: string, fallback: string): string {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

  return text || fallback;
}

const CERT_TITLES: Record<string, string> = {
  'responsive-web-design-v9': 'Responsive Web Design',
  'javascript-v9': 'JavaScript',
  'front-end-development-libraries-v9': 'Bibliothèques Front-End',
  'python-v9': 'Python',
  'relational-databases-v9': 'Bases de données relationnelles',
  'back-end-development-and-apis-v9': 'Back-End et APIs',
  'full-stack-developer-v9': 'Cursus Full-Stack'
};

const EXAM_LENGTH = 80;
const PASSING_SCORE = 0.7;

function shuffleArray<T>(arr: T[], seed: number): T[] {
  const copy = arr.slice();
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getCertFromSearch(search: string): string | null {
  if (!search) return null;
  const params = new URLSearchParams(search);
  return params.get('cert');
}

// `quiz-css-colors` -> `Css colors` : libelle lisible pour les stats par module.
function prettyBlock(block: string): string {
  const label = block
    .replace(/^quiz-/, '')
    .replace(/-/g, ' ')
    .trim();
  return label ? label.charAt(0).toUpperCase() + label.slice(1) : block;
}

function formatAttemptDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function prepareQuestions(
  challenges: QuizChallenge[],
  cert: string,
  seed: number
): PreparedQuestion[] {
  const relevant = challenges.filter(c => c.superBlock === cert);
  const pool: PreparedQuestion[] = [];
  for (const challenge of relevant) {
    for (const quiz of challenge.quizzes || []) {
      for (const q of quiz.questions || []) {
        const distractors = (q.distractors || []).slice(0, 3);
        const choices: Choice[] = [
          ...distractors.map(d => ({ text: d, isAnswer: false })),
          { text: q.answer, isAnswer: true }
        ];
        const shuffledChoices = shuffleArray(choices, seed + pool.length);
        const correctChoiceIndex = shuffledChoices.findIndex(c => c.isAnswer);
        pool.push({
          questionText: q.text,
          choices: shuffledChoices,
          correctChoiceIndex,
          sourceBlock: challenge.block
        });
      }
    }
  }
  return shuffleArray(pool, seed).slice(0, EXAM_LENGTH);
}

function ExamFrPage({ data, location }: PageProps<PageData>): JSX.Element {
  const [cert, setCert] = useState<string | null>(null);
  const [seed, setSeed] = useState<number>(0);
  const [phase, setPhase] = useState<'intro' | 'inprogress' | 'results'>(
    'intro'
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  // 'full' = examen complet tire du pool ; 'review' = revision des erreurs.
  const [mode, setMode] = useState<'full' | 'review'>('full');
  const [reviewQuestions, setReviewQuestions] = useState<PreparedQuestion[]>(
    []
  );
  // Bumpe apres une sauvegarde pour rafraichir l'historique affiche.
  const [historyVersion, setHistoryVersion] = useState(0);

  useEffect(() => {
    setCert(getCertFromSearch(location.search));
  }, [location.search]);

  const questions = useMemo(() => {
    if (mode === 'review') return reviewQuestions;
    if (!cert || phase === 'intro') return [];
    return prepareQuestions(
      data.allChallengeNode.nodes.map(n => n.challenge),
      cert,
      seed
    );
  }, [data.allChallengeNode.nodes, cert, seed, phase, mode, reviewQuestions]);

  const attempts = useMemo(() => {
    void historyVersion;
    return cert ? getAttempts(cert) : [];
  }, [cert, historyVersion]);

  const availableCount = useMemo(() => {
    if (!cert) return 0;
    let count = 0;
    for (const node of data.allChallengeNode.nodes) {
      const c = node.challenge;
      if (c.superBlock !== cert) continue;
      for (const quiz of c.quizzes || []) {
        count += (quiz.questions || []).length;
      }
    }
    return count;
  }, [data.allChallengeNode.nodes, cert]);

  const certTitle = cert ? CERT_TITLES[cert] || cert : '';

  function startExam(): void {
    setMode('full');
    setReviewQuestions([]);
    setSeed(Date.now());
    setAnswers(new Array(Math.min(EXAM_LENGTH, availableCount)).fill(null));
    setCurrentIndex(0);
    setPhase('inprogress');
  }

  function selectAnswer(choiceIndex: number): void {
    const next = answers.slice();
    next[currentIndex] = choiceIndex;
    setAnswers(next);
  }

  function goNext(): void {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setPhase('results');
    }
  }

  function goPrev(): void {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }

  function restart(): void {
    setMode('full');
    setReviewQuestions([]);
    setPhase('intro');
    setCurrentIndex(0);
    setAnswers([]);
  }

  // Relance un mini-examen compose uniquement des questions ratees de la
  // tentative qui vient de se terminer. On reutilise les PreparedQuestion deja
  // en memoire (pas de nouveau tirage dans le pool global).
  function startReview(): void {
    const failed = questions.filter(
      (q, i) => answers[i] !== q.correctChoiceIndex
    );
    if (failed.length === 0) return;
    setReviewQuestions(failed);
    setMode('review');
    setAnswers(new Array(failed.length).fill(null));
    setCurrentIndex(0);
    setPhase('inprogress');
  }

  const score = useMemo(() => {
    if (phase !== 'results') return 0;
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctChoiceIndex) correct++;
    }
    return correct;
  }, [phase, questions, answers]);

  const totalQuestions = questions.length;
  const scorePct = totalQuestions ? score / totalQuestions : 0;
  const passed = scorePct >= PASSING_SCORE;

  // Reussite par module (block source de chaque question), du plus faible au
  // plus fort, pour montrer ou reviser en priorite.
  const moduleStats = useMemo(() => {
    if (phase !== 'results') return [];
    const map = new Map<string, { total: number; correct: number }>();
    for (let i = 0; i < questions.length; i++) {
      const block = questions[i].sourceBlock;
      const entry = map.get(block) || { total: 0, correct: 0 };
      entry.total++;
      if (answers[i] === questions[i].correctChoiceIndex) entry.correct++;
      map.set(block, entry);
    }
    return Array.from(map.entries())
      .map(([block, s]) => ({
        block,
        total: s.total,
        correct: s.correct,
        pct: Math.round((s.correct / s.total) * 100)
      }))
      .sort((a, b) => a.pct - b.pct || a.block.localeCompare(b.block));
  }, [phase, questions, answers]);

  const wrongCount = totalQuestions - score;

  // Sauvegarde la tentative a l'entree dans l'ecran resultats (examen complet
  // seulement : on ne pollue pas l'historique avec les revisions).
  useEffect(() => {
    if (phase !== 'results' || mode !== 'full' || !cert || totalQuestions === 0)
      return;
    saveAttempt({
      cert,
      date: new Date().toISOString(),
      score,
      total: totalQuestions,
      pct: Math.round(scorePct * 100)
    });
    setHistoryVersion(v => v + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, mode, cert]);

  return (
    <LearnLayout>
      <SEO title={cert ? `Examen ${certTitle}` : 'Examen'} />
      <Container>
        <Row>
          <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
            <Spacer size='m' />

            {!cert && (
              <>
                <h1 className='text-center'>Examen non sélectionné</h1>
                <p className='exam-fr-intro'>
                  Cette page attend une certification dans l&apos;URL. Exemple :{' '}
                  <code>/exam-fr?cert=responsive-web-design-v9</code>.
                </p>
                <p>
                  <a href='/cours-fr'>← Retour aux certifications</a>
                </p>
              </>
            )}

            {cert && phase === 'intro' && (
              <>
                <h1 className='text-center'>Examen — {certTitle}</h1>
                <Spacer size='m' />
                <p>
                  Tu vas passer un examen de{' '}
                  <strong>
                    {Math.min(EXAM_LENGTH, availableCount)} questions
                  </strong>{' '}
                  tirées au hasard parmi les{' '}
                  <strong>{availableCount} questions disponibles</strong> dans
                  les quizzes traduits de cette certification.
                </p>
                <p>
                  Tu réussis l&apos;examen avec{' '}
                  <strong>{Math.round(PASSING_SCORE * 100)}%</strong> ou plus de
                  bonnes réponses.
                </p>
                {availableCount === 0 ? (
                  <p className='exam-fr-warning'>
                    🚧 Aucun quiz FR n&apos;est encore traduit pour cette
                    certification. Reviens quand les modules de cette
                    certification auront leurs quizzes en français.
                  </p>
                ) : (
                  <>
                    <p>
                      Tu peux naviguer entre les questions avec les boutons
                      Précédent et Suivant. Le score est calculé à la fin.
                    </p>
                    <Spacer size='m' />
                    <Button onClick={startExam}>Commencer l&apos;examen</Button>
                  </>
                )}
                {attempts.length > 0 && (
                  <div className='exam-fr-history'>
                    <h2>Tes dernières tentatives</h2>
                    <ul className='exam-fr-history-list'>
                      {attempts.slice(0, 5).map((a, i) => (
                        <li key={i} className='exam-fr-history-item'>
                          <span className='exam-fr-history-date'>
                            {formatAttemptDate(a.date)}
                          </span>
                          <span
                            className={
                              a.pct >= Math.round(PASSING_SCORE * 100)
                                ? 'exam-fr-history-pct exam-fr-history-pass'
                                : 'exam-fr-history-pct exam-fr-history-fail'
                            }
                          >
                            {a.score}/{a.total} ({a.pct}%)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Spacer size='m' />
                <p>
                  <a href='/cours-fr'>← Retour aux certifications</a>
                </p>
              </>
            )}

            {cert && phase === 'inprogress' && questions.length > 0 && (
              <>
                <h1 className='text-center'>
                  {mode === 'review' ? 'Révision' : 'Examen'} — {certTitle}
                </h1>
                <p className='exam-fr-progress'>
                  Question {currentIndex + 1} / {questions.length}
                </p>
                <div
                  className='exam-fr-question'
                  dangerouslySetInnerHTML={{
                    __html: questions[currentIndex].questionText
                  }}
                />
                <ul className='exam-fr-choices'>
                  {questions[currentIndex].choices.map((choice, idx) => {
                    const checked = answers[currentIndex] === idx;
                    const accessibleChoiceText = getAccessibleChoiceText(
                      choice.text,
                      `Réponse ${idx + 1}`
                    );
                    return (
                      <li key={idx}>
                        <label
                          aria-label={accessibleChoiceText}
                          className={
                            checked
                              ? 'exam-fr-choice exam-fr-choice-selected'
                              : 'exam-fr-choice'
                          }
                        >
                          <input
                            type='radio'
                            name={`q-${currentIndex}`}
                            checked={checked}
                            onChange={() => selectAnswer(idx)}
                          />
                          <span
                            dangerouslySetInnerHTML={{ __html: choice.text }}
                          />
                        </label>
                      </li>
                    );
                  })}
                </ul>
                <div className='exam-fr-nav'>
                  <Button onClick={goPrev} disabled={currentIndex === 0}>
                    Précédent
                  </Button>
                  <Button onClick={goNext}>
                    {currentIndex === questions.length - 1
                      ? 'Terminer'
                      : 'Suivant'}
                  </Button>
                </div>
              </>
            )}

            {cert && phase === 'results' && (
              <>
                <h1 className='text-center'>
                  {mode === 'review' ? 'Révision' : 'Résultats'} — {certTitle}
                </h1>
                <div
                  className={
                    passed ? 'exam-fr-result-passed' : 'exam-fr-result-failed'
                  }
                >
                  <p className='exam-fr-score'>
                    {score} / {totalQuestions} ({Math.round(scorePct * 100)}%)
                  </p>
                  <p className='exam-fr-verdict'>
                    {passed
                      ? '✅ Réussi'
                      : `❌ Pas réussi — il faut ${Math.round(
                          PASSING_SCORE * 100
                        )}% minimum.`}
                  </p>
                </div>
                <Spacer size='m' />
                {moduleStats.length > 1 && (
                  <>
                    <h2>Réussite par module</h2>
                    <table className='exam-fr-modules'>
                      <thead>
                        <tr>
                          <th>Module</th>
                          <th>Score</th>
                          <th>%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {moduleStats.map(m => (
                          <tr key={m.block}>
                            <td>{prettyBlock(m.block)}</td>
                            <td>
                              {m.correct}/{m.total}
                            </td>
                            <td className='exam-fr-modules-pct'>{m.pct}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Spacer size='m' />
                  </>
                )}
                <h2>Détail des réponses</h2>
                <ol className='exam-fr-review'>
                  {questions.map((q, i) => {
                    const userIdx = answers[i];
                    const isCorrect = userIdx === q.correctChoiceIndex;
                    return (
                      <li
                        key={i}
                        className={
                          isCorrect
                            ? 'exam-fr-review-item exam-fr-correct'
                            : 'exam-fr-review-item exam-fr-incorrect'
                        }
                      >
                        <div
                          className='exam-fr-review-q'
                          dangerouslySetInnerHTML={{ __html: q.questionText }}
                        />
                        <div className='exam-fr-review-a'>
                          <strong>Bonne réponse :</strong>{' '}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: q.choices[q.correctChoiceIndex].text
                            }}
                          />
                        </div>
                        {!isCorrect && userIdx !== null && (
                          <div className='exam-fr-review-user'>
                            <strong>Ta réponse :</strong>{' '}
                            <span
                              dangerouslySetInnerHTML={{
                                __html: q.choices[userIdx].text
                              }}
                            />
                          </div>
                        )}
                        {userIdx === null && (
                          <div className='exam-fr-review-user'>
                            <em>Pas répondu</em>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
                <Spacer size='m' />
                <div className='exam-fr-nav'>
                  {wrongCount > 0 && (
                    <Button onClick={startReview}>
                      Réviser mes erreurs ({wrongCount})
                    </Button>
                  )}
                  <Button onClick={restart}>Recommencer</Button>
                  <a className='exam-fr-back-link' href='/cours-fr'>
                    ← Retour aux certifications
                  </a>
                </div>
              </>
            )}

            <Spacer size='l' />
          </Col>
        </Row>
      </Container>
    </LearnLayout>
  );
}

ExamFrPage.displayName = 'ExamFrPage';
export default ExamFrPage;

export const query = graphql`
  query ExamFrQuery {
    allChallengeNode(filter: { challenge: { block: { regex: "/^quiz-/" } } }) {
      nodes {
        challenge {
          id
          block
          superBlock
          title
          quizzes {
            questions {
              text
              distractors
              answer
            }
          }
        }
      }
    }
  }
`;
