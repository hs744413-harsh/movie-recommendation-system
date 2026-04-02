import { useNavigate } from 'react-router-dom';

function HeroBanner({ movie }) {
  const navigate = useNavigate();

  if (!movie) return null;

  const backdropUrl = movie.backdrop_url || movie.poster_url;

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] overflow-hidden">
      {/* Backdrop Image */}
      {backdropUrl ? (
        <img
          src={backdropUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="eager"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-netflix-dark via-netflix-card to-netflix-black" />
      )}

      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/90 via-netflix-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-48 gradient-bottom" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-12 pb-16 sm:pb-20 max-w-[1400px] mx-auto">
        <div className="max-w-xl animate-slide-up">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight drop-shadow-2xl">
            {movie.title}
          </h1>

          <div className="flex items-center gap-3 mb-4 text-sm">
            {movie.vote_average > 0 && (
              <span className="text-green-400 font-bold text-base">
                {Math.round(movie.vote_average * 10)}% Match
              </span>
            )}
            {movie.release_date && (
              <span className="text-netflix-light-gray">{movie.release_date.split('-')[0]}</span>
            )}
            {movie.genres && (
              <span className="text-netflix-light-gray">{movie.genres}</span>
            )}
          </div>

          <p className="text-netflix-white/90 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
            {movie.overview || 'A great movie to watch with friends and family.'}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/movie/${encodeURIComponent(movie.title)}`)}
              className="flex items-center gap-2 bg-white text-netflix-black font-bold px-6 py-3 rounded-md hover:bg-white/80 transition-all duration-200 text-sm sm:text-base active:scale-95"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Details
            </button>
            <button
              onClick={() => navigate(`/movie/${encodeURIComponent(movie.title)}`)}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-md hover:bg-white/30 transition-all duration-200 text-sm sm:text-base active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
