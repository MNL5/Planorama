import { Title } from '@mantine/core';
import { Box, Stack } from '@mui/material';
import { Guest } from '../../types/guest';

interface GuestListProps {
    guests: Guest[];
    onDragStart: (e: DragEvent, guestId: string) => void;
}

const GuestSeatingList: React.FC<GuestListProps> = ({
    guests,
    onDragStart,
}) => (
    <Box style={{ width: 240, padding: 16, borderRight: '1px solid #ddd' }}>
        <Title order={4}>Guests</Title>
        <Stack spacing="xs">
            {guests.map((guest) => (
                <Box
                    key={guest.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, guest.id)}
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
    </Box>
);

export default GuestSeatingList;
