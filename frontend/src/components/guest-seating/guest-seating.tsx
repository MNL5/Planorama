import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { Flex, Button, Box, Text, Stack, Title } from "@mantine/core";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useEventContext } from "../../contexts/event-context";
import {
  getAllGuests,
  updateGuests,
} from "../../services/guest-service/guest-service";
import Element from "../../types/Element";
import { Guest } from "../../types/guest";
import GuestTable from "../guest-table/guest-table";
import MainLoader from "../mainLoader/MainLoader";
import { RsvpStatus } from "../../types/rsvp-status";
import { CustomTable } from "../custom-table/custom-table";
import { seatingGuestColumns } from "../../utils/seating-guest-columns";

const GuestSeating: React.FC = () => {
  const { currentEvent } = useEventContext();
  const [elements, setTables] = useState<Element[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [openTableId, setOpenTableId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const guestsToShow = useMemo(
    () =>
      guests.filter(
        (guest) => !guest.tableId && guest.status !== RsvpStatus.DECLINE,
      ),
    [guests],
  );

  const {
    data: guestsData = [],
    isLoading,
    isError,
  } = useQuery<Guest[], Error>({
    queryKey: ["fetchGuests", currentEvent?.id],
    queryFn: () => getAllGuests(currentEvent?.id as string),
    enabled: !!currentEvent?.id,
  });

  useEffect(() => {
    if (currentEvent) {
      setTables(currentEvent.diagram.elements || []);
    }
  }, [currentEvent]);

  useEffect(() => {
    setGuests(guestsData);
  }, [guestsData]);

  const handleDrop = (tableId: string, ids: string[]) => {
    const idsSet = new Set(ids);
    setGuests((prev) =>
      prev.map((g) => (idsSet.has(g.id) ? { ...g, tableId } : g)),
    );
  };

  const handleRemove = (guestId: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, tableId: undefined } : g)),
    );
  };

  const handleSave = async () => {
    if (!currentEvent) return;
    startTransition(async () => {
      try {
        const updatedGuestsTables: Record<string, { tableId?: string }> = {};

        guests.forEach((guest) => {
          updatedGuestsTables[guest.id] = {
            tableId: guest?.tableId || "",
          };
        });

        await updateGuests(currentEvent.id, updatedGuestsTables);
        toast.success("Guest seating saved");
      } catch (err) {
        console.error(err);
        toast.error("Failed to save guest seating");
      }
    });
  };

  const handleGuestDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    ids: string[],
  ) => {
    e.dataTransfer.setData("ids", JSON.stringify(ids));
  };

  if (isLoading) return <MainLoader isPending />;
  if (isError) return <Text>Error loading guests</Text>;

  return (
    <Flex
      bg={"primary.0"}
      flex={"1 1"}
      style={{ overflow: "hidden" }}
      onClick={() => setOpenTableId(null)}
    >
      <MainLoader isPending={isPending} />
      <Stack
        p={"lg"}
        align={"center"}
        bg={"linear-gradient(to right, #e9dbf1, #e6c8fa)"}
      >
        <Title order={2} py={"lg"} c={"primary"}>
          Guests
        </Title>
        <CustomTable<Guest>
          data={guestsToShow}
          columns={seatingGuestColumns}
          onDragStart={handleGuestDragStart}
          rowStyle={{ cursor: "pointer" }}
          selectable
        />
        <Button
          size={"md"}
          radius={"md"}
          variant={"light"}
          onClick={handleSave}
          mt={"auto"}
        >
          Save Seating
        </Button>
      </Stack>
      <Box flex={1} pos={"relative"} bg={"#fff"}>
        {elements
          .filter((element) => element.elementType === "table")
          .map((table) => (
            <GuestTable
              key={table.id}
              table={table}
              assignedGuests={guests.filter((g) => g.tableId === table.id)}
              isOpen={openTableId === table.id}
              onOpen={(id) => setOpenTableId(id)}
              onClose={() => setOpenTableId(null)}
              onDrop={handleDrop}
              onRemove={handleRemove}
            />
          ))}

        {elements
          .filter((elements) => elements.elementType === "text")
          .map((objective) => (
            <Box
              key={objective.id}
              style={{
                position: "absolute",
                top: objective.y,
                left: objective.x,
                width: objective.width,
                height: objective.height,
                backgroundColor: objective.color,
                border: "1px dashed #ccc",
                borderRadius: objective.type === "circle" ? "50%" : 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
                padding: 4,
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                cursor: "default",
              }}
            >
              <Text size="sm">{objective.label}</Text>
            </Box>
          ))}
      </Box>
    </Flex>
  );
};

export default GuestSeating;
