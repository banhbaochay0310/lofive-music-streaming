import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { ListPlus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface AddToPlaylistMenuProps {
  songId: string;
}

const AddToPlaylistMenu = ({ songId }: AddToPlaylistMenuProps) => {
  const { playlists, addSongToPlaylist } = usePlaylistStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (playlists.length === 0) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
        title="Add to playlist"
      >
        <ListPlus className="size-4" />
      </button>

      {open && (
        <div className="absolute right-0 bottom-full mb-1 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-xl z-50 py-1 max-h-40 overflow-y-auto">
          {playlists.map((playlist) => (
            <button
              key={playlist._id}
              className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white truncate"
              onClick={(e) => {
                e.stopPropagation();
                addSongToPlaylist(playlist._id, songId);
                setOpen(false);
              }}
            >
              {playlist.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddToPlaylistMenu;
