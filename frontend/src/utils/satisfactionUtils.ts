import { Guest } from '../types/guest';

export const computeTableAverage = (
    tableId: string,
    guests: Guest[],
    satisfactionMap: Record<string, number>
): number | null => {
    const assigned = guests.filter(
        (g) =>
            g.tableId === tableId && typeof satisfactionMap[g.id] === 'number'
    );
    if (assigned.length === 0) return null;

    const total = assigned.reduce(
        (sum, g) => sum + (satisfactionMap[g.id] || 0),
        0
    );
    return total / assigned.length;
};

export const satisfactionToColor = (satisfaction: number): string => {
    const clamped = Math.max(0, Math.min(1, satisfaction));
    const hue = 120 * clamped; // 0 = red, 120 = green
    return `hsl(${hue}, 100%, 45%)`;
};
