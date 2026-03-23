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
    
    window[callbackName] = (data) => {
      // Clean up DOM and memory
      document.body.removeChild(script);
      delete window[callbackName];
      
      // Grab the pristine high-res Amazon S3 image URL IMDB natively generated
      if (data && data.d && data.d[0] && data.d[0].i) {
        resolve(data.d[0].i[0]); 
      } else {
        resolve(null);
      }
    };

    const script = document.createElement('script');
    script.onerror = () => {
        document.body.removeChild(script);
        delete window[callbackName];
        resolve(null);
    };
    script.src = `https://v2.sg.media-imdb.com/suggests/t/${imdbId}.json`;
    document.body.appendChild(script);
  });
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
  // Pass extended=full to Trakt directly so we get all missing info (Overview, Rating, etc)!
  const res = await fetch(`${TRAKT_BASE}/movies/trending?limit=20&page=${page}&extended=full`, {
    headers: TRAKT_HEADERS,
  });
  const totalResults = parseInt(res.headers.get("x-pagination-item-count") || "0", 10);
  const data = await res.json();
  const movies = await Promise.all(data.map((item) => enrichWithPoster(item.movie)));
  return { movies, totalResults };
};

export const searchMovies = async (query, page = 1) => {
  const res = await fetch(
    `${TRAKT_BASE}/search/movie?query=${encodeURIComponent(query)}&limit=20&page=${page}&extended=full`,
    { headers: TRAKT_HEADERS }
  );
  const totalResults = parseInt(res.headers.get("x-pagination-item-count") || "0", 10);
  const data = await res.json();
  const movies = await Promise.all(data.map((item) => enrichWithPoster(item.movie)));
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

