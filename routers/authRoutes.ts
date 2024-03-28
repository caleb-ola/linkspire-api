import { Router } from "express";
import {
  emailVerification,
  forgotPassword,
  login,
  resendVerification,
  resetPassword,
  sendTestEmail,
  signup,
  updatePassword,
} from "../controllers/authController";
import protect from "../middlewares/protect";
import locationDeviceDetect from "../middlewares/locationDeviceDetect";

const router = Router();

router.post("/signup", signup);
router.post("/login", locationDeviceDetect, login);
router.post("/resend-verification", resendVerification);
router.post("/email-verification", emailVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/update-password", protect, updatePassword);
router.post("/send-test-email", sendTestEmail);
// router.get("/get-ip", LocationDeviceDetect);

export default router;
