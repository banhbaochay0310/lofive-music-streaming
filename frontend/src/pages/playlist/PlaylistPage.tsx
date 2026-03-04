import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Check, Clock, MoreHorizontal, Pause, Pencil, Play, Trash2, X } from "lucide-react";
import { formatDuration } from "@/utils/formatDuration";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LikeButton from "@/components/LikeButton";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { currentPlaylist, fetchPlaylistById, removeSongFromPlaylist, deletePlaylist, updatePlaylist, isLoading } =
    usePlaylistStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (playlistId) {
      fetchPlaylistById(playlistId);
    }
  }, [playlistId, fetchPlaylistById]);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Focus rename input when entering rename mode
  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  const handleRename = () => {
    if (!currentPlaylist) return;
    setRenameValue(currentPlaylist.title);
    setIsRenaming(true);
    setMenuOpen(false);
  };

  const submitRename = () => {
    if (!currentPlaylist || !renameValue.trim()) return;
    updatePlaylist(currentPlaylist._id, renameValue.trim());
    setIsRenaming(false);
  };

  const handleDelete = () => {
    if (!currentPlaylist) return;
    deletePlaylist(currentPlaylist._id);
    setMenuOpen(false);
    navigate("/");
  };

  if (isLoading || !currentPlaylist) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-zinc-400">Loading playlist...</div>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (!currentPlaylist.songs.length) return;
    const isCurrentPlaylistPlaying = currentPlaylist.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentPlaylistPlaying) togglePlay();
    else playAlbum(currentPlaylist.songs, 0);
  };

  const handlePlaySong = (index: number) => {
    playAlbum(currentPlaylist.songs, index);
  };

  // Use the first song's image or the playlist's default image
  const coverImage =
    currentPlaylist.songs.length > 0
      ? currentPlaylist.songs[0].imageUrl
      : currentPlaylist.imageUrl;

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-screen">
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#3b82f6]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10">
            {/* Header */}
            <div className="flex p-6 gap-6 pb-8">
              <img
                src={coverImage}
                alt={currentPlaylist.title}
                className="w-[240px] h-[240px] rounded shadow-xl object-cover"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Playlist</p>
                {isRenaming ? (
                  <div className="flex items-center gap-2 my-4">
                    <input
                      ref={renameInputRef}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitRename();
                        if (e.key === "Escape") setIsRenaming(false);
                      }}
                      className="text-3xl sm:text-5xl font-bold bg-zinc-800 border border-zinc-600 rounded-md px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-green-500 w-full max-w-md"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={submitRename}
                      className="text-green-500 hover:text-green-400"
                    >
                      <Check className="size-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsRenaming(false)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="size-5" />
                    </Button>
                  </div>
                ) : (
                  <h1 className="text-5xl sm:text-7xl font-bold my-4">
                    {currentPlaylist.title}
                  </h1>
                )}
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span>• {currentPlaylist.songs.length} songs</span>
                </div>
              </div>
            </div>

            {/* Play button */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayAll}
                disabled={currentPlaylist.songs.length === 0}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlaying &&
                currentPlaylist.songs.some(
                  (song) => song._id === currentSong?._id
                ) ? (
                  <Pause className="h-10 w-10 text-black" fill="black" />
                ) : (
                  <Play className="h-10 w-10 text-black" fill="black" />
                )}
              </Button>

              {/* "..." Menu */}
              <div className="relative" ref={menuRef}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-zinc-400 hover:text-white"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <MoreHorizontal className="size-6" />
                </Button>

                {menuOpen && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-xl z-50 py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white flex items-center gap-2"
                      onClick={handleRename}
                    >
                      <Pencil className="size-4" />
                      Rename playlist
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-700 hover:text-red-300 flex items-center gap-2"
                      onClick={handleDelete}
                    >
                      <Trash2 className="size-4" />
                      Delete playlist
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Song list */}
            <div className="bg-black/20 backdrop-blur-sm">
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Artist</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentPlaylist.songs.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400">
                      This playlist is empty. Add some songs!
                    </div>
                  ) : (
                    currentPlaylist.songs.map((song, index) => {
                      const isCurrentSong = currentSong?._id === song._id;
                      return (
                        <div
                          key={song._id}
                          onDoubleClick={() => handlePlaySong(index)}
                          className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                        >
                          <div className="flex items-center justify-center">
                            {isCurrentSong && isPlaying ? (
                              <div className="size-5 text-green-500">♫</div>
                            ) : (
                              <span className="group-hover:hidden">
                                {index + 1}
                              </span>
                            )}
                            {!isCurrentSong && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlaySong(index);
                                }}
                              >
                                <Play
                                  className="h-4 w-4 hidden group-hover:block"
                                  fill="white"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <img
                              src={song.imageUrl}
                              alt={song.title}
                              className="size-10 rounded object-cover"
                            />
                            <div>
                              <div
                                className={`font-medium ${
                                  isCurrentSong ? "text-green-500" : "text-white"
                                }`}
                              >
                                {song.title}
                              </div>
                              <div>{song.artist}</div>
                            </div>
                          </div>
                          <div className="flex items-center">{song.artist}</div>
                          <div className="flex items-center justify-between">
                            <div>{formatDuration(song.duration)}</div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                              <LikeButton song={song} size="sm" />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSongFromPlaylist(
                                    currentPlaylist._id,
                                    song._id
                                  );
                                }}
                              >
                                <Trash2 className="size-4 text-zinc-400 hover:text-red-400" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlaylistPage;
