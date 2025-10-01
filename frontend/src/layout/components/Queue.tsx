import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/stores/usePlayerStore";
import type { Song } from "@/types";
import { Music } from "lucide-react";

const Queue = () => {
  const { queue, currentSong, currentIndex, playFromQueue } = usePlayerStore();

  // Get upcoming songs (songs after current index)
  const upcomingSongs = queue.slice(currentIndex + 1);

  const handleSongClick = (index: number) => {
    playFromQueue(currentIndex + 1 + index);
  };

  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Music className="size-5 shrink-0" />
          <h2 className="font-semibold">Queue</h2>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {currentSong && (
            <>
              <div className="mb-6">
                <h3 className="text-sm text-zinc-400 mb-4">Now Playing</h3>
                <QueueItem song={currentSong} isPlaying />
              </div>
            </>
          )}

          {upcomingSongs.length > 0 && (
            <div>
              <h3 className="text-sm text-zinc-400 mb-4">Next in queue</h3>
              {upcomingSongs.map((song, index) => (
                <QueueItem 
                  key={song._id} 
                  song={song} 
                  index={index + 1}
                  onClick={() => handleSongClick(index)}
                />
              ))}
            </div>
          )}

          {!currentSong && queue.length === 0 && (
            <div className="text-center text-zinc-400 mt-8">
              No songs in queue
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const QueueItem = ({
  song,
  isPlaying,
  index,
  onClick,
}: {
  song: Song;
  isPlaying?: boolean;
  index?: number;
  onClick?: () => void;
}) => {
  return (
    <div 
      className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/50 group cursor-pointer"
      onClick={onClick}
    >
      {index ? (
        <div className="w-4 text-sm text-zinc-400 text-center">{index}</div>
      ) : (
        <div className="w-4 flex justify-center">
          <Music
            className={`size-4 ${isPlaying ? "text-emerald-400" : "text-white"}`}
          />
        </div>
      )}
      <img
        src={song.imageUrl}
        alt={song.title}
        className="size-10 rounded object-cover"
      />
      <div className="flex-1 min-w-0">
        <div
          className={`font-medium truncate ${
            isPlaying ? "text-emerald-400" : "text-white"
          }`}
        >
          {song.title}
        </div>
        <div className="text-sm text-zinc-400 truncate">{song.artist}</div>
      </div>
    </div>
  );
};

export default Queue;