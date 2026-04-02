import { useRef, useState } from 'react';
import MovieCard from './MovieCard';

function MovieRow({ title, movies, loading }) {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    const container = rowRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const container = rowRef.current;
    if (!container) return;
    setShowLeftArrow(container.scrollLeft > 20);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 20
    );
  };

  if (loading) {
    return (
      <div className="mb-8 sm:mb-10 px-4 sm:px-6 lg:px-12">
        <div className="h-6 w-40 bg-netflix-card rounded animate-shimmer mb-4" />
        <div className="flex gap-2 sm:gap-3 overflow-hidden">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]">
              <div className="aspect-[2/3] bg-netflix-card rounded-md animate-shimmer" />
              <div className="h-4 w-24 bg-netflix-card rounded mt-2 animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-8 sm:mb-10 group/row relative">
      {/* Row Title */}
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white px-4 sm:px-6 lg:px-12 mb-3 sm:mb-4">
        {title}
      </h2>

      {/* Scroll container */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-8 z-20 w-12 bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 rounded-r-md"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-8 z-20 w-12 bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 rounded-l-md"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Movie Cards */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-12 pb-4"
        >
          {movies.map((movie, idx) => (
            <MovieCard key={`${movie.title}-${idx}`} movie={movie} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieRow;
