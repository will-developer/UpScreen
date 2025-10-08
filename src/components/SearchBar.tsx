'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { tmdbApi } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import { translations } from '@/lib/translations';

interface SearchResult {
  id: number;
  title: string;
  description: string;
  type: 'movie' | 'series';
  posterPath: string | null;
  tmdbRating: number;
  releaseYear: number;
  genreIds: number[];
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
        );
        const data = await response.json();

        if (data.results) {
          setResults(data.results.slice(0, 8)); // Limit to 8 results
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar filmes, séries, desenhos..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
        />
        {query && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={clearSearch}
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
            >
              <X />
            </button>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Carregando...
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/movie/${result.id}`}
                  className="block px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {result.posterPath ? (
                        <Image
                          src={
                            tmdbApi.getImageUrl(result.posterPath, 'w92') || ''
                          }
                          alt={result.title}
                          width={40}
                          height={60}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-15 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize">
                          {result.type === 'movie'
                            ? translations.movie
                            : translations.series}
                        </span>
                        <span>•</span>
                        <span>{result.releaseYear}</span>
                        {result.tmdbRating > 0 && (
                          <>
                            <span>•</span>
                            <span>⭐ {result.tmdbRating.toFixed(1)}</span>
                          </>
                        )}
                      </div>
                      {result.description && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {result.description.slice(0, 80)}...
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              <div className="px-4 py-2 text-xs text-gray-500 text-center border-t">
                Pressione Enter para ver todos os resultados
              </div>
            </>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Nenhum título encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
}
