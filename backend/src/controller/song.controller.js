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
    // next 8 songs after featured (skip 6 newest, no overlap)
    const songs = await Song.find().sort({ createdAt: -1 }).skip(6).limit(8);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};
