import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { EditableTable } from "../src/components/editable-table";
import { FIELD_TYPES } from "../src/lib/table-data";
import type { FieldType, TableData } from "../src/lib/table-data";
import { Button } from "../src/components/ui/button";
import "../src/styles.css";

const initial: TableData = { schemaVersion: 2,
  columns: Object.entries(FIELD_TYPES).map(([type, name]) => ({ id: type, name, type: type as FieldType, ...(["select", "multiselect"].includes(type) ? { options: ["待预订", "已预订", "已取消"] } : {}) })),
  rows: Array.from({ length: 12 }, (_, index) => ({ id: `row-${index + 1}`, cells: {
    text: `记录 ${index + 1}`, multiline: index === 1 ? "第一行\n第二行\n第三行" : "备注", number: index,
    currency: 128.5, date: "2027-01-30", select: "待预订", multiselect: ["已预订"], checkbox: false, url: "https://example.com",
  } })),
};
function Fixture() {
  const [value, setValue] = useState(initial), [readOnly, setReadOnly] = useState(false), [busy, setBusy] = useState(false);
  return <main className="mx-auto flex max-w-6xl flex-col gap-4 p-4"><h1>多类型表格验收</h1><p>此页仅使用内存数据，不连接线上记录。</p>
    <Button className="w-fit" onClick={() => setReadOnly(!readOnly)}>切换只读</Button><p role="status">{busy ? "编辑或拖拽中" : "空闲"}</p>
    <EditableTable value={value} onChange={setValue} readOnly={readOnly} onEditingChange={setBusy} />
    <details><summary>查看数据</summary><pre aria-label="表格 JSON" className="overflow-auto">{JSON.stringify(value)}</pre></details>
  </main>;
}
const root = createRoot(document.getElementById("root")!);
root.render(<StrictMode><Fixture /></StrictMode>);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
