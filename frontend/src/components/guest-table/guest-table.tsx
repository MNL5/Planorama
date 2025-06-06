import React from "react";
import {
    Box,
    Button,
    Popover,
    Card,
    ScrollArea,
    Text,
    Title,
    Group,
    Divider,
    Badge,
} from '@mantine/core';
import { toast } from 'react-toastify';
import Element from '../../types/Element';
import { Guest } from '../../types/guest';
import { satisfactionToColor } from '../../utils/satisfactionUtils';
import './GuestTable.css';

interface GuestTableProps {
    table: Element;
    seatedGuestsWithSatisfaction: (Guest & {
        satisfaction: number | undefined;
    })[];
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose: () => void;
    onDrop: (tableId: string, ids: string[]) => void;
    onRemove: (guestId: string) => void;
    tableColor: string;
}

const satisfactionGradient = (satisfaction?: number) => {
    if (satisfaction === undefined) return 'transparent';
    const color = satisfactionToColor(satisfaction);
    return `linear-gradient(50deg, ${color} 0% 0%, transparent 100%)`;
};

const GuestTable: React.FC<GuestTableProps> = ({
    table,
    seatedGuestsWithSatisfaction,
    isOpen,
    onOpen,
    onClose,
    onDrop,
    onRemove,
    tableColor,
}) => {
    const isFull =
        seatedGuestsWithSatisfaction.length >= Number(table.seatCount);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const ids = JSON.parse(e.dataTransfer.getData('ids'));
        if (
            ids.length + seatedGuestsWithSatisfaction.length >
            Number(table.seatCount)
        ) {
            toast.error('Table has not enough seats');
        } else {
            onDrop(table.id, ids);
        }
    };

    return (
        <Popover
            opened={isOpen}
            onClose={onClose}
            position="right"
            withArrow
            trapFocus={false}
            classNames={{
                dropdown: 'guest-table-popover-dropdown',
                arrow: 'guest-table-popover-arrow',
            }}
        >
            <Popover.Target>
                <Box
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen(table.id);
                    }}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className={`guest-table ${table.type}`}
                    style={{
                        top: table.y,
                        left: table.x,
                        width: table.width,
                        height: table.height,
                        backgroundColor: tableColor,
                    }}
                >
                    <Text size="md" color="#3c096c">
                        ({seatedGuestsWithSatisfaction.length}/{table.seatCount}
                        )
                    </Text>
                </Box>
            </Popover.Target>

            <Popover.Dropdown>
                <Card
                    shadow="sm"
                    radius="md"
                    withBorder
                    className="popover-card"
                >
                    <Group align="center" className="popover-header">
                        <Title order={5}>Table Guests</Title>
                        <Badge color={isFull ? 'red' : 'teal'} variant="light">
                            {seatedGuestsWithSatisfaction.length}/
                            {table.seatCount}
                        </Badge>
                    </Group>

                    <Divider />

                    <ScrollArea className="guest-list">
                        {seatedGuestsWithSatisfaction.length === 0 ? (
                            <Text color="dimmed" mt="md">
                                No guests assigned
                            </Text>
                        ) : (
                            seatedGuestsWithSatisfaction.map((g) => (
                                <Group key={g.id} className="guest-item">
                                    <Box
                                        draggable
                                        onDragStart={(e) =>
                                            e.dataTransfer.setData(
                                                'ids',
                                                JSON.stringify([g.id])
                                            )
                                        }
                                        className="guest-box"
                                        style={{
                                            background: satisfactionGradient(
                                                g.satisfaction
                                            ),
                                        }}
                                    >
                                        <span>{g.name}</span>
                                        <span>
                                            {g.satisfaction !== undefined
                                                ? `${g.satisfaction * 100}%`
                                                : ''}
                                        </span>
                                    </Box>
                                    <Button
                                        size="xs"
                                        color="red"
                                        radius="md"
                                        variant="outline"
                                        onClick={() => onRemove(g.id)}
                                    >
                                        Remove
                                    </Button>
                                </Group>
                            ))
                        )}
                    </ScrollArea>
                </Card>
            </Popover.Dropdown>
        </Popover>
    );
};

export default GuestTable;
