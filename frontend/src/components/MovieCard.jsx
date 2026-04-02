import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FALLBACK_POSTER = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
    <rect fill="#232323" width="300" height="450"/>
    <text fill="#555" font-family="Arial" font-size="16" text-anchor="middle" x="150" y="225">No Poster</text>
  </svg>`
);

function MovieCard({ movie, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const posterUrl = movie.poster_url && !imageError ? movie.poster_url : FALLBACK_POSTER;

  const handleClick = () => {
    navigate(`/movie/${encodeURIComponent(movie.title)}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] cursor-pointer transition-all duration-300 hover:z-10"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Poster */}
      <div className="relative rounded-md overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-black/50 group-hover:scale-105 group-hover:-translate-y-2">
        {/* Shimmer placeholder */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-shimmer rounded-md" />
        )}

        <img
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full aspect-[2/3] object-cover transition-opacity duration-300 ${
            imageLoaded || imageError ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {movie.vote_average > 0 && (
              <div className="flex items-center gap-1 mb-1.5">
                <span className="text-yellow-400 text-xs font-bold">★</span>
                <span className="text-white text-xs font-semibold">
                  {Number(movie.vote_average).toFixed(1)}
                </span>
              </div>
            )}
            <h3 className="text-white text-xs sm:text-sm font-bold leading-tight line-clamp-2">
              {movie.title}
            </h3>
            {movie.genres && (
              <p className="text-netflix-light-gray text-[10px] sm:text-xs mt-1 truncate">
                {movie.genres}
              </p>
            )}
          </div>
        </div>

        {/* Netflix-style border on hover */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-md transition-all duration-300" />
      </div>

      {/* Title below poster */}
      <h3 className="text-netflix-white text-xs sm:text-sm font-medium mt-2 truncate group-hover:text-white transition-colors">
        {movie.title}
      </h3>
    </div>
  );
}

export default MovieCard;
