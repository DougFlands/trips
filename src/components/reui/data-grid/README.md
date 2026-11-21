# ReUI Data Grid

Free registry component from https://reui.io/r/new-york/data-grid.json (2026-11-21).
Docs and preview: https://reui.io/docs/data-grid. MIT license: [../LICENSE.md](../LICENSE.md).

Uses TanStack Table v9 `useTable` / `dataGridFeatures`. Keep registry code here; application behavior belongs in `components/record-table/`.

Local adaptations: project `cn` imports, existing Radix Checkbox indeterminate API, unused-import cleanup. Only table, row dragging, i18n and their internal selection helpers are retained. Sorting, paging and built-in editing/selection are disabled by the application. The custom editors preserve Enter for multiline input and support typed values.
