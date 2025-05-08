import { Column } from "../types/column";
import { listToMap } from "./list-to-map";
import { preferenceOptions } from "./preference-options";
import { GuestRelation } from "../types/seating-preference";
import { OptionType } from "../types/option-type";

const relationColumns = (
  firstGuestOptions: OptionType[],
  secondGuestOptions: OptionType[]
): Column<GuestRelation>[] => {
  return [
    {
      key: "firstGuestId",
      label: "Guest",
      isEdit: true,
      isMulti: false,
      isNullable: false,
      values: firstGuestOptions,
      alt: listToMap(firstGuestOptions),
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
      isEdit: true,
      isMulti: false,
      isNullable: false,
      values: secondGuestOptions,
      alt: listToMap(secondGuestOptions),
    },
  ];
};

export { relationColumns };
