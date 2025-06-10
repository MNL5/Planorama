import { chain } from "lodash";

import { Guest } from "../types/guest";
import { Event } from "../types/event";
import { Column } from "../types/column";
import mealOptions from "./meal-options";
import rsvpOptions from "./rsvp-options";
import { listToMap } from "./list-to-map";
import { FilterOperator } from "../types/filter-operator";

const guestColumns: (event: Event, guests: Guest[]) => Column<Guest>[] = (
  event: Event,
  guests: Guest[],
) => {
  const tables =
    event.diagram?.elements
      ?.filter((element) => element.seatCount != null)
      .map((table, index) => ({
        label: `${index + 1}`,
        value: table.id,
      })) || [];

  const groups = chain(guests)
    .map((guest) => guest.group)
    .compact()
    .uniq()
    .map((group) => ({
      label: group,
      value: group,
    }))
    .value();

  return [
    {
      key: "name",
      label: "Name",
      isEdit: true,
      isMulti: false,
      isNullable: false,
      isSearchable: true,
    },
    {
      key: "group",
      label: "Group",
      isEdit: true,
      isMulti: false,
      isNullable: true,
      isFilterable: true,
      values: groups,
      alt: listToMap(groups),
      isOpenList: true,
      filterOperators: [FilterOperator.EQUALS, FilterOperator.NOT_EQUALS],
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      isEdit: true,
      isMulti: false,
      isNullable: false,
      validationFunction: (value: unknown) => {
        if (
          !/^(?:\(?\+972\)?|0)[\s-]?(?:\(?5\d\)?)[\s-]?\d{3}[\s-]?\d{4}$/.test(
            value as string,
          )
        )
          return false;
        const phoneNumber = (value as string).replace(/[-\s]/g, "");
        return phoneNumber.length === 10 || phoneNumber.length === 13;
      },
    },
    {
      key: "meal",
      label: "Meal Type",
      isEdit: true,
      values: mealOptions,
      isMulti: true,
      isNullable: true,
      alt: listToMap(mealOptions),
      isFilterable: true,
      filterOperators: [FilterOperator.EQUALS, FilterOperator.NOT_EQUALS],
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
      isFilterable: true,
      filterOperators: [FilterOperator.EQUALS, FilterOperator.NOT_EQUALS],
    },
  ];
};

export { guestColumns };
