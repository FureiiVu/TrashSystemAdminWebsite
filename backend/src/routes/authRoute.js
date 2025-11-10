import { Router } from "express";
import { signUp, signIn, refreshToken } from "../controller/authController";

const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/refresh-token", refreshToken);

export default router;
