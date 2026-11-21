import test from "node:test";
import assert from "node:assert/strict";
import { isStoredTable, isTableData, upgradeTable, configureColumn, reorderRows, parseCell, isCellValue, FIELD_TYPES } from "../src/lib/table-data.ts";

const legacy = () => ({ schemaVersion: 1, columns: [{ id: "notes", name: "备注" }], rows: [
  { id: "a", cells: { notes: "第一行\n第二行" } }, { id: "b", cells: { notes: "" } }, { id: "c", cells: {} },
] });
test("legacy upgrade preserves IDs, empty/missing cells, multiline text and order without mutation", () => {
  const old = legacy(), before = structuredClone(old), next = upgradeTable(old);
  assert.ok(isStoredTable(old)); assert.ok(isTableData(next)); assert.equal(isTableData(old), false);
  assert.deepEqual(old, before); assert.deepEqual(next.rows, old.rows);
  assert.equal(next.columns[0].type, "multiline"); assert.equal(upgradeTable(next), next);
});
test("all nine types round trip JSON and reject values from other types", () => {
  const cells = { text: "文字", multiline: "一\n二", number: 0, currency: 12.345, date: "2028-02-29", select: "已订", multiselect: ["已订"], checkbox: false, url: "https://example.com" };
  const table = { schemaVersion: 2, columns: Object.keys(FIELD_TYPES).map(type => ({ id: type, name: type, type, ...(["select", "multiselect"].includes(type) ? { options: ["已订", "待订"] } : {}) })), rows: [{ id: "a", cells }] };
  assert.ok(isTableData(JSON.parse(JSON.stringify(table))));
  for (const [type, bad] of [["number", "0"], ["currency", Infinity], ["date", "2027-02-29"], ["checkbox", "false"], ["url", "javascript:alert(1)"], ["multiselect", ["已订", "已订"]], ["select", "取消"]]) {
    assert.equal(isTableData({ ...table, rows: [{ id: "a", cells: { ...cells, [type]: bad } }] }), false, type);
  }
});
test("numeric parsing distinguishes empty, zero and invalid values; dates reject overflow", () => {
  const column = { id: "n", name: "数字", type: "number" };
  assert.equal(parseCell("", column), null); assert.equal(parseCell("0", column), 0);
  assert.equal(parseCell("-2.5", column), -2.5);
  for (const invalid of ["abc", "0xff", "1e999", "Infinity"]) assert.throws(() => parseCell(invalid, column));
  assert.equal(isCellValue("2026-02-30", { ...column, type: "date" }), false);
});
test("column conversion is atomic and cannot erase text or used options", () => {
  const old = upgradeTable(legacy());
  assert.throws(() => configureColumn(old, { ...old.columns[0], type: "number" }), /第 1 行/);
  assert.equal(old.rows[0].cells.notes, "第一行\n第二行");
  assert.throws(() => configureColumn(old, { ...old.columns[0], type: "text" }), /含换行/);
  assert.equal(isCellValue("一\n二", { ...old.columns[0], type: "text" }), false);
  const choice = { ...old, columns: [{ ...old.columns[0], type: "select", options: ["已订", "待订"] }], rows: [{ id: "a", cells: { notes: "已订" } }] };
  assert.throws(() => configureColumn(choice, { ...choice.columns[0], options: ["待订"] }), /选项仍在使用/);
  assert.deepEqual(configureColumn(choice, { ...choice.columns[0], type: "multiselect" }).rows[0].cells.notes, ["已订"]);
  const identifier = { ...old, rows: [{ id: "a", cells: { notes: "001" } }] };
  assert.throws(() => configureColumn(identifier, { ...old.columns[0], type: "number" }), /原始文本/);
});
test("row moves keep all values and stable IDs, including variable height rows", () => {
  const old = upgradeTable(legacy()), moved = reorderRows(old, "a", "c");
  assert.deepEqual(moved.rows.map(row => row.id), ["b", "c", "a"]);
  assert.deepEqual(moved.rows[2], old.rows[0]); assert.deepEqual(old.rows.map(row => row.id), ["a", "b", "c"]);
  assert.equal(reorderRows(old, "missing", "a"), old); assert.equal(reorderRows(old, "a", "a"), old);
});
test("schema boundaries reject duplicate IDs, orphan values and excessive choices", () => {
  const table = upgradeTable(legacy());
  assert.equal(isTableData({ ...table, rows: [...table.rows, table.rows[0]] }), false);
  assert.equal(isTableData({ ...table, rows: [{ id: "a", cells: { other: "orphan" } }] }), false);
  assert.throws(() => configureColumn(table, { id: "choice", name: "选择", type: "select", options: Array.from({ length: 101 }, (_, i) => String(i)) }));
});
