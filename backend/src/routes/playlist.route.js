import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMyPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "../controller/playlist.controller.js";

const router = Router();

router.get("/", protectRoute, getMyPlaylists);
router.get("/:id", protectRoute, getPlaylistById);
router.post("/", protectRoute, createPlaylist);
router.put("/:id", protectRoute, updatePlaylist);
router.delete("/:id", protectRoute, deletePlaylist);
router.post("/:id/songs", protectRoute, addSongToPlaylist);
router.delete("/:id/songs/:songId", protectRoute, removeSongFromPlaylist);

export default router;
