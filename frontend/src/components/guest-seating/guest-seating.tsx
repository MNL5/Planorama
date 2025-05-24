import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, Text, Stack } from "@mantine/core";
import React, { useEffect, useState, useTransition } from "react";
import { useEventContext } from "../../contexts/event-context";
import {
  getAllGuests,
  updateGuests,
} from "../../services/guest-service/guest-service";
import ElementType from "../../types/Element";
import { Guest } from "../../types/guest";
import GuestSeatingList from "../guest-seating-list/guest-seating-list";
import GuestTable from "../guest-table/guest-table";
import MainLoader from "../mainLoader/MainLoader";
import { RsvpStatus } from "../../types/rsvp-status";

const GuestSeating: React.FC = () => {
  const { currentEvent } = useEventContext();
  const [tables, setTables] = useState<ElementType[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [openTableId, setOpenTableId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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

  const handleDrop = (tableId: string, guestId: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, tableId } : g))
    );
  };

  const handleRemove = (guestId: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, tableId: undefined } : g))
    );
  };

  const handleSave = async () => {
    if (!currentEvent) return;
    startTransition(async () => {
      try {
        const updatedGuestsTables: Record<string, { tableId?: string }> = {};

        guests.forEach((guest) => {
          updatedGuestsTables[guest.id] = { tableId: guest?.tableId || "" };
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
    id: string
  ) => {
    e.dataTransfer.setData("guestId", id);
  };

  if (isLoading) return <MainLoader isPending />;
  if (isError) return <Text>Error loading guests</Text>;

  return (
    <Box
      style={{ display: "flex", flex: "1 1" }}
      onClick={() => setOpenTableId(null)}
    >
      <MainLoader isPending={isPending} />
      <Stack p={"lg"} align={"center"} justify={"space-between"}>
        <GuestSeatingList
          guests={guests.filter(
            (guest) => !guest.tableId && guest.status === RsvpStatus.ACCEPTED
          )}
          onDragStart={handleGuestDragStart}
        />
        <Button
          w={200}
          fz={"16px"}
          radius={"md"}
          color={"green"}
          onClick={handleSave}
        >
          Save Seating
        </Button>
      </Stack>
      <Box style={{ flex: 1, position: "relative", background: "#fff" }}>
        {tables.map((table) => (
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
      </Box>
    </Box>
  );
};

export default GuestSeating;
