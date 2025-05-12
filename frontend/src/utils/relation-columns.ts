import { Column } from "../types/column";
import { listToMap } from "./list-to-map";
import { preferenceOptions } from "./preference-options";
import { GuestRelation } from "../types/guest-relation";
import { Guest } from "../types/guest";

const relationColumns: (guests: Guest[]) => Column<GuestRelation>[] = (
  guests: Guest[],
) => {
  const guestsObject: { [key: string]: string } = {};
  guests?.forEach((guest) => {
    guestsObject[guest.id] = guest.name;
  });

  return [
    {
      key: "firstGuestId",
      label: "Guest",
      isEdit: false,
      isMulti: false,
      isNullable: false,
      alt: guestsObject,
    },
    {
      key: "relation",
      label: "Preference",
      isEdit: true,
      isMulti: false,
      isNullable: false,
      values: preferenceOptions,
      alt: listToMap(preferenceOptions),
    },
    {
      key: "secondGuestId",
      label: "Guest",
      isEdit: false,
      isMulti: false,
      isNullable: false,
      alt: guestsObject,
    },
  ];
};

export { relationColumns };
