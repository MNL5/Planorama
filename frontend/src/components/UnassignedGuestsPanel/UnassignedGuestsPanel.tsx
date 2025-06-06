// src/components/GuestSeating/UnassignedGuestsPanel.tsx

import { Button, Stack, Title } from '@mantine/core';
import React from 'react';
import { Guest } from '../../types/guest';
import { seatingGuestColumns } from '../../utils/seating-guest-columns';
import { CustomTable } from '../custom-table/custom-table';

interface UnassignedGuestsPanelProps {
    guestsToShow: Guest[];
    onAutoAssign: () => void;
    onSave: () => void;
}

const UnassignedGuestsPanel: React.FC<UnassignedGuestsPanelProps> = ({
    guestsToShow,
    onAutoAssign,
    onSave,
}) => {
    // Drag start: embed guest IDs in dataTransfer
    const handleGuestDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        ids: string[]
    ) => {
        e.dataTransfer.setData('ids', JSON.stringify(ids));
    };

    return (
        <Stack className="gs-left-panel" align="center">
            <Title order={2} className="gs-left-title">
                Guests
            </Title>

            <Button
                size="md"
                radius="md"
                variant="light"
                onClick={onAutoAssign}
                className="gs-button"
            >
                Auto Assign
            </Button>

            <CustomTable<Guest>
                data={guestsToShow}
                columns={seatingGuestColumns}
                onDragStart={handleGuestDragStart}
                rowStyle={{ cursor: 'pointer' }}
                selectable
            />

            <Button
                size="md"
                radius="md"
                variant="light"
                onClick={onSave}
                className="gs-button gs-button-save"
            >
                Save Seating
            </Button>
        </Stack>
    );
};

export default UnassignedGuestsPanel;
