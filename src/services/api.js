const TRAKT_KEY = import.meta.env.VITE_TRAKT_API_KEY;

const TRAKT_BASE = "https://api.trakt.tv";
const TRAKT_HEADERS = {
  "trakt-api-key": TRAKT_KEY,
  "trakt-api-version": "2",
  "Content-Type": "application/json",
};

// -------------------------------------------------------------
// INCREDIBLE HACK: Bypassing OMDB completely for infinite limits!
// Uses IMDB's native auto-suggest internal JSONP API to fetch flawless high-res posters without CORS.
// -------------------------------------------------------------
const getImdbPosterJsonp = (imdbId) => {
  return new Promise((resolve) => {
    if (!imdbId) return resolve(null);
    const callbackName = `imdb$${imdbId}`;

    // Auto-resolve as null after 4 seconds to prevent stuck requests
    const timeout = setTimeout(() => {
      if (window[callbackName]) {
        delete window[callbackName];
        if (script.parentNode) document.body.removeChild(script);
        resolve(null);
      }
    }, 4000);
    
    window[callbackName] = (data) => {
      clearTimeout(timeout);
      if (script.parentNode) document.body.removeChild(script);
      delete window[callbackName];
      if (data && data.d && data.d[0] && data.d[0].i) {
        resolve(data.d[0].i[0]); 
      } else {
        resolve(null);
      }
    };

    const script = document.createElement('script');
    script.onerror = () => {
      clearTimeout(timeout);
      if (script.parentNode) document.body.removeChild(script);
      delete window[callbackName];
      resolve(null);
    };
    script.src = `https://v2.sg.media-imdb.com/suggests/t/${imdbId}.json`;
    document.body.appendChild(script);
  });
};

// Run enrichWithPoster in small concurrent batches to avoid flooding IMDB JSONP
const batchEnrich = async (movies, batchSize = 5) => {
  const results = [];
  for (let i = 0; i < movies.length; i += batchSize) {
    const batch = movies.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(enrichWithPoster));
    results.push(...batchResults);
  }
  return results;
};

const enrichWithPoster = async (movie) => {
  const imdbId = movie.ids?.imdb;
  // Fetch pristine, infinite-limit poster from internal IMDB endpoint:
  const poster_path = await getImdbPosterJsonp(imdbId);

  return {
    ...movie,
    id: movie.ids?.trakt,
    title: movie.title,
    overview: movie.overview || "",
    release_date: movie.released || "",
    vote_average: movie.rating || 0,
    popularity: movie.votes || 0,
    poster_path: poster_path,
    genre_ids: movie.genres || [],
  };
};

export const getPopularMovies = async (page = 1) => {
  const res = await fetch(`${TRAKT_BASE}/movies/trending?limit=20&page=${page}&extended=full`, {
    headers: TRAKT_HEADERS,
  });
  const totalResults = parseInt(res.headers.get("x-pagination-item-count") || "0", 10);
  const data = await res.json();
  const movies = await batchEnrich(data.map((item) => item.movie));
  return { movies, totalResults };
};

export const searchMovies = async (query, page = 1) => {
  const res = await fetch(
    `${TRAKT_BASE}/search/movie?query=${encodeURIComponent(query)}&limit=20&page=${page}&extended=full`,
    { headers: TRAKT_HEADERS }
  );
  const totalResults = parseInt(res.headers.get("x-pagination-item-count") || "0", 10);
  const data = await res.json();
  const movies = await batchEnrich(data.map((item) => item.movie));
  return { movies, totalResults };
};

export const getMovieDetails = async (id) => {
  const res = await fetch(`${TRAKT_BASE}/movies/${id}?extended=full`, {
    headers: TRAKT_HEADERS,
  });
  const data = await res.json();
  return enrichWithPoster(data);
};

export const getMovieCast = async (id) => {
  const res = await fetch(`${TRAKT_BASE}/movies/${id}/people`, {
    headers: TRAKT_HEADERS,
  });
  const data = await res.json();
  return data.cast || [];
};

// Recently released movies via Trakt calendar (30-day windows, paged backwards)
export const getTrendingMovies = async (page = 1) => {
  const daysPerPage = 30;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - (page - 1) * daysPerPage);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - daysPerPage);
  const startStr = startDate.toISOString().split('T')[0];

  const res = await fetch(
    `${TRAKT_BASE}/calendars/all/movies/${startStr}/${daysPerPage}?extended=full`,
    { headers: TRAKT_HEADERS }
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return [];

  // Sort newest first, deduplicate by trakt id
  const seen = new Set();
  const unique = data
    .sort((a, b) => new Date(b.released) - new Date(a.released))
    .filter(item => {
      const id = item.movie?.ids?.trakt;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });

  return batchEnrich(unique.map(item => item.movie));
};

// Highest rated movies via Trakt popular (sorted by rating desc client-side)
export const getTopRatedMovies = async (page = 1) => {
  const res = await fetch(
    `${TRAKT_BASE}/movies/popular?limit=20&page=${page}&extended=full`,
    { headers: TRAKT_HEADERS }
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return [];

  // Sort by rating descending so highest rated appear first
  const sorted = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return batchEnrich(sorted);
};

