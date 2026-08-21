import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { once } from 'node:events';

const server = createServer((request, response) => {
  request.socket.destroy();
  response.destroy();
});

server.listen(0, '127.0.0.1');
await once(server, 'listening');

const address = server.address();
if (!address || typeof address === 'string') {
  server.close();
  throw new Error("Impossible d'obtenir le port du serveur inaccessible");
}

const child = spawn(
  process.execPath,
  [
    'axe-test.mjs',
    '--strict',
    `--url=http://127.0.0.1:${address.port}/inaccessible`,
    '--timeout=5000'
  ],
  {
    cwd: new URL('.', import.meta.url),
    env: { ...process.env, FORCE_COLOR: '0' },
    stdio: ['ignore', 'pipe', 'pipe']
  }
);

let output = '';
child.stdout.on('data', chunk => {
  output += String(chunk);
});
child.stderr.on('data', chunk => {
  output += String(chunk);
});

const [exitCode] = await once(child, 'exit');
server.close();

const hasFailureSummary =
  /requested=1 loaded=0 scanned=0 skipped=0 failed=1/.test(output);

if (exitCode === 0 || !hasFailureSummary) {
  console.error(output.trim());
  console.error(
    'FAIL axe regression: une page inaccessible doit produire failed=1 et un code non nul.'
  );
  process.exit(1);
}

console.log(
  'PASS axe regression: la page inaccessible produit failed=1, scanned=0 et un code non nul.'
);
