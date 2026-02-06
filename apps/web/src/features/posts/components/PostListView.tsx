"use client";

import { useEffect, useState } from "react";
import { CloudPost } from "@cloudication/shared-types/cloud-post";
import { apiFetch } from "@/lib/apiFetch";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";
import PostDetailModal from "@/features/posts/components/PostDetailModal";

const PostListView = () => {
  const [posts, setPosts] = useState<CloudPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch<CloudPost[]>("/api/cloud-posts");
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("投稿の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-6">
      <div className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-bold text-invert flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand/12 flex items-center justify-center">
            <Icon name="post" size={24} className="text-brand" />
          </div>
          最近の雲
        </h1>
        <Button
          onClick={fetchPosts}
          icon="help" // 適当なリフレッシュ用アイコン
          className="button-white-overlay h-10 w-10 p-0"
          disabled={isLoading}
        />
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
          <div className="animate-spin text-brand">
            <Icon name="cloudication" size={48} />
          </div>
          <p className="text-invert/40 font-bold text-sm tracking-widest">
            雲を探しています...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-alert/8 p-6 rounded-3xl flex flex-col items-center gap-4 border border-alert/10">
          <p className="text-alert font-bold">{error}</p>
          <Button
            onClick={fetchPosts}
            label="再試行"
            className="bg-alert text-surface px-6 h-10 text-sm font-bold rounded-full"
          />
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <div className="bg-invert/5 p-12 rounded-[42px] flex flex-col items-center gap-4 border border-invert/5">
          <Icon name="not_enough_clouds" size={48} className="text-invert/10" />
          <p className="text-invert/30 font-bold text-sm">
            まだ誰も雲を投稿していないようです
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {posts.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedPostId(post.id)}
            className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-invert/5 flex flex-col cursor-pointer active:scale-[0.98]"
          >
            <div className="aspect-16/10 relative overflow-hidden bg-invert/5">
              <img
                src={post.image_url}
                alt="Cloud post"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mask-cloud"
              />
              <div className="absolute top-4 left-4">
                <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20">
                  <Icon name="camera" size={14} className="text-white" />
                  <span className="text-[10px] text-white font-bold tracking-wider uppercase">
                    Captured
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <p className="text-invert text-base leading-relaxed font-medium line-clamp-2">
                {post.content}
              </p>

              <div className="flex items-center justify-between mt-2 pt-4 border-t border-invert/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-brand">
                    <Icon name="post" size={16} />
                    <span className="text-xs font-bold leading-none tabular-nums">
                      {post.likes_count}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-invert/30">
                    <Icon name="help" size={16} /> {/* 位置アイコン代わり */}
                    <span className="text-[10px] font-bold">
                      {new Date(post.created_at).toLocaleDateString("ja-JP", {
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ポスト詳細モーダル */}
      {selectedPostId && (
        <PostDetailModal 
          postId={selectedPostId} 
          onClose={() => setSelectedPostId(null)} 
        />
      )}
    </div>
  );
};

export default PostListView;
