// src/routes/images.ts
import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import { analyzeWithAzureVision } from "../services/vision";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "画像が送信されていません。",
      });
    }

    const analysis = await analyzeWithAzureVision(req.file.buffer);

    // ❌ アダルト・過激判定
    if (analysis.adult) {
      return res.status(400).json({
        status: "error",
        message: "不適切なコンテンツが検出されたため、投稿できません。",
      });
    }

    // ❌ 雲が少なすぎる
    if (analysis.cloudRatio < 0.3) {
      return res.status(400).json({
        status: "error",
        message: "もっと雲が写っている写真を投稿してください！",
      });
    }

    // ⚠️ 警告（人の顔）
    const warning = analysis.faceDetected;

    // ※ R2未使用なので仮トークン
    const imageToken = `temp/${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}/${crypto.randomUUID()}.jpg`;

    return res.status(200).json({
      status: "success",
      image_token: imageToken,
      preview_url: `https://r2.example.com/${imageToken}`, // 仮URL
      analysis: {
        warning,
        warn_reason: warning ? "人の顔が写っています" : "",
        cloud_ratio: analysis.cloudRatio,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "画像処理に失敗しました",
    });
  }
});

export default router;