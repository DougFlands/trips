import { useId, useState } from "react";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { FIELD_TYPES, isChoice } from "../../lib/table-data";
import type { FieldType, TableColumn } from "../../lib/table-data";

/** Column configuration is reusable and has no storage or table-controller dependency. */
export function ColumnSettings({ column, onSave, onCancel }: {
  column: TableColumn; onSave: (column: TableColumn) => void; onCancel: () => void;
}) {
  const prefix = useId();
  const [name, setName] = useState(column.name);
  const [type, setType] = useState<FieldType>(column.type);
  const [options, setOptions] = useState(column.options?.join("\n") ?? "");
  const [error, setError] = useState("");
  return <form aria-label="字段设置" className="flex min-w-0 flex-col gap-4" onSubmit={event => {
    event.preventDefault();
    try { onSave({ id: column.id, name: name.trim(), type, ...(column.width === undefined ? {} : { width: column.width }), ...(isChoice(type) ? { options: options.split("\n").map(item => item.trim()).filter(Boolean) } : {}) }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "无法保存字段。"); }
  }} onKeyDown={event => { if (event.key === "Escape" && !event.nativeEvent.isComposing) { event.preventDefault(); onCancel(); } }}>
    <FieldGroup>
      <Field><FieldLabel htmlFor={`${prefix}-name`}>字段名称</FieldLabel><Textarea autoFocus rows={1} className="min-h-9 resize-none" id={`${prefix}-name`} value={name} maxLength={120} required onChange={event => setName(event.target.value)} /></Field>
      <Field><FieldLabel htmlFor={`${prefix}-type`}>字段类型</FieldLabel><select id={`${prefix}-type`} className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={type} onChange={event => setType(event.target.value as FieldType)}>
        {Object.entries(FIELD_TYPES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select></Field>
      {isChoice(type) && <Field><FieldLabel htmlFor={`${prefix}-options`}>选项（每行一个）</FieldLabel><Textarea id={`${prefix}-options`} value={options} maxLength={12100} onChange={event => setOptions(event.target.value)} /><p className="text-xs text-muted-foreground">最多 100 项。正在使用的选项不能删除。</p></Field>}
    </FieldGroup>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="flex gap-2"><Button size="sm" type="submit">保存字段</Button><Button size="sm" variant="ghost" type="button" onClick={onCancel}>取消</Button></div>
  </form>;
}
