import { Router } from "express";
import protect from "../middlewares/protect";
import {
  createLink,
  getSingleUserLink,
  getUserLinks,
} from "../controllers/linkController";

const router = Router();

router.route("/").post(protect, createLink).get(protect, getUserLinks);
router.route("/:id").get(protect, getSingleUserLink);

export default router;
