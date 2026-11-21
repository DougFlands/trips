/** JSON-only table model, independent of React, editors and persistence. */
export const FIELD_TYPES = {
  text: "文本", multiline: "多行文本", number: "数字", currency: "金额",
  date: "日期", select: "单选", multiselect: "多选", checkbox: "勾选", url: "网址",
} as const;
export type FieldType = keyof typeof FIELD_TYPES;
export type CellValue = string | number | boolean | string[] | null;
export type TableColumn = { id: string; name: string; type: FieldType; options?: string[] };
export type TableRow = { id: string; cells: Record<string, CellValue> };
export type TableData = { schemaVersion: 2; columns: TableColumn[]; rows: TableRow[] };
export type LegacyTableData = {
  schemaVersion: 1; columns: { id: string; name: string }[];
  rows: { id: string; cells: Record<string, string> }[];
};
export const MAX_COLUMNS = 50;
export const MAX_ROWS = 1000;
const record = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const id = (v: unknown): v is string => typeof v === "string" && /^[a-zA-Z0-9-]{1,64}$/.test(v);
export const isChoice = (type: FieldType) => type === "select" || type === "multiselect";
export function isDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}
export function isWebUrl(value: string) {
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
}
export function isColumn(value: unknown): value is TableColumn {
  if (!record(value) || !id(value.id) || typeof value.name !== "string" || !value.name.trim()
    || value.name.length > 120 || typeof value.type !== "string" || !Object.hasOwn(FIELD_TYPES, value.type)) return false;
  if (!isChoice(value.type as FieldType)) return value.options === undefined;
  return Array.isArray(value.options) && value.options.length <= 100
    && value.options.every(option => typeof option === "string" && option.trim() === option && option.length > 0 && option.length <= 120)
    && new Set(value.options).size === value.options.length;
}
export function isCellValue(value: unknown, column: TableColumn): boolean {
  if (value === null) return true;
  switch (column.type) {
    case "number": case "currency": return typeof value === "number" && Number.isFinite(value);
    case "checkbox": return typeof value === "boolean";
    case "multiselect": return Array.isArray(value) && value.length <= 100 && new Set(value).size === value.length
      && value.every(option => typeof option === "string" && column.options?.includes(option));
    default:
      if (typeof value !== "string" || value.length > 10000) return false;
      if (value === "") return true;
      if (column.type === "text") return !/[\r\n]/.test(value);
      if (column.type === "date") return isDate(value);
      if (column.type === "url") return isWebUrl(value);
      if (column.type === "select") return column.options?.includes(value) ?? false;
      return true;
  }
}
function validateTable(value: unknown, legacy: boolean): boolean {
  if (!record(value) || value.schemaVersion !== (legacy ? 1 : 2) || !Array.isArray(value.columns)
    || !Array.isArray(value.rows) || value.columns.length < 1 || value.columns.length > MAX_COLUMNS || value.rows.length > MAX_ROWS) return false;
  const columns = new Map<string, TableColumn>();
  for (const raw of value.columns) {
    const column = legacy && record(raw) ? { ...raw, type: "multiline" } : raw;
    if (!isColumn(column) || columns.has(column.id)) return false;
    columns.set(column.id, column);
  }
  const rows = new Set<string>();
  for (const row of value.rows) {
    if (!record(row) || !id(row.id) || rows.has(row.id) || !record(row.cells)) return false;
    for (const [key, cell] of Object.entries(row.cells)) {
      const column = columns.get(key);
      if (!column || (legacy && typeof cell !== "string") || !isCellValue(cell, column)) return false;
    }
    rows.add(row.id);
  }
  return true;
}
export const isTableData = (value: unknown): value is TableData => validateTable(value, false);
export const isStoredTable = (value: unknown): value is TableData | LegacyTableData => validateTable(value, false) || validateTable(value, true);
export function upgradeTable(value: TableData | LegacyTableData): TableData {
  return value.schemaVersion === 2 ? value : {
    schemaVersion: 2, columns: value.columns.map(column => ({ ...column, type: "multiline" })), rows: value.rows,
  };
}
export function emptyCell(column: TableColumn): CellValue {
  if (column.type === "checkbox") return false;
  if (column.type === "multiselect") return [];
  return null;
}
export function displayCell(value: CellValue | undefined, column: TableColumn): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join("、");
  if (typeof value === "boolean") return value ? "已勾选" : "未勾选";
  if (column.type === "currency" && typeof value === "number") return value.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return String(value);
}
/** User input parser. Empty numeric inputs stay empty; invalid values never become zero. */
export function parseCell(text: string, column: TableColumn): CellValue {
  if (column.type === "number" || column.type === "currency") {
    if (!text.trim()) return null;
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(text.trim()) || !Number.isFinite(Number(text))) throw new Error("请输入有效数字。");
    return Number(text);
  }
  const value = column.type === "date" && !text ? null : text;
  if (!isCellValue(value, column)) throw new Error(column.type === "url" ? "网址须以 http:// 或 https:// 开头。" : "内容不符合字段格式。");
  return value;
}
function convertCell(value: CellValue | undefined, column: TableColumn): CellValue {
  if (value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length)) return null;
  if (isCellValue(value, column)) return value;
  if (column.type === "text" || column.type === "multiline") {
    if (column.type === "text" && typeof value === "string" && /[\r\n]/.test(value)) throw new Error("内容含换行，请保留多行文本类型");
    if (Array.isArray(value)) {
      if (value.length > 1) throw new Error("多个选项无法无损转换为文本");
      return value[0];
    }
    return String(value);
  }
  if (column.type === "multiselect" && typeof value === "string" && column.options?.includes(value)) return [value];
  if (column.type === "select" && Array.isArray(value) && value.length === 1 && column.options?.includes(value[0])) return value[0];
  if (column.type === "checkbox" && (value === "true" || value === "false")) return value === "true";
  if (typeof value === "string" && !isChoice(column.type) && column.type !== "checkbox") {
    const parsed = parseCell(value, column);
    // Keep identifiers like 001, surrounding whitespace and numeric precision intact.
    if (typeof parsed === "number" && String(parsed) !== value) throw new Error("数字转换会改变原始文本，请先修正该单元格");
    return parsed;
  }
  throw new Error("原内容不符合新字段类型或选项");
}
export function configureColumn(table: TableData, column: TableColumn): TableData {
  if (!isColumn(column)) throw new Error("请检查字段名称和选项（最多 100 项，每项不超过 120 字且不能重复）。");
  const old = table.columns.find(item => item.id === column.id);
  if (!old) {
    if (table.columns.length >= MAX_COLUMNS) throw new Error("最多添加 50 列。");
    return { ...table, columns: [...table.columns, column] };
  }
  const rows = table.rows.map((row, index) => {
    if (!Object.hasOwn(row.cells, column.id)) return row;
    try {
      const value = row.cells[column.id];
      // Same-type edits may only change config when all existing values remain valid.
      if (old.type === column.type) {
        if (!isCellValue(value, column)) throw new Error("该选项仍在使用");
        return row;
      }
      const converted = convertCell(value, column);
      if (!isCellValue(converted, column)) throw new Error("转换后的内容不符合字段格式");
      return { ...row, cells: { ...row.cells, [column.id]: converted } };
    } catch (error) { throw new Error(`第 ${index + 1} 行：${error instanceof Error ? error.message : "无法转换"}。原数据未修改。`); }
  });
  return { ...table, columns: table.columns.map(item => item.id === column.id ? column : item), rows };
}
export function reorderRows(table: TableData, activeId: string, overId: string): TableData {
  const from = table.rows.findIndex(row => row.id === activeId), to = table.rows.findIndex(row => row.id === overId);
  if (from < 0 || to < 0 || from === to) return table;
  const rows = [...table.rows];
  rows.splice(to, 0, rows.splice(from, 1)[0]);
  return { ...table, rows };
}
