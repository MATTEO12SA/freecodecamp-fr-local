/* eslint-disable filenames-simple/naming-convention */
import path from 'node:path';

// Lint-staged is mostly disabled here because on Windows with a spaced
// parent path ("Nouveau dossier"), lint-staged 16+ uses nano-spawn without
// a shell and passes quoted file arguments literally, which ESLint v9 and
// Prettier reject. We keep the per-challenge markdown linter because it
// uses single quotes consistently and the path-with-spaces issue does not
// trigger for `pnpm challenge-linter` invocations on this machine.

const linterConfigPath = path.resolve(
  import.meta.dirname,
  './challenges/.markdownlint.yaml'
);

export default {
  './challenges/**/*.md': files =>
    files.map(
      filename =>
        `pnpm challenge-linter --config=${linterConfigPath} '${filename}'`
    ),
  '__lint-staged-noop__': () => []
};
