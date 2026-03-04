import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: String, // Clerk userId
      required: true,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    imageUrl: {
      type: String,
      default: "/playlist-default.png",
    },
  },
  { timestamps: true }
);

// Index for fast lookup by owner
playlistSchema.index({ owner: 1 });

export const Playlist = mongoose.model("Playlist", playlistSchema);
