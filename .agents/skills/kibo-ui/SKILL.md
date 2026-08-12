---
name: kibo-ui
description: Install and adapt Kibo UI source components in this Vite React project.
---

# Kibo UI project workflow

Use Kibo UI only when a component solves a real interaction in the active feature. Kibo components are copied into the repository, so review the generated TypeScript before wiring it to trip data.

## Find and install

1. Check `components.json` and the active feature before adding a component.
2. Prefer the Kibo CLI for discovery and installation:

   ```powershell
   npx kibo-ui add <component>
   ```

3. Keep Kibo code under `src/components/kibo-ui/<component>/` unless a component is truly page-specific.
4. Never commit account tokens, MCP credentials, or license keys.

## Adapt safely

- Read every generated file and confirm imports use this project's `@/` aliases.
- Keep the component's accessible roles, keyboard behavior, and loading/empty states.
- Feed it serializable trip data; don't make it depend on the AMap instance.
- Use `cn()` for conditional classes and the existing shadcn CSS variables for shared colors.
- If a component is only useful to one destination, keep the wrapper and theme classes in that destination's feature folder.

## Verify

Run `npm run lint`, `npm run typecheck`, `npm run build`, and check the affected feature at desktop and narrow widths. Remove unused generated dependencies and files before finishing.
