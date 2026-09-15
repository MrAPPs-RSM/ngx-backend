# NgxBackend

Admin/backend panel built with [Angular](https://angular.dev) (v22) — a generic, config-driven CMS-style panel (dynamic tables, forms, resolvers-based routing) reused across multiple client deployments via per-client environment files.

## Requirements

- Node.js compatible with Angular CLI 22 (Node 18.19+ / 20.11+ / 22+)
- Angular CLI: `npm install -g @angular/cli` (or use the local `npx ng`)

## Getting started

```bash
npm install
npm start
```

Navigate to `http://localhost:4200/`. The app reloads automatically on source changes.

## Environment

This project is deployed with its own environment file under [src/environments](src/environments):

- `environment.ts` / `environment.prod.ts` — default

Each defines API base URL, auth/refresh-token config, and other client-specific settings (`src/environments/environment.ts` is the reference shape). To build for a specific client, replace `environment.ts` (and/or `environment.prod.ts`) with the matching client file before running the build, or add a dedicated `fileReplacements` build configuration in `angular.json` for it (only `production` is currently defined, mapping `environment.ts` → `environment.prod.ts`).

## Build

```bash
npm run build
```

Runs `ng build --configuration production`; artifacts are output to `dist/`.

## Type checking

```bash
npm run typecheck
```

Runs `tsc --noEmit` against `src/tsconfig.app.json`.

## Running unit tests

```bash
npm test
```

Runs `ng test --watch=false --browsers=ChromeHeadless` via [Karma](https://karma-runner.github.io)/Jasmine.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Project structure

Key areas under `src/app`:

- `api/` — `ApiService`, the single wrapper around `HttpClient` used by the whole app (`get`/`post`/`put`/`patch`/`delete`, token handling, refresh token, `setup()` call).
- `auth/` — login, password reset/change, `UserService` (token storage), auth guards.
- `interceptors/` — `RefreshTokenInterceptor`: handles 401/403 by attempting a token refresh and retrying the request, or redirecting to `/login` when no valid refresh token is available or the refresh itself fails.
- `panel/` — the authenticated area: dynamic `resolvers/` (e.g. `PanelResolver`, which calls `SetupService.setup()` on route activation/reload), and `components/` (notably `table/` — the generic, config-driven data table with row actions, and `form/` — the generic dynamic form).
- `interfaces/`, `services/`, `pipes/`, `strategies/` — shared types and utilities.

## Documentation

Check the [ngx-backend wiki](https://github.com/MrAPPs-RSM/ngx-backend/wiki) for panel/table/form configuration reference (action types, field types, resolvers, etc.).

## Further help

For general Angular CLI usage, run `ng help` or see the [Angular CLI reference](https://angular.dev/tools/cli).
