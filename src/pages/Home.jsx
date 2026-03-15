import MovieCard from "../components/MovieCard";
import {useState, useEffect} from "react"
import { searchMovies, getPopularMovies } from "../services/api";
import '../css/Home.css';
function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPopularMovies = async () =>{
            try{
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            } catch(err){
                console.log(err)
                setError("Failed to load movies....")
            }
            finally{
                setLoading(false)
            }
        }
        loadPopularMovies()
    },[]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return
        if(loading)return
        setLoading(true)
        try{
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
            setError(null)
        } catch (err){
            console.log(err)
            setError("Failed to search movies....")
        } finally{
            setLoading(false)
        }
        setSearchQuery("");
    };
    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input type="text" placeholder="search for movies..." className="search-input" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)
                    if(e.target.value===""){
                        getPopularMovies().then(setMovies)
                    }}
                }/>
                <button className="search-btn" type="submit">search</button>
            </form>
            {loading && <p>Loading movies...</p>}
            {error && <p>{}error</p>}
            <div className="movies-grid">
                {movies.map(movie => movie.title.toLowerCase().startsWith(searchQuery) && (<MovieCard key={movie.id} movie={movie} />))}
            </div>
        </div>
        
    )
}
export default Home;    