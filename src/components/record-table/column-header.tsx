import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import type { Header } from "@tanstack/react-table";
import { GripVertical } from "lucide-react";
import { useId } from "react";
import { useDataGrid } from "../reui/data-grid/data-grid";
import type { DataGridFeatures } from "../reui/data-grid/data-grid";
import { DataGridTableHead, DataGridTableHeadRow, DataGridTableHeadRowCell, DataGridTableHeadRowCellResize,
  DataGridTableFillHeadCell, renderDataGridTableHeadCellContent } from "../reui/data-grid/data-grid-table";
import { Button } from "../ui/button";
import type { TableRow } from "../../lib/table-data";

function ColumnHeaderCell({ header, disabled, readOnly }: {
  header: Header<DataGridFeatures, TableRow, unknown>; disabled: boolean; readOnly: boolean;
}) {
  const fixed = header.column.id === "row-actions";
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
    id: header.column.id, disabled: fixed || disabled,
  });
  return <DataGridTableHeadRowCell header={header}>
    <div ref={setNodeRef} className="flex items-start gap-1" data-column-dragging={isDragging || undefined}
      style={{ transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.5 : 1,
        outline: isOver && !isDragging ? "2px solid var(--ring)" : undefined }}>
      {!fixed && !readOnly && <Button type="button" variant="ghost" size="icon-xs" className="mt-2 touch-none cursor-grab"
        {...attributes} {...listeners} disabled={disabled} aria-label={`拖动字段 ${header.column.columnDef.meta?.headerTitle}`}><GripVertical /></Button>}
      <div className="min-w-0 flex-1">{renderDataGridTableHeadCellContent(header)}</div>
    </div>
    {header.column.getCanResize() && <DataGridTableHeadRowCellResize header={header} />}
  </DataGridTableHeadRowCell>;
}

/** Header-only column DnD. The body keeps ReUI's independent row DnD context. */
export function ColumnHeader({ readOnly, disabled, onDraggingChange, onMove }: {
  readOnly: boolean; disabled: boolean; onDraggingChange: (value: boolean) => void;
  onMove: (from: string, to: string) => void;
}) {
  const { table } = useDataGrid<TableRow>();
  const headers = table.getHeaderGroups()[0]?.headers ?? [];
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  return <DndContext id={useId()} sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToHorizontalAxis]}
    accessibility={{ container: typeof document === "undefined" ? undefined : document.body }}
    onDragStart={() => onDraggingChange(true)} onDragCancel={() => onDraggingChange(false)}
    onDragEnd={({ active, over }) => {
      try { if (over && active.id !== over.id) onMove(String(active.id), String(over.id)); }
      finally { onDraggingChange(false); }
    }}>
    <SortableContext items={headers.filter(header => header.column.id !== "row-actions").map(header => header.column.id)} strategy={horizontalListSortingStrategy}>
      <DataGridTableHead><DataGridTableHeadRow rowId="record-columns">
        {headers.map(header => <ColumnHeaderCell key={header.id} header={header} readOnly={readOnly} disabled={disabled} />)}
        <DataGridTableFillHeadCell />
      </DataGridTableHeadRow></DataGridTableHead>
    </SortableContext>
  </DndContext>;
}
