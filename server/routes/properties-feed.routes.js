import express from "express";
import { serveFeed, generateFeed } from "../controllers/xmlFeed.controller.js";

const router = express.Router();

router.get("/serve", serveFeed);
router.get("/generate", generateFeed);

export default router;
