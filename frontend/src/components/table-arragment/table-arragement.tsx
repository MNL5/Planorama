import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState, useTransition } from 'react';
import {
    Flex,
    Box,
    Button,
    Stack,
    Drawer,
    NumberInput,
    Title,
    TextInput,
} from '@mantine/core';

import Element from '../../types/Element';
import RndElement from '../RndElement/RndElement';
import { useEventContext } from '../../contexts/event-context';
import { updateEvent } from '../../services/event-service/event-service';
import MainLoader from '../mainLoader/MainLoader';

const elementTypes = [
    { type: 'square', label: 'Square Table', elementType: 'table' },
    { type: 'rectangle', label: 'Rectangle Table', elementType: 'table' },
    { type: 'circle', label: 'Circular Table', elementType: 'table' },

    { type: 'rectangle', label: 'Rectangle Text', elementType: 'text' },
    { type: 'circle', label: 'Circular Text', elementType: 'text' },
] as const;

const TableArrangement = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [elements, setElements] = useState<Element[]>([]);
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [seatCount, setSeatCount] = useState<number | string>(1);
    const [textObjectiveLabel, setTextObjectiveLabel] = useState<string>('');
    const [selectedType, setSelectedType] = useState<{
        type: Element['type'];
        elementType: Element['elementType'];
    } | null>(null);
    const { currentEvent, setCurrentEvent } = useEventContext();
    const [isPending, startTransition] = useTransition();

    const addTableElement = () => {
        if (!canvasRef.current || !selectedType) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();

        const newElement: Element = {
            id: uuidv4(),
            type: selectedType.type,
            label: `(${seatCount})`,
            width: selectedType.type === 'rectangle' ? 160 : 100,
            height: 100,
            x: canvasRect.width / 2 - 50,
            y: canvasRect.height / 2 - 50,
            color: '#d0b9e0',
            ids: [],
            seatCount,
            elementType: 'table',
        };

        setElements((prev) => [...prev, newElement]);
        setDrawerOpened(false);
        setSeatCount(1);
        setTextObjectiveLabel('');
        setSelectedType(null);
    };

    const addTextElement = () => {
        if (!canvasRef.current || !selectedType) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();

        const newElement: Element = {
            id: uuidv4(),
            type: selectedType.type,
            label: textObjectiveLabel,
            width: selectedType.type === 'rectangle' ? 160 : 100,
            height: 100,
            x: canvasRect.width / 2 - 50,
            y: canvasRect.height / 2 - 50,
            color: '#e9dbf1',
            elementType: 'text',
        };

        setElements((prev) => [...prev, newElement]);
        setDrawerOpened(false);
        setSeatCount(1);
        setTextObjectiveLabel('');
        setSelectedType(null);
    };

    const updateElement = (updated: Element) => {
        setElements((prev) =>
            prev.map((el) => (el.id === updated.id ? updated : el))
        );
    };

    const deleteElement = (id: string) => {
        setElements((prev) => prev.filter((el) => el.id !== id));
    };

    const handleSave = () => {
        startTransition(async () => {
            try {
                if (currentEvent?.id) {
                    setCurrentEvent(
                        await updateEvent(
                            { ...currentEvent, diagram: { elements } },
                            currentEvent.id
                        )
                    );
                    toast.success('Seating arrangement saved');
                } else {
                    console.error('no current event id');
                }
            } catch (error) {
                console.error(error);
                const innerError = error as {
                    response: { data: { error: string } };
                    message: string;
                };
                toast.error(
                    innerError.response?.data?.error || 'Problem has occured'
                );
            }
        });
    };

    const loadLayout = async () => {
        try {
            const loadedElements = currentEvent?.diagram?.elements;
            setElements(loadedElements || []);
        } catch (error) {
            console.error('Failed to load layout:', error);
            setElements([]);
        }
    };

    useEffect(() => {
        loadLayout();
    }, []);

    return (
        <Flex style={{ direction: 'rtl', flex: '1 1' }}>
            <MainLoader isPending={isPending} />
            <Box
                flex={1}
                bg={'#fff'}
                ref={canvasRef}
                pos={'relative'}
                bd={'1px solid rgb(230, 229, 229)'}
            >
                {elements.map((el, index) => (
                    <RndElement
                        key={el.id}
                        element={el}
                        tableNumber={index + 1}
                        onUpdate={updateElement}
                        onDelete={deleteElement}
                    />
                ))}
            </Box>

            <Stack
                w={240}
                p={'lg'}
                ta={'center'}
                align={'center'}
                justify={'space-between'}
                bg={'linear-gradient(to right, #e9dbf1, #e6c8fa)'}
            >
                <div style={{ padding: 16 }}>
                    <Title order={2} c={'primary'} py={'lg'}>
                        Menu
                    </Title>
                    {elementTypes.map(({ type, elementType, label }, index) => (
                        <Button
                            key={index}
                            fullWidth
                            className="primary-btn"
                            style={{ fontSize: '14px' }}
                            onClick={() => {
                                setSelectedType({ type, elementType });
                                setDrawerOpened(true);
                            }}
                        >
                            {label}
                        </Button>
                    ))}
                </div>

                <Button
                    size={'md'}
                    radius={'md'}
                    variant={'light'}
                    onClick={handleSave}
                >
                    Save
                </Button>
            </Stack>

            <Drawer
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                title={
                    selectedType?.elementType === 'table'
                        ? 'Add Table'
                        : 'Add Text'
                }
                position="left"
            >
                {selectedType?.elementType === 'table' ? (
                    <NumberInput
                        label="No. of Seats"
                        value={seatCount}
                        onChange={setSeatCount}
                        min={1}
                    />
                ) : (
                    <TextInput
                        label="Objective"
                        value={textObjectiveLabel}
                        onChange={({ target }) =>
                            setTextObjectiveLabel(target?.value || '')
                        }
                    />
                )}
                <Button
                    mt={'md'}
                    fullWidth
                    radius={'md'}
                    color={'#6a0572'}
                    onClick={
                        selectedType?.elementType === 'table'
                            ? addTableElement
                            : addTextElement
                    }
                >
                    Add
                </Button>
            </Drawer>
        </Flex>
    );
};

export default TableArrangement;
