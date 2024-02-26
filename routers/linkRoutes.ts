import { Router } from "express";
import protect from "../middlewares/protect";
import {
  createLink,
  deleteUserLink,
  getSingleUserLink,
  getUserLinks,
  updateUserLink,
} from "../controllers/linkController";

const router = Router();

router.use(protect);
router.route("/").post(createLink).get(getUserLinks);
router
  .route("/:id")
  .get(getSingleUserLink)
  .patch(updateUserLink)
  .delete(deleteUserLink);

export default router;
