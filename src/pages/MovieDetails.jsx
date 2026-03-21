import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, getMovieCast } from "../services/api";
import "../css/MovieDetails.css";

function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [movieData, castData] = await Promise.all([
                    getMovieDetails(id),
                    getMovieCast(id)
                ]);
                setMovie(movieData);
                setCast(castData);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch movie details.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="details-loading">Loading movie details...</div>;
    if (error) return <div className="details-error">{error}</div>;
    if (!movie) return null;

    // Convert YouTube regular link to embed link
    const trailerUrl = movie.trailer ? movie.trailer.replace("watch?v=", "embed/") : null;

    return (
        <div className="movie-details-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                &larr; Back
            </button>
            
            <div className="details-header">
                <div className="details-poster">
                    <img src={movie.poster_path || "/no-poster.png"} alt={movie.title} />
                </div>
                
                <div className="details-info">
                    <h1 className="details-title">{movie.title} <span>({movie.year})</span></h1>
                    <div className="details-meta">
                        <span className="rating">⭐ {movie.vote_average?.toFixed(1) || movie.rating?.toFixed(1)}</span>
                        {movie.runtime && <span>{movie.runtime} min</span>}
                    </div>

                    <div className="details-genres">
                        {movie.genre_ids?.map((g, i) => <span key={i} className="genre-tag">{g}</span>)}
                    </div>

                    <div className="details-overview-section">
                        <h3>Overview</h3>
                        <p>{movie.overview}</p>
                    </div>

                    {trailerUrl && (
                        <div className="trailer-section">
                            <h3>Trailer</h3>
                            <iframe 
                                className="youtube-iframe"
                                src={trailerUrl} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>

            {cast.length > 0 && (
                <div className="cast-section">
                    <h2>Top Cast</h2>
                    <div className="cast-list">
                        {cast.slice(0, 10).map((member, idx) => (
                            <div key={idx} className="cast-card">
                                <p className="cast-name">{member.person?.name}</p>
                                <p className="cast-character">{member.character}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieDetails;
