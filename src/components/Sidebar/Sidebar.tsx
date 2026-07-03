import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, PlaySquare, Users, Library, History, Clock, ThumbsUp, Download, User, Music, Gamepad2, Trophy, Flame } from "lucide-react";
import ComingSoonModal from "../ComingSoonModal";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Shorts", icon: PlaySquare, path: "/shorts" },
  { label: "Subscriptions", icon: Users, path: "/subscriptions" },
  { label: "You", icon: User, path: "/you" },
  { label: "Library", icon: Library, path: "/library" },
  { label: "History", icon: History, path: "/history" },
  { label: "Watch later", icon: Clock, path: "/watch-later" },
  { label: "Liked videos", icon: ThumbsUp, path: "/liked" },
  { label: "Downloads", icon: Download, path: "/downloads" },
];

const exploreItems = [
  { label: "Music", icon: Music },
  { label: "Gaming", icon: Gamepad2 },
  { label: "Sports", icon: Trophy },
  { label: "Trending", icon: Flame },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [comingSoon, setComingSoon] = useState<{ open: boolean; name: string }>({
    open: false,
    name: "",
  });

  const handleClick = (path: string | null, label: string) => {
    if (path && ["/", "/shorts"].includes(path)) {
      navigate(path);
    } else {
      setComingSoon({ open: true, name: label });
    }
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-14 left-0 w-[240px] h-[calc(100vh-56px)] bg-black py-3 overflow-y-auto z-50 transition-transform duration-200 border-r border-neutral-800
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        
        <div className="px-3 space-y-1">
          {mainItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                onClick={() => handleClick(item.path, item.label)}
                className={`flex items-center gap-6 px-4 py-[10px] mx-1 rounded-xl cursor-pointer text-sm transition-all
                  ${isActive 
                    ? "bg-neutral-800 font-medium text-white" 
                    : "hover:bg-neutral-900 text-neutral-300 hover:text-white"
                  }`}
              >
                <span className="w-6 flex justify-center">
                  <Icon size={22} className={isActive ? "text-white" : ""} />
                </span>
                <span>{item.label}</span>
              </div>
            );
          })}

          <div className="h-px bg-neutral-800 my-4 mx-4" />

          <div className="px-4 text-xs text-neutral-500 font-medium mb-2">Explore</div>
          
          {exploreItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={() => handleClick(null, item.label)}
                className="flex items-center gap-6 px-4 py-[10px] mx-1 rounded-xl cursor-pointer text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white transition-all"
              >
                <span className="w-6 flex justify-center">
                  <Icon size={22} />
                </span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </aside>

      <ComingSoonModal
        isOpen={comingSoon.open}
        onClose={() => setComingSoon({ open: false, name: "" })}
        featureName={comingSoon.name}
      />
    </>
  );
};

export default Sidebar;