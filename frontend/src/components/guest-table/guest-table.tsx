import React from "react";
import {
  Box,
  Button,
  Popover,
  Card,
  ScrollArea,
  Text,
  Title,
  Group,
  Divider,
  Badge,
} from "@mantine/core";
import { toast } from "react-toastify";
import Element from "../../types/Element";
import { Guest } from "../../types/guest";

interface GuestTableProps {
  table: Element;
  assignedGuests: Guest[];
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
  onDrop: (tableId: string, ids: string[]) => void;
  onRemove: (guestId: string) => void;
  tableColor: string;
}

const GuestTable: React.FC<GuestTableProps> = ({
  table,
  assignedGuests,
  isOpen,
  onOpen,
  onClose,
  onDrop,
  onRemove,
  tableColor,
}) => {
  const isFull = assignedGuests.length >= Number(table.seatCount);

  return (
    <Popover
      opened={isOpen}
      onClose={onClose}
      position="right"
      withArrow
      trapFocus={false}
      styles={{
        dropdown: {
          padding: 0,
          background: "transparent",
          boxShadow: "none",
        },
        arrow: { color: "transparent" },
      }}
    >
      <Popover.Target>
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onOpen(table.id);
          }}
          onDrop={(e) => {
            e.preventDefault();
            const ids = JSON.parse(e.dataTransfer.getData("ids"));
            if (ids.length + assignedGuests.length > Number(table.seatCount))
              toast.error("Table has not enough seats");
            else onDrop(table.id, ids);
          }}
          onDragOver={(e) => e.preventDefault()}
          style={{
            border: "1px dashed #ccc",
            position: "absolute",
            top: table.y,
            left: table.x,
            width: table.width,
            height: table.height,
            backgroundColor: tableColor,
            borderRadius: table.type === "circle" ? "50%" : 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            cursor: "pointer",
            transition: "background-color 0.3s ease-in-out",
          }}
        >
          <Text size="md" color="#3c096c">
            ({assignedGuests.length}/{table.seatCount})
          </Text>
        </Box>
      </Popover.Target>

      <Popover.Dropdown>
        <Card shadow="sm" radius="md" withBorder style={{ width: 260 }}>
          <Group align="center" style={{ padding: "8px 16px" }}>
            <Title order={5}>Table Guests</Title>
            <Badge color={isFull ? "red" : "teal"} variant="light">
              {assignedGuests.length}/{table.seatCount}
            </Badge>
          </Group>
          <Divider />
          <ScrollArea style={{ height: 200, padding: "8px 16px" }}>
            {assignedGuests.length === 0 ? (
              <Text color="dimmed" mt="md">
                No guests assigned
              </Text>
            ) : (
              assignedGuests.map((g) => (
                <Group key={g.id} style={{ padding: "4px 0" }}>
                  <Box
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("ids", JSON.stringify([g.id]))
                    }
                    style={{ flex: 1, cursor: "grab" }}
                  >
                    {g.name}
                  </Box>
                  <Button
                    size={"xs"}
                    color={"red"}
                    radius={"md"}
                    variant={"outline"}
                    onClick={() => onRemove(g.id)}
                  >
                    Remove
                  </Button>
                </Group>
              ))
            )}
          </ScrollArea>
        </Card>
      </Popover.Dropdown>
    </Popover>
  );
};

export default GuestTable;
