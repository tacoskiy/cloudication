"use client";

import { useEffect, useState } from "react";
import { CloudPost } from "@cloudication/shared-types/cloud-post";
import { ToggleLikeResponse } from "@cloudication/shared-types/likes";
import { apiFetch } from "@/lib/apiFetch";
import { getOrCreateClientId } from "@/lib/cookie";
import Icon from "@/features/shared/components/Icon";
import Button from "@/features/shared/components/Button";
import Sheet from "@/features/shared/components/Sheet";
import CaptionTag from "@/features/shared/components/CaptionTag";
import { MOCK_POSTS } from "@/features/map/constants/mockPosts";


interface PostDetailModalProps {
  postId: string;
  onClose: () => void;
}

const PostDetailModal = ({ postId, onClose }: PostDetailModalProps) => {
  const [post, setPost] = useState<CloudPost | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      return;
    }

    setHasLiked(false);

    const fetchPost = async () => {
      if (postId.startsWith("mock-")) {
        const mockPost = MOCK_POSTS.find(p => p.id === postId);
        if (mockPost) {
          setPost(mockPost);
          return;
        }
      }

      try {
        const clientId = getOrCreateClientId();
        const data = await apiFetch<CloudPost>(`/api/cloud-posts/${postId}?client_id=${clientId}`);
        setPost(data);
        setHasLiked(!!data.is_liked);
      } catch (err) {
        console.error("Failed to fetch post detail:", err);
        setError("投稿の読み込みに失敗しました");
      }
    };
    fetchPost();
  }, [postId]);

  const handleToggleLike = async () => {
    if (!post || isLiking) return;

    setIsLiking(true);
    try {
      const clientId = getOrCreateClientId();
      const result = await apiFetch<ToggleLikeResponse>(`/api/likes/${postId}/like`, {
        method: "POST",
        body: { client_id: clientId },
      });

      setPost((prev) =>
        prev ? { ...prev, likes_count: result.likes_count } : null
      );
      setHasLiked(result.liked);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Sheet isOpen={!!postId} onClose={onClose}>
      {error || (!post && postId) ? (
        <div className="p-12 flex flex-col items-center gap-6">
          <p className="text-invert/40 font-bold">{error || "読み込み中..."}</p>
          <Button onClick={onClose} label="閉じる" className="bg-invert text-surface px-8 rounded-full" />
        </div>
      ) : post ? (
        <article className="p-6 flex flex-col gap-6">
          {/* Image Section */}
          <img
            src={post.image_url}
            alt="Cloud"
            className="w-full aspect-4/3 h-auto object-cover mask-cloud shadow-2xl shadow-invert/10"
          />

          {/* Info Section */}
          <div className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-2">
              <p className="text-xl text-invert font-medium leading-relaxed">
                {post.content}
              </p>
              <div className="flex items-center gap-4 text-invert/30">
                <span className="text-xs font-bold">
                  {new Date(post.created_at).toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <div className="h-1 w-1 rounded-full bg-invert/10" />
                <span className="text-[10px] font-bold tracking-tight">
                  {post.lat?.toFixed(4)}, {post.lng?.toFixed(4)}
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleLike}
              disabled={isLiking}
              className={`group flex justify-center items-center gap-3 w-full py-6 rounded-[24px] transition-all duration-300 ${isLiking ? 'opacity-50' : 'hover:scale-105 active:scale-95'
                } ${hasLiked
                  ? 'bg-pink text-surface shadow-lg shadow-pink/20 border-pink'
                  : 'bg-pink/5 border border-pink/10 text-pink hover:bg-pink/10'
                }`}
            >
              <div className={`transition-transform duration-500 ${hasLiked ? 'scale-110' : 'group-hover:scale-110'}`}>
                <Icon name="heart" size={28} />
              </div>
              <div className="flex flex-col items-start leading-none">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black tabular-nums">
                    {post.likes_count}
                  </span>
                  <span className="text-[11px] font-bold">
                    いいね！
                  </span>
                </div>
              </div>
            </button>
          </div>
        </article>
      ) : null}
    </Sheet>
  );
};

export default PostDetailModal;
