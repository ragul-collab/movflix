const TRAKT_KEY = import.meta.env.VITE_TRAKT_API_KEY;
const OMDB_KEY = import.meta.env.VITE_OMDB_API_KEY;

const TRAKT_BASE = "https://api.trakt.tv";
const TRAKT_HEADERS = {
  "trakt-api-key": TRAKT_KEY,
  "trakt-api-version": "2",
  "Content-Type": "application/json",
};

const enrichWithPoster = async (movie) => {
  const imdbId = movie.ids?.imdb;
  try {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_KEY}`);
    const data = await res.json();
    return {
      id: movie.ids?.trakt,
      title: movie.title,
      overview: movie.overview || data.Plot || "",
      release_date: movie.released || data.Year || "",
      vote_average: parseFloat(data.imdbRating) || 0,
      popularity: movie.votes || 0,
      poster_path: data.Poster !== "N/A" ? data.Poster : null,
      genre_ids: data.Genre ? data.Genre.split(", ") : [],
    };
  } catch {
    return {
      id: movie.ids?.trakt,
      title: movie.title,
      overview: movie.overview || "",
      release_date: movie.released || "",
      vote_average: 0,
      popularity: 0,
      poster_path: null,
      genre_ids: [],
    };
  }
};

export const getPopularMovies = async () => {
  const res = await fetch(`${TRAKT_BASE}/movies/trending?limit=20`, {
    headers: TRAKT_HEADERS,
  });
  const data = await res.json();
  return Promise.all(data.map((item) => enrichWithPoster(item.movie)));
};

export const searchMovies = async (query) => {
  const res = await fetch(
    `${TRAKT_BASE}/search/movie?query=${encodeURIComponent(query)}&limit=20`,
    { headers: TRAKT_HEADERS }
  );
  const data = await res.json();
  return Promise.all(data.map((item) => enrichWithPoster(item.movie)));
};

