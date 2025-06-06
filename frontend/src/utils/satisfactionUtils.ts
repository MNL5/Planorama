// src/utils/satisfactionUtils.ts

import { Guest } from '../types/guest';
import { Element } from '../types/Element';

export function computeTableAverage(
    tableId: string,
    guests: Guest[],
    satisfactionMap: Record<string, number>
): number | null {
    // Only consider assigned guests who have a satisfaction entry
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
}

export function satisfactionToColor(satisfaction: number): string {
    const clamped = Math.max(0, Math.min(1, satisfaction));
    const hue = 120 * clamped; // 0 = red, 120 = green
    return `hsl(${hue}, 100%, 45%)`;
}
