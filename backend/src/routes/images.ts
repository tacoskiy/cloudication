import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import { analyzeWithAzureVision } from "../services/vision";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

type Status = "accepted" | "accepted_with_warning" | "rejected";

router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    /* =========================
       ❶ 入力チェック
    ========================= */
    if (!req.file) {
      return res.status(400).json({
        status: "rejected",
        reason_code: "NO_IMAGE",
        message: "画像が送信されていません。",
        suggestions: ["画像ファイルを選択してください"],
      });
    }

    /* =========================
       ❷ 画像解析
    ========================= */
    const analysis = await analyzeWithAzureVision(
      req.file.buffer,
      req.file.originalname
    );

    const adult = analysis?.adult ?? {};
    const tags = Array.isArray(analysis?.tags) ? analysis.tags : [];
    const faces = Array.isArray(analysis?.faces) ? analysis.faces : [];
    const cloudRatio =
      typeof analysis?.cloudRatio === "number" ? analysis.cloudRatio : 0;
    const faceDetected = analysis?.faceDetected === true;

    /* =========================
       ❸ 完全NG（不適切コンテンツ）
    ========================= */
    if (adult?.isAdultContent || adult?.isGoryContent) {
      return res.status(400).json({
        status: "rejected",
        reason_code: "INAPPROPRIATE_CONTENT",
        message: "不適切な内容が含まれている可能性があります。",
        suggestions: ["別の写真を選択してください"],
      });
    }

    /* =========================
       ❹ 人物検出
    ========================= */
    const hasPerson =
      faceDetected ||
      faces.length > 0 ||
      tags.some(
        (tag: { name: string; confidence?: number }) =>
          (tag.name === "person" || tag.name === "human") &&
          (tag.confidence ?? 0) > 0.5
      );

    /* =========================
       ❺ 雲が主題でない画像は通さない
    ========================= */
    if (cloudRatio < 0.3) {
      if (hasPerson) {
        return res.status(400).json({
          status: "rejected",
          reason_code: "NO_CLOUD_WITH_PERSON",
          message: "雲が写っていない人物画像は投稿できません。",
          suggestions: [
            "空や雲が主題となる構図で撮影してください",
            "人物が映らない写真を選択してください",
          ],
        });
      }

      return res.status(400).json({
        status: "rejected",
        reason_code: "INSUFFICIENT_CLOUD",
        message: "雲の写り込みが不足しています。",
        suggestions: [
          "空全体が写るように撮影してください",
          "雲が多い写真を選択してください",
        ],
      });
    }

    /* =========================
       ❻ 雲あり + 人物 → 警告
    ========================= */
    const reasons: string[] = [];
    const suggestions: string[] = [];

    if (hasPerson) {
      reasons.push("人物が写っている可能性があります");
      suggestions.push("人物が映らない構図の写真を推奨します");
    }

    const status: Status =
      reasons.length > 0 ? "accepted_with_warning" : "accepted";

    /* =========================
       ❼ 画像トークン生成
    ========================= */
    const imageToken = `temp/${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}/${crypto.randomUUID()}.jpg`;

    /* =========================
       ❽ レスポンス
    ========================= */
    return res.status(200).json({
      status,
      message:
        status === "accepted"
          ? "投稿可能な画像です"
          : "注意点がありますが投稿は可能です",
      reasons,
      suggestions,
      image_token: imageToken,
      preview_url: `https://r2.example.com/${imageToken}`,
      analysis: {
        cloud_ratio: cloudRatio,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "rejected",
      reason_code: "ANALYSIS_FAILED",
      message: "画像の解析に失敗しました。",
      suggestions: ["時間をおいて再度お試しください"],
    });
  }
});

export default router;
