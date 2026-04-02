import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../services/api';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!query.trim()) {
      navigate('/');
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchMovies(query, 40);
        setResults(data.results || []);
      } catch (err) {
        setError('Failed to search movies. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, navigate]);

  return (
    <div className="min-h-screen bg-netflix-black pt-20 sm:pt-24 px-4 sm:px-6 lg:px-12 pb-12">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {loading ? 'Searching...' : `Results for "${query}"`}
          </h1>
          {!loading && (
            <p className="text-netflix-gray text-sm">
              {results.length} movie{results.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i}>
                <div className="aspect-[2/3] bg-netflix-card rounded-md animate-shimmer" />
                <div className="h-4 w-24 bg-netflix-card rounded mt-2 animate-shimmer" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-netflix-red text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-netflix-red hover:bg-netflix-red-hover text-white px-6 py-2 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && !error && results.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-20 h-20 text-netflix-gray/30 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">No movies found</h2>
            <p className="text-netflix-gray mb-6">
              We couldn't find any movies matching "{query}". Try a different search term.
            </p>
            <a
              href="/"
              className="inline-block bg-netflix-red hover:bg-netflix-red-hover text-white px-6 py-3 rounded-md transition-colors font-semibold"
            >
              Browse All Movies
            </a>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {results.map((movie, idx) => (
              <div key={`${movie.title}-${idx}`} className="animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                <MovieCard movie={movie} index={idx} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
