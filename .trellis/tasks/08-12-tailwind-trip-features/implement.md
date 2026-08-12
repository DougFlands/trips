# Implementation plan

## Ordered checklist

1. [x] Record the current worktree and inspect generated-file targets; do not touch `.env.local`, Git metadata, or unrelated user changes.
2. [x] Add Tailwind v4/Vite configuration, path aliases, shadcn `components.json`, CSS-variable theme tokens, and `src/lib/utils.ts`.
3. [x] Install the audited shadcn primitives (`button`, `badge`, `card`, `alert`, `tabs`, `scroll-area`, `separator`) and review every generated file/API before use.
4. [x] Configure ReUI registry/skill and install the free ReUI `timeline` source; configure Kibo CLI/skill and install `announcement` source. Keep registry credentials out of tracked files.
5. [x] Create the Qingdao feature boundary: move the current trip renderer into `src/trips/qingdao-yantai-weihai/page.tsx`, add local compositions/styles, and keep `trip.ts` as data.
6. [x] Replace route strip with ReUI Timeline, alert with shadcn/Kibo composition, and repeated cards/tabs/actions/lists with installed primitives while preserving current state and accessibility behavior.
7. [x] Convert Qingdao layout classes from the old global stylesheet to Tailwind utilities and feature tokens. Reduce `src/styles.css` to global Tailwind base/tokens and retain only justified AMap-generated DOM styles in the Qingdao stylesheet.
8. [x] Convert index/404 structural styles to Tailwind utilities so the old page-specific CSS selectors can be deleted without leaking the Qingdao theme.
9. [x] Update `src/trips/index.ts`, imports, README, and any type signatures; search for old imports, old class selectors, and stale component/config names.
10. [x] Run quality gates: `npm run lint`, `npm run typecheck`, `npm run build`, `npm audit`, and `node --check functions/_AMapService/[[path]].js`.
11. [x] Perform browser smoke checks for `/`, Qingdao detail, unknown path, date tabs, route timeline, map missing/loading/error states, external links, and narrow viewport.
12. [x] Run the Trellis quality check, update frontend specs if the new feature boundary is a lasting convention, then archive/commit only after the user reviews the resulting diff.

## Validation commands

```powershell
npm run lint
npm run typecheck
npm run build
npm audit
node --check 'functions/_AMapService/[[path]].js'
rg -n 'TripPage|styles.css|cyber-panel|topbar|route-strip|map-popup' src
```

## Risk points

- Registry-generated components can select Base UI or Radix APIs that do not match the project; use the configured Radix/CSS-variable style and inspect imports before merging.
- Tailwind v4 scans source files, but AMap popup DOM is created imperatively; keep a small explicit feature stylesheet for those selectors and verify production output.
- Moving the page can break direct URL rendering or imports from `TravelMap`; run typecheck/build immediately after the registry update.
- Existing uncommitted changes are part of the user worktree; never use reset/checkout to resolve conflicts.

## Review gate before activation

- `prd.md` has no open product decisions.
- `design.md` and this file describe the feature boundary and selected components.
- User explicitly approves the final planning summary in a later message.
