import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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

// Simulando dados de votos em memória (será substituído pelo banco de dados)
const mockVotes: {
  [titleId: string]: {
    ratings: number[];
    userVotes: { [userId: string]: number };
  };
} = {};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Get TMDB data first
    let tmdbData: TMDBData | null = null;
    let isMovie = true;

    try {
      // First try as a movie
      tmdbData = (await tmdbApi.getMovieDetails(parseInt(id))) as TMDBData;
    } catch {
      try {
        // If not a movie, try as a TV show
        tmdbData = (await tmdbApi.getTVDetails(parseInt(id))) as TMDBData;
        isMovie = false;
      } catch {
        return NextResponse.json({ error: 'Title not found' }, { status: 404 });
      }
    }

    if (!tmdbData) {
      return NextResponse.json({ error: 'Title not found' }, { status: 404 });
    }

    // Initialize mock votes if not exists
    if (!mockVotes[id]) {
      mockVotes[id] = { ratings: [], userVotes: {} };
    }

    // Check if current user has voted
    const session = await getServerSession(authOptions);
    let userVote = null;

    if (session?.user?.email) {
      userVote = mockVotes[id].userVotes[session.user.email] || null;
    }

    // Calculate average rating from mock data
    const ratings = mockVotes[id].ratings;
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) /
          ratings.length
        : 0;

    // Prepare genres
    const genres =
      tmdbData.genres?.map(
        (g: { id: number; name: string }) => GENRE_MAP[g.id] || g.name,
      ) || [];

    return NextResponse.json({
      id: tmdbData.id,
      title: tmdbData.title || tmdbData.name,
      overview: tmdbData.overview,
      posterPath: tmdbData.poster_path,
      backdropPath: tmdbData.backdrop_path,
      releaseDate: tmdbData.release_date || tmdbData.first_air_date,
      tmdbRating: tmdbData.vote_average,
      tmdbVoteCount: tmdbData.vote_count,
      userRating: averageRating,
      totalVotes: ratings.length,
      userVote,
      runtime: tmdbData.runtime || tmdbData.episode_run_time?.[0],
      genres,
      type: isMovie ? 'movie' : 'tv',
    });
  } catch (error) {
    console.error('Error fetching title:', error);
    return NextResponse.json(
      { error: 'Failed to fetch title' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { rating } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 },
      );
    }

    // Initialize mock votes if not exists
    if (!mockVotes[id]) {
      mockVotes[id] = { ratings: [], userVotes: {} };
    }

    // Check if user already voted
    const previousVote = mockVotes[id].userVotes[session.user.email];

    if (previousVote) {
      // Update existing vote
      const index = mockVotes[id].ratings.indexOf(previousVote);
      if (index > -1) {
        mockVotes[id].ratings[index] = rating;
      }
    } else {
      // Add new vote
      mockVotes[id].ratings.push(rating);
    }

    // Update user vote
    mockVotes[id].userVotes[session.user.email] = rating;

    // Calculate new average
    const ratings = mockVotes[id].ratings;
    const averageRating =
      ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length;

    return NextResponse.json({
      success: true,
      userVote: rating,
      averageRating,
      totalVotes: ratings.length,
    });
  } catch (error) {
    console.error('Error updating vote:', error);
    return NextResponse.json(
      { error: 'Failed to update vote' },
      { status: 500 },
    );
  }
}
