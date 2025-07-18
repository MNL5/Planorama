import React from "react";
import { Box, Text } from "@mantine/core";
import gridCanvas from "../../assets/grid-canvas.png";
import { Guest } from "../../types/guest";
import GuestTable from "../guest-table/guest-table";
import Element from "../../types/Element";
import { satisfactionToColor } from "../../utils/satisfactionUtils";
import { getPastelColorForGroup } from "../../utils/colorUtils";
import "./ElementsCanvas.css";

interface ElementsCanvasProps {
  elements: Element[];
  guests: Guest[];
  satisfactionMap: Record<string, number>;
  viewMode: "regular" | "satisfaction" | "groups";
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
}

const ElementsCanvas: React.FC<ElementsCanvasProps> = ({
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
}) => {
  const tableElements = elements?.filter((el) => el.elementType === "table") || [];
  const textElements = elements?.filter((el) => el.elementType === "text") || [];

  const getTableColor = (tableId: string, assignedGuests: Guest[]): string => {
    if (viewMode === "satisfaction") {
      const avg = computeTableAverage(tableId, guests, satisfactionMap);
      return avg !== null ? satisfactionToColor(avg) : "#d0b9e0";
    }

    if (viewMode === "groups") {
      const groups = Array.from(
        new Set(assignedGuests.map((g) => g.group).filter(Boolean)),
      );
      if (groups.length > 0) return getPastelColorForGroup(groups[0]);
    }

    return "#d0b9e0";
  };

  return (
    <Box
      className="gs-table-canvas"
      style={{ backgroundImage: `url(${gridCanvas})` }}
    >
      {tableElements.map((table) => {
        const assignedGuests = guests.filter((g) => g.tableId === table.id);
        const seatedWithSatisfaction = assignedGuests.map((g) => ({
          ...g,
          satisfaction:
            typeof satisfactionMap[g.id] === "number"
              ? satisfactionMap[g.id]
              : undefined,
        }));

        const tableColor = getTableColor(table.id, assignedGuests);

        return (
          <GuestTable
            key={table.id}
            table={table}
            seatedGuestsWithSatisfaction={seatedWithSatisfaction}
            isOpen={openTableId === table.id}
            onOpen={() => onOpenTable(table.id)}
            onClose={onCloseTable}
            onDrop={onDrop}
            onRemove={onRemove}
            tableColor={tableColor}
            viewMode={viewMode}
          />
        );
      })}

      {textElements.map((textEl) => (
        <Box
          key={textEl.id}
          className={`gs-text-element ${
            textEl.type === "circle" ? "circle" : ""
          }`}
          style={{
            top: textEl.y,
            left: textEl.x,
            width: textEl.width,
            height: textEl.height,
            backgroundColor: textEl.color,
          }}
        >
          <Text size="sm">{textEl.label}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default ElementsCanvas;
