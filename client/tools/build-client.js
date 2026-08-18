const { spawnSync } = require('node:child_process');

const environment = { ...process.env };
delete environment.DEBUG;
environment.GATSBY_CPU_COUNT ||= '1';
environment.NODE_OPTIONS = [
  environment.NODE_OPTIONS,
  '--max-old-space-size=7168',
  '--no-deprecation'
]
  .filter(Boolean)
  .join(' ');

const result = spawnSync(
  process.execPath,
  [require.resolve('gatsby/cli.js'), 'build', '--prefix-paths'],
  {
    cwd: process.cwd(),
    env: environment,
    stdio: 'inherit'
  }
);

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
