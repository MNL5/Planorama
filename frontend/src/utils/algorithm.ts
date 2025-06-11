import { AIGuest } from "../types/guest";
import { GuestRelation } from "../types/guest-relation";
import { Relation } from "../types/relation";
import Table from "../types/Element";

export class Algorithm {
  private guests: AIGuest[];
  private tables: Table[];
  private seatToTable: string[];
  private tableToNumOfSeats: Record<string, number>;
  private relations: Record<string, Record<Relation, string[]>>;
  private groupToAmount: Record<string, number>;
  private maxGroupSize: number;

  constructor(guests: AIGuest[], tables: Table[], relations: GuestRelation[]) {
    this.guests = guests;
    this.tables = tables;

    this.tableToNumOfSeats = {};
    this.seatToTable = [];
    for (const table of this.tables) {
      this.tableToNumOfSeats[table.id] = table.numOfSeats;
      for (let i = 0; i < table.numOfSeats; i++) {
        this.seatToTable.push(table.id);
      }
    }

    this.relations = {};
    for (const relation of relations) {
      if (!this.relations[relation.firstGuestId]) {
        this.relations[relation.firstGuestId] = {};
      }
      if (!this.relations[relation.secondGuestId]) {
        this.relations[relation.secondGuestId] = {};
      }

      if (!this.relations[relation.firstGuestId][relation.relation]) {
        this.relations[relation.firstGuestId][relation.relation] = [];
      }
      if (!this.relations[relation.secondGuestId][relation.relation]) {
        this.relations[relation.secondGuestId][relation.relation] = [];
      }

      this.relations[relation.firstGuestId][relation.relation].push(
        relation.secondGuestId,
      );
      this.relations[relation.secondGuestId][relation.relation].push(
        relation.firstGuestId,
      );
    }

    this.groupToAmount = {};
    for (const guest of guests) {
      if (!this.groupToAmount[guest.group]) {
        this.groupToAmount[guest.group] = 0;
      }
      this.groupToAmount[guest.group]++;
    }
    this.maxGroupSize = Math.max(...Object.values(this.groupToAmount));
  }

  private maxHappinessFunc(guest: AIGuest): number {
    let score = this.groupToAmount[guest.group] - 1;

    const guestRelations = this.relations[guest.id];
    if (guestRelations) {
      if (guestRelations[Relation.MUST]) {
        score += guestRelations[Relation.MUST].length * 1.5;
      }
      if (guestRelations[Relation.LIKE]) {
        score += guestRelations[Relation.LIKE].length;
      }
    }

    return score;
  }

  private happinessFunc(
    guest: AIGuest,
    table: string,
    groupToAmountPerTable: Record<string, Record<string, number>>,
    guestToTable: Record<string, string>,
  ): number {
    let score = groupToAmountPerTable[table]?.[guest.group] ?? 0;
    score -= 1;

    const guestRelations = this.relations[guest.id];
    if (!guestRelations) return score;

    const getNumOf = (type: Relation): number => {
      const related = guestRelations[type];
      return related
        ? related.reduce(
            (acc, guestId) => acc + (guestToTable[guestId] === table ? 1 : 0),
            0,
          )
        : 0;
    };

    if (guestRelations[Relation.MUST]) {
      const withMust = getNumOf(Relation.MUST);
      const totalMust = guestRelations[Relation.MUST].length;
      const withoutMust = totalMust - withMust;
      score += withMust * 1.5;
      score -= withoutMust * 5;
    }
    if (guestRelations[Relation.LIKE]) {
      score += getNumOf(Relation.LIKE);
    }
    if (guestRelations[Relation.HATE]) {
      score -= getNumOf(Relation.HATE) * 1.2;
    }
    if (guestRelations[Relation.MUST_NOT]) {
      score -= getNumOf(Relation.MUST_NOT) * 5;
    }

    return score;
  }

  private calcHelpers(
    guests: AIGuest[],
    seatToTableFn: (i: number, guest: AIGuest) => string,
  ): [
    Record<string, Record<string, number>>,
    Record<string, string>,
    Record<string, number>,
  ] {
    const groupToAmountPerTable: Record<string, Record<string, number>> = {};
    const guestToTable: Record<string, string> = {};
    const amountPerTable: Record<string, number> = {};

    guests.forEach((guest, i) => {
      if (guest.group === "_") return;

      const table = seatToTableFn(i, guest);
      guestToTable[guest.id] = table;

      if (!groupToAmountPerTable[table]) groupToAmountPerTable[table] = {};
      if (!groupToAmountPerTable[table][guest.group])
        groupToAmountPerTable[table][guest.group] = 0;
      groupToAmountPerTable[table][guest.group]++;

      if (!amountPerTable[table]) amountPerTable[table] = 0;
      amountPerTable[table]++;
    });

    return [groupToAmountPerTable, guestToTable, amountPerTable];
  }

  public setSatisfactory(guests: AIGuest[]): AIGuest[] {
    const [groupToAmountPerTable, guestToTable] = this.calcHelpers(
      guests,
      (i, guest) => guest.table!,
    );

    for (const guest of guests) {
      if (guest.group === "_" || !guest.table) continue;
      const max = this.maxHappinessFunc(guest);
      guest.satisfaction = max === 0 ? 100 :
          this.happinessFunc(
            guest,
            guest.table,
            groupToAmountPerTable,
            guestToTable,
          ) / max;
    }

    return guests;
  }
}

export default Algorithm;
