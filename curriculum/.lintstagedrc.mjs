/* eslint-disable filenames-simple/naming-convention */
import path from 'node:path';

// Lint-staged is mostly disabled here for the same Windows nano-spawn reason
// documented in client/.lintstagedrc.mjs. We keep the per-challenge markdown
// linter because pnpm wraps the call in a way that survives the quoting on
// this machine. Run other lint/format commands manually when needed.

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
