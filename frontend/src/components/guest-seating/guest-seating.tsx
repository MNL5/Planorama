import React, { useState, useEffect } from 'react';
import { Box, Text, Stack, Button, Title, Popover, Group } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useEventContext } from '../../contexts/event-context';
import { updateEvent } from '../../services/event-service/event-service';
import ElementType from '../../types/Element';
import { toast } from 'react-toastify';
import { getAllGuests } from '../../Services/guest-service/guest-service';
import { Guest } from '../../types/guest';

const GuestSeating: React.FC = () => {
    const { currentEvent, setCurrentEvent } = useEventContext();
    const [tables, setTables] = useState<ElementType[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [openTableId, setOpenTableId] = useState<string | null>(null);

    // Fetch guests
    const {
        data: guestsData = [],
        isLoading,
        isError,
    } = useQuery<Guest[], Error>({
        queryKey: ['fetchGuests', currentEvent?.id],
        queryFn: () => getAllGuests(currentEvent?.id as string),
        enabled: !!currentEvent?.id,
    });

    // Initialize tables
    useEffect(() => {
        if (currentEvent) {
            setTables(currentEvent.diagram.elements || []);
        }
    }, [currentEvent]);

    // Initialize guests state from fetched data
    useEffect(() => {
        setGuests(guestsData.map((g) => ({ ...g })));
    }, [guestsData]);

    // Handle drop of guest onto table: update guest.assignedTableId
    const handleDrop = (tableId: string, guestId: string) => {
        setGuests((prev) =>
            prev.map((g) => (g.id === guestId ? { ...g, tableId } : g))
        );
    };

    // Remove guest from table
    const handleRemove = (guestId: string) => {
        setGuests((prev) =>
            prev.map((g) =>
                g.id === guestId ? { ...g, tableId: undefined } : g
            )
        );
    };

    // Save updated diagram: only needs tables layout since guest->table associations stored separately
    const handleSave = async () => {
        if (!currentEvent) return;
        try {
            // include updated seating assignments in event if schema supports, else only save diagram
            const updatedEvent = {
                ...currentEvent,
                diagram: { elements: tables },
                guests,
            };
            const result = await updateEvent(updatedEvent, currentEvent.id);
            setCurrentEvent(result);
            alert('Guest seating saved');
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <Text>Loading guests...</Text>;
    if (isError) return <Text>Error loading guests</Text>;

    return (
        <Box style={{ display: 'flex', height: '100vh' }}>
            {/* Left: Guest List */}
            <Box
                style={{
                    width: 240,
                    padding: 16,
                    borderRight: '1px solid #ddd',
                }}
            >
                <Title order={4}>Guests</Title>
                <Stack spacing="xs">
                    {guests
                        .filter((g) => !g.tableId)
                        .map((guest) => (
                            <Box
                                key={guest.id}
                                draggable
                                onDragStart={(e) =>
                                    e.dataTransfer.setData('guestId', guest.id)
                                }
                                style={{
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: 4,
                                    backgroundColor: '#f0f0f0',
                                    cursor: 'grab',
                                }}
                            >
                                {guest.name}
                            </Box>
                        ))}
                </Stack>
                <Button fullWidth mt="md" onClick={handleSave} color="green">
                    Save Seating
                </Button>
            </Box>

            {/* Right: Tables Canvas */}
            <Box
                style={{ flex: 1, position: 'relative', background: '#fff' }}
                onClick={() => setOpenTableId(null)}
            >
                {tables.map((table) => {
                    const assignedGuests = guests.filter(
                        (g) => g.tableId === table.id
                    );
                    // capacity check
                    const isFull =
                        assignedGuests.length >= (table.seatCount || Infinity);

                    return (
                        <Popover
                            key={table.id}
                            opened={openTableId === table.id}
                            onClose={() => setOpenTableId(null)}
                            position="right"
                            withArrow
                            trapFocus={false}
                        >
                            <Popover.Target>
                                <Box
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenTableId(table.id);
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const guestId =
                                            e.dataTransfer.getData('guestId');
                                        if (isFull) {
                                            toast.error('Table is full');
                                        } else {
                                            handleDrop(table.id, guestId);
                                        }
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    style={{
                                        position: 'absolute',
                                        top: table.y,
                                        left: table.x,
                                        width: table.width,
                                        height: table.height,
                                        backgroundColor: '#d0b9e0',
                                        borderRadius:
                                            table.type === 'circle' ? '50%' : 8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Text weight={700}>{table.label}</Text>
                                </Box>
                            </Popover.Target>

                            <Popover.Dropdown>
                                <Title order={5}>Table Guests</Title>
                                <Stack spacing="xs">
                                    {assignedGuests.map((g) => (
                                        <Group key={g.id} position="apart">
                                            <Box
                                                draggable
                                                onDragStart={(e) =>
                                                    e.dataTransfer.setData(
                                                        'guestId',
                                                        g.id
                                                    )
                                                }
                                                style={{ cursor: 'grab' }}
                                            >
                                                {g.name}
                                            </Box>
                                            <Button
                                                size="xs"
                                                color="red"
                                                onClick={() =>
                                                    handleRemove(g.id)
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </Group>
                                    ))}
                                </Stack>
                            </Popover.Dropdown>
                        </Popover>
                    );
                })}
            </Box>
        </Box>
    );
};

export default GuestSeating;
