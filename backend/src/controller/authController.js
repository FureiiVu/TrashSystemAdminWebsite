import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import UserRole from "../enum/userRole.js";

dotenv.config();

import { generateToken } from "../services/tokenService.js";

export const signUp = (req, res) => {
  const { username, password } = req.body;

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Save user to database (call create user logic later)
  const newUser = { username, password: hashedPassword };
  console.log("User registered:", newUser);

  res.json({ message: "User registered successfully" });
};

export const signIn = async (req, res) => {
  const { username, password } = req.body;

  // Find user in database (call find user logic later)
  const userFromDB = await findUserByUsername(username); // Chưa viết hàm này

  if (!userFromDB) {
    return res.status(404).json({ error: "User has not been registered" });
  }

  // Check password
  const isValidPassword = await bcrypt.compare(password, userFromDB.password);

  // If password is valid, generate token, else return error
  if (isValidPassword) {
    const { accessToken, refreshToken } = generateToken(userFromDB.id);

    // Gửi refreshToken qua cookie (HTTP-only)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // Set to true if using HTTPS
    });

    res.json({
      accessToken,
      user: { id: userFromDB.id, username: userFromDB.username },
      message: "Sign in successful",
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};

export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

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
