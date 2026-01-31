import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import sampleRouter from "./routes/sample";
import cloudPostsRouter from "./routes/cloudPosts";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

app.get("/api/hello", (_req, res) => {
  res.json({
    status: "ok",
    message: "Hello from Express and node.js!"
  });
});

app.use("/samples", sampleRouter);
app.use("/api/cloud-posts", cloudPostsRouter);