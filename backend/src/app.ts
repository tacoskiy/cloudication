// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import imagesRouter from "./routes/images";
import sampleRouter from "./routes/sample";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ルーティング
app.use("/images", imagesRouter);
app.use("/samples", sampleRouter);

app.get("/api/hello", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;