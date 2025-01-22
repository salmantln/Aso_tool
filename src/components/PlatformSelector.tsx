// components/PlatformSelector.tsx
import { useState } from 'react';
import { Globe } from 'lucide-react';

interface PlatformSelectorProps {
    onPlatformChange: (platform: 'ios' | 'android') => void;
    onCountryChange: (country: string) => void;
    selectedPlatform: 'ios' | 'android';
    selectedCountry: string;
}

export function PlatformSelector({
                                     onPlatformChange,
                                     onCountryChange,
                                     selectedPlatform,
                                     selectedCountry
                                 }: PlatformSelectorProps) {
    const [isCountryOpen, setIsCountryOpen] = useState(false);

    const COUNTRIES = {
        us: { name: 'United States', flag: '🇺🇸' },
        gb: { name: 'United Kingdom', flag: '🇬🇧' },
        fr: { name: 'France', flag: '🇫🇷' },
        de: { name: 'Germany', flag: '🇩🇪' },
        es: { name: 'Spain', flag: '🇪🇸' },
        it: { name: 'Italy', flag: '🇮🇹' },
        jp: { name: 'Japan', flag: '🇯🇵' },
        kr: { name: 'South Korea', flag: '🇰🇷' },
    };

    return (
        <div className="flex items-center gap-4">
            {/* Platform Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                    onClick={() => onPlatformChange('ios')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        selectedPlatform === 'ios'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    iOS
                </button>
                <button
                    onClick={() => onPlatformChange('android')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        selectedPlatform === 'android'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Android
                </button>
            </div>

            {/* Country Selector */}
            <div className="relative">
                <button
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    className="flex items-center text-gray-500 gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors"
                >
                    <span>{COUNTRIES[selectedCountry as keyof typeof COUNTRIES]?.flag}</span>
                    <span>{selectedCountry.toUpperCase()}</span>
                    <Globe size={16} className="text-gray-500" />
                </button>

                {isCountryOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                        {Object.entries(COUNTRIES).map(([code, { name, flag }]) => (
                            <button
                                key={code}
                                onClick={() => {
                                    onCountryChange(code);
                                    setIsCountryOpen(false);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <span>{flag}</span>
                                <span>{name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}