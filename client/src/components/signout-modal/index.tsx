const signInRedirectPaths = new Set(['/settings', '/update-email']);

export const pathAfterSignout = (path: string): string => {
  const normalizedPath = path.replace(/\/$/, '');
  return signInRedirectPaths.has(normalizedPath) ? '/learn' : path;
};

const SignoutModal = (): JSX.Element | null => null;

SignoutModal.displayName = 'SignoutModal';

export default SignoutModal;
