import { Button } from '@mantine/core';
import { Rnd } from 'react-rnd';
import Element from '../../types/element';

interface RndElementProps {
    element: Element;
    onUpdate: (updated: Element) => void;
    onDelete: (id: string) => void;
}

const RndElement = ({ element, onUpdate, onDelete }: RndElementProps) => (
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
            boxShadow: 'rgb(0 0 0 / 16%) 0px 4px 16px',
        }}
    >
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
            }}
        >
            {element.label}
            <Button
                size="xs"
                color="#951818"
                onClick={() => onDelete(element.id)}
            >
                x
            </Button>
        </div>
    </Rnd>
);

export default RndElement;
