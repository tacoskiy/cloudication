import { Router, Request, Response } from "express";
import { likesService } from "./likes.service";
import type { ToggleLikeRequest, ToggleLikeResponse } from "@cloudication/shared-types/likes";


const router = Router();

// いいねをトグル
router.post("/:postId/like", async (req: Request<{ postId: string }, {}, ToggleLikeRequest>, res: Response<ToggleLikeResponse | { error: string }>) => {
  try {
    const { postId } = req.params;
    const { client_id } = req.body;

    if (!client_id) {
      return res.status(400).json({ error: "client_id is required" });
    }

    const result = await likesService.toggleLike(postId as string, client_id);
    const count = await likesService.getLikesCount(postId as string);

    res.json({
      ...result,
      likes_count: count,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
