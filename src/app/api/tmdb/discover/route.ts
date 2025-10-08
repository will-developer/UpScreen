import { NextRequest, NextResponse } from 'next/server';
import { tmdbApi, TMDBMovie, TMDBTVShow } from '@/lib/tmdb';

// Mapeamento de gêneros para IDs do TMDB
const genreToIds: { [key: string]: number[] } = {
  action: [28],
  adventure: [12],
  animation: [16],
  comedy: [35],
  crime: [80],
  drama: [18],
  fantasy: [14],
  horror: [27],
  mystery: [9648],
  romance: [10749],
  thriller: [53],
};

// Tradução de gêneros
const genreTranslations: { [key: number]: string } = {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'popular';
    const genre = searchParams.get('genre') || 'all';

    let response;

    // Se há filtro de gênero específico, usar discover
    if (genre !== 'all' && genreToIds[genre]) {
      const genreId = genreToIds[genre][0]; // Usar o primeiro ID do gênero
      if (type === 'popular') {
        response = await tmdbApi.discoverMoviesByGenre(genreId);
      } else {
        response = await tmdbApi.discoverMoviesByGenre(genreId);
      }
    } else {
      // Sem filtro de gênero, usar endpoints normais
      if (type === 'popular') {
        response = await tmdbApi.getPopularMovies();
      } else if (type === 'top_rated') {
        response = await tmdbApi.getTopRatedMovies();
      } else {
        response = await tmdbApi.getPopularMovies();
      }
    }

    const tmdbResults = response.results;

    // Transformar dados para o formato esperado
    const transformedResults = tmdbResults.map(
      (item: TMDBMovie | TMDBTVShow) => {
        const genres =
          item.genre_ids?.map(
            (id: number) => genreTranslations[id] || 'Desconhecido',
          ) || [];

        // Determinar se é filme ou série e extrair dados corretos
        const isMovie = 'title' in item;
        const title = isMovie
          ? (item as TMDBMovie).title
          : (item as TMDBTVShow).name;
        const releaseDate = isMovie
          ? (item as TMDBMovie).release_date
          : (item as TMDBTVShow).first_air_date;

        return {
          id: item.id.toString(),
          tmdbId: item.id,
          title: title || 'Título desconhecido',
          description: item.overview || 'Sem descrição disponível',
          type: isMovie ? ('movie' as const) : ('series' as const),
          genre: genres[0] || 'Desconhecido',
          releaseYear: releaseDate ? new Date(releaseDate).getFullYear() : 2024,
          rating: 0,
          voteCount: 0,
          tmdbRating: item.vote_average,
          tmdbVoteCount: item.vote_count,
          posterPath: item.poster_path,
          backdropPath: item.backdrop_path,
          genreIds: item.genre_ids || [],
        };
      },
    );

    return NextResponse.json({
      results: transformedResults,
      total_pages: response.total_pages,
      total_results: response.total_results,
    });
  } catch (error) {
    console.error('Error fetching TMDB discover:', error);
    return NextResponse.json(
      { error: 'Failed to fetch titles' },
      { status: 500 },
    );
  }
}
