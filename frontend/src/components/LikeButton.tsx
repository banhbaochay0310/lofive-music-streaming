import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import type { Song } from "@/types";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  song: Song;
  size?: "sm" | "default";
  variant?: "ghost" | "outline";
}

const LikeButton = ({ song, size = "default", variant = "ghost" }: LikeButtonProps) => {
  const { toggleLikeSong, isLiked } = usePlayerStore();
  const liked = isLiked(song._id);

  return (
    <Button
      size={size}
      variant={variant}
      className={`group-hover:opacity-100 ${
        size === "sm" ? "opacity-0" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        toggleLikeSong(song);
      }}
    >
      <Heart
        className={`${
          size === "sm" ? "size-4" : "size-5"
        } ${
          liked
            ? "fill-emerald-500 text-emerald-500"
            : "text-zinc-400 hover:text-white"
        }`}
      />
    </Button>
  );
};

export default LikeButton;