import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchShorts } from "../../features/videos/videosSlice";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Loads the YouTube IFrame Player API script exactly once, regardless of
// how many ShortPlayer instances mount/unmount. Raw <iframe src="...?controls=0">
// cannot suppress YouTube's native tap-gesture overlay (play/pause/skip circle)
// — that overlay lives inside a cross-origin document, so no CSS from this app
// can touch it. The API gives real programmatic control instead.
const useYouTubeApi = () => {
  const [ready, setReady] = useState(!!window.YT?.Player);

  useEffect(() => {
    if (window.YT?.Player) {
      setReady(true);
      return;
    }
    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      setReady(true);
    };
  }, []);

  return ready;
};

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const ShortPlayer = ({
  videoId,
  apiReady,
}: {
  videoId: string;
  apiReady: boolean;
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!apiReady || !mountRef.current) return;

    playerRef.current = new window.YT.Player(mountRef.current, {
      videoId,
      playerVars: {
        autoplay: 1,
        mute: 1,
        loop: 1,
        playlist: videoId,
        controls: 0,
        modestbranding: 1,
        disablekb: 1,
        rel: 0,
        iv_load_policy: 3,
        playsinline: 1,
      },
      events: {
        onReady: (e: any) => e.target.playVideo(),
      },
    });

    return () => {
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiReady, videoId]);

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player?.getPlayerState) return;
    if (player.getPlayerState() === window.YT.PlayerState.PLAYING) {
      player.pauseVideo();
      setIsPaused(true);
    } else {
      player.playVideo();
      setIsPaused(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* YT player itself — pointer-events-none, clicks handled by our overlay below */}
      <div ref={mountRef} className="w-full h-full pointer-events-none" />

      {/* Our click layer. This is what makes play/pause actually work,
          since it's our own DOM, not YouTube's cross-origin document. */}
      <div className="absolute inset-0 cursor-pointer" onClick={togglePlay}>
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
              <PlayIcon />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// How many items from the end of the list triggers the next page fetch.
// 3 gives the network request time to resolve before the user physically
// scrolls off the end of what's loaded. Set to 0 and you get a dead-scroll
// gap where the user hits a wall and waits.
const PREFETCH_THRESHOLD = 3;

const Shorts = () => {
  const dispatch = useAppDispatch();
  const {
    shorts,
    loading,
    error,
    shortsNextPageToken,
    shortsHasMore,
    shortsLoadingMore,
  } = useAppSelector((state) => state.videos);
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const apiReady = useYouTubeApi();

  useEffect(() => {
    if (shorts.length === 0) {
      dispatch(fetchShorts(undefined));
    }
  }, [dispatch, shorts.length]);

  useEffect(() => {
    if (shorts.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const id = entry.target.getAttribute("data-video-id");
            if (id) setActiveId(id);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: [0.6],
      },
    );

    itemRefs.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [shorts]);

  // Infinite scroll trigger. Fires when the active short is within
  // PREFETCH_THRESHOLD of the end of the loaded list. The condition guard
  // in the fetchShorts thunk itself (shortsLoadingMore / shortsHasMore)
  // is the real duplicate-call protection — this check here just avoids
  // dispatching pointlessly on every activeId change.
  useEffect(() => {
    if (!activeId || shortsLoadingMore || !shortsHasMore) return;

    const activeIndex = shorts.findIndex((s) => s.id.videoId === activeId);
    if (activeIndex === -1) return;

    if (activeIndex >= shorts.length - PREFETCH_THRESHOLD) {
      dispatch(fetchShorts(shortsNextPageToken ?? undefined));
    }
  }, [
    activeId,
    shorts,
    shortsHasMore,
    shortsLoadingMore,
    shortsNextPageToken,
    dispatch,
  ]);

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
          onClick={() => dispatch(fetchShorts(undefined))}
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
    <div
      ref={containerRef}
      className="shorts-scroll h-[calc(100vh-56px)] overflow-y-scroll snap-y snap-mandatory max-w-md mx-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`.shorts-scroll::-webkit-scrollbar { display: none; }`}</style>
      {shorts.map((short) => {
        const videoId = short.id.videoId;
        const isActive = activeId === videoId;

        return (
          <div
            key={videoId}
            data-video-id={videoId}
            ref={(el) => {
              if (el) itemRefs.current.set(videoId, el);
              else itemRefs.current.delete(videoId);
            }}
            className="h-[calc(100vh-56px)] snap-start flex items-center justify-center"
          >
            {/* Bound by HEIGHT first (h-full), width derives from the 9:16
                ratio via w-auto — prevents the box exceeding the viewport
                height and bleeding into the next snap section. */}
            <div className="h-full max-h-full w-auto max-w-full aspect-[9/16] mx-auto rounded-xl overflow-hidden bg-black relative">
              {isActive ? (
                <ShortPlayer videoId={videoId} apiReady={apiReady} />
              ) : (
                <img
                  src={short.snippet.thumbnails.high.url}
                  alt={short.snippet.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pointer-events-none">
                <h3 className="text-sm font-medium text-white line-clamp-2">
                  {short.snippet.title}
                </h3>
                <p className="text-xs text-neutral-300 mt-1">
                  {short.snippet.channelTitle}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      {shortsLoadingMore && (
        <div className="h-16 flex items-center justify-center text-neutral-400 text-sm">
          Loading more...
        </div>
      )}
    </div>
  );
};

export default Shorts;
