import { NextRequest, NextResponse } from 'next/server';
import { tmdbApi } from '@/lib/tmdb';

interface TMDBData {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  episode_run_time?: number[];
  genres?: Array<{ id: number; name: string }>;
}

// Map TMDB genre IDs to genre names
const GENRE_MAP: { [key: number]: string } = {
  28: 'Ação',
  12: 'Aventura',
  16: 'Animação',
  35: 'Comédia',
  80: 'Crime',
  99: 'Documentário',
  18: 'Drama',
  10751: 'Família',
  14: 'Fantasia',
  36: 'História',
  27: 'Terror',
  10402: 'Música',
  9648: 'Mistério',
  10749: 'Romance',
  878: 'Ficção Científica',
  10770: 'Cinema TV',
  53: 'Thriller',
  10752: 'Guerra',
  37: 'Western',
  // TV Genres
  10759: 'Ação & Aventura',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tmdbId = parseInt(id);

    if (isNaN(tmdbId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    // Get data from TMDB
    let tmdbData: TMDBData | null = null;
    let type: 'movie' | 'series' = 'movie';

    try {
      tmdbData = (await tmdbApi.getMovieDetails(tmdbId)) as TMDBData;
      type = 'movie';
    } catch {
      try {
        tmdbData = (await tmdbApi.getTVDetails(tmdbId)) as TMDBData;
        type = 'series';
      } catch {
        return NextResponse.json(
          { error: 'Title not found in TMDB' },
          { status: 404 },
        );
      }
    }

    // Transform TMDB genres to our format
    const genres = tmdbData.genres?.map((g) => GENRE_MAP[g.id] || g.name) || [];

    const response = {
      id: tmdbId,
      title: tmdbData.title || tmdbData.name || 'Título Desconhecido',
      description: tmdbData.overview || '',
      type: type,
      posterPath: tmdbData.poster_path,
      backdropPath: tmdbData.backdrop_path,
      tmdbRating: tmdbData.vote_average || 0,
      tmdbVoteCount: tmdbData.vote_count || 0,
      releaseYear: new Date(
        tmdbData.release_date || tmdbData.first_air_date || '2024-01-01',
      ).getFullYear(),
      runtime: tmdbData.runtime || tmdbData.episode_run_time?.[0] || null,
      genres: genres,
      ourRating: 0, // Temporary - will be implemented with proper database integration
      ourVoteCount: 0, // Temporary
      userVote: null, // Temporary
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get title details error:', error);
    return NextResponse.json(
      { error: 'Failed to get title details' },
      { status: 500 },
    );
  }
}
