import { Router, Request, Response } from "express";
import prisma from "@/lib/prisma";

const router = Router();

// 24時間以内のCloudPostを取得
router.get("/", async (req: Request, res: Response) => {
    try {
    // 現在時刻から24時間前の時刻
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // 24時間以内のCloudPostを取得
    const posts = await prisma.cloudPost.findMany({
        where: {
        created_at: {
            gte: twentyFourHoursAgo,
        },
        },
        include: {
        location: true,
        _count: {
            select: {
            likes: true,
            },
        },
        },
        orderBy: {
        created_at: "desc",
        },
    });

    // レスポンス形式に変換
    const formattedPosts = posts.map((post) => {
        return {
            id: post.id,
            content: post.content,
            image_url: post.image_url,
            lat: post.location?.lat || null,
            lng: post.location?.lng || null,
            expires_at: post.location?.expires_at || null,
            likes_count: post._count.likes,
        };
        });

        res.json(formattedPosts);
    } catch (error) {
        console.error("Error fetching cloud posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// CloudPostを作成
router.post("/", async (req: Request, res: Response) => {
    try {
        const { image_token, content, lat, lng, client_id } = req.body;

        // バリデーション
        if (!image_token || !content || lat === undefined || lng === undefined || !client_id) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        // image_tokenをimage_urlに変換
        const image_url = `uploads/${image_token}`;

        // expires_at: 現在時刻 + 24時間
        const expires_at = new Date();
        expires_at.setHours(expires_at.getHours() + 24);

        // CloudPostを作成
        const post = await prisma.cloudPost.create({
            data: {
                image_url,
                content,
                location: {
                    create: {
                        lat,
                        lng,
                        expires_at,
                    },
                },
            },
            include: {
                location: true,
            },
        });

        // レスポンス形式に変換
        res.status(201).json({
            post_id: post.id,
            image_url: post.image_url,
            expires_at: post.location?.expires_at.toISOString() || null,
        });
    } catch (error) {
        console.error("Error creating cloud post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
