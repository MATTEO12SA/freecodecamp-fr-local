/**
 * Stub → human-qa-test.mjs --persist
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));
const r = spawnSync(
  process.execPath,
  [path.join(root, 'human-qa-test.mjs'), '--persist'],
  { stdio: 'inherit' }
);
process.exit(r.status ?? 1);
