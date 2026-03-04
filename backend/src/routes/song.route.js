import { Router } from "express";
import { getAllSongs, getMadeForYouSongs, getTrendingSongs, getFeaturedSongs, incrementPlayCount } from "../controller/song.controller.js";

const router = Router();

router.get("/", getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.patch("/:id/play", incrementPlayCount);

export default router;