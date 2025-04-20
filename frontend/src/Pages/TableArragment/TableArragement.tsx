import { Box, Button, Drawer, NumberInput, Text } from '@mantine/core';
import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { v4 as uuidv4 } from 'uuid';

const elementTypes = [
    { type: 'square', label: 'שולחן מרובע' },
    { type: 'rectangle', label: 'שולחן מלבני' },
    { type: 'circle', label: 'שולחן עגול' },
    { type: 'stage', label: 'רחבת ריקודים' },
    { type: 'text', label: 'טקסט' },
];

const Element = ({ element, onUpdate }) => {
    return (
        <Rnd
            bounds="parent"
            size={{ width: element.width, height: element.height }}
            position={{ x: element.x, y: element.y }}
            onDragStop={(e, d) => onUpdate({ ...element, x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, position) => {
                onUpdate({
                    ...element,
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    x: position.x,
                    y: position.y,
                });
            }}
            style={{
                backgroundColor: element.color,
                borderRadius: element.type === 'circle' ? '50%' : '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontWeight: 'bold',
                cursor: 'move',
            }}
        >
            {element.label}
        </Rnd>
    );
};

const TableArrangement = () => {
    const [elements, setElements] = useState([]);
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [seatCount, setSeatCount] = useState(8);

    const addElement = () => {
        if (!selectedType) return;
        const newElement = {
            id: uuidv4(),
            type: selectedType,
            label:
                selectedType === 'stage'
                    ? 'רחבת ריקודים'
                    : `שולחן (${seatCount})`,
            width: selectedType === 'rectangle' ? 160 : 100,
            height: 100,
            x: 300,
            y: 200,
            color: selectedType === 'stage' ? '#4ccfff' : '#a0f0ff',
        };
        setElements((prev) => [...prev, newElement]);
        setDrawerOpened(false);
    };

    const updateElement = (updated) => {
        setElements((prev) =>
            prev.map((el) => (el.id === updated.id ? updated : el))
        );
    };

    return (
        <Box style={{ display: 'flex', height: '100vh', direction: 'rtl' }}>
            {/* Canvas */}
            <Box
                style={{
                    flex: 1,
                    position: 'relative',
                    backgroundColor: '#fff',
                    border: '4px solid black',
                }}
            >
                {elements.map((el) => (
                    <Element
                        key={el.id}
                        element={el}
                        onUpdate={updateElement}
                    />
                ))}
            </Box>

            {/* Side menu */}
            <Box
                style={{
                    width: 150,
                    padding: '1rem',
                    backgroundColor: '#f8f8f8',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                }}
            >
                <Text fw={700}>תפריט</Text>
                {elementTypes.map((el) => (
                    <Button
                        key={el.type}
                        fullWidth
                        onClick={() => {
                            setSelectedType(el.type);
                            setDrawerOpened(true);
                        }}
                    >
                        {el.label}
                    </Button>
                ))}
            </Box>

            {/* Drawer for settings */}
            <Drawer
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                title="הוספת שולחן"
                position="left"
            >
                {selectedType !== 'stage' && selectedType !== 'text' && (
                    <NumberInput
                        label="מספר מקומות"
                        value={seatCount}
                        onChange={setSeatCount}
                        min={1}
                    />
                )}
                <Button fullWidth mt="md" onClick={addElement}>
                    הוסף
                </Button>
            </Drawer>
        </Box>
    );
};

export default TableArrangement;
