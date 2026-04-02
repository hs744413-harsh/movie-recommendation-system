import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchMovies } from '../services/api';
import useDebounce from '../hooks/useDebounce';

function Navbar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Track scroll for navbar background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const data = await searchMovies(debouncedQuery, 8);
        setSuggestions(data.results || []);
      } catch {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSuggestions([]);
      setShowSearch(false);
    }
  };

  const handleSuggestionClick = (title) => {
    setQuery('');
    setSuggestions([]);
    setShowSearch(false);
    navigate(`/movie/${encodeURIComponent(title)}`);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-netflix-black/95 backdrop-blur-md shadow-2xl'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-16 sm:h-[68px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-netflix-red font-extrabold text-2xl sm:text-3xl tracking-tighter select-none group-hover:drop-shadow-[0_0_12px_rgba(229,9,20,0.5)] transition-all duration-300">
            MOVIEFLIX
          </span>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4" ref={searchRef}>
          {/* Search */}
          <div className="relative">
            {!showSearch ? (
              <button
                onClick={() => {
                  setShowSearch(true);
                  setTimeout(() => inputRef.current?.focus(), 100);
                }}
                className="text-netflix-white hover:text-white transition-colors p-2"
                aria-label="Open search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            ) : (
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="w-48 sm:w-64 bg-netflix-black/90 border border-netflix-gray/50 text-white text-sm px-4 py-2 pl-10 rounded-md focus:outline-none focus:border-netflix-white/60 transition-all placeholder-netflix-gray"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-netflix-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>
            )}

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-netflix-dark/98 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-fade-in z-50">
                {suggestions.map((movie, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(movie.title)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                  >
                    {movie.poster_url ? (
                      <img src={movie.poster_url} alt="" className="w-10 h-14 rounded object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-14 rounded bg-netflix-card flex-shrink-0 flex items-center justify-center">
                        <svg className="w-5 h-5 text-netflix-gray" fill="currentColor" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{movie.title}</p>
                      <p className="text-xs text-netflix-gray truncate">{movie.genres || 'Movie'}</p>
                    </div>
                    {movie.vote_average > 0 && (
                      <span className="text-xs font-semibold text-yellow-400 flex-shrink-0">
                        ★ {Number(movie.vote_average).toFixed(1)}
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onClick={handleSearch}
                  className="w-full px-4 py-3 text-sm text-netflix-red hover:bg-white/5 transition-colors text-center border-t border-white/5 font-medium"
                >
                  See all results for "{query}"
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
