import { Router } from "express";
import {
  createUser,
  updateUser,
  deleteUser,
} from "../controller/userController.js";
import { verifyToken } from "../middleware/tokenVerification.js";

const router = Router();

router.use(verifyToken);

router.post("/create-user", createUser);
router.post("/update-user", updateUser);
router.delete("/delete-user", deleteUser);

export default router;
