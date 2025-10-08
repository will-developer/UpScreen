'use client';

import { useState, useEffect } from 'react';
import { Star, Medal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TopTitle {
  id: number;
  name: string;
  description: string;
  genre: string;
  voteCount: number;
  rating: number;
  imageUrl?: string;
  posterPath?: string;
}

export function TopTitles() {
  const [titles, setTitles] = useState<TopTitle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopTitles();
  }, []);

  const fetchTopTitles = async () => {
    try {
      const response = await fetch('/api/discover?type=top_rated');
      const data = await response.json();
      
      const transformedTitles = data.results?.slice(0, 6).map((item: {
        tmdbId: number;
        title: string;
        description: string;
        genre: string;
        tmdbVoteCount: number;
        tmdbRating: number;
        posterPath: string;
      }) => ({
        id: item.tmdbId,
        name: item.title,
        description: item.description,
        genre: item.genre,
        voteCount: item.tmdbVoteCount,
        rating: item.tmdbRating,
        posterPath: item.posterPath,
      })) || [];
      
      setTitles(transformedTitles);
    } catch (error) {
      console.error('Error fetching top titles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Medal className="text-yellow-500" size={20} />;
    if (index === 1) return <Medal className="text-gray-400" size={20} />;
    if (index === 2) return <Medal className="text-amber-600" size={20} />;
    return (
      <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {titles.map((title, index) => (
        <Link
          key={title.id}
          href={`/movie/${title.id}`}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
        >
          <div className="relative">
            {title.posterPath ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${title.posterPath}`}
                alt={title.name}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <Star className="text-gray-400" size={48} />
              </div>
            )}
            <div className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md">
              {getRankIcon(index)}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {title.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                {title.genre}
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star size={16} className="text-yellow-500 fill-current" />
                <span>{title.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}