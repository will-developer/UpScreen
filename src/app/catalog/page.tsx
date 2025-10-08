'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Star, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SearchBar } from '@/components/SearchBar';

interface CatalogItem {
  id: string;
  tmdbId: number;
  title: string;
  description: string;
  type: 'movie' | 'series';
  genre: string;
  releaseYear: number;
  rating: number;
  voteCount: number;
  tmdbRating: number;
  tmdbVoteCount: number;
  posterPath: string | null;
  backdropPath: string | null;
  genreIds: number[];
}

export default function CatalogPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [currentType, setCurrentType] = useState<'popular' | 'top_rated'>(
    'popular',
  );

  const genres = [
    { key: 'all', label: 'Todos os Gêneros' },
    { key: 'action', label: 'Ação' },
    { key: 'adventure', label: 'Aventura' },
    { key: 'animation', label: 'Animação' },
    { key: 'comedy', label: 'Comédia' },
    { key: 'crime', label: 'Crime' },
    { key: 'drama', label: 'Drama' },
    { key: 'fantasy', label: 'Fantasia' },
    { key: 'horror', label: 'Terror' },
    { key: 'mystery', label: 'Mistério' },
    { key: 'romance', label: 'Romance' },
    { key: 'thriller', label: 'Thriller' },
  ];

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/discover?type=${currentType}&genre=${selectedGenre}`,
      );
      if (response.ok) {
        const data = await response.json();
        setItems(data.results || []);
      } else {
        console.error('Error fetching items from API');
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [selectedGenre, currentType]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Catálogo de Filmes e Séries
        </h1>

        <div className="mb-6">
          <SearchBar />
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={currentType}
              onChange={(e) =>
                setCurrentType(e.target.value as 'popular' | 'top_rated')
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="popular">Populares</option>
              <option value="top_rated">Mais Bem Avaliados</option>
            </select>
          </div>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {genres.map((genre) => (
              <option key={genre.key} value={genre.key}>
                {genre.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/movie/${item.tmdbId}`}>
                <div className="aspect-[2/3] relative">
                  {item.posterPath ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <div className="text-center text-white p-4">
                        <Star className="w-12 h-12 mx-auto mb-2" />
                        <span className="text-sm font-medium">
                          {item.type === 'movie' ? 'Filme' : 'Série'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/movie/${item.tmdbId}`}>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 hover:text-orange-600 line-clamp-2">
                    {item.title}
                  </h3>
                </Link>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span className="capitalize">
                    {item.type === 'movie' ? 'Filme' : 'Série'}
                  </span>
                  <span>{item.releaseYear}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">
                      {item.tmdbRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({item.tmdbVoteCount})
                    </span>
                  </div>

                  {session && (
                    <Link
                      href={`/movie/${item.tmdbId}`}
                      className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                      Avaliar
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum título encontrado</p>
        </div>
      )}
    </div>
  );
}
