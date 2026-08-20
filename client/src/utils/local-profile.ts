import type { CompletedChallenge } from '../redux/prop-types';
import {
  getLocalCompletedChallenges,
  setLocalCompletedChallenges
} from './local-progress';
import { getContinuePath, setContinuePath } from './local-continue';

const EXPORT_VERSION = 1;

export type LocalProfileExport = {
  version: number;
  exportedAt: string;
  completedChallenges: CompletedChallenge[];
  continuePath: string | null;
};

export function exportLocalProfile(
  now: number = Date.now()
): LocalProfileExport {
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date(now).toISOString(),
    completedChallenges: getLocalCompletedChallenges(),
    continuePath: getContinuePath()
  };
}

export function serializeLocalProfile(profile: LocalProfileExport): string {
  return `${JSON.stringify(profile, null, 2)}\n`;
}

export function parseLocalProfile(raw: string): LocalProfileExport {
  const parsed = JSON.parse(raw) as Partial<LocalProfileExport>;
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Profil invalide');
  }
  if (parsed.version !== EXPORT_VERSION) {
    throw new Error('Version de profil non supportée');
  }
  if (!Array.isArray(parsed.completedChallenges)) {
    throw new Error('completedChallenges manquant');
  }
  const completedChallenges = parsed.completedChallenges.filter(
    (entry): entry is CompletedChallenge =>
      !!entry &&
      typeof entry === 'object' &&
      typeof (entry as { id?: unknown }).id === 'string'
  );
  const continuePath =
    typeof parsed.continuePath === 'string' ? parsed.continuePath : null;
  return {
    version: EXPORT_VERSION,
    exportedAt:
      typeof parsed.exportedAt === 'string'
        ? parsed.exportedAt
        : new Date().toISOString(),
    completedChallenges,
    continuePath
  };
}

export function importLocalProfile(raw: string): LocalProfileExport {
  const profile = parseLocalProfile(raw);
  setLocalCompletedChallenges(profile.completedChallenges);
  if (profile.continuePath) {
    setContinuePath(profile.continuePath);
  }
  return profile;
}

/** Efface progression, continue, onboarding et sessions d'examen locales. */
export function wipeLocalLearningData(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem('fcc-local-user');
    window.localStorage.removeItem('fcc-local-continue-path');
    window.localStorage.removeItem('fcc-local-onboarding-seen');
    window.localStorage.removeItem('fcc-exam-session');
    window.localStorage.removeItem('fcc-exam-history');
  } catch {
    // ignore
  }
}
