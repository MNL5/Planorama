// src/hooks/useGuestData.ts

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import {
    getAllGuests,
    updateGuests,
    autoAssign,
} from '../services/guest-service/guest-service';
import { getAllRelations } from '../services/relation-service/relation-service';
import { Guest, AIGuest } from '../types/guest';
import { GuestRelation } from '../types/guest-relation';
import Algorithm from '../utils/algorithem';
import Element from '../types/Element';

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

export function useGuestData(
    currentEvent: { id: string; diagram: { elements: Element[] } } | null,
    viewMode: 'regular' | 'satisfaction'
): UseGuestDataResult {
    // ─── Local state ───────────────────────────────────────────────────────
    const [elements, setElements] = useState<Element[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [relations, setRelations] = useState<GuestRelation[]>([]);
    const [satisfactionMap, setSatisfactionMap] = useState<
        Record<string, number>
    >({});

    // ─── Fetch GUESTS ───────────────────────────────────────────────────────
    const {
        data: guestsData = [],
        isLoading: guestsLoading,
        isError: guestsError,
    } = useQuery<Guest[], Error>({
        queryKey: ['fetchGuests', currentEvent?.id],
        queryFn: () => getAllGuests(currentEvent!.id),
        enabled: !!currentEvent?.id,
    });

    // ─── Fetch RELATIONS ────────────────────────────────────────────────────
    const {
        data: relationsData = [],
        isLoading: relationsLoading,
        isError: relationsError,
    } = useQuery<GuestRelation[], Error>({
        queryKey: ['fetchRelations', currentEvent?.id],
        queryFn: () => getAllRelations(currentEvent!.id),
        enabled: !!currentEvent?.id,
    });

    // ─── Sync “elements” when event changes ─────────────────────────────────
    useEffect(() => {
        if (!currentEvent) return;
        setElements(currentEvent.diagram.elements || []);
    }, [currentEvent]);

    // ─── Sync “guests” state when guestsData changes ────────────────────────
    useEffect(() => {
        setGuests(guestsData);
    }, [guestsData]);

    // ─── Sync “relations” state when relationsData changes ─────────────────
    useEffect(() => {
        setRelations(relationsData);
    }, [relationsData]);

    const isLoading = guestsLoading || relationsLoading;
    const isError = guestsError || relationsError;

    // ─── Save seating assignments back to server ────────────────────────────
    const handleSaveSeating = async () => {
        if (!currentEvent) return;
        const payload: Record<string, { tableId?: string }> = {};
        guests.forEach((g) => {
            payload[g.id] = { tableId: g.tableId || '' };
        });
        try {
            await updateGuests(currentEvent.id, payload);
            // Optionally: toast.success('Guest seating saved')
        } catch (err) {
            console.error(err);
            // Optionally: toast.error('Failed to save guest seating')
        }
    };

    // ─── Auto‐assign from server & merge results ────────────────────────────
    const handleAutoAssign = async () => {
        if (!currentEvent) return;

        // The calling component should check seat availability first.
        try {
            const response = await autoAssign(currentEvent.id);
            // response.guests: Array<{ id: string; table: string; satisfaction: number }>

            // Build a quick lookup for table assignments
            const assignments: Record<string, string> = {};
            response.guests.forEach((g) => {
                assignments[g.id] = g.table;
            });

            setGuests((prev) =>
                prev.map((g) => {
                    const assignedTable = assignments[g.id];
                    return assignedTable ? { ...g, tableId: assignedTable } : g;
                })
            );

            // Merge satisfaction scores from response into satisfactionMap
            const newMap: Record<string, number> = {};
            response.guests.forEach((g) => {
                if (typeof g.satisfaction === 'number') {
                    newMap[g.id] = g.satisfaction;
                }
            });
            setSatisfactionMap(newMap);
        } catch (err) {
            console.error(err);
            // Optionally: toast.error('Failed to auto assign')
        }
    };

    // ─── Compute satisfactionMap whenever dependencies change ────────────────
    useEffect(() => {
        if (viewMode !== 'satisfaction') {
            // In “regular” mode, clear any existing satisfaction scores
            setSatisfactionMap({});
            return;
        }

        // Build input for Algorithm: only guests who already have a tableId
        const assignedGuests: AIGuest[] = guests
            .filter((g) => !!g.tableId)
            .map((g) => ({
                id: g.id,
                group: g.group,
                table: g.tableId!,
                satisfaction: undefined,
            }));

        // Filter only “table” elements
        const tableElements = elements.filter(
            (el) => el.elementType === 'table'
        );
        const algo = new Algorithm(assignedGuests, tableElements, relations);
        const updatedList = algo.setSatisfactory(assignedGuests);

        // Build a new map { guest.id → updated.satisfaction }
        const newMap: Record<string, number> = {};
        updatedList.forEach((u) => {
            if (typeof u.satisfaction === 'number') {
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
}
