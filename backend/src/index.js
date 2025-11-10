import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import testRoute from "./routes/testRoute.js";
import { connectDB } from "./lib/connectDB.js";

dotenv.config();

// Khởi tạo biến
const port = process.env.PORT;
const app = express();

// Parse JSON body
app.use(express.json());

// Parse Cookies
app.use(cookieParser());

// Đường dẫn API
app.use("/api/auth", testRoute);

// Lắng nghe cổng, chạy kết nối DB
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
