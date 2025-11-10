import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Kiểm tra header tồn tại
  if (!authHeader) {
    return res.status(400).json({
      error:
        "Missing Authorization header. Expected format: 'Authorization: Bearer <token>'",
    });
  }

  // Kiểm tra định dạng hợp lệ
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      error:
        "Invalid Authorization header format. It should start with 'Bearer '",
    });
  }

  // Nếu hợp lệ, lấy token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token", message: error.message });
  }
};
