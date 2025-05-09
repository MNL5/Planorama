import { Relation } from "./relation";

type GuestRelation = {
  id: string;
  firstGuestId: string;
  relation: Relation;
  secondGuestId: string;
};

export type { GuestRelation };
