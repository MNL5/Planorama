import { Guest } from "../types/guest";
import { Column } from "../types/column";
import { FilterOperator } from "../types/filter-operator";

const seatingGuestColumns: Column<Guest>[] = [
  {
    key: "name",
    label: "Name",
    isEdit: false,
    isMulti: false,
    isSearchable: true,
  },
  {
    key: "group",
    label: "Group",
    isEdit: true,
    isMulti: false,
    isSearchable: true,
    isFilterable: true,
    filterOperators: [FilterOperator.EQUALS, FilterOperator.NOT_EQUALS],
  },
];

export { seatingGuestColumns };
