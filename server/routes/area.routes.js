import express from "express";

import {
    getAllAreas,
    getAreaDetail,
    createArea,
    updateArea,
    deleteArea,
} from "../controllers/area.controller.js";

const router = express.Router();

router.route("/").get(getAllAreas);
router.route("/:id").get(getAreaDetail);
router.route("/").post(createArea);
router.route("/:id").patch(updateArea);
router.route("/:id").delete(deleteArea);

export default router;
