import './css/App.css';
import Favourite from './pages/Favourites';
import Home from './pages/Home';
import {Routes, Route} from 'react-router-dom'
import NavBar from './components/NavBar';
import { MovieProvider } from './context/MovieContext';
import { useState } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <MovieProvider>
      
      <div className={darkMode ? "dark" : "light"}>
        <NavBar darkMode={darkMode} setDarkMode={setDarkMode}/>
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path="/favourites" element={<Favourite/>}></Route>
          </Routes>
        </main>
      </div>
    </MovieProvider>
  )
}

export default App
