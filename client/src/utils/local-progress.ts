import type { CompletedChallenge, User } from '../redux/prop-types';

const STORAGE_KEY = 'fcc-local-user';
const STORAGE_VERSION = 1;

type StoredLocalUser = {
  version: number;
  completedChallenges: CompletedChallenge[];
};

function empty(): StoredLocalUser {
  return { version: STORAGE_VERSION, completedChallenges: [] };
}

// Une entree valide doit au moins porter un id (sinon elle casserait le rendu
// de progression). Les entrees corrompues sont filtrees a la lecture.
function isValidCompleted(entry: unknown): entry is CompletedChallenge {
  return (
    !!entry &&
    typeof entry === 'object' &&
    typeof (entry as { id?: unknown }).id === 'string'
  );
}

function readStored(): StoredLocalUser {
  if (typeof window === 'undefined') return empty();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<StoredLocalUser>;
    // Les anciennes versions stockaient la forme sans champ `version`. On migre
    // a la lecture en filtrant les entrees invalides ; writeStored reecrira la
    // forme versionnee au prochain enregistrement.
    const completedChallenges = Array.isArray(parsed.completedChallenges)
      ? parsed.completedChallenges.filter(isValidCompleted)
      : [];
    return { version: STORAGE_VERSION, completedChallenges };
  } catch {
    return empty();
  }
}

function writeStored(completedChallenges: CompletedChallenge[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, completedChallenges })
    );
  } catch {
    // localStorage may be full or disabled; ignore.
  }
}

export function getLocalCompletedChallenges(): CompletedChallenge[] {
  return readStored().completedChallenges;
}

export function ensureLocalUserInitialized(): void {
  if (typeof window === 'undefined') return;
  if (window.localStorage.getItem(STORAGE_KEY)) return;
  writeStored([]);
}

export function setLocalCompletedChallenges(
  completedChallenges: CompletedChallenge[]
): void {
  writeStored(completedChallenges);
}

export function buildLocalUser(): User {
  const completedChallenges = getLocalCompletedChallenges();
  return {
    id: 'local-user',
    username: 'you',
    name: 'You',
    email: '',
    emailVerified: true,
    isDonating: false,
    completedChallenges,
    completedDailyCodingChallenges: [],
    partiallyCompletedChallenges: [],
    savedChallenges: [],
    completedSurveys: [],
    yearsTopContributor: [],
    githubProfile: '',
    linkedin: '',
    twitter: '',
    website: '',
    portfolio: [],
    about: '',
    location: '',
    picture: '',
    points: 0,
    currentChallengeId: '',
    isHonest: true,
    sendQuincyEmail: false,
    theme: 'default',
    keyboardShortcuts: false,
    sound: false,
    socrates: false,
    acceptedPrivacyTerms: true,
    msUsername: undefined,
    profileUI: {
      isLocked: false,
      showAbout: true,
      showCerts: true,
      showDonation: false,
      showHeatMap: true,
      showLocation: true,
      showName: true,
      showPoints: true,
      showPortfolio: true,
      showTimeLine: true
    },
    is2018DataVisCert: false,
    is2018FullStackCert: false,
    isApisMicroservicesCert: false,
    isBackEndCert: false,
    isCheater: false,
    isCollegeAlgebraPyCertV8: false,
    isDataAnalysisPyCertV7: false,
    isDataVisCert: false,
    isFoundationalCSharpCertV8: false,
    isFrontEndCert: false,
    isFrontEndLibsCert: false,
    isFullStackCert: false,
    isInfosecCertV7: false,
    isInfosecQaCert: false,
    isJsAlgoDataStructCert: false,
    isJsAlgoDataStructCertV8: false,
    isMachineLearningPyCertV7: false,
    isQaCertV7: false,
    isRelationalDatabaseCertV8: false,
    isRespWebDesignCert: false,
    isSciCompPyCertV7: false,
    isUpcomingPythonCertV8: false
  } as unknown as User;
}
