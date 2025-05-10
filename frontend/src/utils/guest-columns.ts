import { Guest } from "../types/guest";
import { Event } from "../types/event";
import { Column } from "../types/column";
import mealOptions from "./meal-options";
import rsvpOptions from "./rsvp-options";
import { listToMap } from "./list-to-map";

const guestColumns: (event: Event) => Column<Guest>[] = (event: Event) => {
  const tables =
    event.diagram?.elements?.map((table, index) => ({
      label: `${index + 1}`,
      value: table.id,
    })) || [];

  return [
    {
      key: "name",
      label: "Name",
      isEdit: true,
      isMulti: false,
      isNullable: false,
    },
    {
      key: "group",
      label: "Group",
      isEdit: true,
      isMulti: false,
      isNullable: true,
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      isEdit: true,
      isMulti: false,
      isNullable: false,
      validationFunction: (value: unknown) =>
        /^[+\d]?(?:[\d-.\s()]*)$/.test(value as string),
    },
    {
      key: "meal",
      label: "Meal Type",
      isEdit: true,
      values: mealOptions,
      isMulti: true,
      isNullable: true,
      alt: listToMap(mealOptions),
    },
    {
      key: "tableId",
      label: "Table Number",
      isEdit: true,
      isMulti: false,
      isNullable: true,
      values: tables,
      alt: listToMap(tables),
    },
    {
      key: "status",
      label: "RSVP",
      isEdit: true,
      values: rsvpOptions,
      isMulti: false,
      isNullable: true,
      alt: listToMap(rsvpOptions),
    },
  ];
};

export { guestColumns };
