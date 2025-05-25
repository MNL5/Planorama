import {
    Autocomplete,
    Button,
    Drawer,
    Group,
    Stack,
    Text,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import React, { useEffect, useState } from 'react';
import { Guest } from '../../types/guest';

interface TableDetailsDrawerProps {
    opened: boolean;
    onClose: () => void;
    table: {
        id: string;
        seatCount: number;
        name?: string;
    };
    allGuests: Guest[];
    assignedGuests: Guest[];
    onAssign: (tableId: string, guestId: string) => void;
    onRemove: (guestId: string) => void;
}

export const TableDetailsDrawer: React.FC<TableDetailsDrawerProps> = ({
    opened,
    onClose,
    table,
    allGuests,
    assignedGuests,
    onAssign,
    onRemove,
}) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [options, setOptions] = useState<string[]>([]);

    useEffect(() => {
        const names = allGuests.map((g) => g.name);
        setOptions(names);
    }, [allGuests]);

    const handleSelect = (value: string) => {
        const guest = allGuests.find((g) => g.name === value);
        if (!guest) return;

        if (guest.tableId && guest.tableId !== table.id) {
            modals.openConfirmModal({
                title: 'Reassign Guest',
                children: (
                    <Text>{`${guest.name} is already at another table. Move them here?`}</Text>
                ),
                labels: { confirm: 'Move', cancel: 'Cancel' },
                onConfirm: () => onAssign(table.id, guest.id),
            });
        } else {
            onAssign(table.id, guest.id);
        }

        setSearchValue('');
    };

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            title={`Table ${table.name || table.id} (${assignedGuests.length}/${
                table.seatCount
            })`}
            padding="lg"
            size="sm"
        >
            <Autocomplete
                data={options}
                value={searchValue}
                onChange={setSearchValue}
                onItemSubmit={handleSelect}
                placeholder="Type guest name..."
                label="Add Guest"
                nothingFound="No matching guest"
                mb="md"
            />

            <Stack spacing="sm">
                {assignedGuests.map((g) => (
                    <Group position="apart" key={g.id}>
                        <Text>{g.name}</Text>
                        <Button
                            size="xs"
                            variant="outline"
                            color="red"
                            onClick={() => onRemove(g.id)}
                        >
                            Remove
                        </Button>
                    </Group>
                ))}
            </Stack>

            <Button fullWidth mt="lg" onClick={onClose}>
                Done
            </Button>
        </Drawer>
    );
};
