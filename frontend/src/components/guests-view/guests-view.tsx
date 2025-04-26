import { useState } from "react";

import { Guest } from "../../types/guest";
import { MealType } from "../../types/meal";
import { RsvpStatus } from "../../types/rsvp-status";
import { guestColumns } from "../../utils/guest-columns";
import { CustomTable } from "../custom-table/custom-table";
import { Flex } from "@mantine/core";

const GuestsView: React.FC = () => {
  const [guests] = useState<Guest[]>([
    {
      id: "1",
      name: "Matan Leibovich Dromi",
      gender: "Male",
      group: "Ha Magnivim",
      meal: [MealType.GLUTEN_FREE],
      phoneNumber: "050-2349994",
      status: RsvpStatus.ACCEPTED,
      table: 1,
    },
  ]);

  return (
    <Flex style={{ flex: "1 1", overflowY: "scroll" }}>
      <CustomTable<Guest> data={guests} columns={guestColumns} />
    </Flex>
  );
};

export { GuestsView };
