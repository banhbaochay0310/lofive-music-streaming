import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon, Search } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore.ts";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

const Topbar = () => {
  const { isAdmin } = useAuthStore();
  const { songs, fetchSongs } = useMusicStore();
  const { playAlbum } = usePlayerStore();
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const suggestions =
    search.trim().length > 0
      ? songs.filter((song) =>
          song.title.toLowerCase().includes(search.trim().toLowerCase())
        )
      : [];

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  // Đóng suggestions khi click ra ngoài (kiểm tra cả input và dropdown)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInput = inputRef.current && inputRef.current.contains(target);
      const clickedDropdown = dropdownRef.current && dropdownRef.current.contains(target);
      if (!clickedInput && !clickedDropdown) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };
    if (showSuggestions) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSuggestions]);

  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/50 backdrop-blur-2xl z-10 rounded-md">
      <div className="flex gap-2 items-center">
        <img src="/Lofive.png" className="size-10" />
        Lofive
      </div>
      {/* Tsearch */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 size-5" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (!suggestions.length) return;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setShowSuggestions(true);
                setHighlightedIndex((prev) =>
                  Math.min(prev + 1, suggestions.length - 1)
                );
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex((prev) => Math.max(prev - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                const idx = highlightedIndex >= 0 ? highlightedIndex : 0;
                const song = suggestions[idx];
                if (song) {
                  setSearch(song.title);
                  setShowSuggestions(false);
                  playAlbum([song], 0);
                }
              } else if (e.key === "Escape") {
                setShowSuggestions(false);
                setHighlightedIndex(-1);
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search songs..."
            className="w-full pl-10 pr-3 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-zinc-400"
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-12 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto"
            >
              {suggestions.slice(0, 8).map((song, idx) => (
                <div
                  key={song._id}
                  className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-zinc-800 ${
                    idx === highlightedIndex ? "bg-zinc-800" : ""
                  }`}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Topbar: selected song", song);
                    setSearch(song.title);
                    setShowSuggestions(false);
                    playAlbum([song], 0);
                  }}
                >
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="truncate">{song.title}</span>
                  <span className="text-xs text-zinc-400 ml-2">
                    {song.artist}
                  </span>
                </div>
              ))}
              {suggestions.length > 8 && (
                <div className="px-4 py-2 text-xs text-zinc-500">
                  And more...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            to={"/admin"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboardIcon className="size-4 mr-2" />
            Admin Dashboard
          </Link>
        )}

        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  );
};

export default Topbar;
