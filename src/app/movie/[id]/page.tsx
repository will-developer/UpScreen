'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Star, Clock, Calendar } from 'lucide-react';
import Image from 'next/image';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  tmdbRating: number;
  tmdbVoteCount: number;
  releaseDate: string;
  runtime?: number;
  genres: string[];
  type: 'movie' | 'tv';
  userRating?: number;
  totalVotes?: number;
  userVote?: number;
}

export default function MovieDetailsPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchMovieDetails(params.id as string);
    }
  }, [params.id]);

  const fetchMovieDetails = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/movies/${id}`);
      const data = await response.json();
      setMovie(data);
      setUserVote(data.userVote || null);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (rating: number) => {
    if (!session) {
      alert('Você precisa estar logado para votar!');
      return;
    }

    try {
      const response = await fetch(`/api/movies/${params.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });

      if (response.ok) {
        const result = await response.json();
        setUserVote(result.userVote);

        if (movie) {
          setMovie({
            ...movie,
            userRating: result.averageRating,
            totalVotes: result.totalVotes,
          });
        }

        alert(`Voto registrado: ${rating} estrelas!`);
      } else {
        alert('Erro ao votar. Tente novamente.');
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Erro ao votar. Tente novamente.');
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isHovered = hoveredStar !== null && starValue <= hoveredStar;
      const isSelected = userVote !== null && starValue <= userVote;

      return (
        <button
          key={starValue}
          onClick={() => handleVote(starValue)}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(null)}
          disabled={!session}
          className={`w-8 h-8 transition-colors ${
            !session
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer hover:scale-110'
          }`}
        >
          <Star
            className={`w-full h-full transition-colors ${
              isHovered || isSelected
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Filme não encontrado
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {movie.backdropPath && (
        <div className="relative h-96 w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-semibold">
                  {movie.tmdbRating.toFixed(1)}
                </span>
                <span className="text-sm opacity-75">
                  ({movie.tmdbVoteCount} votos)
                </span>
              </div>
              {movie.runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{movie.runtime} min</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {movie.posterPath && (
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sinopse</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {movie.overview || 'Sinopse não disponível.'}
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gêneros
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Sua Avaliação
                </h3>
                {session ? (
                  <div>
                    <div className="flex gap-1 mb-4">{renderStars()}</div>
                    {userVote && (
                      <p className="text-sm text-gray-600">
                        Você avaliou com {userVote} estrelas
                      </p>
                    )}
                    {movie.totalVotes && movie.totalVotes > 0 && (
                      <p className="text-sm text-gray-600">
                        Média da comunidade: {movie.userRating?.toFixed(1)}{' '}
                        estrelas ({movie.totalVotes} votos)
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Faça login para avaliar este filme
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
