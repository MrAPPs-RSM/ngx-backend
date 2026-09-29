import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const angularCli = require.resolve('@angular/cli/bin/ng.js');
const cliArgs = process.argv.slice(2);

function normalizeBasePath(value) {
  const basePath = value.trim();

  if (!basePath) {
    throw new Error('The --base-path option requires a non-empty path.');
  }

  if (basePath.includes('?') || basePath.includes('#') || basePath.includes('://')) {
    throw new Error(
      `Invalid --base-path "${value}": provide a path such as /admin/, not a URL, query or fragment.`
    );
  }

  return `/${basePath.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/');
}

function mapBasePath(args) {
  const mappedArgs = [];
  let basePath;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--base-path') {
      if (index + 1 >= args.length || args[index + 1].startsWith('--')) {
        throw new Error('The --base-path option requires a value.');
      }

      basePath = args[index + 1];
      index += 1;
      continue;
    }

    if (argument.startsWith('--base-path=')) {
      basePath = argument.slice('--base-path='.length);
      continue;
    }

    mappedArgs.push(argument);
  }

  if (basePath === undefined) {
    return mappedArgs;
  }

  if (args[0] !== 'build') {
    throw new Error('--base-path is supported only by the build command.');
  }

  if (mappedArgs.some((argument) => argument === '--base-href' || argument.startsWith('--base-href='))) {
    throw new Error('Use either --base-path or --base-href, not both.');
  }

  return [...mappedArgs, `--base-href=${normalizeBasePath(basePath)}`];
}

let angularArgs;

try {
  angularArgs = mapBasePath(cliArgs);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const result = spawnSync(process.execPath, [angularCli, ...angularArgs], {
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
