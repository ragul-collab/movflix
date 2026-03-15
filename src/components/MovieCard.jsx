import '../css/MovieCard.css'
import { useMovieContext } from '../context/MovieContext';

const GENRE_MAP = {
    28: "Action", 12: "Adventure", 16: "Animation",
    35: "Comedy", 80: "Crime", 99: "Documentary",
    18: "Drama", 10751: "Family", 14: "Fantasy",
    36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
    53: "Thriller", 10752: "War", 37: "Western"
}

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
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            </div>

            {/* ✅ Rating Badge */}
            <div className="movie-rating" style={{backgroundColor: getRatingColor(movie.vote_average)}}>
                ⭐ {movie.vote_average.toFixed(1)}
            </div>

            {/* ✅ Overlay with overview */}
            <div className="movie-overlay">
                <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={handleFavourite}>
                    <span className="heart-icon">❤️</span>
                </button>
                <p className="movie-overview">{movie.overview}</p>
            </div>

            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.release_date?.split("-")[0]}</p>

                {/* ✅ Popularity */}
                <div className="movie-popularity">
                    🔥 {movie.popularity.toFixed(0)} popularity
                </div>

                {/* ✅ Genres */}
                <div className="movie-genres">
                    {movie.genre_ids.slice(0, 3).map(id => (
                        <span key={id} className="genre-tag">
                            {GENRE_MAP[id] || "Other"}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default MovieCard;