"use client";

import { useEffect, useState } from "react";
import { CloudPost } from "@cloudication/shared-types/cloud-post";
import { ToggleLikeResponse } from "@cloudication/shared-types/likes";
import { apiFetch } from "@/lib/apiFetch";
import { getOrCreateClientId } from "@/lib/cookie";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";
import Sheet from "@/components/common/Sheet";
import CaptionTag from "@/components/common/CaptionTag";

interface PostDetailModalProps {
  postId: string;
  onClose: () => void;
}

const PostDetailModal = ({ postId, onClose }: PostDetailModalProps) => {
  const [post, setPost] = useState<CloudPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;
    
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const data = await apiFetch<CloudPost>(`/api/cloud-posts/${postId}`);
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch post detail:", err);
        setError("投稿の読み込みに失敗しました");
      } finally {
        setIsLoading(false);
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
    } catch (err) {
      console.error("Failed to toggle like:", err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Sheet isOpen={!!postId} onClose={onClose}>
      {isLoading ? (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
          <div className="animate-spin text-brand">
            <Icon name="cloudication" size={40} />
          </div>
        </div>
      ) : error || !post ? (
        <div className="p-12 flex flex-col items-center gap-6">
          <p className="text-invert/40 font-bold">{error || "見つかりませんでした"}</p>
          <Button onClick={onClose} label="閉じる" className="bg-invert text-surface px-8 rounded-full" />
        </div>
      ) : (
        <>
          {/* Image Section */}
          <div className="aspect-4/3 relative bg-invert/5 p-4">
            <img 
              src={post.image_url} 
              alt="Cloud" 
              className="w-full h-full object-cover mask-cloud shadow-inner rounded-3xl"
            />
            <div className="absolute top-8 left-8">
              <CaptionTag label="Captured" icon="camera" />
            </div>
          </div>

          {/* Info Section */}
          <div className="p-8 flex flex-col gap-6 overflow-y-auto">
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

            <div className="flex items-center justify-between pt-2">
              <button 
                onClick={handleToggleLike}
                disabled={isLiking}
                className={`group flex items-center gap-3 px-6 h-14 rounded-2xl transition-all ${
                  isLiking ? 'opacity-50' : 'hover:scale-105 active:scale-95'
                } bg-brand/5 border border-brand/10`}
              >
                <div className="text-brand">
                  <Icon name="post" size={24} />
                </div>
                <span className="text-lg font-black text-brand tabular-nums">
                  {post.likes_count}
                </span>
                <span className="text-xs font-bold text-brand/40 uppercase tracking-widest ml-1">Likes</span>
              </button>

              <div className="flex gap-2">
                <Button icon="help" className="button-white-overlay w-14 h-14 p-0" />
              </div>
            </div>
          </div>
        </>
      )}
    </Sheet>
  );
};

export default PostDetailModal;
