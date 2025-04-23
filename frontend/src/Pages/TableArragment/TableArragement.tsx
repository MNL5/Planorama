import { Box, Button, Drawer, NumberInput, Text } from '@mantine/core';
import axios from 'axios';
import { useRef, useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { v4 as uuidv4 } from 'uuid';

interface ElementType {
    id: string;
    type: 'square' | 'rectangle' | 'circle';
    label: string;
    width: number;
    height: number;
    x: number;
    y: number;
    color: string;
    seatCount: number;
}

const elementTypes = [
    { type: 'square', label: 'שולחן מרובע' },
    { type: 'rectangle', label: 'שולחן מלבני' },
    { type: 'circle', label: 'שולחן עגול' },
] as const;

const Element = ({
    element,
    onUpdate,
    onDelete,
}: {
    element: ElementType;
    onUpdate: (updated: ElementType) => void;
    onDelete: (id: string) => void;
}) => (
    <Rnd
        bounds="parent"
        size={{ width: element.width, height: element.height }}
        position={{ x: element.x, y: element.y }}
        onDragStop={(_, d) => onUpdate({ ...element, x: d.x, y: d.y })}
        onResizeStop={(_, __, ref, ___, position) =>
            onUpdate({
                ...element,
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                x: position.x,
                y: position.y,
            })
        }
        style={{
            backgroundColor: element.color,
            borderRadius: element.type === 'circle' ? '50%' : '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 'bold',
            cursor: 'move',
            position: 'absolute',
        }}
    >
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
            }}
        >
            {element.label}
            <Button size="xs" color="red" onClick={() => onDelete(element.id)}>
                x
            </Button>
        </div>
    </Rnd>
);

const TableArrangement = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [elements, setElements] = useState<ElementType[]>([]);
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [selectedType, setSelectedType] = useState<
        ElementType['type'] | null
    >(null);
    const [seatCount, setSeatCount] = useState<number>(1);

    const addElement = () => {
        if (!canvasRef.current || !selectedType) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();

        const newElement: ElementType = {
            id: uuidv4(),
            type: selectedType,
            label: `(${seatCount})`,
            width: selectedType === 'rectangle' ? 160 : 100,
            height: 100,
            x: canvasRect.width / 2 - 50,
            y: canvasRect.height / 2 - 50,
            color: '#a0f0ff',
            seatCount,
        };

        setElements((prev) => [...prev, newElement]);
        setDrawerOpened(false);
        setSeatCount(1);
        setSelectedType(null);
    };

    const updateElement = (updated: ElementType) => {
        setElements((prev) =>
            prev.map((el) => (el.id === updated.id ? updated : el))
        );
    };

    const deleteElement = (id: string) => {
        setElements((prev) => prev.filter((el) => el.id !== id));
    };

    const handleSave = async () => {
        await axios.post('/api/layout/save', { elements });
        alert('Layout saved');
    };

    const loadLayout = async () => {
        try {
            const response = await axios.get('/api/layout/load');
            const loadedElements = response.data?.elements;

            if (Array.isArray(loadedElements)) {
                setElements(loadedElements);
            } else {
                console.warn('Invalid layout format:', loadedElements);
                setElements([]);
            }
        } catch (error) {
            console.error('Failed to load layout:', error);
            setElements([]);
        }
    };

    useEffect(() => {
        loadLayout();
    }, []);

    return (
        <Box style={{ display: 'flex', height: '100vh', direction: 'rtl' }}>
            <Box
                ref={canvasRef}
                style={{
                    flex: 1,
                    position: 'relative',
                    backgroundColor: '#fff',
                    border: '2px solid black',
                }}
            >
                {elements.map((el) => (
                    <Element
                        key={el.id}
                        element={el}
                        onUpdate={updateElement}
                        onDelete={deleteElement}
                    />
                ))}
            </Box>

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
                <Button color="grey" fullWidth onClick={handleSave}>
                    שמור
                </Button>
            </Box>

            <Drawer
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                title="הוספת שולחן"
                position="left"
            >
                {selectedType && (
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
