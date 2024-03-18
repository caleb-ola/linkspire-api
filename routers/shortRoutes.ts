import { Router } from "express";
import protect from "../middlewares/protect";
import {
  createShort,
  deleteShort,
  getAllShorts,
  getShort,
  updateShort,
} from "../controllers/shortController";

const router = Router();

router.use(protect);
router.route("/").get(getAllShorts).post(createShort);

router.route("/:id").get(getShort).patch(updateShort).delete(deleteShort);

export default router;
