import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { isRecord } from "../lib/synced-document";

export type TableData = {
  schemaVersion: 1;
  columns: { id: string; name: string }[];
  rows: { id: string; cells: Record<string, string> }[];
};
const MAX_COLUMNS = 50;
const MAX_ROWS = 1000;
export function isTableData(value: unknown): value is TableData {
  if (!isRecord(value) || value.schemaVersion !== 1 || !Array.isArray(value.columns) || !Array.isArray(value.rows)
    || value.columns.length < 1 || value.columns.length > MAX_COLUMNS || value.rows.length > MAX_ROWS) return false;
  const ids = new Set<string>();
  for (const column of value.columns) {
    if (!isRecord(column) || typeof column.id !== "string" || !/^[a-zA-Z0-9-]{1,64}$/.test(column.id)
      || ids.has(column.id) || typeof column.name !== "string" || !column.name.trim() || column.name.length > 120) return false;
    ids.add(column.id);
  }
  const rows = new Set<string>();
  for (const row of value.rows) {
    if (!isRecord(row) || typeof row.id !== "string" || !/^[a-zA-Z0-9-]{1,64}$/.test(row.id)
      || rows.has(row.id) || !isRecord(row.cells)
      || !Object.entries(row.cells).every(([key, cell]) => ids.has(key) && typeof cell === "string" && cell.length <= 10000)) return false;
    rows.add(row.id);
  }
  return true;
}

function EditableCell({ value, label, readOnly, header, onCommit, onEditingChange }: {
  value: string; label: string; readOnly: boolean; header?: boolean;
  onCommit: (value: string) => void; onEditingChange?: (editing: boolean) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const open = useRef(false);
  const trigger = useRef<HTMLDivElement>(null);
  const begin = () => {
    if (readOnly) return;
    open.current = true; setDraft(value); setEditing(true); onEditingChange?.(true);
  };
  const finish = (commit: boolean, focus: boolean) => {
    if (!open.current) return;
    open.current = false;
    if (commit && !readOnly) onCommit(header ? draft.trim() || value : draft);
    setEditing(false); onEditingChange?.(false);
    if (focus) requestAnimationFrame(() => trigger.current?.focus());
  };
  useEffect(() => {
    if (readOnly && open.current) {
      open.current = false; setEditing(false); onEditingChange?.(false);
    }
  }, [readOnly, onEditingChange]);
  return editing && !readOnly ? (
    <Textarea autoFocus aria-label={label} value={draft} maxLength={header ? 120 : 10000}
      rows={1} className="min-h-9 min-w-0 resize-none overflow-hidden"
      onFocus={event => event.target.select()} onChange={event => setDraft(event.target.value)}
      onBlur={() => finish(true, false)}
      onKeyDown={event => {
        if (event.nativeEvent.isComposing || event.keyCode === 229) return;
        if ((event.key === "Enter" && (event.ctrlKey || event.metaKey)) || event.key === "Escape") {
          event.preventDefault(); finish(event.key === "Enter", true);
        }
      }} />
  ) : (
    <div ref={trigger} tabIndex={readOnly ? undefined : 0} aria-label={label}
      className="group flex min-h-9 min-w-40 items-center gap-2 rounded-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
      onDoubleClick={begin} onKeyDown={event => {
        if (event.target === event.currentTarget && event.key === "Enter") { event.preventDefault(); begin(); }
      }}>
      <span className="min-w-0 flex-1 whitespace-pre-wrap break-words">{value || <span className="text-muted-foreground">—</span>}</span>
      {!readOnly && <Button type="button" variant="ghost" size="icon-xs" aria-label={`编辑${label}`} onClick={begin}
        className="shrink-0 opacity-50 hover:opacity-100"><Pencil /></Button>}
    </div>
  );
}

export function EditableTable({ value, onChange, readOnly = false, onEditingChange }: {
  value: TableData; onChange: (value: TableData) => void; readOnly?: boolean;
  onEditingChange?: (editing: boolean) => void;
}) {
  const addColumn = () => onChange({ ...value, columns: [...value.columns, { id: crypto.randomUUID(), name: `列 ${value.columns.length + 1}` }] });
  const addRow = () => onChange({ ...value, rows: [...value.rows, { id: crypto.randomUUID(), cells: {} }] });
  const moveRow = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (readOnly || target < 0 || target >= value.rows.length) return;
    const rows = [...value.rows];
    [rows[index], rows[target]] = [rows[target], rows[index]];
    onChange({ ...value, rows });
  };
  return <div className="flex flex-col gap-3">
    <div className="rounded-lg border bg-background">
      <Table containerLabel="记录表格，可横向滚动">
        <TableHeader><TableRow>
          <TableHead scope="col" className="w-12"><span className="sr-only">行号</span>#</TableHead>
          {value.columns.map(column => <TableHead key={column.id} scope="col" className="min-w-48 border-l">
            <EditableCell value={column.name} label={`表头 ${column.name}`} header readOnly={readOnly} onEditingChange={onEditingChange}
              onCommit={name => onChange({ ...value, columns: value.columns.map(item => item.id === column.id ? { ...item, name } : item) })} />
          </TableHead>)}
        </TableRow></TableHeader>
        <TableBody>
          {value.rows.map((row, index) => <TableRow key={row.id}>
            <TableCell className="font-mono text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="min-w-4">{index + 1}</span>
                {!readOnly && <>
                  <Button type="button" variant="ghost" size="icon-xs" aria-label={`上移第 ${index + 1} 行`}
                    title="上移" disabled={index === 0} onClick={() => moveRow(index, -1)}><ArrowUp /></Button>
                  <Button type="button" variant="ghost" size="icon-xs" aria-label={`下移第 ${index + 1} 行`}
                    title="下移" disabled={index === value.rows.length - 1} onClick={() => moveRow(index, 1)}><ArrowDown /></Button>
                </>}
              </div>
            </TableCell>
            {value.columns.map(column => <TableCell key={column.id} className="max-w-96 border-l">
              <EditableCell value={Object.hasOwn(row.cells, column.id) ? row.cells[column.id] : ""} label={`第 ${index + 1} 行 ${column.name}`} readOnly={readOnly} onEditingChange={onEditingChange}
                onCommit={text => onChange({ ...value, rows: value.rows.map(item => item.id === row.id
                  ? { ...item, cells: { ...item.cells, [column.id]: text } } : item) })} />
            </TableCell>)}
          </TableRow>)}
          {value.rows.length === 0 && <TableRow><TableCell colSpan={value.columns.length + 1} className="h-32 text-center text-muted-foreground">
            {readOnly ? "还没有记录。" : "从添加第一行开始。"}
          </TableCell></TableRow>}
        </TableBody>
      </Table>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      {!readOnly && <>
        <Button variant="outline" size="sm" onClick={addRow} disabled={value.rows.length >= MAX_ROWS}><Plus data-icon="inline-start" />添加行</Button>
        <Button variant="outline" size="sm" onClick={addColumn} disabled={value.columns.length >= MAX_COLUMNS}><Plus data-icon="inline-start" />添加列</Button>
      </>}
      <span className="text-xs text-muted-foreground">{value.rows.length} / {MAX_ROWS} 行 · {value.columns.length} / {MAX_COLUMNS} 列</span>
    </div>
  </div>;
}
