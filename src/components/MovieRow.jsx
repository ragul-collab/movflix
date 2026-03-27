import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieContext } from '../context/MovieContext';
import '../css/MovieRow.css';

function getRatingColor(r) {
    if (r >= 7) return '#4CAF50';
    if (r >= 5) return '#FF9800';
    return '#e50914';
}

function MovieRow({ title, movies = [], loading = false, loadingMore = false, onLoadMore, icon = '' }) {
    const rowRef = useRef(null);
    const navigate = useNavigate();
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

    // Scroll buttons
    const scroll = (direction) => {
        if (rowRef.current) {
            rowRef.current.scrollBy({
                left: direction === 'left' ? -600 : 600,
                behavior: 'smooth',
            });
        }
    };

    // Infinite horizontal scroll — fires onLoadMore when near right edge
    const handleScroll = useCallback(() => {
        if (!rowRef.current || !onLoadMore || loadingMore) return;
        const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 300) {
            onLoadMore();
        }
    }, [onLoadMore, loadingMore]);

    const skeletons = [...Array(8)].map((_, i) => (
        <div key={i} className="row-skeleton-card">
            <div className="row-skeleton-poster shimmer" />
            <div className="row-skeleton-text shimmer" />
            <div className="row-skeleton-sub shimmer" />
        </div>
    ));

    const moreSkeletons = [...Array(4)].map((_, i) => (
        <div key={`more-${i}`} className="row-skeleton-card">
            <div className="row-skeleton-poster shimmer" />
            <div className="row-skeleton-text shimmer" />
            <div className="row-skeleton-sub shimmer" />
        </div>
    ));

    return (
        <section className="movie-row-section">
            <div className="movie-row-header">
                <h2 className="movie-row-title">
                    {icon && <span className="row-icon">{icon}</span>}
                    {title}
                </h2>
                <div className="row-scroll-btns">
                    <button className="row-scroll-btn" onClick={() => scroll('left')} aria-label="Scroll left">‹</button>
                    <button className="row-scroll-btn" onClick={() => scroll('right')} aria-label="Scroll right">›</button>
                </div>
            </div>

            <div className="movie-row-track" ref={rowRef} onScroll={handleScroll}>
                {loading
                    ? skeletons
                    : movies.map((movie) => {
                        const favorite = isFavorite(movie.id);

                        return (
                            <div
                                key={movie.id}
                                className="row-card"
                                onClick={() => navigate(`/movie/${movie.id}`)}
                            >
                                <div className="row-card-poster">
                                    <img
                                        src={movie.poster_path || '/no-poster.png'}
                                        alt={movie.title}
                                        onError={(e) => {
                                            if (e.target.src.includes('SX1000')) {
                                                e.target.src = e.target.src.replace('SX1000', 'SX300');
                                            } else {
                                                e.target.onerror = null;
                                                e.target.src = '/no-poster.png';
                                            }
                                        }}
                                    />
                                    <div
                                        className="row-card-rating"
                                        style={{ backgroundColor: getRatingColor(movie.vote_average) }}
                                    >
                                        ⭐ {movie.vote_average?.toFixed(1)}
                                    </div>
                                    <button
                                        className={`row-fav-btn ${favorite ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            favorite ? removeFromFavorites(movie.id) : addToFavorites(movie);
                                        }}
                                        aria-label="Toggle favorite"
                                    >
                                        ❤️
                                    </button>
                                    <div className="row-card-overlay">
                                        <p className="row-card-overview">{movie.overview}</p>
                                    </div>
                                </div>
                                <div className="row-card-info">
                                    <p className="row-card-title">{movie.title}</p>
                                    <p className="row-card-year">{movie.release_date?.split('-')[0]}</p>
                                </div>
                            </div>
                        );
                    })}

                {/* Append skeleton cards at the end while loading more */}
                {loadingMore && moreSkeletons}
            </div>
        </section>
    );
}

export default MovieRow;
