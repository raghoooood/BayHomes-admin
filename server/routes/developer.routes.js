import express from "express";

import {
    getAllDevelopers,
    getDeveloperDetail,
    createDeveloper,
    updateDeveloper,
    deleteDeveloper,
} from "../controllers/developer.controller.js";

const router = express.Router();

router.route("/").get(getAllDevelopers);
router.route("/:id").get(getDeveloperDetail);
router.route("/").post(createDeveloper);
router.route("/:id").patch(updateDeveloper);
router.route("/:id").delete(deleteDeveloper);

export default router;
