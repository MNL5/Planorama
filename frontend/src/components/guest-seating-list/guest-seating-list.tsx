import { useMemo } from "react";
import { Stack, Title } from "@mantine/core";

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
    () => (
      <CustomTable<Guest>
        data={guests}
        columns={seatingGuestColumns}
        onDragStart={onDragStart}
      />
    ),
    [guests, onDragStart]
  );

  return (
    <Stack align={'center'} justify={'center'} style={{ width: 300, padding: 16, borderRight: "1px solid #ddd" }}>
      <Title order={2} py={"lg"} c={"primary"}>
        Guests
      </Title>
      {guestsTable}
    </Stack>
  );
};

export default GuestSeatingList;
