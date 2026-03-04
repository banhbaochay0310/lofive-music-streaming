import { Song } from "../models/song.model.js";

export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 }); // newest first (descending order)
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    // 6 newest songs (stable, deterministic)
    const songs = await Song.find().sort({ createdAt: -1 }).limit(6);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};

export const getMadeForYouSongs = async (req, res, next) => {
  try {
    // oldest 4 songs (no overlap with featured/trending which use newest)
    const songs = await Song.find().sort({ createdAt: 1 }).limit(4);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};

export const getTrendingSongs = async (req, res, next) => {
  try {
    // Top 8 most played songs (real trending based on engagement)
    const songs = await Song.find().sort({ playCount: -1, createdAt: -1 }).limit(8);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};

export const incrementPlayCount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findByIdAndUpdate(
      id,
      { $inc: { playCount: 1 } },
      { new: true }
    );
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.status(200).json({ playCount: song.playCount });
  } catch (error) {
    next(error);
  }
};
