import mongoose from "mongoose";

const likedSongSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: true,
    },
  },
  { timestamps: true }
);

// Composite unique index to prevent duplicate likes
likedSongSchema.index({ userId: 1, songId: 1 }, { unique: true });

export const LikedSong = mongoose.model("LikedSong", likedSongSchema);