import './css/App.css';
import Favourite from './pages/Favourites';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import {Routes, Route} from 'react-router-dom'
import NavBar from './components/NavBar';
import { MovieProvider } from './context/MovieContext';
import { useState, useEffect } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null ? JSON.parse(savedMode) : true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  }, [darkMode]);

  return (
    <MovieProvider>
      
      <div className={darkMode ? "app-container dark" : "app-container light"}>
        <NavBar darkMode={darkMode} setDarkMode={setDarkMode}/>
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path="/favourites" element={<Favourite/>}></Route>
            <Route path="/movie/:id" element={<MovieDetails/>}></Route>
          </Routes>
        </main>
      </div>
    </MovieProvider>
  )
}

export default App
