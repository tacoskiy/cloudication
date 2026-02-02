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

    const adult = analysis?.adult ?? {};
    const tags = Array.isArray(analysis?.tags) ? analysis.tags : [];
    const faces = Array.isArray(analysis?.faces) ? analysis.faces : [];
    const cloudRatio = typeof analysis?.cloudRatio === "number" ? analysis.cloudRatio : 0;
    const faceDetected = analysis?.faceDetected === true;

    /* =========================
       ❌ 完全NG：不適切コンテンツ（アダルト・際どい・残虐）
    ========================= */
    const THRESHOLD = 0.4;

    const isInappropriate =
      adult?.isAdultContent ||
      adult?.isRacyContent ||
      adult?.isGoryContent ||
      (adult?.adultScore ?? 0) > THRESHOLD ||
      (adult?.racyScore ?? 0) > THRESHOLD ||
      (adult?.goreScore ?? 0) > THRESHOLD;

    if (isInappropriate) {
      console.warn(
        `[Blocked] Inappropriate content detected. Scores: Adult=${adult?.adultScore}, Racy=${adult?.racyScore}`
      );
      return res.status(400).json({
        status: "error",
        message:
          "不適切な画像、または露出が多い画像の可能性があるため投稿できません。",
      });
    }

    /* =========================
       ❌ 完全NG：人の顔・人体
    ========================= */
    const hasPerson = tags.some(
      (tag: { name: string; confidence?: number }) =>
        (tag.name === "person" || tag.name === "human") &&
        (tag.confidence ?? 0) > 0.5
    );

    if (faces.length > 0 || faceDetected || hasPerson) {
      return res.status(400).json({
        status: "error",
        message: "人物が写っている画像は投稿できません。",
      });
    }

    /* =========================
       ❌ 条件不足：雲が少ない
    ========================= */
    if (cloudRatio < 0.3) {
      return res.status(400).json({
        status: "error",
        message: "もっと雲が写っている写真を投稿してください。",
      });
    }

    /* =========================
       ✅ OK
    ========================= */
    const imageToken = `temp/${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}/${crypto.randomUUID()}.jpg`;

    return res.status(200).json({
      status: "success",
      image_token: imageToken,
      preview_url: `https://r2.example.com/${imageToken}`,
      analysis: {
        cloud_ratio: cloudRatio,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "この画像は投稿できません",
    });
  }
});

export default router;