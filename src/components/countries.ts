export interface Country {
    code: string;
    name: string;
    flag: string;
}

export const countries: Country[] = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'de', name: 'Germany', flag: '🇩🇪' },
    { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'fr', name: 'France', flag: '🇫🇷' },
    { code: 'it', name: 'Italy', flag: '🇮🇹' },
    { code: 'es', name: 'Spain', flag: '🇪🇸' },
    { code: 'jp', name: 'Japan', flag: '🇯🇵' },
    { code: 'kr', name: 'South Korea', flag: '🇰🇷' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'br', name: 'Brazil', flag: '🇧🇷' },
    { code: 'ru', name: 'Russia', flag: '🇷🇺' },
    { code: 'cn', name: 'China', flag: '🇨🇳' },
    { code: 'in', name: 'India', flag: '🇮🇳' },
];