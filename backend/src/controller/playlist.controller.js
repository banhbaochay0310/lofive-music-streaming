import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";
import { NotFoundError, ValidationError } from "../middleware/error.middleware.js";

// GET /api/playlists — get all playlists for current user
export const getMyPlaylists = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const playlists = await Playlist.find({ owner: userId }).sort({ createdAt: -1 });
    res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
};

// GET /api/playlists/:id — get playlist with populated songs
export const getPlaylistById = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate({
      path: "songs",
      model: Song,
    });

    if (!playlist) {
      throw new NotFoundError("Playlist not found");
    }

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

// POST /api/playlists — create a new playlist
export const createPlaylist = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { title } = req.body;

    if (!title || !title.trim()) {
      throw new ValidationError("Playlist title is required");
    }

    const playlist = await Playlist.create({
      title: title.trim(),
      owner: userId,
      songs: [],
    });

    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

// PUT /api/playlists/:id — update playlist title
export const updatePlaylist = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { title } = req.body;

    const playlist = await Playlist.findOne({ _id: req.params.id, owner: userId });
    if (!playlist) {
      throw new NotFoundError("Playlist not found");
    }

    if (title) playlist.title = title.trim();
    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/playlists/:id — delete playlist
export const deletePlaylist = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, owner: userId });
    if (!playlist) {
      throw new NotFoundError("Playlist not found");
    }

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// POST /api/playlists/:id/songs — add a song to playlist
export const addSongToPlaylist = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { songId } = req.body;

    if (!songId) {
      throw new ValidationError("songId is required");
    }

    const playlist = await Playlist.findOne({ _id: req.params.id, owner: userId });
    if (!playlist) {
      throw new NotFoundError("Playlist not found");
    }

    // Prevent duplicates
    if (playlist.songs.includes(songId)) {
      return res.status(200).json(playlist);
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/playlists/:id/songs/:songId — remove a song from playlist
export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { songId } = req.params;

    const playlist = await Playlist.findOne({ _id: req.params.id, owner: userId });
    if (!playlist) {
      throw new NotFoundError("Playlist not found");
    }

    playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};
