import { useEffect, useMemo, useState } from "react";
import { useTable } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Plus, Settings2 } from "lucide-react";
import { DataGrid, dataGridFeatures } from "../reui/data-grid/data-grid";
import type { DataGridFeatures } from "../reui/data-grid/data-grid";
import { DataGridTableDndRowHandle, DataGridTableDndRows } from "../reui/data-grid/data-grid-table-dnd-rows";
import { Button } from "../ui/button";
import { CellDisplay, CellEditor } from "./cell-editor";
import { ColumnSettings } from "./column-settings";
import { configureColumn, emptyCell, FIELD_TYPES, isTableData, MAX_COLUMNS, MAX_ROWS, reorderRows } from "../../lib/table-data";
import type { TableColumn, TableData, TableRow } from "../../lib/table-data";
import { MAX_DOCUMENT_BYTES } from "../../lib/synced-document";

export type RecordTableProps = {
  value: TableData; onChange: (value: TableData) => void; readOnly?: boolean;
  onEditingChange?: (editing: boolean) => void;
};

/** Controlled ReUI grid: callers own data, permissions and persistence. */
export function RecordTable({ value, onChange, readOnly = false, onEditingChange }: RecordTableProps) {
  const [editing, setEditing] = useState<{ row: string; column: string } | null>(null);
  const [configuring, setConfiguring] = useState<TableColumn | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const busy = !readOnly && (!!editing || !!configuring || dragging);
  useEffect(() => { onEditingChange?.(busy); return () => onEditingChange?.(false); }, [busy, onEditingChange]);
  useEffect(() => { if (readOnly) { setEditing(null); setConfiguring(null); setDragging(false); } }, [readOnly]);

  const columns = useMemo<ColumnDef<DataGridFeatures, TableRow>[]>(() => {
    const commit = (next: TableData) => {
      if (readOnly) return false;
      if (!isTableData(next) || new TextEncoder().encode(JSON.stringify(next)).length > MAX_DOCUMENT_BYTES) {
        setError("内容格式有误或超过 512 KB，请减少内容后重试。"); return false;
      }
      setError(""); onChange(next); return true;
    };
    return [{
      id: "row-actions", header: () => <span aria-label="行号">#</span>, size: readOnly ? 48 : 126,
      cell: ({ row }) => <div className="flex items-center gap-1">
        <span className="min-w-4 font-mono text-xs text-muted-foreground">{row.index + 1}</span>
        {!readOnly && <>
          <DataGridTableDndRowHandle disabled={!!editing || !!configuring} disabledLabel="请先完成编辑" />
          <Button type="button" variant="ghost" size="icon-xs" aria-label={`上移第 ${row.index + 1} 行`} disabled={busy || row.index === 0}
            onClick={() => commit(reorderRows(value, row.id, value.rows[row.index - 1].id))}><ArrowUp /></Button>
          <Button type="button" variant="ghost" size="icon-xs" aria-label={`下移第 ${row.index + 1} 行`} disabled={busy || row.index === value.rows.length - 1}
            onClick={() => commit(reorderRows(value, row.id, value.rows[row.index + 1].id))}><ArrowDown /></Button>
        </>}
      </div>,
    }, ...value.columns.map((column): ColumnDef<DataGridFeatures, TableRow> => ({
      id: column.id, accessorFn: row => row.cells[column.id], size: 240, minSize: 180,
      meta: { cellClassName: "align-top whitespace-normal", headerClassName: "whitespace-normal" },
      header: () => <div className="flex items-start justify-between gap-2 py-2">
        <div className="min-w-0"><span className="block whitespace-pre-wrap break-words">{column.name}</span><span className="text-xs font-normal text-muted-foreground">{FIELD_TYPES[column.type]}</span></div>
        {!readOnly && <Button type="button" variant="ghost" size="icon-xs" aria-label={`设置字段 ${column.name}`} disabled={busy} onClick={() => setConfiguring(column)}><Settings2 /></Button>}
      </div>,
      cell: ({ row }) => {
        const label = `第 ${row.index + 1} 行 ${column.name}`;
        return !readOnly && editing?.row === row.id && editing.column === column.id
          ? <CellEditor key={`${row.id}:${column.id}`} column={column} label={label} value={row.original.cells[column.id]} onCancel={() => setEditing(null)} onCommit={cell => {
            const next = { ...value, rows: value.rows.map(item => item.id === row.id ? { ...item, cells: { ...item.cells, [column.id]: cell } } : item) };
            if (!commit(next)) return false;
            setEditing(null); return true;
          }} />
          : <CellDisplay column={column} label={label} value={row.original.cells[column.id]} readOnly={readOnly || busy} onEdit={() => setEditing({ row: row.id, column: column.id })} />;
      },
    }))];
  }, [value, onChange, readOnly, editing, configuring, busy]);

  const table = useTable({ features: dataGridFeatures, columns, data: value.rows, getRowId: row => row.id,
    manualPagination: true, enableSorting: false });
  const emit = (next: TableData) => {
    if (readOnly) return;
    if (!isTableData(next) || new TextEncoder().encode(JSON.stringify(next)).length > MAX_DOCUMENT_BYTES) throw new Error("内容格式有误或超过 512 KB，请减少内容后重试。");
    onChange(next); setError("");
  };
  return <div className="flex min-w-0 flex-col gap-3">
    {configuring && !readOnly && <ColumnSettings key={configuring.id} column={configuring} onCancel={() => setConfiguring(null)} onSave={column => { emit(configureColumn(value, column)); setConfiguring(null); }} />}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <DataGrid table={table} recordCount={value.rows.length} emptyMessage={readOnly ? "还没有记录。" : "从添加第一行开始。"}
      i18n={{ labels: { dragToReorderRow: "拖动以调整行顺序", reorderingUnavailable: "请先完成编辑" } }}
      tableLayout={{ width: "fixed", cellBorder: true, rowBorder: true, headerBackground: true, rowsDraggable: !readOnly }}>
      <div role="region" aria-label="记录表格，可横向滚动" tabIndex={0} className="min-w-0 max-w-full overflow-x-auto rounded-lg border bg-background">
        <DataGridTableDndRows dataIds={value.rows.map(row => row.id)}
          onDragStart={() => { setDragging(true); onEditingChange?.(true); }}
          onDragCancel={() => setDragging(false)}
          handleDragEnd={({ active, over }) => {
            try {
              if (!readOnly && !editing && !configuring && over) emit(reorderRows(value, String(active.id), String(over.id)));
            } catch (reason) { setError(reason instanceof Error ? reason.message : "无法调整行顺序。"); }
            finally { setDragging(false); }
          }} />
      </div>
    </DataGrid>
    <div className="flex flex-wrap items-center gap-2">
      {!readOnly && <>
        <Button type="button" variant="outline" size="sm" disabled={busy || value.rows.length >= MAX_ROWS} onClick={() => {
          try { emit({ ...value, rows: [...value.rows, { id: crypto.randomUUID(), cells: Object.fromEntries(value.columns.map(column => [column.id, emptyCell(column)])) }] }); }
          catch (reason) { setError(reason instanceof Error ? reason.message : "无法添加行。"); }
        }}><Plus data-icon="inline-start" />添加行</Button>
        <Button type="button" variant="outline" size="sm" disabled={busy || value.columns.length >= MAX_COLUMNS} onClick={() => setConfiguring({ id: crypto.randomUUID(), name: `字段 ${value.columns.length + 1}`, type: "text" })}><Plus data-icon="inline-start" />添加字段</Button>
      </>}
      <span className="text-xs text-muted-foreground">{value.rows.length} / {MAX_ROWS} 行 · {value.columns.length} / {MAX_COLUMNS} 列</span>
    </div>
  </div>;
}
