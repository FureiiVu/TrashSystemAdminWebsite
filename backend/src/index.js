import express from "express";
import dotenv from "dotenv";

import testRoute from "./routes/testRoute.js";
import { connectDB } from "./lib/connectDB.js";

dotenv.config();

// Khởi tạo biến
const port = process.env.PORT;
const app = express();

// Đường dẫn API
app.use("/api/test", testRoute);

// Lắng nghe cổng, chạy kết nối DB
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
