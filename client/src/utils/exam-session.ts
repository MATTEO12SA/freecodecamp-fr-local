const STORAGE_KEY = 'fcc-exam-session';
const STORAGE_VERSION = 2;
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export type ExamSession = {
  cert: string;
  seed: number;
  currentIndex: number;
  answers: Array<number | null>;
  mode: 'full' | 'review';
  reviewIndexes: number[];
  updatedAt: string;
};

type SessionStore = Record<string, ExamSession>;
type VersionedSessionStore = {
  version: number;
  byCert: SessionStore;
};

function isExamSession(value: unknown): value is ExamSession {
  if (!value || typeof value !== 'object') return false;
  const session = value as ExamSession;
  return (
    typeof session.cert === 'string' &&
    Number.isFinite(session.seed) &&
    Number.isInteger(session.currentIndex) &&
    session.currentIndex >= 0 &&
    Array.isArray(session.answers) &&
    session.answers.every(
      answer => answer === null || (Number.isInteger(answer) && answer >= 0)
    ) &&
    (session.mode === 'full' || session.mode === 'review') &&
    Array.isArray(session.reviewIndexes) &&
    session.reviewIndexes.every(
      index => Number.isInteger(index) && index >= 0
    ) &&
    typeof session.updatedAt === 'string' &&
    Number.isFinite(new Date(session.updatedAt).getTime())
  );
}

function readStore(): SessionStore {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<VersionedSessionStore>;
    if (
      parsed.version !== STORAGE_VERSION ||
      !parsed.byCert ||
      typeof parsed.byCert !== 'object'
    ) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed.byCert).filter(([, session]) =>
        isExamSession(session)
      )
    );
  } catch {
    return {};
  }
}

function writeStore(store: SessionStore): void {
  if (typeof window === 'undefined') return;

  try {
    if (Object.keys(store).length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        byCert: store
      })
    );
  } catch {
    // localStorage plein ou désactivé : la session reste utilisable en mémoire.
  }
}

export function getExamSession(
  cert: string,
  now = Date.now()
): ExamSession | null {
  const store = readStore();
  const session = store[cert];
  if (!session) return null;

  if (now - new Date(session.updatedAt).getTime() > SESSION_MAX_AGE_MS) {
    delete store[cert];
    writeStore(store);
    return null;
  }

  return session;
}

export function saveExamSession(
  session: Omit<ExamSession, 'updatedAt'>,
  now = Date.now()
): void {
  const store = readStore();
  store[session.cert] = {
    ...session,
    updatedAt: new Date(now).toISOString()
  };
  writeStore(store);
}

export function clearExamSession(cert: string): void {
  const store = readStore();
  delete store[cert];
  writeStore(store);
}
