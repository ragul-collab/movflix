# 🎬 Movflix

A movie discovery web app built with React, powered by the **Trakt** and **OMDb** APIs.

🌐 **Live Demo:** [movflix-rho.vercel.app](https://movflix-rho.vercel.app)

## ✨ Features

- 🔍 **Movie Search** — Search for any movie instantly
- 🎥 **Movie Details Page** — View detailed info including ratings, plot, genre, and runtime
- ❤️ **Favourites System** — Save and manage your favourite movies locally
- 🔔 **Toast Notifications** — Get instant feedback when adding or removing favourites
- 💀 **Skeleton Loading Cards** — Smooth loading placeholders for a better UX
- 📱 **Responsive Design** — Works across all screen sizes

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend framework & build tool |
| React Router | Client-side routing |
| Trakt API | Movie data & search |
| OMDb API | Posters & additional metadata |
| Context API | Global state (favourites, toasts) |
| Vercel | Deployment |

---

## 📁 Project Structure

```
frontend/
├── public/
└── src/
    ├── assets/
    ├── components/
    │   ├── MovieCard.jsx
    │   ├── NavBar.jsx
    │   ├── SkeletonCard.jsx
    │   └── Toast.jsx
    ├── context/
    │   ├── MovieContext.jsx
    │   └── ToastContext.jsx
    ├── css/
    ├── pages/
    │   ├── Home.jsx
    │   ├── Favourites.jsx
    │   └── MovieDetails.jsx
    ├── services/
    │   └── api.js
    ├── App.jsx
    └── main.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Trakt API key
- OMDb API key

### Installation

```bash
# Clone the repo
git clone https://github.com/ragul-collab/movflix.git
cd movflix/frontend

# Install dependencies
npm install

# Create a .env file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_TRAKT_API_KEY=your_trakt_api_key
VITE_OMDB_API_KEY=your_omdb_api_key
```

### Run Locally

```bash
npm run dev
```

---

## 📦 Deployment

This app is deployed on **Vercel**. Environment variables are configured in the Vercel dashboard under project settings.

---

## 📝 License

ragul-collab

