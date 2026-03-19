# 🎬 Movflix

A movie discovery web app built with React that lets you search, explore, and save your favourite movies.

🔗 **Live Demo:** [ragul07-movflix.vercel.app](https://ragul07-movflix.vercel.app)

---

## ✨ Features

- 🔍 Search movies by title
- 🎥 Browse trending & popular movies
- ⭐ View IMDb ratings and genres
- 🖼️ Movie posters and overviews
- ❤️ Add / remove movies from favourites
- 💾 Favourites saved locally (persists on refresh)

---

## 🛠️ Tech Stack

- **React** + **Vite**
- **Trakt API** — movie data, ratings, genres, trending
- **OMDb API** — posters and IMDb metadata
- **CSS** — custom styling
- **Vercel** — deployment

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/ragul-collab/movflix.git
cd movflix/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root folder:
```properties
VITE_TRAKT_API_KEY=your_trakt_client_id
VITE_OMDB_API_KEY=your_omdb_api_key
```

Get your free API keys:
- Trakt → [trakt.tv/oauth/applications/new](https://trakt.tv/oauth/applications/new)
- OMDb → [omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)

### 4. Run the app
```bash
npm run dev
```

---

## 📁 Project Structure
```
src/
├── components/
│   ├── MovieCard.jsx
│   └── NavBar.jsx
├── context/
│   └── MovieContext.jsx
├── pages/
│   ├── Home.jsx
│   └── Favourites.jsx
├── services/
│   └── api.js
└── css/
```

---

## 🌐 Deployment

Deployed on **Vercel** with environment variables configured in the dashboard.

---

## 👤 Author

**Ragul** — [github.com/ragul-collab](https://github.com/ragul-collab)
