function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16 py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-netflix-red font-extrabold text-xl tracking-tighter">MOVIEFLIX</span>
            <span className="text-netflix-gray text-sm">— Powered by ML</span>
          </div>

          <div className="flex items-center gap-6 text-netflix-gray text-sm">
            <span>TF-IDF + Cosine Similarity</span>
            <span className="hidden sm:inline">•</span>
            <span>TMDB API</span>
            <span className="hidden sm:inline">•</span>
            <span>45K+ Movies</span>
          </div>
        </div>

        <div className="mt-8 text-center text-netflix-gray/60 text-xs">
          <p>Movie data & images provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
