"use client";
import {useState} from 'react';
import {Calendar, Loader, Search, Star, ThumbsUp} from 'lucide-react';
import type {Review} from '@/types/review';
import {AppMetadata} from "@/lib/ITunesReviewScraper";

const countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'de', name: 'Germany', flag: '🇩🇪' },
    { code: 'nl', name: 'Netherlands', flag: '🇳🇱' }, // Fixed Netherlands flag
    { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' }, // Fixed UK flag
    { code: 'fr', name: 'France', flag: '🇫🇷' },
    { code: 'it', name: 'Italy', flag: '🇮🇹' },
    { code: 'es', name: 'Spain', flag: '🇪🇸' },
    { code: 'jp', name: 'Japan', flag: '🇯🇵' },
    { code: 'kr', name: 'South Korea', flag: '🇰🇷' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'br', name: 'Brazil', flag: '🇧🇷' },
    { code: 'cn', name: 'China', flag: '🇨🇳' },
    { code: 'in', name: 'India', flag: '🇮🇳' }
];

export default function LiveReviewsList() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [appId, setAppId] = useState<string>('1576857102');
    const [selectedCountry, setSelectedCountry] = useState<string>('us');
    const [metadata, setMetadata] = useState<AppMetadata | null>(null);
    const extractNumericId = (input: string): string => {
        // Remove any 'id' prefix and extract only numbers
        return input.replace(/^id/i, '').match(/\d+/)?.[0] || '';
    };

    const fetchReviews = async (): Promise<void> => {
        setLoading(true);
        setError('');
        try {
            const numericId = extractNumericId(appId);
            if (!numericId) {
                setError('Please enter a valid App Store ID');
                setLoading(false);
                return;
            }

            const response = await fetch(`/api/?appId=${numericId}&country=${selectedCountry}`);
            const data = await response.json();
            if ('error' in data) {
                setError(data.error);
            } else {
                setReviews(data.reviews);
                setMetadata(data.metadata);
            }
        } catch (error) {
            setError('Failed to fetch reviews');
        }
        setLoading(false);
    };
    const filteredReviews = reviews.filter(review => {
        const matchesSearch = (review.content.text?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
            review.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = selectedRating === 0 || review.rating === selectedRating;
        return matchesSearch && matchesRating;
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* Header */}
            <div className="bg-white shadow-sm mb-6">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">App Store Reviews</h1>

                    <div className="mt-4 flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Enter App Store ID"
                                value={appId}
                                onChange={(e) => setAppId(e.target.value)}
                                className="px-4 py-2 border rounded-lg w-full text-black"
                            />
                        </div>
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="px-4 py-2 border rounded-lg text-gray-600"
                        >
                            {countries.map((country) => (
                                <option
                                    key={country.code}
                                    value={country.code}
                                    className="flex items-center gap-2"
                                >
                                    {`${country.flag}  ${country.code.toUpperCase()}`}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={fetchReviews}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2"
                        >
                            {loading && <Loader className="animate-spin" size={20}/>}
                            {loading ? 'Fetching Reviews...' : 'Fetch Reviews'}
                        </button>
                        {reviews.length > 0 && (
                            <span className="text-gray-600">
                                Found {reviews.length} reviews
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4">

                {metadata && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex items-start space-x-6">
                            {/* App Icon */}
                            <img
                                src={metadata.icon}
                                alt={`${metadata.name} icon`}
                                className="w-24 h-24 rounded-xl"
                            />

                            {/* App Info */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900">{metadata.name}</h2>
                                <p className="text-gray-600">{metadata.developer}</p>
                                <div className="flex items-center mt-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`${
                                                    i < Math.round(metadata.rating)
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-200'
                                                }`}
                                                size={20}
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-gray-600">{metadata.rating.toFixed(1)}</span>
                                    <span className="ml-4 text-gray-600">Version {metadata.version}</span>
                                </div>
                            </div>
                        </div>

                        {/* Screenshots */}
                        {metadata.screenshots.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Screenshots</h3>
                                <div className="flex space-x-4 overflow-x-auto pb-4">
                                    {metadata.screenshots.map((screenshot, index) => (
                                        <img
                                            key={index}
                                            src={screenshot}
                                            alt={`${metadata.name} screenshot ${index + 1}`}
                                            className="h-72 rounded-xl shadow-sm"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 whitespace-pre-line">{metadata.description}</p>
                        </div>
                    </div>
                )}
                {/* Filters */}
                {reviews.length > 0 && (
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 text-gray-600" size={20}/>
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg text-black"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 border rounded-lg text-gray-400"
                            value={selectedRating}
                            onChange={(e) => setSelectedRating(Number(e.target.value))}
                        >
                            <option value={0}>All Ratings</option>
                            {[5, 4, 3, 2, 1].map(rating => (
                                <option key={rating} value={rating}>{rating} Stars</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                    {filteredReviews.map(review => (
                        <div key={review.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg text-gray-600">{review.title}</h3>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                                            size={20}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="text-gray-600 mb-4">{review.content.text}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <Calendar size={16} className="mr-1" />
                                    {new Date(review.updated).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                    <ThumbsUp size={16} className="mr-1" />
                                    {review.voteSum}
                                </div>
                                <div>Version: {review.version}</div>
                                <div>By: {review.author.name}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {!loading && reviews.length === 0 && !error && (
                    <div className="text-center text-gray-500 py-12">
                        Enter an App Store ID and click &#34;Fetch Reviews&#34; to begin
                    </div>
                )}
            </div>
        </div>
    );
}