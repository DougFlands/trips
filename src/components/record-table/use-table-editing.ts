import { useEffect, useRef, useState } from "react";
import type { DataGridCellSelectionApi } from "../reui/data-grid/data-grid-cell-selection";
import type { CellValue, TableData } from "../../lib/table-data";

export type EditAdvance = "next" | "previous" | "stay" | null;
export type CellEditorHandle = { submit: (advance: EditAdvance) => boolean; contains: (target: Node) => boolean };
export type CellSession = { row: string; column: string; initialText?: string };

/** Owns edit handoff and focus, independently of field controls and cloud transport. */
export function useTableEditing(value: TableData, emit: (next: TableData) => void, readOnly: boolean) {
  const [session, setSession] = useState<CellSession | null>(null);
  const sessionRef = useRef(session);
  const editorRef = useRef<CellEditorHandle | null>(null);
  const selectionRef = useRef<DataGridCellSelectionApi | null>(null);
  const changeSession = (next: CellSession | null) => { sessionRef.current = next; setSession(next); };

  useEffect(() => { if (readOnly) { sessionRef.current = null; setSession(null); } }, [readOnly]);
  useEffect(() => {
    if (!session) return;
    // Submit before ReUI changes selection. Invalid drafts keep focus and cannot be lost by another click.
    const leave = (event: PointerEvent) => {
      if (event.target instanceof Node && editorRef.current?.contains(event.target)) return;
      if (editorRef.current?.submit(null) === false) { event.preventDefault(); event.stopImmediatePropagation(); }
    };
    document.addEventListener("pointerdown", leave, true);
    return () => document.removeEventListener("pointerdown", leave, true);
  }, [session]);

  const focusAfter = (current: CellSession, advance: Exclude<EditAdvance, null>) => {
    const col = value.columns.findIndex(column => column.id === current.column);
    const row = value.rows.findIndex(item => item.id === current.row);
    if (col < 0 || row < 0) return;
    const position = row * value.columns.length + col;
    const next = Math.max(0, Math.min(value.rows.length * value.columns.length - 1,
      position + (advance === "next" ? 1 : advance === "previous" ? -1 : 0)));
    requestAnimationFrame(() => selectionRef.current?.focusCell(
      value.rows[Math.floor(next / value.columns.length)].id, value.columns[next % value.columns.length].id));
  };
  return {
    session, editorRef, selectionRef,
    open(next: CellSession) {
      if (readOnly) return;
      if (sessionRef.current && !editorRef.current?.submit(null)) return;
      changeSession(next);
    },
    commit(cell: CellValue, advance: EditAdvance) {
      const current = sessionRef.current;
      if (!current || readOnly) return false;
      emit({ ...value, rows: value.rows.map(row => row.id === current.row
        ? { ...row, cells: { ...row.cells, [current.column]: cell } } : row) });
      changeSession(null);
      if (advance) focusAfter(current, advance);
      return true;
    },
    cancel() {
      const current = sessionRef.current;
      changeSession(null);
      if (current) focusAfter(current, "stay");
    },
  };
}
