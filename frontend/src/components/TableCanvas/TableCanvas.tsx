import React from "react";
import { Box, Text } from "@mantine/core";
import gridCanvas from "../../assets/grid-canvas.png";
import { Guest } from "../../types/guest";
import GuestTable from "../guest-table/guest-table";
import Element from "../../types/Element";

interface TableCanvasProps {
  elements: Element[];
  guests: Guest[];
  satisfactionMap: Record<string, number>;
  viewMode: "regular" | "satisfaction";
  openTableId: string | null;
  onOpenTable: (id: string) => void;
  onCloseTable: () => void;
  onDrop: (tableId: string, ids: string[]) => void;
  onRemove: (guestId: string) => void;
  computeTableAverage: (
    tableId: string,
    guests: Guest[],
    satisfactionMap: Record<string, number>,
  ) => number | null;
  satisfactionToColor: (s: number) => string;
}

const TableCanvas: React.FC<TableCanvasProps> = ({
  elements,
  guests,
  satisfactionMap,
  viewMode,
  openTableId,
  onOpenTable,
  onCloseTable,
  onDrop,
  onRemove,
  computeTableAverage,
  satisfactionToColor,
}) => {
  const tableElements = elements.filter((el) => el.elementType === "table");
  const textElements = elements.filter((el) => el.elementType === "text");

  return (
    <Box
      className="gs-table-canvas"
      style={{ backgroundImage: `url(${gridCanvas})` }}
    >
      {tableElements.map((table) => {
        const assignedGuests = guests.filter((g) => g.tableId === table.id);
        const avg = computeTableAverage(table.id, guests, satisfactionMap);

        const tableColor =
          viewMode === "satisfaction" && avg !== null
            ? satisfactionToColor(avg)
            : "#d0b9e0";

        const seatedWithSatisfaction = assignedGuests.map((g) => ({
          ...g,
          satisfaction:
            typeof satisfactionMap[g.id] === "number"
              ? satisfactionMap[g.id]
              : undefined,
        }));

        return (
          <GuestTable
            key={table.id}
            table={table}
            assignedGuests={seatedWithSatisfaction}
            isOpen={openTableId === table.id}
            onOpen={() => onOpenTable(table.id)}
            onClose={onCloseTable}
            onDrop={onDrop}
            onRemove={onRemove}
            tableColor={tableColor}
          />
        );
      })}

      {textElements.map((textEl) => (
        <Box
          key={textEl.id}
          className="gs-text-element"
          style={{
            top: textEl.y,
            left: textEl.x,
            width: textEl.width,
            height: textEl.height,
            backgroundColor: textEl.color,
            borderRadius: textEl.type === "circle" ? "50%" : "4px",
          }}
        >
          <Text size="sm">{textEl.label}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default TableCanvas;
