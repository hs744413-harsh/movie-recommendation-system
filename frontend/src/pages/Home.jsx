import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import Skeleton from '../components/Skeleton';
import { getTrending, getPopular, getTopRated } from '../services/api';

function Home() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [trendingData, popularData, topRatedData] = await Promise.allSettled([
          getTrending(),
          getPopular(),
          getTopRated(20),
        ]);

        const trendingMovies = trendingData.status === 'fulfilled' ? trendingData.value : [];
        const popularMovies = popularData.status === 'fulfilled' ? popularData.value : [];
        const topRatedMovies = topRatedData.status === 'fulfilled' ? topRatedData.value : [];

        if (trendingData.status === 'rejected' && popularData.status === 'rejected' && topRatedData.status === 'rejected') {
          throw new Error('Failed to fetch movies from the backend. Make sure the FastAPI server is running.');
        }

        setTrending(trendingMovies);
        setPopular(popularMovies);
        setTopRated(topRatedMovies);

        // Pick a random movie with a backdrop for the hero
        const heroPool = trendingMovies.filter((m) => m.backdrop_url);
        if (heroPool.length > 0) {
          setHeroMovie(heroPool[Math.floor(Math.random() * heroPool.length)]);
        } else if (trendingMovies.length > 0) {
          setHeroMovie(trendingMovies[0]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load movies. Please try again later.');
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error && !trending.length && !popular.length) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center px-4">
          <svg className="w-16 h-16 text-netflix-red mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-netflix-gray mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-netflix-red hover:bg-netflix-red-hover text-white font-semibold px-6 py-3 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Hero Banner */}
      {loading ? <Skeleton type="hero" /> : <HeroBanner movie={heroMovie} />}

      {/* Movie Rows */}
      <div className="-mt-12 sm:-mt-16 relative z-10">
        <MovieRow title="🔥 Trending Now" movies={trending} loading={loading} />
        <MovieRow title="🎬 Popular Movies" movies={popular} loading={loading} />
        <MovieRow title="⭐ Top Rated" movies={topRated} loading={loading} />
      </div>
    </div>
  );
}

export default Home;
