import { Guest } from "../types/guest";
import { Column } from "../types/column";
import { MealType } from "../types/meal";
import { RsvpStatus } from "../types/rsvp-status";

const guestColumns: Column<Guest>[] = [
  {
    key: "name",
    label: "Name",
    isEdit: true,
  },
  { key: "group", label: "Group", isEdit: true },
  { key: "phoneNumber", label: "Phone Number", isEdit: true },
  {
    key: "meal",
    label: "Meal Type",
    isEdit: true,
    values: [
      MealType.KID,
      MealType.VEGAN,
      MealType.KOSHER,
      MealType.VEGETARIAN,
      MealType.GLUTEN_FREE,
    ],
  },
  { key: "table", label: "Table Number", isEdit: true },
  {
    key: "status",
    label: "RSVP",
    isEdit: true,
    values: [RsvpStatus.ACCEPTED, RsvpStatus.TENTATIVE, RsvpStatus.DECLINE],
  },
];

export { guestColumns };
