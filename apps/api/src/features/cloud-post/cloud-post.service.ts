import type { CreateCloudPostRequest as CreatePostDto, CloudPost, CreateCloudPostResponse } from "@cloudication/shared-types/cloud-post";
import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import { r2MoveToMain } from "../../services/cloudflare-r2";



type PostWithRelations = Prisma.CloudPostGetPayload<{
  include: {
    location: true;
    likes: true;
    _count: {
      select: {
        likes: true;
      };
    };
  };
}>;

export const cloudPostService = {
  async getRecentPosts(hours: number = 24, clientId?: string): Promise<CloudPost[]> {
    const threshold = new Date();
    threshold.setHours(threshold.getHours() - hours);

    const posts = await prisma.cloudPost.findMany({
      where: {
        created_at: {
          gte: threshold,
        },
      },
      include: {
        location: true,
        likes: clientId ? {
          where: {
            client_id: clientId,
          },
        } : false,
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

    return posts.map((post: PostWithRelations) => ({
      id: post.id,
      content: post.content,
      image_url: post.image_url,
      lat: post.location?.lat || null,
      lng: post.location?.lng || null,
      expires_at: post.location?.expires_at ? post.location.expires_at.toISOString() : null,
      likes_count: post._count.likes,
      is_liked: post.likes ? post.likes.length > 0 : false,
      created_at: post.created_at.toISOString(),
    }));
  },

  async getPostById(id: string, clientId?: string): Promise<CloudPost | null> {
    const post = await prisma.cloudPost.findUnique({
      where: { id },
      include: {
        location: true,
        likes: clientId ? {
          where: {
            client_id: clientId,
          },
        } : false,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post) return null;

    return {
      id: post.id,
      content: post.content,
      image_url: post.image_url,
      lat: post.location?.lat || null,
      lng: post.location?.lng || null,
      expires_at: post.location?.expires_at ? post.location.expires_at.toISOString() : null,
      likes_count: post._count.likes,
      is_liked: post.likes ? post.likes.length > 0 : false,
      created_at: post.created_at.toISOString(),
    } as CloudPost;
  },

  async createPost(data: CreatePostDto): Promise<CreateCloudPostResponse> {
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 24);

    // R2 の一時保存バケットからメインバケットへ画像を移動
    let image_url = "";
    try {
      image_url = await r2MoveToMain(data.image_token);
    } catch (error) {
      console.error("Failed to move image to main bucket:", error);
      // 移動に失敗した場合は一旦一時保存のパスを生成（暫定対応）
      const TEMP_BUCKET = process.env.R2_TEMP_BUCKET_NAME || "cloudication-temp";
      image_url = process.env.R2_TEMP_PUBLIC_URL
        ? `${process.env.R2_TEMP_PUBLIC_URL}/${data.image_token}`
        : `https://${TEMP_BUCKET}.r2.dev/${data.image_token}`;
    }

    const post = await prisma.cloudPost.create({
      data: {
        image_url,
        content: data.content,
        location: {
          create: {
            lat: data.lat,
            lng: data.lng,
            expires_at,
          },
        },
      },
      include: {
        location: true,
      },
    });

    return {
      post_id: post.id,
      image_url: post.image_url,
      expires_at: post.location?.expires_at.toISOString() || null,
    };
  },

  async deletePost(id: string) {
    // Due to Prisma's relation settings, we might need to delete location first if it's not cascade
    // In schema.prisma, location has post_id as @id and references post(id).
    // Let's delete the post; if onDelete is not set, we might need manual cleanup.
    // Based on schema.prisma, there are no explicit onDelete actions.
    
    // First delete likes and location to be safe (manual cascade)
    await prisma.cloudLike.deleteMany({ where: { post_id: id } });
    await prisma.cloudLocation.deleteMany({ where: { post_id: id } });
    return await prisma.cloudPost.delete({
      where: { id },
    });
  },
};
