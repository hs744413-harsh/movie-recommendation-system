# 🎬 Netflix-Style Movie Recommendation System

<p align="center">
  <img src="https://img.shields.io/badge/Made%20With-Python-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-React-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-red?style=for-the-badge" />
  <img src="https://img.shields.io/badge/ML-TF--IDF-orange?style=for-the-badge" />
</p>

---

## 🚀 Overview

A **Netflix-inspired Movie Recommendation System** built using **Machine Learning + Full Stack Development**.
It recommends movies based on content similarity using **TF-IDF and cosine similarity**, and integrates with the **TMDB API** for real-time movie data.

---

## 🎯 Features

✅ Content-based movie recommendations
✅ FastAPI backend with optimized APIs
✅ React frontend with Netflix-style UI
✅ TMDB API integration (posters, ratings, trending)
✅ Search with autocomplete
✅ Top-rated & popular movie sections
✅ Fuzzy matching (handles wrong movie names)
✅ Cached recommendations (high performance)

---

## 🧠 How It Works

1. Movie data is processed and cleaned
2. Text features (genres + overview) are combined
3. TF-IDF vectorization is applied
4. Cosine similarity is used to find similar movies
5. Top-N similar movies are returned

---

## 🏗️ Tech Stack

### 🔹 Backend

* Python
* FastAPI
* Pandas, NumPy
* Scikit-learn

### 🔹 Frontend

* React.js
* Axios
* Tailwind CSS

### 🔹 APIs

* TMDB Movie API

---

## 📁 Project Structure

```
movie-recommendation-system/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── recommendation.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   │
│   └── package.json
│
├── models/
│   ├── df.pkl
│   ├── indices.pkl
│   ├── tfidf.pkl
│   └── tfidf_matrix.pkl
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔥 Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

👉 Backend runs on: `http://127.0.0.1:8000`

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm start
```

👉 Frontend runs on: `http://localhost:3000`

---

## 🔑 Environment Variables

Create `.env` file:

```
TMDB_API_KEY=your_api_key_here
```

---

## 📡 API Endpoints

| Endpoint                   | Description               |
| -------------------------- | ------------------------- |
| `/recommendations/{title}` | Get movie recommendations |
| `/movies/{title}`          | Get movie details         |
| `/search`                  | Search movies             |
| `/trending`                | Trending movies (TMDB)    |
| `/popular`                 | Popular movies            |
| `/top-rated`               | Top rated movies          |

---

## ⚡ Performance Optimizations

* 🔥 LRU Cache for recommendations
* ⚡ FastAPI async APIs
* 🚀 Efficient TF-IDF vectorization
* 📦 Optimized data loading

---

## 🧪 Sample Output

```json
{
  "title": "Inception",
  "recommendations": [
    "Interstellar",
    "The Prestige",
    "Shutter Island"
  ]
}
```

---

## 📌 Important Notes

* `.pkl` files are not included (large size)
* Download or generate locally
* Ensure correct file paths

---

## 🎯 Future Improvements

* 🔐 User authentication
* ❤️ Watchlist & favorites
* ⭐ Hybrid recommendation system
* ☁️ Cloud deployment (AWS / Render)
* 📊 User-based collaborative filtering

---

## 🧑‍💻 Author

**Harsh Panwar**
📌 Aspiring Software Engineer | Full Stack Developer

---

## 🌟 Show Your Support

If you like this project:

⭐ Star the repository
🍴 Fork it
📢 Share it

---

## 📄 License

This project is licensed under the MIT License.
