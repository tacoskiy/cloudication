import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import { analyzeWithAzureVision } from "../../services/azure-vision";
import { r2TempUpload } from "../../services/cloudflare-r2";
import { moderateImage } from "./image-moderate";
import type { ImageModerateResponse } from "@cloudication/shared-types/image-moderate";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      const response: ImageModerateResponse = {
        status: "rejected",
        reasons: ["画像が送信されていません"],
        suggestions: ["画像ファイルを選択してください"],
      };
      return res.status(200).json(response);
    }

    const analysis = await analyzeWithAzureVision(
      req.file.buffer,
      req.file.originalname
    );

    const adult = analysis?.adult ?? {};
    const tags = Array.isArray(analysis?.tags) ? analysis.tags : [];
    const faces = Array.isArray(analysis?.faces) ? analysis.faces : [];
    const cloudRatio = typeof analysis?.cloudRatio === "number" ? analysis.cloudRatio : 0;
    const skyRatio = typeof analysis?.skyRatio === "number" ? analysis.skyRatio : 0;
    const faceDetected = analysis?.faceDetected === true;

    const hasPerson =
      faceDetected ||
      faces.length > 0 ||
      tags.some(
        (tag: { name: string; confidence?: number }) =>
          (tag.name === "person" || tag.name === "human") &&
          (tag.confidence ?? 0) > 0.5
      );

    const result = moderateImage({
      cloudRatio,
      skyRatio,
      hasPerson,
      isAdult: adult.isAdultContent === true,
      isGory: adult.isGoryContent === true,
    });

    if (result.status === "accepted" || result.status === "accepted_with_warning") {
      const date = new Date();
      const filename = `${crypto.randomUUID()}.jpg`;
      const key = `images/${date.getFullYear()}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${filename}`;

      const imageUrl = await r2TempUpload(
        req.file.buffer,
        key,
        req.file.mimetype
      );

      return res.status(200).json({
        ...result,
        image_token: key,
        preview_url: imageUrl,
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: "rejected",
      reasons: ["画像の解析に失敗しました"],
      suggestions: ["時間をおいて再度お試しください"],
    });
  }
});

export default router;
