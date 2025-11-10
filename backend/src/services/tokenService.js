import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import UserRole from "../enum/userRole.js";

dotenv.config();

export const generateToken = (userId) => {
  const payload = {
    id: userId,
    role: UserRole.MANAGER.id,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
