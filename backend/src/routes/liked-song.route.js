import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getLikedSongs, toggleLikeSong } from "../controller/liked-song.controller.js";

const router = Router();

router.get("/", protectRoute, getLikedSongs);
router.post("/:songId", protectRoute, toggleLikeSong);

export default router;