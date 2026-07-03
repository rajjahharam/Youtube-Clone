import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchVideos } from "../../features/videos/videosSlice";
import VideoCard from "../../components/VideoCard/VideoCard";
import VideoCardSkeleton from "../../components/Skeleton/VideoCardSkeleton";

const Home = () => {
  const dispatch = useAppDispatch();
  const { allVideos, loading, error } = useAppSelector((state) => state.videos);

  useEffect(() => {
    if (allVideos.length === 0) {
      dispatch(fetchVideos());
    }
  }, [dispatch, allVideos.length]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-red-500 text-center">Failed to load videos: {error}</p>
        <button
          onClick={() => dispatch(fetchVideos())}
          className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (allVideos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-neutral-400">
        No videos found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
      {allVideos.map((video) => (
        <div key={video.id} className="group">
          <VideoCard video={video} />
        </div>
      ))}
    </div>
  );
};

export default Home;