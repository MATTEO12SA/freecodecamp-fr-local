// Historique local des tentatives d'examen FR (/exam-fr).
// Meme philosophie que local-progress.ts : pas de backend, tout est dans
// localStorage. Cle dediee `fcc-exam-history`, separee de la progression.

const STORAGE_KEY = 'fcc-exam-history';
const STORAGE_VERSION = 1;
const MAX_PER_CERT = 50;

export type ExamAttempt = {
  cert: string;
  date: string; // ISO timestamp
  score: number;
  total: number;
  pct: number; // entier 0-100
};

type Store = Record<string, ExamAttempt[]>;
type VersionedStore = { version: number; byCert: Store };

function isValidAttempt(a: unknown): a is ExamAttempt {
  return (
    !!a &&
    typeof a === 'object' &&
    typeof (a as ExamAttempt).cert === 'string' &&
    typeof (a as ExamAttempt).score === 'number' &&
    typeof (a as ExamAttempt).total === 'number'
  );
}

function readStore(): Store {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    // Nouvelle forme : { version, byCert }. Ancienne forme : Record<cert,
    // attempts[]> directement. On accepte les deux et on filtre les tentatives
    // corrompues.
    const versioned = parsed as Partial<VersionedStore>;
    const rawByCert: Record<string, unknown> =
      typeof versioned.version === 'number' && versioned.byCert
        ? versioned.byCert
        : (parsed as Record<string, unknown>);
    const clean: Store = {};
    for (const [cert, list] of Object.entries(rawByCert)) {
      if (Array.isArray(list)) clean[cert] = list.filter(isValidAttempt);
    }
    return clean;
  } catch {
    return {};
  }
}

function writeStore(store: Store): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, byCert: store })
    );
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
