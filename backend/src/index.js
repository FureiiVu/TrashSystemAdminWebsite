import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import path from "path";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import { connectDB } from "./lib/connectDB.js";

dotenv.config();

// Khởi tạo biến
const port = process.env.PORT;
const app = express();
const __dirname = path.resolve();

// Parse JSON body
app.use(express.json());

// Parse Cookies
app.use(cookieParser());

// File upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);

// Đường dẫn API
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

// Lắng nghe cổng, chạy kết nối DB
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
