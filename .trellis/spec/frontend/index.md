# Frontend Guidelines

## Pre-Development Checklist

- Read [Architecture](./architecture.md) before changing page structure, trip data, or the map.
- Read [Quality](./quality.md) before changing TypeScript, dependencies, or build scripts.
- Keep the site static and compatible with a browser-only deployment.

## Quality Check

- Run the configured lint, typecheck, and build commands.
- Check that the map has explicit loading, missing-config, and failure states.
- Confirm a new trip can be added without copying the page renderer.

## Guides

| Guide | Scope |
|---|---|
| [Architecture](./architecture.md) | Components, trip content, map integration, styling |
| [Quality](./quality.md) | Type safety, dependencies, checks, accessibility |
