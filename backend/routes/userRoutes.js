import express from "express";
import { login, register, logout, getUser, verifyEmail, resendVerificationEmail, forgotPassword, resetPassword } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/login", login);
router.post("/password/forgot", forgotPassword);
router.post("/password/reset", resetPassword);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);

export default router;
