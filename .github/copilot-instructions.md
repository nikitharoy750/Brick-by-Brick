# Copilot instructions for brick-by-brick

## Project overview

- This repository is a Next.js 16 app using the App Router and TypeScript.
- The UI is primarily a client-side interactive experience centered in `app/page.tsx`.
- Reusable UI pieces live in `app/components/` (`BrickPreview.tsx`, `OpeningAnimation.tsx`).
- The root layout and global metadata/font setup live in `app/layout.tsx`.
- Global styling is defined in `app/globals.css` with Tailwind v4 and CSS variables.

## Commands

Use the project scripts from the repo root:

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

There is no dedicated automated test suite or test runner configured in this repository (`package.json` has no `test` script, and no Jest/Vitest/Cypress/Playwright config files were found). For focused validation when you need a single-file check, prefer:

```bash
npx eslint app/page.tsx
npx tsc --noEmit
```

## High-level architecture

- `app/page.tsx` is the main feature file: it owns the interactive state for the brick wall, concept selection, drag-and-drop behavior, and the personality analysis algorithm.
- `app/components/` is intentionally small and contains presentation-only pieces that are composed by the page.
- `app/layout.tsx` sets the document shell (`<html>`, `<body>`) and loads the Geist font family.
- `app/globals.css` is the shared styling entry point; prefer Tailwind classes for UI work unless a CSS variable or global rule is truly required.
- This app does not appear to include a backend, API routes, or database layer; most logic is in-browser React state rather than server/serverless code.

## Repo-specific conventions

- Respect the custom Next.js guidance in `AGENTS.md` and `CLAUDE.md`: this project is not the standard Next.js you may be familiar with, and the local Next.js docs under `node_modules/next/dist/docs/` should be consulted before assuming default APIs or conventions.
- Heed deprecation notices when working with Next.js APIs; this repo has explicit guidance to avoid relying on stale patterns from older examples.
- Keep feature work localized to the `app/` tree unless there is a clear reason to add shared infrastructure elsewhere.
- Follow the existing pattern in `app/page.tsx`: interactive behavior is driven by React state with `useState`/`useEffect`, and UI composition remains component-based rather than moving logic into a new framework abstraction.
- Prefer small, direct changes over introducing new libraries or architectural patterns unless the repo already uses them.

## Working style

- Treat `app/page.tsx` as the central page logic and avoid duplicating state management in separate files unless a component genuinely owns its own behavior.
- Keep styling consistent with the current Tailwind-first approach and the existing color palette used in the interactive brick UI.
- Do not assume standard Next.js defaults without checking the local version and docs in this repo.
