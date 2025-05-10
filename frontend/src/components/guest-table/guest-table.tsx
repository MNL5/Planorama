import { Box, Button, Group, Popover, Stack, Text, Title } from '@mantine/core';
import React from 'react';
import { toast } from 'react-toastify';
import Element from '../../types/Element';
import { Guest } from '../../types/guest';

interface GuestTableProps {
    table: Element;
    assignedGuests: Guest[];
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose: () => void;
    onDrop: (tableId: string, guestId: string) => void;
    onRemove: (guestId: string) => void;
}

const GuestTable: React.FC<GuestTableProps> = ({
    table,
    assignedGuests,
    isOpen,
    onOpen,
    onClose,
    onDrop,
    onRemove,
}) => {
    const capacity = table.seatCount;
    const isFull = assignedGuests.length >= capacity;

    return (
        <Popover
            opened={isOpen}
            onClose={onClose}
            position="right"
            withArrow
            trapFocus={false}
        >
            <Popover.Target>
                <Box
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen(table.id);
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        const guestId = e.dataTransfer.getData('guestId');
                        if (isFull) {
                            toast.error('Table is full');
                        } else {
                            onDrop(table.id, guestId);
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
                        borderRadius: table.type === 'circle' ? '50%' : 8,
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
                <Stack spacing="xs" mt="md">
                    {assignedGuests.map((g) => (
                        <Group key={g.id} position="apart">
                            <Box
                                draggable
                                onDragStart={(e) =>
                                    e.dataTransfer.setData('guestId', g.id)
                                }
                                style={{ cursor: 'grab' }}
                            >
                                {g.name}
                            </Box>
                            <Button
                                size="xs"
                                color="red"
                                variant="subtle"
                                onClick={() => onRemove(g.id)}
                            >
                                Remove
                            </Button>
                        </Group>
                    ))}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
};

export default GuestTable;
