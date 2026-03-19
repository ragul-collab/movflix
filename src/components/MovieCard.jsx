import '../css/MovieCard.css'
import { useMovieContext } from '../context/MovieContext';

function MovieCard({ movie }) {
    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext()
    const favorite = isFavorite(movie.id)

    function handleFavourite(e) {
        e.preventDefault()
        if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    }

    function getRatingColor(rating) {
        if (rating >= 7) return "#4CAF50"
        if (rating >= 5) return "#FF9800"
        return "#e50914"
    }

    return (
        <div className="movie-card">
            <div className="movie-poster">
                <img src={movie.poster_path || "/no-poster.png"} alt={movie.title} />
            </div>

            {/* Rating Badge */}
            <div className="movie-rating" style={{backgroundColor: getRatingColor(movie.vote_average)}}>
                ⭐ {movie.vote_average.toFixed(1)}
            </div>

            {/* Overlay with overview */}
            <div className="movie-overlay">
                <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={handleFavourite}>
                    <span className="heart-icon">❤️</span>
                </button>
                <p className="movie-overview">{movie.overview}</p>
            </div>

            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.release_date?.split("-")[0]}</p>

                {/* Popularity */}
                <div className="movie-popularity">
                    🔥 {movie.popularity.toFixed(0)} popularity
                </div>

                {/* Genres */}
                <div className="movie-genres">
                    {movie.genre_ids.slice(0, 3).map(genre => (
                        <span key={genre} className="genre-tag">
                            {genre}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MovieCard;