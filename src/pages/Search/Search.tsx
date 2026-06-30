import { useAppSelector } from "../../app/hooks";
import VideoCard from "../../components/VideoCard/VideoCard";

const Search = () => {
  const { query, results, loading, error } = useAppSelector(
    (state) => state.search
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400">
        Searching...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Search failed: {error}
      </div>
    );
  }

  if (!query) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400">
        Type something in the search bar above.
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400">
        No results found for "{query}"
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-neutral-400 mb-4">
        Results for "{query}"
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {results.map((video) => (
          <VideoCard key={video.id.videoId} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Search;