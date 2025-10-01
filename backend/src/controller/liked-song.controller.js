import { LikedSong } from "../models/liked-song.model.js";
import { Song } from "../models/song.model.js";

export const getLikedSongs = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    
    // Get all liked song records for this user
    const likedSongs = await LikedSong.find({ userId }).populate({
      path: 'songId',
      model: Song
    });

    // Map to return just the song objects
    const songs = likedSongs.map(record => record.songId);
    
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};

export const toggleLikeSong = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const songId = req.params.songId;

    // Check if song is already liked
    const existingLike = await LikedSong.findOne({ userId, songId });

    if (existingLike) {
      // Unlike: Remove the record
      await LikedSong.findByIdAndDelete(existingLike._id);
      res.status(200).json({ liked: false });
    } else {
      // Like: Create new record
      await LikedSong.create({ userId, songId });
      res.status(201).json({ liked: true });
    }
  } catch (error) {
    next(error);
  }
};