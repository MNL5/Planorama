const pastelColorCache: Record<string, string> = {};

export const getPastelColorForGroup = (group: string): string => {
    if (pastelColorCache[group]) return pastelColorCache[group];
    const hue = Math.floor(Math.random() * 360);
    const pastel = `hsl(${hue}, 70%, 85%)`;
    pastelColorCache[group] = pastel;
    return pastel;
};

export const getGroupGradient = (guests: { group?: string }[]) => {
    const uniqueGroups = Array.from(
        new Set(guests.map((g) => g.group || 'unknown'))
    );
    const colors = uniqueGroups.map((group) => getPastelColorForGroup(group));

    if (colors.length === 0) return 'transparent';
    if (colors.length === 1) return colors[0];

    const step = 100 / (colors.length - 1);
    const gradient = colors
        .map((color, index) => `${color} ${index * step}%`)
        .join(', ');

    return `linear-gradient(90deg, ${gradient})`;
};
