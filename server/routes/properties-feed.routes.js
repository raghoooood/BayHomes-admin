import express from "express";
import { generateFeed } from "../controllers/xMLFeed.controller.js";
import { serveFeed } from "../controllers/xMLFeed.controller.js";

const router = express.Router();

router.get("/serve", serveFeed);
router.get("/generate", generateFeed);

export default router;
