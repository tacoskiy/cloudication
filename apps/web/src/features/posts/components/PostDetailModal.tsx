"use client";

import { useEffect, useState } from "react";
import type { CloudPost } from "@cloudication/shared-types/cloud-post";
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
  const [isFlareActive, setIsFlareActive] = useState(false);
  const [isFlareSecondaryActive, setIsFlareSecondaryActive] = useState(false);

  useEffect(() => {
    if (!postId) {
      return;
    }

    setHasLiked(false);
    setPost(null);
    setError(null);

    const fetchPost = async () => {
      if (postId.startsWith("mock-")) {
        // Simulate network delay for mock posts
        await new Promise(resolve => setTimeout(resolve, 600));
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

    const nextLiked = !hasLiked;

    // Trigger flare animation when liking
    if (nextLiked) {
      setIsFlareActive(true);
      setIsFlareSecondaryActive(true);

      setTimeout(() => {
        setIsFlareActive(false);
        setIsFlareSecondaryActive(false);
      }, 1600);
    }

    setIsLiking(true);

    // Handle mock posts
    if (postId.startsWith("mock-")) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const nextLiked = !hasLiked;
      setPost(prev => prev ? {
        ...prev,
        likes_count: prev.likes_count + (nextLiked ? 1 : -1)
      } : null);
      setHasLiked(nextLiked);
      setIsLiking(false);
      return;
    }

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
    <Sheet isOpen={!!postId} onClose={onClose} overflowVisible>
      {error ? (
        <div className="p-12 flex flex-col items-center gap-6">
          <p className="text-invert/40 font-bold">{error}</p>
          <Button onClick={onClose} label="閉じる" className="bg-invert text-surface px-8 rounded-full" />
        </div>
      ) : !post && postId ? (
        <article className="p-6 flex flex-col gap-6 animate-pulse">
          {/* Skeleton Image */}
          <div className="w-full aspect-4/3 bg-invert/5 mask-cloud" />

          {/* Skeleton Info */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="h-6 bg-invert/5 rounded-lg w-3/4" />
              <div className="h-6 bg-invert/5 rounded-lg w-1/2" />
              <div className="flex items-center gap-4">
                <div className="h-3 bg-invert/5 rounded-full w-24" />
                <div className="h-1 w-1 rounded-full bg-invert/5" />
                <div className="h-3 bg-invert/5 rounded-full w-20" />
              </div>
            </div>

            {/* Skeleton Like Button */}
            <div className="w-full h-20 bg-invert/5 rounded-[24px]" />
          </div>
        </article>
      ) : post ? (
        <article className="p-6 flex flex-col gap-6 overflow-visible">
          {/* Image Section */}
          <img
            src={post.image_url}
            alt="Cloud"
            className="w-full aspect-4/3 h-auto object-cover mask-cloud shadow-2xl shadow-invert/10"
          />

          {/* Info Section (Scrollable) */}
          <div className="flex flex-col gap-2 overflow-y-auto min-h-0">
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

          {/* Action Section (Outside scroll for visible overflow) */}
          <button
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`group relative flex justify-center items-center gap-3 w-full py-6 rounded-[24px] transition-all duration-300 ${isLiking ? 'opacity-50' : 'hover:scale-105 active:scale-95'
              } ${hasLiked
                ? 'bg-pink text-surface shadow-lg shadow-pink/20 border-pink'
                : 'bg-pink/5 border border-pink/10 text-pink hover:bg-pink/10'
              }`}
          >
            {/* Flare Rings */}
            {isFlareActive && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-pink animate-ring-flare pointer-events-none" />
            )}
            {isFlareSecondaryActive && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-warning animate-ring-flare-secondary pointer-events-none" />
            )}

            <div className={`transition-transform duration-500 ${hasLiked ? 'scale-110' : 'group-hover:scale-110'} ${hasLiked && !isLiking ? 'animate-pop' : ''}`}>
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
        </article>
      ) : null}
    </Sheet>
  );
};

export default PostDetailModal;
