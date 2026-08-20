import React, { useEffect, useMemo, useRef, useState } from 'react';
import { graphql } from 'gatsby';
import type { PageProps } from 'gatsby';
import { Container, Col, Row, Spacer, Button } from '@freecodecamp/ui';
import LearnLayout from '../components/layouts/learn';
import SEO from '../components/seo';
import {
  getExamCertificationTitle,
  listReadyExamCertifications
} from '../utils/exam-certifications';
import { hasFrenchBlock } from '../utils/has-french-intro';
import { getAttempts, saveAttempt } from '../utils/exam-history';
import {
  clearExamSession,
  getExamSession,
  saveExamSession
} from '../utils/exam-session';
import { sanitizeQuizHtml } from '../utils/sanitize-quiz-html';

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
  const cert = getCertFromSearch(location.search);
  const [seed, setSeed] = useState<number>(0);
  const [phase, setPhase] = useState<'intro' | 'inprogress' | 'results'>(
    'intro'
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  // 'full' = examen complet tire du pool ; 'review' = revision des erreurs.
  const [mode, setMode] = useState<'full' | 'review'>('full');
  const [reviewIndexes, setReviewIndexes] = useState<number[]>([]);
  // Bumpe apres une sauvegarde pour rafraichir l'historique affiche.
  const [historyVersion, setHistoryVersion] = useState(0);
  const [restoredCert, setRestoredCert] = useState<string | null>(null);
  const [pendingResume, setPendingResume] = useState(false);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<
    'all' | 'incorrect' | 'unanswered'
  >('all');
  const finishingRef = useRef(false);

  const certTitle = getExamCertificationTitle(cert);
  const isUnknownCertification = Boolean(cert && !certTitle);

  useEffect(() => {
    finishingRef.current = false;
    setShowFinishConfirmation(false);
    setReviewFilter('all');

    if (!cert || !getExamCertificationTitle(cert)) {
      setPhase('intro');
      setCurrentIndex(0);
      setAnswers([]);
      setMode('full');
      setReviewIndexes([]);
      setPendingResume(false);
      setRestoredCert(cert);
      return;
    }

    const session = getExamSession(cert);
    if (session) {
      setSeed(session.seed);
      setCurrentIndex(session.currentIndex);
      setAnswers(session.answers);
      setMode(session.mode);
      setReviewIndexes(session.reviewIndexes);
      setPendingResume(true);
      setPhase('intro');
    } else {
      setPhase('intro');
      setCurrentIndex(0);
      setAnswers([]);
      setMode('full');
      setReviewIndexes([]);
      setPendingResume(false);
    }
    setRestoredCert(cert);
  }, [cert]);

  const frenchQuizChallenges = useMemo(
    () =>
      data.allChallengeNode.nodes
        .map(node => node.challenge)
        .filter(challenge => hasFrenchBlock(challenge.block)),
    [data.allChallengeNode.nodes]
  );

  const questions = useMemo(() => {
    if (!cert || (phase === 'intro' && !pendingResume)) return [];
    const pool = prepareQuestions(frenchQuizChallenges, cert, seed);
    if (mode === 'review') {
      return reviewIndexes.map(index => pool[index]).filter(Boolean);
    }
    return phase === 'intro' ? [] : pool;
  }, [
    frenchQuizChallenges,
    cert,
    seed,
    phase,
    mode,
    reviewIndexes,
    pendingResume
  ]);

  const attempts = useMemo(() => {
    void historyVersion;
    return cert ? getAttempts(cert) : [];
  }, [cert, historyVersion]);

  const availableCount = useMemo(() => {
    if (!cert) return 0;
    let count = 0;
    for (const challenge of frenchQuizChallenges) {
      if (challenge.superBlock !== cert) continue;
      for (const quiz of challenge.quizzes || []) {
        count += (quiz.questions || []).length;
      }
    }
    return count;
  }, [frenchQuizChallenges, cert]);

  const readyExams = useMemo(
    () => listReadyExamCertifications(frenchQuizChallenges),
    [frenchQuizChallenges]
  );

  useEffect(() => {
    if (
      restoredCert !== cert ||
      phase !== 'inprogress' ||
      !cert ||
      !certTitle
    ) {
      return;
    }

    saveExamSession({
      cert,
      seed,
      currentIndex,
      answers,
      mode,
      reviewIndexes
    });
  }, [
    answers,
    cert,
    certTitle,
    currentIndex,
    mode,
    phase,
    restoredCert,
    reviewIndexes,
    seed
  ]);

  useEffect(() => {
    if (
      phase === 'inprogress' &&
      questions.length > 0 &&
      currentIndex >= questions.length
    ) {
      setCurrentIndex(questions.length - 1);
    }
  }, [currentIndex, phase, questions.length]);

  useEffect(() => {
    if (!showFinishConfirmation) return;

    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setShowFinishConfirmation(false);
      }
    };

    document.getElementById('exam-fr-continue')?.focus();
    document.addEventListener('keydown', closeOnEscape);

    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [showFinishConfirmation]);

  function startExam(): void {
    if (cert) clearExamSession(cert);
    finishingRef.current = false;
    setShowFinishConfirmation(false);
    setPendingResume(false);
    setReviewFilter('all');
    setMode('full');
    setReviewIndexes([]);
    setSeed(Date.now());
    setAnswers(new Array(Math.min(EXAM_LENGTH, availableCount)).fill(null));
    setCurrentIndex(0);
    setPhase('inprogress');
  }

  function resumeExam(): void {
    finishingRef.current = false;
    setShowFinishConfirmation(false);
    setPendingResume(false);
    setPhase('inprogress');
  }

  function selectAnswer(choiceIndex: number): void {
    setShowFinishConfirmation(false);
    const next = answers.slice();
    next[currentIndex] = choiceIndex;
    setAnswers(next);
  }

  function goNext(): void {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const unanswered = answers.filter(answer => answer === null).length;
      if (unanswered > 0) {
        setShowFinishConfirmation(true);
      } else {
        finishExam();
      }
    }
  }

  function goPrev(): void {
    setShowFinishConfirmation(false);
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }

  function finishExam(): void {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setShowFinishConfirmation(false);
    if (cert) clearExamSession(cert);
    setPhase('results');
  }

  function restart(): void {
    if (cert) clearExamSession(cert);
    finishingRef.current = false;
    setShowFinishConfirmation(false);
    setPendingResume(false);
    setReviewFilter('all');
    setMode('full');
    setReviewIndexes([]);
    setPhase('intro');
    setCurrentIndex(0);
    setAnswers([]);
  }

  // Relance un mini-examen compose uniquement des questions ratees de la
  // tentative qui vient de se terminer. On reutilise le seed de l'examen
  // complet et les index des erreurs, sans stocker les solutions.
  function startReview(): void {
    const failedIndexes = questions
      .map((_, index) => index)
      .filter(index => answers[index] !== questions[index].correctChoiceIndex);
    if (failedIndexes.length === 0) return;
    finishingRef.current = false;
    setShowFinishConfirmation(false);
    setReviewFilter('all');
    setReviewIndexes(failedIndexes);
    setMode('review');
    setAnswers(new Array(failedIndexes.length).fill(null));
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
  const unansweredCount = answers.filter(answer => answer === null).length;
  const incorrectCount = questions.filter(
    (question, index) =>
      answers[index] !== null && answers[index] !== question.correctChoiceIndex
  ).length;
  const effectiveReviewFilter =
    incorrectCount === 0 && unansweredCount === 0 ? 'all' : reviewFilter;
  const reviewItems = questions
    .map((question, index) => {
      const userChoiceIndex = answers[index] ?? null;
      return {
        question,
        index,
        userChoiceIndex,
        isCorrect: userChoiceIndex === question.correctChoiceIndex
      };
    })
    .filter(item => {
      if (effectiveReviewFilter === 'incorrect') {
        return !item.isCorrect && item.userChoiceIndex !== null;
      }
      if (effectiveReviewFilter === 'unanswered') {
        return item.userChoiceIndex === null;
      }
      return true;
    });

  // Sauvegarde la tentative a l'entree dans l'ecran resultats (examen complet
  // seulement : on ne pollue pas l'historique avec les revisions).
  useEffect(() => {
    if (phase !== 'results' || mode !== 'full' || !cert || totalQuestions === 0)
      return;
    const saved = saveAttempt({
      cert,
      date: new Date().toISOString(),
      score,
      total: totalQuestions,
      pct: Math.round(scorePct * 100),
      seed
    });
    if (saved) setHistoryVersion(v => v + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, mode, cert, seed]);

  return (
    <LearnLayout contentId='content-start'>
      <SEO
        title={
          isUnknownCertification
            ? 'Certification inconnue'
            : certTitle
              ? `Examen ${certTitle}`
              : 'Examen'
        }
      />
      <Container>
        <Row>
          <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
            <Spacer size='m' />

            {!cert && (
              <>
                <h1 className='text-center'>Choisis une certification</h1>
                <p className='exam-fr-intro'>
                  L&apos;examen se lance depuis une certification, pas depuis
                  une URL à taper. Seuls les parcours qui ont déjà des questions
                  de quiz en français sont listés.
                </p>
                {readyExams.length === 0 ? (
                  <p className='exam-fr-warning'>
                    Aucun quiz français n&apos;est encore disponible pour
                    l&apos;examen.
                  </p>
                ) : (
                  <ul className='exam-fr-cert-list'>
                    {readyExams.map(item => (
                      <li key={item.key}>
                        <a
                          href={`/exam-fr?cert=${encodeURIComponent(item.key)}`}
                        >
                          {item.title} ({item.questions} questions)
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <p>
                  <a href='/cours-fr?view=certifications'>
                    ← Retour aux certifications
                  </a>
                </p>
              </>
            )}

            {isUnknownCertification && (
              <>
                <h1 className='text-center'>Certification inconnue</h1>
                <p className='exam-fr-intro'>
                  Cette certification ne correspond à aucun examen local
                  disponible.
                </p>
                <p>
                  <a href='/cours-fr?view=certifications'>
                    ← Retour aux certifications
                  </a>
                </p>
              </>
            )}

            {cert && certTitle && phase === 'intro' && (
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
                ) : pendingResume ? (
                  <div className='exam-fr-resume' role='status'>
                    <p>
                      Une session est en cours à la question{' '}
                      <strong>
                        {currentIndex + 1}/{answers.length || EXAM_LENGTH}
                      </strong>
                      . Tu peux la reprendre ou recommencer à zéro.
                    </p>
                    <div className='exam-fr-nav'>
                      <button
                        type='button'
                        className='exam-fr-resume-primary'
                        onClick={resumeExam}
                      >
                        Reprendre
                      </button>
                      <button
                        type='button'
                        className='exam-fr-resume-danger'
                        onClick={startExam}
                      >
                        Recommencer
                      </button>
                    </div>
                  </div>
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
                  <a href='/cours-fr?view=certifications'>
                    ← Retour aux certifications
                  </a>
                </p>
              </>
            )}

            {cert &&
              certTitle &&
              phase === 'inprogress' &&
              questions.length > 0 && (
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
                      __html: sanitizeQuizHtml(
                        questions[currentIndex].questionText
                      )
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
                              dangerouslySetInnerHTML={{
                                __html: sanitizeQuizHtml(choice.text)
                              }}
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
                  {showFinishConfirmation && (
                    <div
                      className='exam-fr-finish-confirmation'
                      role='alertdialog'
                      aria-modal='true'
                      aria-labelledby='exam-fr-finish-title'
                    >
                      <h2 id='exam-fr-finish-title'>
                        Terminer l&apos;examen ?
                      </h2>
                      <p>
                        {unansweredCount} question
                        {unansweredCount > 1 ? 's' : ''} sans réponse. Tu peux
                        encore les compléter avant de calculer ton score.
                      </p>
                      <div className='exam-fr-confirm-actions'>
                        <Button
                          id='exam-fr-continue'
                          onClick={() => setShowFinishConfirmation(false)}
                        >
                          Continuer l&apos;examen
                        </Button>
                        <Button onClick={finishExam}>
                          Terminer quand même
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

            {cert && certTitle && phase === 'results' && (
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
                <div
                  className='exam-fr-review-filters'
                  aria-label='Filtrer le détail des réponses'
                >
                  <button
                    type='button'
                    aria-pressed={effectiveReviewFilter === 'incorrect'}
                    disabled={incorrectCount === 0}
                    onClick={() => setReviewFilter('incorrect')}
                  >
                    À revoir ({incorrectCount})
                  </button>
                  <button
                    type='button'
                    aria-pressed={effectiveReviewFilter === 'unanswered'}
                    disabled={unansweredCount === 0}
                    onClick={() => setReviewFilter('unanswered')}
                  >
                    Sans réponse ({unansweredCount})
                  </button>
                  <button
                    type='button'
                    aria-pressed={effectiveReviewFilter === 'all'}
                    onClick={() => setReviewFilter('all')}
                  >
                    Toutes ({totalQuestions})
                  </button>
                </div>
                <ol className='exam-fr-review'>
                  {reviewItems.map(
                    ({ question, index, userChoiceIndex, isCorrect }) => {
                      return (
                        <li
                          key={index}
                          className={
                            isCorrect
                              ? 'exam-fr-review-item exam-fr-correct'
                              : 'exam-fr-review-item exam-fr-incorrect'
                          }
                        >
                          <details>
                            <summary>
                              <span>Question {index + 1}</span>
                              <strong>
                                {isCorrect ? 'Correcte' : 'À revoir'}
                              </strong>
                            </summary>
                            <div className='exam-fr-review-content'>
                              <div
                                className='exam-fr-review-q'
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeQuizHtml(
                                    question.questionText
                                  )
                                }}
                              />
                              <div className='exam-fr-review-a'>
                                <strong>Bonne réponse :</strong>{' '}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeQuizHtml(
                                      question.choices[
                                        question.correctChoiceIndex
                                      ].text
                                    )
                                  }}
                                />
                              </div>
                              {!isCorrect && userChoiceIndex !== null && (
                                <div className='exam-fr-review-user'>
                                  <strong>Ta réponse :</strong>{' '}
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: sanitizeQuizHtml(
                                        question.choices[userChoiceIndex].text
                                      )
                                    }}
                                  />
                                </div>
                              )}
                              {userChoiceIndex === null && (
                                <div className='exam-fr-review-user'>
                                  <em>Pas répondu</em>
                                </div>
                              )}
                            </div>
                          </details>
                        </li>
                      );
                    }
                  )}
                </ol>
                <Spacer size='m' />
                <div className='exam-fr-nav'>
                  {wrongCount > 0 && (
                    <Button onClick={startReview}>
                      Réviser mes erreurs ({wrongCount})
                    </Button>
                  )}
                  <Button onClick={restart}>Recommencer</Button>
                  <a
                    className='exam-fr-back-link'
                    href='/cours-fr?view=certifications'
                  >
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
