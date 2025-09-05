import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("Stat route get method");
});

export default router;