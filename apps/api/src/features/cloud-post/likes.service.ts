import prisma from "../../lib/prisma";

export const likesService = {
  async toggleLike(postId: string, clientId: string) {
    const existingLike = await prisma.cloudLike.findUnique({
      where: {
        post_id_client_id: {
          post_id: postId,
          client_id: clientId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.cloudLike.delete({
        where: {
          post_id_client_id: {
            post_id: postId,
            client_id: clientId,
          },
        },
      });
      return { liked: false };
    } else {
      // Like
      await prisma.cloudLike.create({
        data: {
          post_id: postId,
          client_id: clientId,
        },
      });
      return { liked: true };
    }
  },

  async getLikesCount(postId: string) {
    return await prisma.cloudLike.count({
      where: { post_id: postId },
    });
  },
};
