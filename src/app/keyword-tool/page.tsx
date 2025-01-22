'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Search, Settings, Link, HelpCircle, Clock } from 'lucide-react';
import type { KeywordData } from '@/types/apptweak';

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

    const analyzeKeyword = useCallback(async (keyword: string) => {
        setLoading(true);
        try {
            const response = await fetch('/api/keywords', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword })
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
    }, []);

    return (
        <div className="h-screen flex flex-col bg-white rounded-lg shadow overflow-hidden">
            {/* Window Controls */}
            <div className="flex gap-2 p-2">
                <div className="w-3 h-3 rounded-full bg-red-500"/>
                <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                <div className="w-3 h-3 rounded-full bg-green-500"/>
            </div>

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-64 bg-gray-100 border-r p-4">
                    <h2 className="text-sm font-medium mb-4">Apps</h2>
                    <div className="flex items-center gap-3 p-3 bg-gray-200 rounded-lg mb-2">
                        <img src="/api/placeholder/32/32" alt="App icon" className="rounded-xl" />
                        <div>
                            <div className="text-sm font-medium">Intelligent CV: Resume Bui...</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                iPhone •
                            </div>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                        <Plus size={16} />
                        Add App
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center gap-4">
                            {/*<PlatformSelector />*/}
                            <div className="flex items-center gap-2">
                                <span className="text-sm">Keywords</span>
                                <img src="/api/placeholder/16/16" alt="US" className="rounded" />
                                <span className="text-sm">US</span>
                            </div>

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
                                className="px-3 py-1 border rounded-md text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => inputKeyword.trim() && analyzeKeyword(inputKeyword.trim())}
                                disabled={loading || !inputKeyword.trim()}
                                className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-sm flex items-center gap-2 disabled:bg-gray-400"
                            >
                                <Plus size={16} />
                                Add Keywords
                            </button>
                            <div className="flex items-center gap-2">
                                <Link size={20} className="text-gray-600" />
                                <Settings size={20} className="text-gray-600" />
                                <Search size={20} className="text-gray-600" />
                            </div>
                        </div>
                    </div>

                    {/* Keyword Table */}
                    <div className="flex-1 overflow-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b">
                                <th className="text-left p-3 text-sm font-medium">Keyword</th>
                                <th className="text-left p-3 text-sm font-medium">Notes</th>
                                <th className="text-left p-3 text-sm font-medium">Last update</th>
                                <th className="text-left p-3 text-sm font-medium">Popularity</th>
                                <th className="text-left p-3 text-sm font-medium">Difficulty</th>
                                <th className="text-left p-3 text-sm font-medium">Position</th>
                                <th className="text-left p-3 text-sm font-medium">Apps in Ranking</th>
                            </tr>
                            </thead>
                            <tbody>
                            {keywords.map((keyword, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                        <span className="text-sm">{keyword.keyword}</span>
                                    </td>
                                    <td className="p-3">
                                        {keyword.notes?.map((note, i) => (
                                            <span
                                                key={i}
                                                className="w-2 h-2 rounded-full bg-purple-500 inline-block mr-1"
                                            />
                                        ))}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Clock size={14} />
                                            {keyword.lastUpdate}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <MetricBar value={keyword.popularity} color="bg-yellow-400" />
                                    </td>
                                    <td className="p-3">
                                        <MetricBar value={keyword.difficulty} color="bg-red-400" />
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">#{keyword.position}</span>
                                            <span className="text-xs text-green-500">{keyword.trend}</span>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <img
                                                        key={i}
                                                        src="/api/placeholder/24/24"
                                                        alt="Competitor app"
                                                        className="w-6 h-6 rounded-lg border-2 border-white"
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500">+{keyword.competitors}</span>
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