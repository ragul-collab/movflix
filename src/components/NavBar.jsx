import { Link } from "react-router-dom"
import '../css/Navbar.css'

function NavBar({ darkMode, setDarkMode }){
    return(
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to='/'>
                    <span className="brand-mov">Mov</span>
                    <span className="brand-flix">flix</span>
                    <span className="brand-icon">🎬</span>
                </Link>
            </div>
            <div className="navbar-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/favourites" className="nav-link">❤️ Favourites</Link>

                {/* ✅ Toggle Button */}
                <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>
            </div>
        </nav>
    )
}
export default NavBar;