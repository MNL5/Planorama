import { Box, Button, Stack, Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useEventContext } from '../../contexts/event-context';
import { updateEvent } from '../../services/event-service/event-service';
import ElementType from '../../types/Element';
import GuestTable from '../guest-table/guest-table';
import { getAllGuests } from '../../Services/guest-service/guest-service';
import { Guest } from '../../types/guest';
import GuestSeatingList from '../guest-seating-list/guest-seating-list';

const GuestSeating: React.FC = () => {
    const { currentEvent, setCurrentEvent } = useEventContext();
    const [tables, setTables] = useState<ElementType[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [openTableId, setOpenTableId] = useState<string | null>(null);

    const {
        data: guestsData = [],
        isLoading,
        isError,
    } = useQuery<Guest[], Error>({
        queryKey: ['fetchGuests', currentEvent?.id],
        queryFn: () => getAllGuests(currentEvent?.id as string),
        enabled: !!currentEvent?.id,
    });

    useEffect(() => {
        if (currentEvent) {
            setTables(currentEvent.diagram.elements || []);
        }
    }, [currentEvent]);

    useEffect(() => {
        setGuests(guestsData);
    }, [guestsData]);

    const handleDrop = (tableId: string, guestId: string) => {
        setGuests((prev) =>
            prev.map((g) => (g.id === guestId ? { ...g, tableId } : g))
        );
    };

    const handleRemove = (guestId: string) => {
        setGuests((prev) =>
            prev.map((g) =>
                g.id === guestId ? { ...g, tableId: undefined } : g
            )
        );
    };

    const handleSave = async () => {
        if (!currentEvent) return;
        try {
            const updatedEvent = {
                ...currentEvent,
                diagram: { elements: tables },
                guests,
            };
            const result = await updateEvent(updatedEvent, currentEvent.id);
            setCurrentEvent(result);
            toast.success('Guest seating saved');
        } catch (err) {
            console.error(err);
            toast.error('Failed to save guest seating');
        }
    };

    const handleGuestDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        id: string
    ) => {
        e.dataTransfer.setData('guestId', id);
    };

    if (isLoading) return <Text>Loading guests...</Text>;
    if (isError) return <Text>Error loading guests</Text>;

    return (
        <Box
            style={{ display: 'flex', height: '100vh' }}
            onClick={() => setOpenTableId(null)}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <GuestSeatingList
                    guests={guests.filter((g) => !g.tableId)}
                    onDragStart={handleGuestDragStart}
                />
                <Button fullWidth mt="md" onClick={handleSave} color="green">
                    Save Seating
                </Button>
            </div>
            <Box style={{ flex: 1, position: 'relative', background: '#fff' }}>
                {tables.map((table) => (
                    <GuestTable
                        key={table.id}
                        table={table}
                        assignedGuests={guests.filter(
                            (g) => g.tableId === table.id
                        )}
                        isOpen={openTableId === table.id}
                        onOpen={(id) => setOpenTableId(id)}
                        onClose={() => setOpenTableId(null)}
                        onDrop={handleDrop}
                        onRemove={handleRemove}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default GuestSeating;
