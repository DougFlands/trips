import { useCallback, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { useTable } from "@tanstack/react-table";
import type { ColumnDef, columnResizingState } from "@tanstack/react-table";
import { Plus, Settings2 } from "lucide-react";
import { DataGrid, dataGridFeatures } from "../reui/data-grid/data-grid";
import type { DataGridFeatures } from "../reui/data-grid/data-grid";
import { DataGridCellSelection } from "../reui/data-grid/data-grid-cell-selection";
import { DataGridTableDndRowHandle, DataGridTableDndRows } from "../reui/data-grid/data-grid-table-dnd-rows";
import { Button } from "../ui/button";
import { CellDisplay, CellEditor } from "./cell-editor";
import { ColumnPopover } from "./column-popover";
import { ColumnHeader } from "./column-header";
import { useTableEditing } from "./use-table-editing";
import { configureColumn, DEFAULT_COLUMN_WIDTH, emptyCell, FIELD_TYPES, isTableData, MAX_COLUMNS,
  MAX_COLUMN_WIDTH, MIN_COLUMN_WIDTH, MAX_ROWS, reorderColumns, reorderRows, resizeColumns } from "../../lib/table-data";
import type { TableColumn, TableData, TableRow } from "../../lib/table-data";
import { MAX_DOCUMENT_BYTES } from "../../lib/synced-document";

export type RecordTableProps = {
  value: TableData; onChange: (value: TableData) => void; readOnly?: boolean;
  onEditingChange?: (editing: boolean) => void;
};

/** Controlled grid. Field controls, layout gestures and edit focus live in separate components. */
export function RecordTable({ value, onChange, readOnly = false, onEditingChange }: RecordTableProps) {
  const [configuring, setConfiguring] = useState<TableColumn | null>(null);
  const [rowDragging, setRowDragging] = useState(false), [columnDragging, setColumnDragging] = useState(false);
  const [resizing, setResizing] = useState<columnResizingState>({ columnSizingStart: [], deltaOffset: null,
    deltaPercentage: null, isResizingColumn: false, startOffset: null, startSize: null });
  const [error, setError] = useState("");
  const emit = useCallback((next: TableData) => {
    if (readOnly) return;
    if (!isTableData(next) || new TextEncoder().encode(JSON.stringify(next)).length > MAX_DOCUMENT_BYTES) {
      throw new Error("内容格式有误或超过 512 KB，请减少内容后重试。");
    }
    onChange(next); setError("");
  }, [onChange, readOnly]);
  const editing = useTableEditing(value, emit, readOnly);
  const layoutBusy = !!configuring || rowDragging || columnDragging || !!resizing.isResizingColumn;
  const busy = !readOnly && (!!editing.session || layoutBusy);
  useEffect(() => { onEditingChange?.(busy); return () => onEditingChange?.(false); }, [busy, onEditingChange]);
  useEffect(() => { if (readOnly) { setConfiguring(null); setRowDragging(false); setColumnDragging(false); } }, [readOnly]);
  const changeLayout = (change: () => TableData) => {
    try { emit(change()); } catch (reason) { setError(reason instanceof Error ? reason.message : "无法调整表格。"); }
  };

  const columns = useMemo<ColumnDef<DataGridFeatures, TableRow>[]>(() => [{
    id: "row-actions", header: () => <span aria-label="行号">#</span>, size: readOnly ? 48 : 80,
    enableResizing: false, enableCellSelection: false,
    cell: ({ row }) => <div className="flex items-center gap-1">
      <span className="min-w-4 font-mono text-xs text-muted-foreground">{row.index + 1}</span>
      {!readOnly && <DataGridTableDndRowHandle disabled={!!editing.session || !!configuring || columnDragging || !!resizing.isResizingColumn} disabledLabel="请先完成编辑" />}
    </div>,
  }, ...value.columns.map((column, index): ColumnDef<DataGridFeatures, TableRow> => ({
    id: column.id, accessorFn: row => row.cells[column.id], size: column.width ?? DEFAULT_COLUMN_WIDTH,
    minSize: MIN_COLUMN_WIDTH, maxSize: MAX_COLUMN_WIDTH,
    meta: { headerTitle: column.name, fillWidth: index === value.columns.length - 1,
      cellClassName: "align-top whitespace-normal", headerClassName: "whitespace-normal",
      cellEdit: { editable: !readOnly && !layoutBusy } },
    header: () => <div className="flex items-start justify-between gap-1 py-2">
      <div className="min-w-0"><span className="block whitespace-pre-wrap break-words">{column.name}</span><span className="text-xs font-normal text-muted-foreground">{FIELD_TYPES[column.type]}</span></div>
      {!readOnly && <ColumnPopover column={column} open={configuring?.id === column.id}
        onOpenChange={open => setConfiguring(open ? column : null)} onSave={next => emit(configureColumn(value, next))}>
        <Button type="button" variant="ghost" size="icon-xs" aria-label={`设置字段 ${column.name}`}
          disabled={busy && configuring?.id !== column.id}><Settings2 /></Button>
      </ColumnPopover>}
    </div>,
    cell: ({ row }) => {
      const label = `第 ${row.index + 1} 行 ${column.name}`;
      return !readOnly && editing.session?.row === row.id && editing.session.column === column.id
        ? <CellEditor key={`${row.id}:${column.id}`} column={column} label={label} value={row.original.cells[column.id]}
          initialText={editing.session.initialText} editorRef={editing.editorRef} onCancel={editing.cancel} onCommit={editing.commit} />
        : <CellDisplay column={column} label={label} value={row.original.cells[column.id]} />;
    },
  }))], [value, readOnly, editing.session, configuring, layoutBusy, busy, columnDragging, resizing.isResizingColumn, emit]);
  const widths = useMemo(() => Object.fromEntries(value.columns.map(column => [column.id, column.width ?? DEFAULT_COLUMN_WIDTH])), [value.columns]);
  const table = useTable({ features: dataGridFeatures, columns, data: value.rows, getRowId: row => row.id,
    manualPagination: true, enableSorting: false, columnResizeMode: "onEnd",
    enableColumnResizing: !readOnly && !editing.session && !configuring && !rowDragging && !columnDragging,
    state: { columnSizing: widths, columnResizing: resizing }, onColumnResizingChange: setResizing,
    onColumnSizingChange: updater => changeLayout(() => resizeColumns(value, typeof updater === "function" ? updater(widths) : updater)),
  });
  const adding = configuring && !value.columns.some(column => column.id === configuring.id);
  return <div className="flex min-w-0 flex-col gap-3" onKeyDownCapture={event => {
    // Windows IME starts with Process/229 before composition. Focus a real input before its first syllable.
    if (readOnly || editing.session || layoutBusy || !(event.key === "Process" || event.keyCode === 229)
      || (event.target instanceof Element && event.target.closest("input, textarea, select, button"))) return;
    const focused = table.getFocusedCell();
    if (focused && ["text", "multiline", "url"].includes(value.columns.find(column => column.id === focused.column.id)?.type ?? "")) {
      flushSync(() => editing.open({ row: focused.row.id, column: focused.column.id, initialText: "" }));
    }
  }}>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <DataGrid table={table} recordCount={value.rows.length} emptyMessage={readOnly ? "还没有记录。" : "从添加第一行开始。"}
      onCellEditRequest={request => { if (!layoutBusy) editing.open({ row: request.rowId, column: request.columnId, initialText: request.initialText }); }}
      i18n={{ labels: { dragToReorderRow: "拖动以调整行顺序", reorderingUnavailable: "请先完成编辑" } }}
      tableLayout={{ width: "fixed", cellBorder: true, rowBorder: true, headerBackground: true, rowsDraggable: !readOnly,
        columnsResizable: true, columnsResizeMode: "onEnd", cellSelection: true, cellSelectionMode: "single" }}>
      <DataGridCellSelection apiRef={editing.selectionRef} clipboard={false} />
      <div role="region" aria-label="记录表格，可横向滚动" className="min-w-0 max-w-full overflow-x-auto rounded-lg border bg-background">
        <DataGridTableDndRows dataIds={value.rows.map(row => row.id)}
          headerContent={<ColumnHeader readOnly={readOnly} disabled={readOnly || !!editing.session || !!configuring || rowDragging || !!resizing.isResizingColumn}
            onDraggingChange={setColumnDragging} onMove={(from, to) => changeLayout(() => reorderColumns(value, from, to))} />}
          onDragStart={() => { setRowDragging(true); onEditingChange?.(true); }} onDragCancel={() => setRowDragging(false)}
          handleDragEnd={({ active, over }) => {
            if (!readOnly && !editing.session && !configuring && over) changeLayout(() => reorderRows(value, String(active.id), String(over.id)));
            setRowDragging(false);
          }} />
      </div>
    </DataGrid>
    <div className="flex flex-wrap items-center gap-2">
      {!readOnly && <>
        <Button type="button" variant="outline" size="sm" disabled={busy || value.rows.length >= MAX_ROWS} onClick={() => changeLayout(() => ({
          ...value, rows: [...value.rows, { id: crypto.randomUUID(), cells: Object.fromEntries(value.columns.map(column => [column.id, emptyCell(column)])) }],
        }))}><Plus data-icon="inline-start" />添加行</Button>
        <ColumnPopover column={adding ? configuring : { id: "new-field", name: `字段 ${value.columns.length + 1}`, type: "text" }}
          open={!!adding} onOpenChange={open => setConfiguring(open ? { id: crypto.randomUUID(), name: `字段 ${value.columns.length + 1}`, type: "text" } : null)}
          onSave={column => emit(configureColumn(value, column))}>
          <Button type="button" variant="outline" size="sm" disabled={(busy && !adding) || value.columns.length >= MAX_COLUMNS}><Plus data-icon="inline-start" />添加字段</Button>
        </ColumnPopover>
      </>}
      <span className="text-xs text-muted-foreground">{value.rows.length} / {MAX_ROWS} 行 · {value.columns.length} / {MAX_COLUMNS} 列</span>
    </div>
  </div>;
}
