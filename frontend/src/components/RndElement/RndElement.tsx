import { Button } from '@mantine/core';
import { Rnd } from 'react-rnd';
import Element from '../../types/Element';

interface RndElementProps {
    element: Element;
    tableNumber: number;
    onUpdate: (updated: Element) => void;
    onDelete: (id: string) => void;
}

const RndElement = ({
    element,
    tableNumber,
    onUpdate,
    onDelete,
}: RndElementProps) => (
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
            border: '1px dashed #ccc',
            backgroundColor: element.color,
            borderRadius: element.type === 'circle' ? '50%' : '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            cursor: 'move',
            position: 'absolute',
            boxShadow: 'rgb(0 0 0 / 16%) 0px 4px 16px',
        }}
    >
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <span style={{ fontSize: '1.3rem' }}>{tableNumber}</span>
            <span>{element.label}</span>
            <Button
                size="xs"
                color="#951818"
                h={'20px'}
                p={'5px'}
                radius={'md'}
                style={{
                    position: 'absolute',
                    top: '5px',
                    left: '5px',
                    fontSize: '0.8rem',
                }}
                onClick={() => onDelete(element.id)}
            >
                ×
            </Button>
        </div>
    </Rnd>
);

export default RndElement;
