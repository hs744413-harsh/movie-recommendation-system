import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieRow from '../components/MovieRow';
import Skeleton from '../components/Skeleton';
import { getMovieDetails, getRecommendations } from '../services/api';

function MovieDetails() {
  const { title } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMovie = async () => {
      setLoading(true);
      setRecLoading(true);
      setError(null);

      try {
        const data = await getMovieDetails(decodeURIComponent(title));
        setMovie(data);
      } catch (err) {
        setError(err.message || 'Movie not found.');
      } finally {
        setLoading(false);
      }

      try {
        const recData = await getRecommendations(decodeURIComponent(title));
        setRecommendations(recData.recommendations || []);
      } catch {
        setRecommendations([]);
      } finally {
        setRecLoading(false);
      }
    };

    fetchMovie();
  }, [title]);

  if (loading) return <Skeleton type="detail" />;

  if (error) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center pt-16">
        <div className="text-center px-4">
          <svg className="w-20 h-20 text-netflix-gray/40 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
          <h2 className="text-3xl font-bold text-white mb-3">Movie Not Found</h2>
          <p className="text-netflix-gray text-lg mb-6">{error}</p>
          <a
            href="/"
            className="inline-block bg-netflix-red hover:bg-netflix-red-hover text-white font-semibold px-6 py-3 rounded-md transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const backdropUrl = movie.backdrop_url || movie.poster_url;

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Backdrop Section */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh]">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-netflix-dark to-netflix-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/50 to-netflix-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/70 to-transparent" />
      </div>

      {/* Movie Info */}
      <div className="relative -mt-48 sm:-mt-56 lg:-mt-64 px-4 sm:px-6 lg:px-12 pb-12 z-10">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Poster */}
          <div className="flex-shrink-0 flex justify-center lg:justify-start">
            {movie.poster_url ? (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-48 sm:w-56 lg:w-72 rounded-lg shadow-2xl shadow-black/50 border border-white/10"
              />
            ) : (
              <div className="w-48 sm:w-56 lg:w-72 aspect-[2/3] rounded-lg bg-netflix-card flex items-center justify-center">
                <svg className="w-12 h-12 text-netflix-gray" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 animate-slide-up text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
              {movie.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6 text-sm">
              {movie.vote_average > 0 && (
                <span className="bg-green-500/20 text-green-400 font-bold px-3 py-1 rounded-full text-sm">
                  ★ {Number(movie.vote_average).toFixed(1)}
                </span>
              )}
              {movie.tmdb_rating > 0 && movie.tmdb_rating !== movie.vote_average && (
                <span className="bg-yellow-500/20 text-yellow-400 font-bold px-3 py-1 rounded-full text-sm">
                  TMDB {Number(movie.tmdb_rating).toFixed(1)}
                </span>
              )}
              {movie.release_date && (
                <span className="text-netflix-light-gray bg-white/5 px-3 py-1 rounded-full">
                  📅 {movie.release_date}
                </span>
              )}
              {movie.popularity > 0 && (
                <span className="text-netflix-light-gray bg-white/5 px-3 py-1 rounded-full">
                  🔥 {Math.round(movie.popularity)} popularity
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.genres && (
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                {movie.genres.split(/[, ]+/).filter(Boolean).map((genre, i) => (
                  <span
                    key={i}
                    className="bg-netflix-red/15 text-netflix-red border border-netflix-red/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="mb-6">
              <h3 className="text-white font-semibold text-lg mb-2">Overview</h3>
              <p className="text-netflix-light-gray leading-relaxed text-sm sm:text-base max-w-2xl mx-auto lg:mx-0">
                {movie.overview || 'No overview available for this movie.'}
              </p>
            </div>

            {/* Production Companies */}
            {movie.production_companies && (
              <div className="mb-6">
                <h3 className="text-white font-semibold text-lg mb-2">Production</h3>
                <p className="text-netflix-gray text-sm">{movie.production_companies}</p>
              </div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0">
              {movie.vote_count > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/5">
                  <p className="text-netflix-gray text-xs uppercase tracking-wider mb-1">Votes</p>
                  <p className="text-white text-xl font-bold">{Number(movie.vote_count).toLocaleString()}</p>
                </div>
              )}
              {movie.vote_average > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/5">
                  <p className="text-netflix-gray text-xs uppercase tracking-wider mb-1">Rating</p>
                  <p className="text-white text-xl font-bold">{Number(movie.vote_average).toFixed(1)}/10</p>
                </div>
              )}
              {movie.popularity > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/5">
                  <p className="text-netflix-gray text-xs uppercase tracking-wider mb-1">Popularity</p>
                  <p className="text-white text-xl font-bold">{Math.round(movie.popularity)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8">
        <MovieRow
          title="🎯 Similar Movies You May Like"
          movies={recommendations}
          loading={recLoading}
        />
      </div>
    </div>
  );
}

export default MovieDetails;
