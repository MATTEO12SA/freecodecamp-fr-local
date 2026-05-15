/* eslint-disable filenames-simple/naming-convention */

// Lint-staged is disabled here because on Windows with a spaced parent path
// (e.g. "Nouveau dossier"), lint-staged 16+ uses nano-spawn without a shell.
// Quoted file arguments are passed literally including the surrounding
// quotes, which both ESLint v9 and Prettier reject as malformed patterns:
//
//   "No files matching the pattern "C:/Users/.../Nouveau" were found."
//
// Run lint/format manually when needed:
//   pnpm -C client lint
//   pnpm -C client format
//
// The pre-push hook in `.husky/pre-push` still runs prettier --check on
// changed files (it uses an explicit `until ... grep` loop, not nano-spawn).

// Match a pattern that will never exist so lint-staged accepts the config
// but never spawns a child process. (Empty config throws "Configuration
// should not be empty".)
export default {
  '__lint-staged-disabled-on-windows__': () => []
};
