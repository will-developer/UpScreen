// TMDB API configuration
export const TMDB_API_KEY =
  process.env.TMDB_API_KEY ||
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNTZlNzVmNmJiNDhiZTAxMTY2MzRhOGYxM2Y1MTc5MSIsIm5iZiI6MTc1ODkwNDM4MC4yMjgsInN1YiI6IjY4ZDZjMDNjNzBmY2I4MjlhNTY4YjAxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6-rhwbquxDRftaHBWTUaOiOuwZXgx6S0xiLea4s6_kk';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  adult: boolean;
  original_language: string;
  popularity: number;
  video: boolean;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  adult: boolean;
  original_language: string;
  popularity: number;
  origin_country: string[];
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export class TMDBApi {
  private baseUrl = TMDB_BASE_URL;
  private apiKey = TMDB_API_KEY;

  private async fetchFromTMDB<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}${
      endpoint.includes('?') ? '&' : '?'
    }language=pt-BR`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Get popular movies
  async getPopularMovies(page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchFromTMDB<TMDBResponse<TMDBMovie>>(
      `/movie/popular?page=${page}`,
    );
  }

  // Get popular TV shows
  async getPopularTVShows(page = 1): Promise<TMDBResponse<TMDBTVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TMDBTVShow>>(
      `/tv/popular?page=${page}`,
    );
  }

  // Get top rated movies
  async getTopRatedMovies(page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchFromTMDB<TMDBResponse<TMDBMovie>>(
      `/movie/top_rated?page=${page}`,
    );
  }

  // Get top rated TV shows
  async getTopRatedTVShows(page = 1): Promise<TMDBResponse<TMDBTVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TMDBTVShow>>(
      `/tv/top_rated?page=${page}`,
    );
  }

  // Search movies and TV shows
  async searchMulti(
    query: string,
    page = 1,
  ): Promise<TMDBResponse<TMDBMovie | TMDBTVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TMDBMovie | TMDBTVShow>>(
      `/search/multi?query=${encodeURIComponent(query)}&page=${page}`,
    );
  }

  // Get movie genres
  async getMovieGenres(): Promise<{ genres: TMDBGenre[] }> {
    return this.fetchFromTMDB<{ genres: TMDBGenre[] }>('/genre/movie/list');
  }

  // Get TV genres
  async getTVGenres(): Promise<{ genres: TMDBGenre[] }> {
    return this.fetchFromTMDB<{ genres: TMDBGenre[] }>('/genre/tv/list');
  }

  // Discover movies by genre
  async discoverMoviesByGenre(
    genreId: number,
    page = 1,
  ): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchFromTMDB<TMDBResponse<TMDBMovie>>(
      `/discover/movie?with_genres=${genreId}&page=${page}`,
    );
  }

  // Discover TV shows by genre
  async discoverTVByGenre(
    genreId: number,
    page = 1,
  ): Promise<TMDBResponse<TMDBTVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TMDBTVShow>>(
      `/discover/tv?with_genres=${genreId}&page=${page}`,
    );
  }

  // Get movie details
  async getMovieDetails(movieId: number) {
    return this.fetchFromTMDB(`/movie/${movieId}`);
  }

  // Get TV show details
  async getTVDetails(tvId: number) {
    return this.fetchFromTMDB(`/tv/${tvId}`);
  }

  // Helper method to get full image URL
  getImageUrl(path: string | null, size = 'w500'): string | null {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}

export const tmdbApi = new TMDBApi();
