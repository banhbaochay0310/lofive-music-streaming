import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("Album route get method");
});

export default router;