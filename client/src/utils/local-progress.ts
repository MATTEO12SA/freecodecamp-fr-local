import type { CompletedChallenge, User } from '../redux/prop-types';

const STORAGE_KEY = 'fcc-local-user';

type StoredLocalUser = {
  completedChallenges: CompletedChallenge[];
};

function readStored(): StoredLocalUser {
  if (typeof window === 'undefined') return { completedChallenges: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedChallenges: [] };
    const parsed = JSON.parse(raw) as Partial<StoredLocalUser>;
    return {
      completedChallenges: Array.isArray(parsed.completedChallenges)
        ? parsed.completedChallenges
        : []
    };
  } catch {
    return { completedChallenges: [] };
  }
}

function writeStored(data: StoredLocalUser): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
  writeStored({ completedChallenges: [] });
}

export function setLocalCompletedChallenges(
  completedChallenges: CompletedChallenge[]
): void {
  writeStored({ completedChallenges });
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
