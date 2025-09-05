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
    // fetch 6 random songs
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: { title: 1, artist: 1, imageUrl: 1, audioUrl: 1 },
      },
    ]);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};

export const getMadeForYouSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: { title: 1, artist: 1, imageUrl: 1, audioUrl: 1 },
      },
    ]);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};

export const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: { title: 1, artist: 1, imageUrl: 1, audioUrl: 1 },
      },
    ]);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};
