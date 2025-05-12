import { Guest } from "../types/guest";
import { Column } from "../types/column";
import { Gift } from "../types/gift";

const giftsColumns: (guests: Guest[]) => Column<Gift>[] = (guests: Guest[]) => {
  const guestsObject: { [key: string]: string } = {};
  guests?.forEach((guest) => {
    guestsObject[guest.id] = guest.name;
  });

  return [
    {
      key: "guestId",
      label: "Guest Name",
      isEdit: false,
      isMulti: false,
      isNullable: false,
      alt: guestsObject,
      footer: (gift: Gift[]) => {
        return "Total Gifts: " + gift.length;
      },
    },
    {
      key: "greeting",
      label: "Greeting",
      isEdit: false,
      isMulti: false,
      isNullable: false,
    },
    {
      key: "amount",
      label: "Gift Amount",
      isEdit: false,
      isMulti: false,
      isNullable: false,
      footer: (gifts: Gift[]) => {
        return `${gifts?.reduce((acc, gift) => acc + gift.amount, 0) || 0}`;
      },
    },
  ];
};

export { giftsColumns };
