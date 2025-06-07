import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  getAllGuests,
  updateGuests,
  autoAssign,
} from "../services/guest-service/guest-service";
import { getAllRelations } from "../services/relation-service/relation-service";
import { Guest, AIGuest } from "../types/guest";
import { GuestRelation } from "../types/guest-relation";
import Algorithm from "../utils/algorithm";
import Element from "../types/Element";
import { toast } from "react-toastify";

export interface UseGuestDataResult {
  guests: Guest[];
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
  relations: GuestRelation[];
  elements: Element[];
  satisfactionMap: Record<string, number>;
  setSatisfactionMap: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  isLoading: boolean;
  isError: boolean;
  handleSaveSeating: () => void;
  handleAutoAssign: () => void;
}

const useGuestData = (
  currentEvent: { id: string; diagram: { elements: Element[] } } | null,
  viewMode: "regular" | "satisfaction",
): UseGuestDataResult => {
  const [elements, setElements] = useState<Element[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [relations, setRelations] = useState<GuestRelation[]>([]);
  const [satisfactionMap, setSatisfactionMap] = useState<
    Record<string, number>
  >({});

  const {
    data: guestsData = [],
    isLoading: guestsLoading,
    isError: guestsError,
  } = useQuery<Guest[], Error>({
    queryKey: ["fetchGuests", currentEvent?.id],
    queryFn: () => getAllGuests(currentEvent!.id),
    enabled: !!currentEvent?.id,
  });

  const {
    data: relationsData = [],
    isLoading: relationsLoading,
    isError: relationsError,
  } = useQuery<GuestRelation[], Error>({
    queryKey: ["fetchRelations", currentEvent?.id],
    queryFn: () => getAllRelations(currentEvent!.id),
    enabled: !!currentEvent?.id,
  });

  useEffect(() => {
    if (!currentEvent) return;
    setElements(currentEvent.diagram.elements || []);
  }, [currentEvent]);

  useEffect(() => {
    setGuests(guestsData);
  }, [guestsData]);

  useEffect(() => {
    setRelations(relationsData);
  }, [relationsData]);

  const isLoading = guestsLoading || relationsLoading;
  const isError = guestsError || relationsError;

  const handleSaveSeating = async () => {
    if (!currentEvent) return;
    const payload: Record<string, { tableId?: string }> = {};
    guests.forEach((g) => {
      payload[g.id] = { tableId: g.tableId || "" };
    });
    try {
      await updateGuests(currentEvent.id, payload);
      toast.success("Guest seating saved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save guest seating");
    }
  };

  const handleAutoAssign = async () => {
    if (!currentEvent) return;

    try {
      const response = await autoAssign(currentEvent.id);

      const assignments: Record<string, string> = {};
      response.guests.forEach((g) => {
        assignments[g.id] = g.table;
      });

      setGuests((prev) =>
        prev.map((g) => {
          const assignedTable = assignments[g.id];
          return assignedTable ? { ...g, tableId: assignedTable } : g;
        }),
      );

      const newMap: Record<string, number> = {};
      response.guests.forEach((g) => {
        if (typeof g.satisfaction === "number") {
          newMap[g.id] = g.satisfaction;
        }
      });
      setSatisfactionMap(newMap);
    } catch (err) {
      console.error(err);
      toast.error("Failed to auto assign");
    }
  };

  useEffect(() => {
    if (viewMode !== "satisfaction") {
      setSatisfactionMap({});
      return;
    }

    const aloGuests: AIGuest[] = guests.map((g) => ({
      id: g.id,
      group: g.group,
      table: g.tableId!,
      satisfaction: undefined,
    }));

    const tableElements = elements.filter((el) => el.seatCount !== null);

    const algo = new Algorithm(aloGuests, tableElements, relations);
    const updatedList = algo.setSatisfactory(aloGuests);

    const newMap: Record<string, number> = {};
    updatedList.forEach((u) => {
      if (typeof u.satisfaction === "number") {
        newMap[u.id] = u.satisfaction;
      }
    });

    setSatisfactionMap(newMap);
  }, [guests, elements, relations, viewMode]);

  return {
    guests,
    setGuests,
    relations,
    elements,
    satisfactionMap,
    setSatisfactionMap,
    isLoading,
    isError,
    handleSaveSeating,
    handleAutoAssign,
  };
};

export default useGuestData;
