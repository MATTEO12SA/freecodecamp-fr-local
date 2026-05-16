/* eslint-disable filenames-simple/naming-convention */

// Lint-staged 16+ uses nano-spawn without a shell. On Windows with a spaced
// parent path ("Nouveau dossier"), quoted file arguments are passed literally
// including the surrounding quotes, which both ESLint v9 and Prettier reject:
//   No files matching the pattern "C:/Users/.../Nouveau" were found.
// This config is a no-op so commits aren't blocked. Run lint/format manually:
//   pnpm -C client lint
//   pnpm -C client format

export default {
  '__lint-staged-noop__': () => []
};
