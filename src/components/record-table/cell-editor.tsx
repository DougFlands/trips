import { useId, useImperativeHandle, useRef, useState } from "react";
import type { Ref } from "react";
import { Check, ExternalLink } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { displayCell, parseCell } from "../../lib/table-data";
import type { CellValue, TableColumn } from "../../lib/table-data";
import type { CellEditorHandle, EditAdvance } from "./use-table-editing";

export function CellDisplay({ value, column, label }: {
  value: CellValue | undefined; column: TableColumn; label: string;
}) {
  const text = displayCell(value, column);
  return <div className="flex min-h-9 min-w-0 items-start gap-1">
    <div aria-label={label} className="min-w-0 flex-1 whitespace-pre-wrap break-words rounded-sm py-1">
      {column.type === "checkbox" ? <span className="inline-flex items-center gap-1">{value === true && <Check className="size-4" />}{text || "未勾选"}</span>
        : Array.isArray(value) && value.length ? <span className="flex flex-wrap gap-1">{value.map(option => <Badge key={option} variant="secondary">{option}</Badge>)}</span>
        : text || <span className="text-muted-foreground">—</span>}
    </div>
    {column.type === "url" && typeof value === "string" && value && <a href={value} target="_blank" rel="noreferrer" aria-label={`打开${label}链接`} className="shrink-0 rounded-sm p-1.5 text-muted-foreground"><ExternalLink className="size-3" /></a>}
  </div>;
}

/** A single edit session. All controls live inside the same focus boundary. */
export function CellEditor({ value, column, label, initialText, editorRef, onCommit, onCancel }: {
  value: CellValue | undefined; column: TableColumn; label: string;
  initialText?: string; editorRef?: Ref<CellEditorHandle>;
  onCommit: (value: CellValue, advance: EditAdvance) => boolean; onCancel: () => void;
}) {
  const [text, setText] = useState(initialText ?? (value == null || Array.isArray(value) ? "" : String(value)));
  const [selected, setSelected] = useState<string[]>(Array.isArray(value) ? value : []);
  const [checked, setChecked] = useState(value === true);
  const [error, setError] = useState("");
  const errorId = useId();
  const closed = useRef(false);
  const container = useRef<HTMLDivElement>(null);
  const composing = useRef(false);
  const cancel = () => { if (!closed.current) { closed.current = true; onCancel(); } };
  const save = (advance: EditAdvance = null): boolean => {
    if (closed.current) return true;
    if (composing.current) return false;
    try {
      const next = column.type === "multiselect" ? selected : column.type === "checkbox" ? checked : parseCell(text, column);
      if (onCommit(next, advance)) { closed.current = true; return true; }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "内容格式有误。"); }
    container.current?.querySelector<HTMLElement>("input, textarea, select, button")?.focus();
    return false;
  };
  useImperativeHandle(editorRef, () => ({ submit: save, contains: target => container.current?.contains(target) ?? false }));
  const common = { "aria-label": label, "aria-invalid": !!error, "aria-describedby": error ? errorId : undefined };
  return <div ref={container} className="flex min-w-0 flex-col gap-2" data-cell-interactive data-record-cell-editor
    onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) save(); }}
    onKeyDownCapture={event => {
      // ReUI has a native viewport listener, before React's bubble handlers.
      if (event.nativeEvent.isComposing || event.keyCode === 229) { event.stopPropagation(); return; }
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); cancel(); }
      if (event.key === "Tab") {
        const choices = container.current?.querySelectorAll("[role=checkbox]");
        if (column.type === "multiselect" && choices?.length
          && event.target !== choices[event.shiftKey ? 0 : choices.length - 1]) return;
        event.preventDefault(); event.stopPropagation(); save(event.shiftKey ? "previous" : "next");
      }
      if (event.key === "Enter" && (column.type !== "multiline" || event.ctrlKey || event.metaKey)) {
        event.preventDefault(); event.stopPropagation(); save("stay");
      }
    }}>
    {column.type === "multiline" ? <Textarea {...common} autoFocus rows={1} className="min-h-9 resize-none overflow-hidden" value={text} maxLength={10000} onChange={event => setText(event.target.value)} />
      : column.type === "checkbox" ? <label className="flex min-h-9 items-center gap-2"><Checkbox {...common} autoFocus checked={checked} onCheckedChange={v => setChecked(v === true)} />已勾选</label>
      : column.type === "select" ? <select {...common} autoFocus className="h-9 w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm" value={text} onChange={event => setText(event.target.value)}>
        <option value="">未选择</option>{column.options?.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      : column.type === "multiselect" ? <fieldset aria-label={label} tabIndex={-1}
        ref={node => { if (!column.options?.length) node?.focus(); }} className="flex max-h-60 flex-col gap-2 overflow-auto rounded-md border p-2">
        <legend className="sr-only">{label}</legend>
        {!column.options?.length && <p className="text-xs text-muted-foreground">请先在字段设置中添加选项。</p>}
        {column.options?.map((option, index) => <label key={option} className="flex items-center gap-2 whitespace-normal text-sm"><Checkbox autoFocus={index === 0} checked={selected.includes(option)} onCheckedChange={v => setSelected(v === true ? [...selected, option] : selected.filter(item => item !== option))} />{option}</label>)}
      </fieldset>
      : <Input {...common} autoFocus type={column.type === "date" ? "date" : "text"} inputMode={column.type === "number" || column.type === "currency" ? "decimal" : column.type === "url" ? "url" : undefined}
        value={text} maxLength={10000} onChange={event => setText(event.target.value)}
        onInput={column.type === "date" ? event => setText(event.currentTarget.value) : undefined} />}
    {error && <p id={errorId} role="alert" className="whitespace-normal text-xs text-destructive">{error}</p>}
  </div>;
}
