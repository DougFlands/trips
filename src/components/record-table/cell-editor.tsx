import { useId, useRef, useState } from "react";
import { Check, ExternalLink, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { displayCell, parseCell } from "../../lib/table-data";
import type { CellValue, TableColumn } from "../../lib/table-data";

export function CellDisplay({ value, column, label, readOnly, onEdit }: {
  value: CellValue | undefined; column: TableColumn; label: string; readOnly: boolean; onEdit: () => void;
}) {
  const text = displayCell(value, column);
  return <div className="flex min-h-9 min-w-0 items-start gap-1">
    <div tabIndex={readOnly ? undefined : 0} aria-label={label}
      className="min-w-0 flex-1 whitespace-pre-wrap break-words rounded-sm py-1 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
      onDoubleClick={readOnly ? undefined : onEdit} onKeyDown={event => {
        if (!readOnly && event.target === event.currentTarget && event.key === "Enter") { event.preventDefault(); onEdit(); }
      }}>
      {column.type === "checkbox" ? <span className="inline-flex items-center gap-1">{value === true && <Check className="size-4" />}{text || "未勾选"}</span>
        : Array.isArray(value) && value.length ? <span className="flex flex-wrap gap-1">{value.map(option => <Badge key={option} variant="secondary">{option}</Badge>)}</span>
        : text || <span className="text-muted-foreground">—</span>}
    </div>
    {column.type === "url" && typeof value === "string" && value && <a href={value} target="_blank" rel="noreferrer" aria-label={`打开${label}链接`} className="shrink-0 rounded-sm p-1.5 text-muted-foreground"><ExternalLink className="size-3" /></a>}
    {!readOnly && <Button type="button" variant="ghost" size="icon-xs" aria-label={`编辑${label}`} onClick={onEdit}><Pencil /></Button>}
  </div>;
}

/** A single edit session. All controls live inside the same focus boundary. */
export function CellEditor({ value, column, label, onCommit, onCancel }: {
  value: CellValue | undefined; column: TableColumn; label: string;
  onCommit: (value: CellValue) => boolean; onCancel: () => void;
}) {
  const [text, setText] = useState(value == null || Array.isArray(value) ? "" : String(value));
  const [selected, setSelected] = useState<string[]>(Array.isArray(value) ? value : []);
  const [checked, setChecked] = useState(value === true);
  const [error, setError] = useState("");
  const errorId = useId();
  const closed = useRef(false);
  const cancel = () => { if (!closed.current) { closed.current = true; onCancel(); } };
  const save = () => {
    if (closed.current) return;
    try {
      const next = column.type === "multiselect" ? selected : column.type === "checkbox" ? checked : parseCell(text, column);
      if (onCommit(next)) closed.current = true;
    } catch (reason) { setError(reason instanceof Error ? reason.message : "内容格式有误。"); }
  };
  const common = { "aria-label": label, "aria-invalid": !!error, "aria-describedby": error ? errorId : undefined };
  return <div className="flex min-w-0 flex-col gap-2" data-cell-interactive
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) save(); }}
    onKeyDown={event => {
      if (event.nativeEvent.isComposing || event.keyCode === 229) return;
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); cancel(); }
      if (event.key === "Enter" && (column.type !== "multiline" || event.ctrlKey || event.metaKey)) {
        if (event.target instanceof HTMLButtonElement && !event.ctrlKey && !event.metaKey) return;
        event.preventDefault(); save();
      }
    }}>
    {column.type === "multiline" ? <Textarea {...common} autoFocus rows={1} className="min-h-9 resize-none overflow-hidden" value={text} maxLength={10000} onChange={event => setText(event.target.value)} />
      : column.type === "checkbox" ? <label className="flex min-h-9 items-center gap-2"><Checkbox {...common} autoFocus checked={checked} onCheckedChange={v => setChecked(v === true)} />已勾选</label>
      : column.type === "select" ? <select {...common} autoFocus className="h-9 w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm" value={text} onChange={event => setText(event.target.value)}>
        <option value="">未选择</option>{column.options?.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      : column.type === "multiselect" ? <fieldset aria-label={label} className="flex max-h-60 flex-col gap-2 overflow-auto rounded-md border p-2">
        <legend className="sr-only">{label}</legend>
        {!column.options?.length && <p className="text-xs text-muted-foreground">请先在字段设置中添加选项。</p>}
        {column.options?.map((option, index) => <label key={option} className="flex items-center gap-2 whitespace-normal text-sm"><Checkbox autoFocus={index === 0} checked={selected.includes(option)} onCheckedChange={v => setSelected(v === true ? [...selected, option] : selected.filter(item => item !== option))} />{option}</label>)}
      </fieldset>
      : <Input {...common} autoFocus type={column.type === "date" ? "date" : "text"} inputMode={column.type === "number" || column.type === "currency" ? "decimal" : column.type === "url" ? "url" : undefined}
        value={text} maxLength={10000} onChange={event => setText(event.target.value)}
        onInput={column.type === "date" ? event => setText(event.currentTarget.value) : undefined} />}
    {error && <p id={errorId} role="alert" className="whitespace-normal text-xs text-destructive">{error}</p>}
    <div className="flex gap-1">
      <Button type="button" size="xs" variant="outline" onClick={save}>保存</Button>
      <Button type="button" size="xs" variant="ghost" onClick={cancel}>取消</Button>
    </div>
  </div>;
}
