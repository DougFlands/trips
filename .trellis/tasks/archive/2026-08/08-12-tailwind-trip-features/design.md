# Technical design

## Boundaries

```text
src/main.tsx                         browser entry; imports global Tailwind base
src/App.tsx                          pathname parsing, index, 404, trip dispatch
src/trips/types.ts                   serializable trip contracts
src/trips/index.ts                   trip registry + page resolver
src/trips/qingdao-yantai-weihai/
  trip.ts                            Qingdao data (keep existing contract)
  page.tsx                            Qingdao page composition and state
  styles.css                          Qingdao-only marker/popup and theme exceptions
  components/                         Qingdao-only sections/compositions
src/components/ui/                   source-owned shadcn primitives
src/components/reui/                 source-owned ReUI primitives used by Qingdao
src/components/kibo-ui/               source-owned Kibo UI components used by Qingdao
src/components/amap/                  reusable loader/map integration
src/lib/utils.ts                      cn() helper used by generated components
src/styles.css                        Tailwind import, tokens, reset, minimal global rules
```

`App` and `main` stay public entry points. The current generic `TripPage` is replaced by a registry entry that points the Qingdao data at `qingdao-yantai-weihai/page.tsx`. A future trip can register a different page component and import a different feature stylesheet without copying Qingdao markup.

## Tailwind and theme

- Use Tailwind CSS v4 with `@tailwindcss/vite` in `vite.config.ts` and `@import "tailwindcss"` in the global stylesheet.
- Keep shadcn CSS-variable tokens in `src/styles.css`; map them with `@theme inline` so generated components use utilities rather than hard-coded page selectors.
- Move the yellow/cyan/pink cyber palette into Qingdao feature variables/classes. The feature page owns layout utilities and visual composition; global CSS only provides reset, focus treatment, reduced motion, and token definitions.
- Keep a small Qingdao stylesheet for AMap-created DOM (`map-marker`, `map-popup`, user marker) and any clip-path effect that is awkward or unsafe to express in generated DOM. It must not contain selectors for generic page sections.

## Component mapping

| Existing interaction | Installed source component | Integration |
|---|---|---|
| CTA/scroll/location/map links | shadcn `Button` | `asChild` for anchors; explicit `type` for actions |
| Hero and list metrics | shadcn `Badge` | custom variant classes driven by Qingdao tokens |
| Date filter | shadcn `Tabs` | controlled value, `all` plus zero-based day values |
| Day/meal/booking cards | shadcn `Card` | local feature wrappers provide cyber borders and spacing |
| `trip.alert` | shadcn `Alert` + Kibo `Announcement` | Announcement provides composable notice shell; Alert remains fallback semantics |
| Stop/alternative side panel | shadcn `ScrollArea` | preserve keyboard focusable list items and external links |
| Section separators | shadcn `Separator` | replace repeated border-only markup |
| Route strip | ReUI `Timeline` | horizontal milestones, each node calls the existing `showDay` handler |

Do not use a component when it would hide map lifecycle behavior. AMap loading/error/missing status remains an explicit `TravelMap` state, with Tailwind classes in the map component.

## Data flow

1. `App` resolves the path to a registered trip entry.
2. The entry supplies `{ trip, Page }`; `Page` is feature-owned.
3. Qingdao page owns active day and focused place state and derives visible stops/alternatives exactly as today.
4. Shared AMap component receives typed trip slices and returns explicit loading, missing-config, ready, and error UI.
5. Feature components receive serializable `Trip` data and callbacks; no global store or route library is introduced.

## Dependency and registry policy

- Runtime dependencies added only when generated components require them (expected: `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, and the selected Radix primitives).
- `components.json` configures the official shadcn source plus ReUI namespace `https://reui.io/r/{style}/{name}.json`; no ReUI license secret is committed. Kibo components are installed with the Kibo CLI and remain source-owned.
- Skills are project-local and documented: official shadcn skill, ReUI installer skill, and a small Kibo UI skill covering `npx kibo-ui add`, source review, and validation. Credentials/MCP tokens stay outside the repository.

## Migration and rollback

- Preserve current uncommitted data/map improvements. Make the move in small patches: configure build, add components, move page, then delete obsolete selectors.
- Keep the old `src/TripPage.tsx` only until the registry points to the feature page and checks pass; remove it in the same migration once no imports remain.
- `src/styles.css` can be restored from the pre-task worktree if visual parity or map behavior regresses; data and AMap code remain independently recoverable.

## Compatibility

- Keep current URLs and pathname routing.
- Keep browser-only static deployment and Cloudflare AMap proxy behavior.
- Preserve mobile layout, keyboard focus, external link security, and AMap environment-variable names.
