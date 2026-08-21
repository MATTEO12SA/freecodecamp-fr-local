/**
 * Stub → human-qa-test.mjs --hub
 * Kept so existing docs / local:check callers keep working.
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));
const r = spawnSync(
  process.execPath,
  [path.join(root, 'human-qa-test.mjs'), '--hub'],
  { stdio: 'inherit' }
);
process.exit(r.status ?? 1);
