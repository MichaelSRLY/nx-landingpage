# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js App Router project using TypeScript.
- `src/app/`: Route entries, global styles, and page-level modules (for example `src/app/page.tsx` and `src/app/mandantenportal-senger/page.tsx`).
- `src/components/`: Reusable UI building blocks in PascalCase files (for example `Navbar.tsx`, `ProjectInquiry.tsx`).
- `public/`: Static assets served directly (logos, icons, video, and imagery).
- Root config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`.

Use the `@/*` alias for imports from `src` (configured in `tsconfig.json`).

## Build, Test, and Development Commands
- `npm run dev`: Start local dev server at `http://localhost:3000`.
- `npm run build`: Create production build.
- `npm run start`: Run the production build locally.
- `npm run lint`: Run ESLint with Next.js core-web-vitals and TypeScript rules.

Typical workflow:
```bash
npm install
npm run lint
npm run dev
```

## Coding Style & Naming Conventions
- Language: TypeScript (`strict: true`), React function components.
- Indentation: 2 spaces; prefer semicolon-free style to match existing files.
- Components: PascalCase names and filenames (`AutomationShowcase.tsx`).
- Variables/functions: camelCase.
- Routes: follow App Router folder naming under `src/app`.
- Styling: keep shared/global styles in `src/app/globals.css`; use module CSS when page-specific (for example `page.module.css`).

Run `npm run lint` before opening a PR.

## Testing Guidelines
There is currently no automated test suite configured in this repository. For now:
- Treat `npm run lint` as the required quality gate.
- Manually verify key routes (`/` and `/mandantenportal-senger`) before submitting changes.
- For new logic-heavy features, add tests with a co-located pattern like `ComponentName.test.tsx` and document the runner in `package.json`.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit messages (for example `Fix favicon: Add icons to app directory for Next.js App Router`).
- Keep subject lines concise and action-oriented.
- Group related changes into a single commit when possible.
- PRs should include: purpose, scope, manual verification steps, and screenshots/GIFs for UI updates.
- Link relevant issues or task IDs when available.
