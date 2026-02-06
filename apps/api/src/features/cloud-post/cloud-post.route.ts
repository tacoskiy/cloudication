import { Router, Request, Response } from "express";
import { cloudPostService } from "./cloud-post.service";
import { CloudPost, CreateCloudPostRequest, CreateCloudPostResponse } from "@cloudication/shared-types/cloud-post";


const router = Router();

// 24時間以内のCloudPostを取得
router.get("/", async (req: Request, res: Response) => {
  try {
    const clientId = req.query.client_id as string;
    const posts = await cloudPostService.getRecentPosts(24, clientId);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching cloud posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 特定のCloudPostを取得
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const clientId = req.query.client_id as string;
    const post = await cloudPostService.getPostById(req.params.id as string, clientId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching cloud post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// CloudPostを作成
router.post("/", async (req: Request<{}, {}, CreateCloudPostRequest>, res: Response<CreateCloudPostResponse | { error: string }>) => {
  try {
    const { image_token, content, lat, lng, client_id } = req.body;

    if (!image_token || !content || lat === undefined || lng === undefined || !client_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await cloudPostService.createPost({
      image_token,
      content,
      lat,
      lng,
      client_id,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating cloud post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// CloudPostを削除
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await cloudPostService.deletePost(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting cloud post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
