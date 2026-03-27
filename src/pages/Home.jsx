import MovieCard from "../components/MovieCard";
import MovieRow from "../components/MovieRow";
import SkeletonCard from "../components/SkeletonCard";
import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "react-router-dom";
import { searchMovies, getPopularMovies, getTrendingMovies, getTopRatedMovies } from "../services/api";
import '../css/Home.css';

// Global cache for Home page to persist data and scroll position across unmounts
const homeCache = {
    movies: [],
    page: 1,
    queryParam: null,
    scrollY: 0,
    totalResults: 0,
};

function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get("q") || "";

    const isMatch = homeCache.queryParam === queryParam && homeCache.movies.length > 0;

    const [searchInput, setSearchInput] = useState(queryParam);
    const [movies, setMovies] = useState(isMatch ? homeCache.movies : []);
    const [totalResults, setTotalResults] = useState(isMatch ? homeCache.totalResults : 0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(!isMatch);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(isMatch ? homeCache.page : 1);

    // ── Trending Now (Recent Releases) ──
    const [trendingMovies, setTrendingMovies]     = useState([]);
    const [trendingPage, setTrendingPage]         = useState(1);
    const [trendingLoading, setTrendingLoading]   = useState(true);
    const [trendingLoadMore, setTrendingLoadMore] = useState(false);
    const [trendingHasMore, setTrendingHasMore]   = useState(true);
    const trendingFetching = useRef(false);

    // ── Top Rated ──
    const [topRatedMovies, setTopRatedMovies]     = useState([]);
    const [topRatedPage, setTopRatedPage]         = useState(1);
    const [topRatedLoading, setTopRatedLoading]   = useState(true);
    const [topRatedLoadMore, setTopRatedLoadMore] = useState(false);
    const [topRatedHasMore, setTopRatedHasMore]   = useState(true);
    const topRatedFetching = useRef(false);

    const initialMountCached = useRef(isMatch);
    const isSearching = !!queryParam;

    // ── Fetch Trending page ──
    useEffect(() => {
        if (isSearching) return;
        if (trendingFetching.current) return;
        if (!trendingHasMore && trendingPage > 1) return;

        trendingFetching.current = true;
        const isFirst = trendingPage === 1;
        if (isFirst) setTrendingLoading(true);
        else setTrendingLoadMore(true);

        getTrendingMovies(trendingPage)
            .then(data => {
                if (data.length === 0) {
                    setTrendingHasMore(false);
                } else {
                    setTrendingMovies(prev => {
                        if (isFirst) return data;
                        const ids = new Set(prev.map(m => m.id));
                        return [...prev, ...data.filter(m => !ids.has(m.id))];
                    });
                }
            })
            .catch(() => setTrendingHasMore(false))
            .finally(() => {
                setTrendingLoading(false);
                setTrendingLoadMore(false);
                trendingFetching.current = false;
            });
    }, [trendingPage, isSearching]);

    // ── Fetch Top Rated page ──
    useEffect(() => {
        if (isSearching) return;
        if (topRatedFetching.current) return;
        if (!topRatedHasMore && topRatedPage > 1) return;

        topRatedFetching.current = true;
        const isFirst = topRatedPage === 1;
        if (isFirst) setTopRatedLoading(true);
        else setTopRatedLoadMore(true);

        getTopRatedMovies(topRatedPage)
            .then(data => {
                if (data.length === 0) {
                    setTopRatedHasMore(false);
                } else {
                    setTopRatedMovies(prev => {
                        if (isFirst) return data;
                        const ids = new Set(prev.map(m => m.id));
                        return [...prev, ...data.filter(m => !ids.has(m.id))];
                    });
                }
            })
            .catch(() => setTopRatedHasMore(false))
            .finally(() => {
                setTopRatedLoading(false);
                setTopRatedLoadMore(false);
                topRatedFetching.current = false;
            });
    }, [topRatedPage, isSearching]);

    // ── Load more callbacks for rows ──
    const handleTrendingLoadMore = useCallback(() => {
        if (!trendingFetching.current && trendingHasMore && !trendingLoadMore) {
            setTrendingPage(p => p + 1);
        }
    }, [trendingHasMore, trendingLoadMore]);

    const handleTopRatedLoadMore = useCallback(() => {
        if (!topRatedFetching.current && topRatedHasMore && !topRatedLoadMore) {
            setTopRatedPage(p => p + 1);
        }
    }, [topRatedHasMore, topRatedLoadMore]);

    // ── Sync URL query param ──
    useEffect(() => {
        setSearchInput(queryParam);
        if (queryParam !== homeCache.queryParam) setPage(1);
    }, [queryParam]);

    // ── Save to cache ──
    useEffect(() => {
        homeCache.movies = movies;
        homeCache.page = page;
        homeCache.queryParam = queryParam;
        homeCache.totalResults = totalResults;
    }, [movies, page, queryParam, totalResults]);

    // ── Infinite vertical scroll + scroll restoration ──
    useEffect(() => {
        if (initialMountCached.current) {
            setTimeout(() => window.scrollTo(0, homeCache.scrollY), 0);
        }

        const handleScroll = () => {
            homeCache.scrollY = window.scrollY;
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
                if (!loading && !loadingMore) setPage(prev => prev + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, loadingMore]);

    // ── Fetch popular/search movies ──
    useEffect(() => {
        if (initialMountCached.current) {
            initialMountCached.current = false;
            return;
        }

        const fetchMovies = async () => {
            if (page === 1) setLoading(true);
            else setLoadingMore(true);
            setError(null);

            try {
                const result = queryParam
                    ? await searchMovies(queryParam, page)
                    : await getPopularMovies(page);

                const { movies: newMovies, totalResults: total } = result;
                setTotalResults(total);
                setMovies(prev => {
                    if (page === 1) return newMovies;
                    const ids = new Set(prev.map(m => m.id));
                    return [...prev, ...newMovies.filter(m => !ids.has(m.id))];
                });
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
        if (!searchInput.trim()) setSearchParams({});
        else setSearchParams({ q: searchInput });
    };

    const handleClear = () => {
        setSearchInput("");
        setSearchParams({});
    };

    return (
        <div className="home">
            {/* ── SEARCH BAR ── */}
            <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Search for movies..."
                        className="search-input"
                        value={searchInput}
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                            if (e.target.value === "") setSearchParams({});
                        }}
                    />
                    {searchInput && (
                        <button type="button" className="search-clear-btn" onClick={handleClear} aria-label="Clear search">
                            ✕
                        </button>
                    )}
                </div>
                <button className="search-btn" type="submit">Search</button>
            </form>

            {/* ── SEARCH RESULTS COUNT ── */}
            {isSearching && !loading && (
                <p className="search-results-count">
                    {totalResults > 0
                        ? `Found ${totalResults.toLocaleString()} results for "${queryParam}"`
                        : `No results found for "${queryParam}"`}
                </p>
            )}

            {error && <p className="search-error">{error}</p>}

            {/* ── HOME ROWS: only when not searching ── */}
            {!isSearching && (
                <>
                    <MovieRow
                        title="New Releases"
                        icon="🎬"
                        movies={trendingMovies}
                        loading={trendingLoading}
                        loadingMore={trendingLoadMore}
                        onLoadMore={handleTrendingLoadMore}
                    />
                    <MovieRow
                        title="Top Rated"
                        icon="⭐"
                        movies={topRatedMovies}
                        loading={topRatedLoading}
                        loadingMore={topRatedLoadMore}
                        onLoadMore={handleTopRatedLoadMore}
                    />

                    <div className="section-divider">
                        <span className="section-divider-label">Popular Movies</span>
                    </div>
                </>
            )}

            {/* ── MOVIES GRID ── */}
            {loading ? (
                <div className="movies-grid">
                    {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
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
                    {[...Array(4)].map((_, i) => <SkeletonCard key={`more-${i}`} />)}
                </div>
            )}
        </div>
    );
}

export default Home;