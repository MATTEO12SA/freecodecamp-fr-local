// Historique local des tentatives d'examen FR (/exam-fr).
// Meme philosophie que local-progress.ts : pas de backend, tout est dans
// localStorage. Cle dediee `fcc-exam-history`, separee de la progression.

const STORAGE_KEY = 'fcc-exam-history';
const MAX_PER_CERT = 50;

export type ExamAttempt = {
  cert: string;
  date: string; // ISO timestamp
  score: number;
  total: number;
  pct: number; // entier 0-100
};

type Store = Record<string, ExamAttempt[]>;

function readStore(): Store {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

function writeStore(store: Store): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // localStorage plein ou desactive : on ignore.
  }
}

// Tentatives d'un cert, de la plus recente a la plus ancienne.
export function getAttempts(cert: string): ExamAttempt[] {
  const list = readStore()[cert];
  return Array.isArray(list) ? list : [];
}

export function saveAttempt(attempt: ExamAttempt): void {
  const store = readStore();
  const list = Array.isArray(store[attempt.cert]) ? store[attempt.cert] : [];
  list.unshift(attempt);
  store[attempt.cert] = list.slice(0, MAX_PER_CERT);
  writeStore(store);
}
