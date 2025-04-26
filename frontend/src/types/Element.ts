import { UUIDTypes } from 'uuid';

interface Element {
    id: string;
    type: 'square' | 'rectangle' | 'circle';
    label: string;
    width: number;
    height: number;
    x: number;
    y: number;
    color: string;
    seatCount: number;
    ids: UUIDTypes[];
}

export default Element;
