import { Box, Button, Flex, Stack, Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState, useTransition } from 'react';
import { toast } from 'react-toastify';
import { useEventContext } from '../../contexts/event-context';
import {
    getAllGuests,
    updateGuests,
} from '../../services/guest-service/guest-service';
import Element from '../../types/Element';
import { Guest } from '../../types/guest';
import { RsvpStatus } from '../../types/rsvp-status';
import { seatingGuestColumns } from '../../utils/seating-guest-columns';
import { CustomTable } from '../custom-table/custom-table';
import MainLoader from '../mainLoader/MainLoader';
import { TableDetailsDrawer } from '../table-details-drawer/table-details-drawer';

const GuestSeating: React.FC = () => {
    const { currentEvent } = useEventContext();
    const [elements, setTables] = useState<Element[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [openTableId, setOpenTableId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Element | null>(null);

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
        startTransition(async () => {
            try {
                const updatedGuestsTables: Record<
                    string,
                    { tableId?: string }
                > = {};

                guests.forEach((guest) => {
                    updatedGuestsTables[guest.id] = {
                        tableId: guest?.tableId || '',
                    };
                });

                await updateGuests(currentEvent.id, updatedGuestsTables);
                toast.success('Guest seating saved');
            } catch (err) {
                console.error(err);
                toast.error('Failed to save guest seating');
            }
        });
    };

    const handleGuestDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        id: string
    ) => {
        e.dataTransfer.setData('guestId', id);
    };

    if (isLoading) return <MainLoader isPending />;
    if (isError) return <Text>Error loading guests</Text>;

    return (
        <Flex
            bg={'primary.0'}
            flex={'1 1'}
            style={{ overflow: 'hidden' }}
            onClick={() => setOpenTableId(null)}
        >
            <MainLoader isPending={isPending} />
            <Stack
                p={'lg'}
                align={'center'}
                bg={'linear-gradient(to right, #e9dbf1, #e6c8fa)'}
            >
                <Title order={2} py={'lg'} c={'primary'}>
                    Guests
                </Title>
                <CustomTable<Guest>
                    data={guests.filter(
                        (guest) =>
                            !guest.tableId &&
                            guest.status !== RsvpStatus.DECLINE
                    )}
                    columns={seatingGuestColumns}
                    onDragStart={handleGuestDragStart}
                    rowStyle={{ cursor: 'pointer' }}
                />
                <Button
                    size={'md'}
                    radius={'md'}
                    variant={'light'}
                    onClick={handleSave}
                    mt={'auto'}
                >
                    Save Seating
                </Button>
            </Stack>
            <Box flex={1} pos={'relative'} bg={'#fff'}>
                {elements
                    .filter((element) => element.elementType === 'table')
                    .map((table) => (
                        <Box
                            key={table.id}
                            onClick={() => {
                                setSelectedTable(table);
                                setDrawerOpened(true);
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                const guestId =
                                    e.dataTransfer.getData('guestId');
                                handleDrop(table.id, guestId);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            style={{
                                position: 'absolute',
                                top: table.y,
                                left: table.x,
                                width: table.width,
                                height: table.height,
                                backgroundColor: '#d0b9e0',
                                border: '1px dashed #ccc',
                                borderRadius:
                                    table.type === 'circle' ? '50%' : 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <Text>
                                (
                                {
                                    guests.filter((g) => g.tableId === table.id)
                                        .length
                                }
                                /{table.seatCount})
                            </Text>
                        </Box>
                    ))}

                {elements
                    .filter((elements) => elements.elementType === 'text')
                    .map((objective) => (
                        <Box
                            key={objective.id}
                            style={{
                                position: 'absolute',
                                top: objective.y,
                                left: objective.x,
                                width: objective.width,
                                height: objective.height,
                                backgroundColor: objective.color,
                                border: '1px dashed #ccc',
                                borderRadius:
                                    objective.type === 'circle' ? '50%' : 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#666',
                                padding: 4,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                cursor: 'default',
                            }}
                        >
                            <Text size="sm">{objective.label}</Text>
                        </Box>
                    ))}
            </Box>
            {selectedTable && (
                <TableDetailsDrawer
                    opened={drawerOpened}
                    onClose={() => setDrawerOpened(false)}
                    table={{
                        id: selectedTable.id,
                        seatCount: Number(selectedTable.seatCount),
                        name: `Table ${
                            elements.findIndex(
                                (el) => el.id === selectedTable.id
                            ) + 1
                        }`,
                    }}
                    allGuests={guests}
                    assignedGuests={guests.filter(
                        (g) => g.tableId === selectedTable.id
                    )}
                    onAssign={handleDrop}
                    onRemove={handleRemove}
                />
            )}
        </Flex>
    );
};

export default GuestSeating;
