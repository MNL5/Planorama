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
    ids: string[];
}

export default Element;
