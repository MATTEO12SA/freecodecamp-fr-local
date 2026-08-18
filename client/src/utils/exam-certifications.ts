export const examCertificationTitles = {
  'responsive-web-design-v9': 'Responsive Web Design',
  'javascript-v9': 'JavaScript',
  'front-end-development-libraries-v9': 'Bibliothèques Front-End',
  'python-v9': 'Python',
  'relational-databases-v9': 'Bases de données relationnelles',
  'back-end-development-and-apis-v9': 'Back-End et APIs',
  'full-stack-developer-v9': 'Cursus Full-Stack'
} as const;

export function getExamCertificationTitle(
  certification: string | null
): string | null {
  if (!certification) return null;
  return (
    examCertificationTitles[
      certification as keyof typeof examCertificationTitles
    ] ?? null
  );
}

export function listExamCertifications(): Array<{
  key: keyof typeof examCertificationTitles;
  title: string;
}> {
  return (
    Object.entries(examCertificationTitles) as Array<
      [keyof typeof examCertificationTitles, string]
    >
  ).map(([key, title]) => ({ key, title }));
}

type QuizChallenge = {
  superBlock: string;
  quizzes?: { questions?: unknown[] }[];
};

export function listReadyExamCertifications(
  challenges: QuizChallenge[]
): Array<{
  key: keyof typeof examCertificationTitles;
  title: string;
  questions: number;
}> {
  const counts = new Map<string, number>();
  for (const challenge of challenges) {
    let questions = 0;
    for (const quiz of challenge.quizzes || []) {
      questions += quiz.questions?.length || 0;
    }
    if (questions === 0) continue;
    counts.set(
      challenge.superBlock,
      (counts.get(challenge.superBlock) || 0) + questions
    );
  }

  return listExamCertifications()
    .map(item => ({
      ...item,
      questions: counts.get(item.key) || 0
    }))
    .filter(item => item.questions > 0);
}
