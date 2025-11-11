import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import UserRole from "../enum/userRole.js";
import { createUser } from "./userController.js";
import { generateToken } from "../services/tokenService.js";

dotenv.config();

export const signUp = async (req, res) => {
  // 1. Lấy dữ liệu từ req.body
  const { username, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // 2. Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // 3. Tạo user mới
  await createUser(req, res, hashedPassword);

  // 4. Trả về phản hồi thành công
  res.json({ message: "User registered successfully" });
};

export const signIn = async (req, res) => {
  // 1. Lấy dữ liệu từ req.body
  const { username, password } = req.body;

  // 2. Tìm user trong cơ sở dữ liệu
  const userFromDB = await findUserByUsername(username); // Chưa viết hàm này

  if (!userFromDB) {
    return res.status(404).json({ error: "User has not been registered" });
  }

  // 3. Kiểm tra mật khẩu
  const isValidPassword = await bcrypt.compare(password, userFromDB.password);

  // 4. Nếu đúng, tạo và trả về token
  if (isValidPassword) {
    const { accessToken, refreshToken } = generateToken(userFromDB.id);

    // Gửi refreshToken qua cookie (HTTP-only)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      accessToken,
      message: "Sign in successful",
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};

export const refreshToken = (req, res) => {
  // 1. Lấy refreshToken từ cookie
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  // 2. Xác thực refreshToken, tạo và trả về accessToken mới
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        role: UserRole.MANAGER.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // refreshToken hết hạn
      return res
        .status(403)
        .json({ error: "Refresh token expired, please log in again" });
    }

    if (err.name === "JsonWebTokenError") {
      // refreshToken sai định dạng hoặc bị giả mạo
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    res.status(500).json({ error: "Unknown error while refreshing token" });
  }
};
