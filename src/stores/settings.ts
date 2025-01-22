// stores/settings.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Country {
    code: string;
    name: string;
    language: string;
}

interface SettingsStore {
    selectedCountry: string;
    selectedPlatform: 'ios' | 'android';
    countries: Country[];
    setCountry: (country: string) => void;
    setPlatform: (platform: 'ios' | 'android') => void;
    setCountries: (countries: Country[]) => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            selectedCountry: 'us',
            selectedPlatform: 'android',
            countries: [],
            setCountry: (country) => set({ selectedCountry: country }),
            setPlatform: (platform) => set({ selectedPlatform: platform }),
            setCountries: (countries) => set({ countries }),
        }),
        {
            name: 'settings-storage',
        }
    )
);