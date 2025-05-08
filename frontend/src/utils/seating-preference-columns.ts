import { Column } from "../types/column";
import { listToMap } from "./list-to-map";
import { preferenceOptions } from "./preference-options";
import { SeatingPreference } from "../types/seating-preference";
import { OptionType } from "../types/option-type";

const seatingPreferenceColumns = (
  firstGuestOptions: OptionType[],
  secondGuestOptions: OptionType[]
): Column<SeatingPreference>[] => {
  return [
    {
      key: "firstGuest",
      label: "Guest",
      isEdit: true,
      isMulti: false,
      isNullable: false,
      values: firstGuestOptions,
      alt: listToMap(firstGuestOptions),
    },
    {
      key: "preference",
      label: "Preference",
      isEdit: true,
      isMulti: false,
      isNullable: false,
      values: preferenceOptions,
      alt: listToMap(preferenceOptions),
    },
    {
      key: "secondGuest",
      label: "Guest",
      isEdit: true,
      isMulti: false,
      isNullable: false,
      values: secondGuestOptions,
      alt: listToMap(secondGuestOptions),
    },
  ];
};

export { seatingPreferenceColumns };
