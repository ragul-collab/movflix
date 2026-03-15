const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN
const BASE_URL = "https://api.themoviedb.org/3";

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`
    }
}

export const getPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular`, options)
    const data = await response.json()
    return data.results
};

export const searchMovies = async (query) => {
    const response = await fetch(`${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`, options)
    const data = await response.json()
    return data.results
}