import '../css/Favorites.css'
import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';

function Favorite (){
    const {favorites} = useMovieContext();
    if (favorites.length > 0) {
        return(
            <div className='favorites'>
                <h2>Your Favorites</h2>
             <div className="movies-grid">
                 {favorites.map(movie => (<MovieCard key={movie.id} movie={movie} />))}
             </div>
            </div>
        )
    }
    return(
        <div className="favorites-empty">
            <h3>No Favourite Movie Yet</h3>
        </div>
    )
}
export default Favorite;