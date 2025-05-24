import { useMemo } from "react";
import { Title } from "@mantine/core";
import { Box, Stack } from "@mui/material";

import { Guest } from "../../types/guest";
import { CustomTable } from "../custom-table/custom-table";
import { seatingGuestColumns } from "../../utils/seating-guest-columns";

interface GuestListProps {
  guests: Guest[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, guestId: string) => void;
}

const GuestSeatingList: React.FC<GuestListProps> = ({
  guests,
  onDragStart,
}) => {
  const guestsTable = useMemo(
    () => <CustomTable<Guest> data={guests} columns={seatingGuestColumns} />,
    [guests]
  );
  return (
    <Box style={{ width: 240, padding: 16, borderRight: "1px solid #ddd" }}>
      <Title order={4}>Guests</Title>
      <Stack spacing="xs">
        {guestsTable}
        {guests.map((guest) => (
          <Box
            key={guest.id}
            draggable
            onDragStart={(e) => onDragStart(e, guest.id)}
          >
            {guest.name}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default GuestSeatingList;
