import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom";
import { searchMovies, getPopularMovies } from "../services/api";
import '../css/Home.css';

// Global cache for Home page to persist data and scroll position across unmounts
const homeCache = {
    movies: [],
    page: 1,
    queryParam: null,
    scrollY: 0
};

function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get("q") || "";

    // Check if we can safely restore from cache
    const isMatch = homeCache.queryParam === queryParam && homeCache.movies.length > 0;

    const [searchInput, setSearchInput] = useState(queryParam);
    const [movies, setMovies] = useState(isMatch ? homeCache.movies : []);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(!isMatch);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(isMatch ? homeCache.page : 1);

    const initialMountCached = useRef(isMatch);

    // Sync input with the URL query parameter (handles back button or clicking Home nav)
    useEffect(() => {
        setSearchInput(queryParam);
        // Reset page if it's a completely new search (not a cache restoration)
        if (queryParam !== homeCache.queryParam) {
            setPage(1);
        }
    }, [queryParam]);

    // Save state to cache
    useEffect(() => {
        homeCache.movies = movies;
        homeCache.page = page;
        homeCache.queryParam = queryParam;
    }, [movies, page, queryParam]);

    // Infinite scroll listener & Scroll restoration
    useEffect(() => {
        if (initialMountCached.current) {
            // Restore scroll after a microscopic delay to ensure the browser has painted the DOM
            setTimeout(() => {
                window.scrollTo(0, homeCache.scrollY);
            }, 0);
        }

        const handleScroll = () => {
            homeCache.scrollY = window.scrollY; // Constantly track the user's scroll position

            // Check if user is near bottom
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
                if (!loading && !loadingMore) {
                    setPage(prev => prev + 1);
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, loadingMore]);

    // Fetch movies when query or page changes
    useEffect(() => {
        // Skip the very first fetch IF we successfully restored from memory cache
        if (initialMountCached.current) {
            initialMountCached.current = false;
            return; 
        }

        const fetchMovies = async () => {
            if (page === 1) setLoading(true);
            else setLoadingMore(true);
            setError(null);
            
            try {
                const results = queryParam 
                    ? await searchMovies(queryParam, page) 
                    : await getPopularMovies(page);
                    
                setMovies(prev => page === 1 ? results : [...prev, ...results]);
            } catch (err) {
                console.log(err);
                setError("Failed to load movies....");
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };
        fetchMovies();
    }, [queryParam, page]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchInput.trim()) {
            setSearchParams({});
        } else {
            setSearchParams({ q: searchInput });
        }
    };

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="search for movies..."
                    className="search-input"
                    value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                        if (e.target.value === "") {
                            setSearchParams({});
                        }
                    }}
                />
                <button className="search-btn" type="submit">search</button>
            </form>

            {error && <p>{error}</p>}

            {/* Display skeletons if loading first page, otherwise display movies */}
            {loading ? (
                <div className="movies-grid">
                    {[...Array(8)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : (
                <div className="movies-grid">
                    {movies.map((movie, index) =>
                        <MovieCard key={`${movie.id}-${index}`} movie={movie} />
                    )}
                </div>
            )}
            
            {loadingMore && (
                <div className="movies-grid">
                    {[...Array(4)].map((_, i) => (
                        <SkeletonCard key={`more-${i}`} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home;