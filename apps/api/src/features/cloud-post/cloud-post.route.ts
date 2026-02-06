import { Router, Request, Response } from "express";
import { cloudPostService } from "./cloud-post.service";
import { CreateCloudPostRequest, CreateCloudPostResponse } from "@cloudication/shared-types/cloud-post";
import { containsNGWord } from "../../services/text-moderate";
import { asyncHandler } from "../../lib/asyncHandler";

const router = Router();

// 24時間以内のCloudPostを取得
router.get("/", asyncHandler(async (req: Request, res: Response) => {
  const clientId = req.query.client_id as string;
  const posts = await cloudPostService.getRecentPosts(24, clientId);
  res.json(posts);
}));

// 特定のCloudPostを取得
router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  const clientId = req.query.client_id as string;
  const post = await cloudPostService.getPostById(req.params.id as string, clientId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(post);
}));

// CloudPostを作成
router.post("/", asyncHandler(async (req: Request<{}, {}, CreateCloudPostRequest>, res: Response<CreateCloudPostResponse | { error: string }>) => {
  const { image_token, content, lat, lng, client_id } = req.body;

  const trimmedContent = content?.trim() || "";
  if (!image_token || !trimmedContent || lat === undefined || lng === undefined || !client_id) {
    return res.status(400).json({ error: "必要な項目が不足しているか、コメントが空です" });
  }

  if (trimmedContent.length > 28) {
    return res.status(400).json({ error: "コメントは28文字以内で入力してください" });
  }

  if (containsNGWord(trimmedContent)) {
    return res.status(400).json({ error: "不適切な表現が含まれています" });
  }

  const result = await cloudPostService.createPost({
    image_token,
    content: trimmedContent,
    lat,
    lng,
    client_id,
  });

  res.status(201).json(result);
}));

// CloudPostを削除
router.delete("/:id", asyncHandler(async (req: Request, res: Response) => {
  await cloudPostService.deletePost(req.params.id as string);
  res.status(204).send();
}));

export default router;
