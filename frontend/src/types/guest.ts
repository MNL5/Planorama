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
  tableId?: string;
};

type AIGuest = {
  id: string;
  group: string;
  table: string;
  satisfaction: number | undefined;
};

export type { Guest, AIGuest };
