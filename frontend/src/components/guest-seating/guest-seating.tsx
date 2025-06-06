// src/components/GuestSeating/GuestSeating.tsx

import React, { useState, useMemo, useTransition } from 'react';
import { Flex, Box, SegmentedControl, Text } from '@mantine/core';
import { toast } from 'react-toastify';

import { useEventContext } from '../../contexts/event-context';
import { useGuestData } from '../../hooks/useGuestData';

import UnassignedGuestsPanel from '../UnassignedGuestsPanel/UnassignedGuestsPanel';
import TableCanvas from '../TableCanvas/TableCanvas';

import {
    computeTableAverage,
    satisfactionToColor,
} from '../../utils/satisfactionUtils';
import { RsvpStatus } from '../../types/rsvp-status';

import './GuestSeating.css'; // Bring in the CSS module
import MainLoader from '../mainLoader/MainLoader';

type ViewMode = 'regular' | 'satisfaction';

const GuestSeating: React.FC = () => {
    const { currentEvent } = useEventContext();
    const [viewMode, setViewMode] = useState<ViewMode>('regular');
    const [openTableId, setOpenTableId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    // Use our custom hook to get all relevant data & actions
    const {
        guests,
        setGuests,
        elements,
        satisfactionMap,
        isLoading,
        isError,
        handleSaveSeating,
        handleAutoAssign,
    } = useGuestData(currentEvent, viewMode);

    // Compute which guests are “unassigned” (and not declined)
    const guestsToShow = useMemo(
        () =>
            guests.filter((g) => !g.tableId && g.status !== RsvpStatus.DECLINE),
        [guests]
    );

    // If either query is still loading, show loader
    if (isLoading) {
        return <MainLoader isPending />;
    }
    // If either query errored, show error text
    if (isError) {
        return <Text className="gs-error-text">Error loading data.</Text>;
    }

    // Drop handler: assign multiple guest IDs to a given table
    const handleDrop = (tableId: string, ids: string[]) => {
        const idSet = new Set(ids);
        setGuests((prev) =>
            prev.map((g) => (idSet.has(g.id) ? { ...g, tableId } : g))
        );
        // No need to recalc satisfaction manually; hook's useEffect runs automatically
    };

    // Remove handler: unassign a single guest
    const handleRemove = (guestId: string) => {
        setGuests((prev) =>
            prev.map((g) =>
                g.id === guestId ? { ...g, tableId: undefined } : g
            )
        );
        // Hook’s useEffect will recalc once state updates
    };

    // Check total seats vs. unassigned guests for “Auto Assign” validation
    const totalSeats = elements.reduce(
        (sum, el) => sum + (el.seatCount || 0),
        0
    );
    const canAutoAssign = guestsToShow.length <= totalSeats;

    return (
        <Flex className="gs-container" onClick={() => setOpenTableId(null)}>
            {/* Overlay loader while transitions (save/auto‐assign) are pending */}
            <MainLoader isPending={isPending} />

            {/* ─── LEFT PANEL: Unassigned Guests + Actions ───────────────── */}
            <UnassignedGuestsPanel
                guestsToShow={guestsToShow}
                onAutoAssign={() => {
                    if (!canAutoAssign) {
                        toast.error('Not enough seats for all guests');
                        return;
                    }
                    startTransition(() => handleAutoAssign());
                }}
                onSave={() => startTransition(() => handleSaveSeating())}
            />

            {/* ─── RIGHT PANEL: Canvas of Tables & Text Elements ────────── */}
            <Box className="gs-canvas">
                <SegmentedControl
                    value={viewMode}
                    onChange={(val) => setViewMode(val as ViewMode)}
                    data={[
                        { label: 'Regular', value: 'regular' },
                        { label: 'Satisfaction', value: 'satisfaction' },
                    ]}
                    className="gs-view-switch"
                />

                <TableCanvas
                    elements={elements}
                    guests={guests}
                    satisfactionMap={satisfactionMap}
                    viewMode={viewMode}
                    openTableId={openTableId}
                    onOpenTable={(id) => setOpenTableId(id)}
                    onCloseTable={() => setOpenTableId(null)}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    computeTableAverage={computeTableAverage}
                    satisfactionToColor={satisfactionToColor}
                />
            </Box>
        </Flex>
    );
};

export default GuestSeating;
