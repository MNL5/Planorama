type CreateGift = {
  guestId: string;
  amount: number;
  greeting: string;
  eventId: string;
}

type Gift = Omit<CreateGift, "eventId"> & {
  id: string;
};

export type { Gift, CreateGift };
