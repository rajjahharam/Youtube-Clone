import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchShorts } from "../../features/videos/videosSlice";

const Shorts = () => {
  const dispatch = useAppDispatch();
  const { shorts, loading, error } = useAppSelector((state) => state.videos);

  useEffect(() => {
    if (shorts.length === 0) {
      dispatch(fetchShorts());
    }
  }, [dispatch, shorts.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400">
        Loading shorts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-500">Failed to load shorts: {error}</p>
        <button
          onClick={() => dispatch(fetchShorts())}
          className="px-4 py-2 bg-neutral-800 rounded-lg text-sm hover:bg-neutral-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400">
        No shorts found.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
      {shorts.map((short) => (
        <div
          key={short.id.videoId}
          className="w-full aspect-[9/16] rounded-xl overflow-hidden bg-neutral-800 relative cursor-pointer"
        >
          <img
            src={short.snippet.thumbnails.high.url}
            alt={short.snippet.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <h3 className="text-sm font-medium text-white line-clamp-2">
              {short.snippet.title}
            </h3>
            <p className="text-xs text-neutral-300 mt-1">
              {short.snippet.channelTitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shorts;