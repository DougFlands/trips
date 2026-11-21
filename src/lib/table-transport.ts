import { createDocumentTransport } from "./synced-document";
import type { DocumentTransport } from "./synced-document";
import { isStoredTable, isTableData, upgradeTable } from "./table-data";
import type { TableData } from "./table-data";

/** Migration happens only in memory on read; the normal revisioned save writes v2. */
export function createTableTransport(getPassword: () => string): DocumentTransport<TableData> {
  const reader = createDocumentTransport(isStoredTable, getPassword);
  const writer = createDocumentTransport(isTableData, getPassword);
  return {
    async read(id, signal) {
      const document = await reader.read(id, signal);
      return document ? { ...document, data: upgradeTable(document.data) } : null;
    },
    write: writer.write,
  };
}
