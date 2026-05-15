/* eslint-disable filenames-simple/naming-convention */
import { ESLint } from 'eslint';

const cwd = import.meta.dirname;
const eslintCli = new ESLint({ cwd });

export default {
  '*.(mjs|js|ts|tsx)': async files => {
    const ignored = await Promise.all(
      files.map(file => eslintCli.isPathIgnored(file))
    );
    const lintable = files.filter((_, i) => !ignored[i]);
    const prettierCmds = files.map(f => `prettier --write '${f}'`);
    if (lintable.length === 0) return prettierCmds;
    const eslintArgs = lintable.map(f => `'${f}'`).join(' ');
    return [`eslint --fix ${eslintArgs}`, ...prettierCmds];
  },
  '*.!(mjs|js|ts|tsx|css|md)': files =>
    files.map(f => `prettier --write --ignore-unknown '${f}'`),
  '*.css': files => [
    ...files.map(f => `stylelint --fix '${f}'`),
    ...files.map(f => `prettier --write '${f}'`)
  ]
};
