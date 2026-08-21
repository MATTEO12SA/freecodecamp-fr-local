/**
 * Stub → human-qa-test.mjs --human --rwd-only
 * (ancien submit-test : page challenge FR + progression via vrai Check/Submit)
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));
const r = spawnSync(
  process.execPath,
  [path.join(root, 'human-qa-test.mjs'), '--human', '--rwd-only'],
  { stdio: 'inherit' }
);
process.exit(r.status ?? 1);
