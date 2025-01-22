'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Search, Settings, Link, HelpCircle, Clock } from 'lucide-react';
import type { KeywordData } from '@/types/apptweak';
import {PlatformSelector} from "@/components/PlatformSelector";

const MetricBar = ({ value, color = "bg-yellow-400" }) => (
    <div className="flex items-center gap-2">
        <div className="w-24 bg-gray-200 rounded-full h-1">
            <div
                className={`h-1 rounded-full ${color}`}
                style={{ width: `${value}%` }}
            />
        </div>
        <span className="text-sm text-gray-600">{value}</span>
    </div>
);

export default function KeywordResearchPage() {
    const [keywords, setKeywords] = useState<KeywordData[]>([]);
    const [inputKeyword, setInputKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<'ios' | 'android'>('ios');
    const [selectedCountry, setSelectedCountry] = useState('us');

    // Update the analyzeKeyword function
    const analyzeKeyword = useCallback(async (keyword: string) => {
        setLoading(true);
        try {
            const response = await fetch('/api/keywords', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    keyword,
                    platform: selectedPlatform,
                    country: selectedCountry
                })
            });

            if (!response.ok) throw new Error('Failed to fetch keyword data');

            const data = await response.json();
            setKeywords(prev => [data, ...prev]);
            setInputKeyword('');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedPlatform, selectedCountry]);

    // const analyzeKeyword = useCallback(async (keyword: string) => {
    //     setLoading(true);
    //     try {
    //         const response = await fetch('/api/keywords', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ keyword })
    //         });
    //
    //         if (!response.ok) throw new Error('Failed to fetch keyword data');
    //
    //         const data = await response.json();
    //         setKeywords(prev => [data, ...prev]);
    //         setInputKeyword('');
    //     } catch (error) {
    //         console.error('Error:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);

    return (
        <div className="h-screen flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Window Controls */}
            <div className="flex gap-2 p-3 bg-gray-50">
                <div className="w-3 h-3 rounded-full bg-red-500"/>
                <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                <div className="w-3 h-3 rounded-full bg-green-500"/>
            </div>

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-72 bg-gray-50 border-r border-gray-200 p-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Apps</h2>
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 mb-3 hover:border-gray-300 transition-colors">
                        <img src="/api/placeholder/40/40" alt="App icon" className="rounded-xl" />
                        <div>
                            <div className="text-sm font-semibold text-gray-900">Intelligent CV: Resume Bui...</div>
                            <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                                iPhone •
                            </div>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 mt-4 text-sm font-medium text-gray-700 hover:text-gray-900">
                        <Plus size={18} />
                        Add App
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                        <div className="flex items-center gap-6">
                            <PlatformSelector
                                selectedPlatform={selectedPlatform}
                                selectedCountry={selectedCountry}
                                onPlatformChange={setSelectedPlatform}
                                onCountryChange={setSelectedCountry}
                            />
                            {/*<div className="flex items-center gap-2">*/}
                            {/*    <span className="text-sm font-semibold text-gray-900">Keywords</span>*/}
                            {/*    <img src="/api/placeholder/20/20" alt="US" className="rounded"/>*/}
                            {/*    <span className="text-sm font-medium text-gray-700">US</span>*/}
                            {/*</div>*/}

                            {/* Keyword Input */}
                            <input
                                type="text"
                                value={inputKeyword}
                                onChange={(e) => setInputKeyword(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && inputKeyword.trim()) {
                                        analyzeKeyword(inputKeyword.trim());
                                    }
                                }}
                                placeholder="Enter keyword..."
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium placeholder:text-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => inputKeyword.trim() && analyzeKeyword(inputKeyword.trim())}
                                disabled={loading || !inputKeyword.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus size={18} />
                                Add Keywords
                            </button>
                            <div className="flex items-center gap-3">
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Link size={20} />
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Settings size={20} />
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Search size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Keyword Table */}
                    <div className="flex-1 overflow-auto bg-gray-50">
                        <table className="w-full">
                            <thead>
                            <tr className="bg-white border-b border-gray-200">
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Keyword</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Notes</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Last update</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Popularity</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Difficulty</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Position</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Apps in Ranking</th>
                            </tr>
                            </thead>
                            <tbody>
                            {keywords.map((keyword, index) => (
                                <tr key={index} className="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-medium text-gray-900">{keyword.keyword}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        {keyword.notes?.map((note, i) => (
                                            <span
                                                key={i}
                                                className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block mr-1"
                                            />
                                        ))}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock size={16} />
                                            {keyword.lastUpdate}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <MetricBar value={keyword.popularity} color="bg-yellow-500" />
                                    </td>
                                    <td className="py-4 px-6">
                                        <MetricBar value={keyword.difficulty} color="bg-red-500" />
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900">#{keyword.position}</span>
                                            <span className="text-sm font-medium text-green-600">{keyword.trend}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <img
                                                        key={i}
                                                        src="/api/placeholder/28/28"
                                                        alt="Competitor app"
                                                        className="w-7 h-7 rounded-lg border-2 border-white"
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">+{keyword.competitors}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

}