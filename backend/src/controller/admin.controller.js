import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

const uploadtoCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error uploading to Cloudinary:", error);
    throw new Error("Error uploading file ");
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadtoCloudinary(audioFile);
    const imageUrl = await uploadtoCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
    });

    await song.save();
    // Update album
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, { $push: { songs: song._id } });
    }
    res.status(201).json(song);
  } catch (error) {
    console.log("Error creating song:", error);
    next(error);
  }
};


export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findByIdAndDelete(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    } 
    // remove song from album
    if (song.albumId) {   
      await Album.findByIdAndUpdate(song.albumId, { $pull: { songs: song._id } });
    }
    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error deleting song:", error);
    next(error);
  }
};