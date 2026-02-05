import { CreateCloudPostRequest as CreatePostDto, CloudPost, CreateCloudPostResponse } from "@cloudication/shared-types/cloud-post";
import prisma from "../../lib/prisma";


export const cloudPostService = {
  async getRecentPosts(hours: number = 24): Promise<CloudPost[]> {
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

    return posts.map((post) => ({
      id: post.id,
      content: post.content,
      image_url: post.image_url,
      lat: post.location?.lat || null,
      lng: post.location?.lng || null,
      expires_at: post.location?.expires_at ? post.location.expires_at.toISOString() : null,
      likes_count: post._count.likes,
      created_at: post.created_at.toISOString(),
    }));
  },

  async getPostById(id: string): Promise<CloudPost | null> {
    const post = await prisma.cloudPost.findUnique({
      where: { id },
      include: {
        location: true,
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
      created_at: post.created_at.toISOString(),
    };
  },

  async createPost(data: CreatePostDto): Promise<CreateCloudPostResponse> {
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 24);

    // Note: In a real app, you might want to map image_token to a real URL or use it as is
    // The previous implementation used `uploads/${image_token}`
    const image_url = `uploads/${data.image_token}`;

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
