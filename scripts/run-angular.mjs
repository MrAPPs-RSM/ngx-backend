import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const angularCli = require.resolve('@angular/cli/bin/ng.js');

const result = spawnSync(process.execPath, [angularCli, ...process.argv.slice(2)], {
  env: {
    ...process.env,
    NG_BUILD_CACHE_STORE: 'sqlite'
  },
  stdio: 'inherit'
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
