import express from "express";
import dotenv from "dotenv";

import testRoute from "./routes/testRoute.js";

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use("/api/test", testRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
