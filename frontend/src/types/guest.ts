import { MealType } from "./meal";
import { RsvpStatus } from "./rsvp-status";

type Guest = {
  id: string;
  name: string;
  phoneNumber: string;
  gender: string;
  group: string;
  status: RsvpStatus;
  meal: MealType[];
  tableId: string;
};

export type { Guest };
