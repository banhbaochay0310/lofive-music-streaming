import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGridSkeleton from "@/components/skeletons/SectionGridSkeleton";
import PlayButton from "@/pages/home/components/PlayButton";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";

const AllSongsPage = () => {
  const { songs, fetchSongs, isLoading, error } = useMusicStore();
  const { playAlbum } = usePlayerStore();

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  if (isLoading) return <SectionGridSkeleton />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <main className="h-full rounded-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">All Songs</h1>
          <Button variant="outline" onClick={() => playAlbum(songs, 0)}>
            Play All
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {songs.map((song) => (
              <div
                key={song._id}
                className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
              >
                <div className="relative mb-4">
                  <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <PlayButton song={song} />
                </div>
                <h3 className="font-medium mb-2 truncate">{song.title}</h3>
                <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </main>
  );
};

export default AllSongsPage;
