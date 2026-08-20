/**
 * Persists the last learn challenge path so the global "Continuer" nav link
 * can resume where the learner left off (local fork, no account).
 */
const STORAGE_KEY = 'fcc-local-continue-path';

const LEARN_CHALLENGE_PATH = /^\/learn\/[^/]+\/[^/]+\/[^/]+\/?$/;

export function isLearnChallengePath(pathname: string): boolean {
  if (!pathname) return false;
  // Strip locale prefixes like /french if present
  const normalized = pathname.replace(
    /^\/(english|french|espanol|chinese|italian|portuguese|japanese|ukrainian|german|swahili)(?=\/)/,
    ''
  );
  return LEARN_CHALLENGE_PATH.test(normalized);
}

export function getContinuePath(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw || !isLearnChallengePath(raw)) return null;
    return raw;
  } catch {
    return null;
  }
}

export function setContinuePath(pathname: string): void {
  if (typeof window === 'undefined') return;
  if (!isLearnChallengePath(pathname)) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, pathname);
  } catch {
    // ignore quota / private mode
  }
}

export function clearContinuePath(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
