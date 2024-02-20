import { Router } from "express";
import {
  getAllUsers,
  getCurrentUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
} from "../controllers/userController";
import protect from "../middlewares/protect";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/user", getUserByEmail);
router.get("/user/:username", getUserByUsername);
router.get("/current-user", protect, getCurrentUser);

export default router;
