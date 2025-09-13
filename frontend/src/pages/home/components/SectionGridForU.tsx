import type { Song } from "@/types";
import SectionGridSkeleton from "@/components/skeletons/SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { useMemo } from "react";
import { Link } from "react-router-dom";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};

// Danh sách màu cho banner
const COLORS = [
  "bg-green-500",
  "bg-blue-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-red-500",
];

const SectionGrid = ({ title, songs, isLoading }: SectionGridProps) => {
  // Tạo mảng màu cố định cho từng bài, chỉ thực hiện khi songs thay đổi
  const songColors = useMemo(() => {
    const shuffled = [...COLORS].sort(() => 0.5 - Math.random());
    return songs.map((_, index) => shuffled[index % shuffled.length]);
  }, [songs]);

  if (isLoading) return <SectionGridSkeleton />;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <Button
          variant="link"
          className="text-sm text-zinc-400 hover:text-white"
        >
          <Link to="/songs" className="text-sm text-zinc-400 hover:text-white">
            Show all
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {songs.map((song, index) => {
          const colorClass = songColors[index]; // màu cố định
          const formattedIndex = (index + 1).toString().padStart(2, "0"); // 01, 02, 03

          return (
            <div
              key={song._id}
              className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
            >
              <div className="relative mb-4">
                {/* Image Container */}
                <div className="aspect-square rounded-md shadow-lg overflow-hidden relative">
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-md"
                  />

                  {/* Logo */}
                  <div className="absolute top-2 left-2 w-8 h-8">
                    <img
                      src="/Spotify.png"
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* "Daily Mix" */}
                  <div
                    className={`opacity-80 absolute bottom-2 left-2 text-white text-sm font-bold px-2 py-1 rounded ${colorClass}`}
                  >
                    DailyMix
                  </div>

                  {/* Index */}
                  <div
                    className={`opacity-80 absolute bottom-2 right-2 text-white text-sm font-bold px-2 py-1 rounded ${colorClass}`}
                  >
                    {formattedIndex}
                  </div>
                </div>

                <PlayButton song={song} />
              </div>

              <h3 className="font-medium mb-2 truncate">{song.title}</h3>
              <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionGrid;
