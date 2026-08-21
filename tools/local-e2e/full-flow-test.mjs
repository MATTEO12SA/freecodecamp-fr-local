/**
 * Stub → human-qa-test.mjs --human
 * Extra flags (--js-only, --rwd-only, --python, --cheat) are forwarded.
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));
const forwarded = process.argv.slice(2);
const r = spawnSync(
  process.execPath,
  [path.join(root, 'human-qa-test.mjs'), '--human', ...forwarded],
  { stdio: 'inherit' }
);
process.exit(r.status ?? 1);
