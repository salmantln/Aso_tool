// CountrySelector.tsx
import React from 'react';
import {countries} from "@/components/countries";
// import { Country, countries } from './countries';

interface CountrySelectorProps {
    selectedCountry: string;
    onCountryChange: (countryCode: string) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
                                                                    selectedCountry,
                                                                    onCountryChange,
                                                                }) => {
    return (
        <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            {countries.map((country) => (
                <option key={country.code} value={country.code}>
                    {country.flag} {country.code.toUpperCase()}
                </option>
            ))}
        </select>
    );
};