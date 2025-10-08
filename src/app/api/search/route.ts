import { NextRequest, NextResponse } from 'next/server';
import { tmdbApi } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 },
      );
    }

    const results = await tmdbApi.searchMulti(query, page);

    // Transform results to match our Title format
    const transformedResults = results.results.map((item) => {
      const isMovie = 'title' in item;
      return {
        id: item.id,
        title: isMovie ? item.title : item.name,
        description: item.overview,
        type: isMovie ? 'movie' : 'series',
        genre: 'Drama', // We'll map this properly later
        releaseYear:
          new Date(
            (isMovie ? item.release_date : item.first_air_date) || '',
          ).getFullYear() || 2024,
        rating: 0, // Our internal rating
        voteCount: 0, // Our internal vote count
        tmdbRating: item.vote_average,
        tmdbVoteCount: item.vote_count,
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        genreIds: item.genre_ids,
      };
    });

    return NextResponse.json({
      results: transformedResults,
      page: results.page,
      totalPages: results.total_pages,
      totalResults: results.total_results,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search titles' },
      { status: 500 },
    );
  }
}
