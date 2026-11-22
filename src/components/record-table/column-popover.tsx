import type { ReactElement } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ColumnSettings } from "./column-settings";
import type { TableColumn } from "../../lib/table-data";

export function ColumnPopover({ column, open, onOpenChange, onSave, children }: {
  column: TableColumn; open: boolean; onOpenChange: (open: boolean) => void;
  onSave: (column: TableColumn) => void; children: ReactElement;
}) {
  return <Popover open={open} onOpenChange={onOpenChange}>
    <PopoverTrigger asChild>{children}</PopoverTrigger>
    <PopoverContent side="bottom" align="end" collisionPadding={12}
      className="max-h-[var(--radix-popover-content-available-height)] w-80 max-w-[calc(100vw-24px)] overflow-y-auto"
      onEscapeKeyDown={event => { if (event.isComposing) event.preventDefault(); }}>
      <ColumnSettings key={column.id} column={column} onCancel={() => onOpenChange(false)} onSave={next => {
        onSave(next); onOpenChange(false);
      }} />
    </PopoverContent>
  </Popover>;
}
