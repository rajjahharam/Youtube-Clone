import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchVideos } from "../../features/videos/videosSlice";
import VideoCard from "../../components/VideoCard/VideoCard";

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
      <div className="flex items-center justify-center h-64 text-neutral-400">
        Loading videos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-500">Failed to load videos: {error}</p>
        <button
          onClick={() => dispatch(fetchVideos())}
          className="px-4 py-2 bg-neutral-800 rounded-lg text-sm hover:bg-neutral-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (allVideos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400">
        No videos found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {allVideos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default Home;