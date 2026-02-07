import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import imageModerateRouter from "./features/image-moderate/image-moderate.route";
import cloudPostRouter from "./features/cloud-post/cloud-post.route";
import likesRouter from "./features/cloud-post/likes.route";

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());

// Rate Limiting (General)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "リクエスト制限を超えました。しばらく時間をおいてお試しください。" },
});
app.use(limiter);

// Routes
app.get("/", (_req, res) => {
  console.log("[Healthcheck] Root endpoint hit");
  res.json({ status: "ok", service: "cloudication-api" });
});

app.get("/api/hello", (_req, res) => {
  res.json({
    status: "ok",
    message: "Hello from Express and node.js!"
  });
});

app.use("/api/cloud-posts", cloudPostRouter);
app.use("/api/likes", likesRouter);
app.use("/api/image-moderate", imageModerateRouter);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[Unhandled Error]", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || "予期せぬエラーが発生しました",
  });
});

const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || "0.0.0.0";

console.log(`[Config] Attempting to start server on ${HOST}:${PORT}`);
console.log(`[Config] process.env.PORT is: ${process.env.PORT}`);

app.listen(PORT, HOST, () => {
  console.log(`Backend is listening on http://${HOST}:${PORT}`);
});