import { NextRequest, NextResponse } from 'next/server';
import { tmdbApi } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'popular'; // popular, top_rated, discover
    const genre = searchParams.get('genre');
    const page = parseInt(searchParams.get('page') || '1');

    let moviesResponse;
    let tvResponse;

    if (type === 'popular') {
      moviesResponse = await tmdbApi.getPopularMovies(page);
      tvResponse = await tmdbApi.getPopularTVShows(page);
    } else if (type === 'top_rated') {
      moviesResponse = await tmdbApi.getTopRatedMovies(page);
      tvResponse = await tmdbApi.getTopRatedTVShows(page);
    } else if (type === 'discover' && genre) {
      const genresResponse = await tmdbApi.getMovieGenres();
      const genreObj = genresResponse.genres.find(
        (g) => g.name.toLowerCase() === genre.toLowerCase(),
      );

      if (genreObj) {
        moviesResponse = await tmdbApi.discoverMoviesByGenre(genreObj.id, page);
        tvResponse = await tmdbApi.discoverTVByGenre(genreObj.id, page);
      } else {
        moviesResponse = await tmdbApi.getPopularMovies(page);
        tvResponse = await tmdbApi.getPopularTVShows(page);
      }
    } else {
      moviesResponse = await tmdbApi.getPopularMovies(page);
      tvResponse = await tmdbApi.getPopularTVShows(page);
    }

    // Combine and transform results
    const allResults = [
      ...moviesResponse.results.map((movie) => ({
        id: `movie-${movie.id}`,
        tmdbId: movie.id,
        title: movie.title,
        description: movie.overview,
        type: 'movie' as const,
        genre: 'Drama', // We'll improve this mapping
        releaseYear: new Date(movie.release_date || '').getFullYear() || 2024,
        rating: 0,
        voteCount: 0,
        tmdbRating: movie.vote_average,
        tmdbVoteCount: movie.vote_count,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        genreIds: movie.genre_ids,
      })),
      ...tvResponse.results.map((tv) => ({
        id: `tv-${tv.id}`,
        tmdbId: tv.id,
        title: tv.name,
        description: tv.overview,
        type: 'series' as const,
        genre: 'Drama', // We'll improve this mapping
        releaseYear: new Date(tv.first_air_date || '').getFullYear() || 2024,
        rating: 0,
        voteCount: 0,
        tmdbRating: tv.vote_average,
        tmdbVoteCount: tv.vote_count,
        posterPath: tv.poster_path,
        backdropPath: tv.backdrop_path,
        genreIds: tv.genre_ids,
      })),
    ];

    // Sort by TMDB rating
    allResults.sort((a, b) => b.tmdbRating - a.tmdbRating);

    return NextResponse.json({
      results: allResults.slice(0, 20), // Limit to 20 results
      page,
      hasMore: true,
    });
  } catch (error) {
    console.error('TMDB API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch titles from TMDB' },
      { status: 500 },
    );
  }
}
