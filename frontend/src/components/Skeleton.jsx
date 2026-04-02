function Skeleton({ type = 'card', count = 1 }) {
  if (type === 'hero') {
    return (
      <div className="relative w-full h-[70vh] sm:h-[80vh] bg-netflix-dark animate-shimmer">
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-12 pb-16 sm:pb-20">
          <div className="max-w-xl space-y-4">
            <div className="h-12 w-80 bg-netflix-card rounded animate-shimmer" />
            <div className="h-4 w-60 bg-netflix-card rounded animate-shimmer" />
            <div className="h-16 w-96 bg-netflix-card rounded animate-shimmer" />
            <div className="flex gap-3">
              <div className="h-12 w-32 bg-netflix-card rounded-md animate-shimmer" />
              <div className="h-12 w-36 bg-netflix-card rounded-md animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="min-h-screen bg-netflix-black pt-20 px-4 sm:px-6 lg:px-12">
        <div className="h-[50vh] bg-netflix-dark animate-shimmer rounded-lg mb-8" />
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-10 w-72 bg-netflix-card rounded animate-shimmer" />
          <div className="h-6 w-48 bg-netflix-card rounded animate-shimmer" />
          <div className="h-24 w-full bg-netflix-card rounded animate-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 sm:gap-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]">
          <div className="aspect-[2/3] bg-netflix-card rounded-md animate-shimmer" />
          <div className="h-4 w-24 bg-netflix-card rounded mt-2 animate-shimmer" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
