import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Play } from "lucide-react";
import { useAppDispatch } from "../../app/hooks";
import { setQuery, clearQuery, searchVideos } from "../../features/search/searchSlice";

const Navbar = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (inputValue.trim() === "") return;
    dispatch(setQuery(inputValue));
    dispatch(searchVideos(inputValue));
    navigate("/search");
  };

  const handleClear = () => {
    setInputValue("");
    dispatch(clearQuery());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-black flex items-center justify-between px-4 z-50 border-b border-neutral-800">
      {/* Logo */}
      <div
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <Play className="text-red-600 fill-red-600" size={22} />
        <span className="text-white text-lg font-bold tracking-tight">
          YouTube
        </span>
      </div>

      {/* Search */}
      <div className="flex items-center w-2/5">
        <input
          type="text"
          placeholder="Search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 h-9 bg-neutral-900 border border-neutral-700 rounded-l-full px-4 text-sm text-white outline-none focus:border-blue-500"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="h-9 px-2 bg-neutral-900 border border-neutral-700 border-l-0 text-neutral-400 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="h-9 px-4 bg-neutral-800 border border-neutral-700 rounded-r-full text-white hover:bg-neutral-700 flex items-center justify-center"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-black text-sm font-semibold cursor-pointer">
        U
      </div>
    </nav>
  );
};

export default Navbar;