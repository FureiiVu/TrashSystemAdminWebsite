import { Router } from "express";
import { signUp, signIn } from "../controller/authController";
import { refreshToken } from "../middleware/tokenVerification.js";

const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/refresh-token", refreshToken);

export default router;
