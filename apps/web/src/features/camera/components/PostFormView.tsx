"use client";

import { useState, useEffect } from "react";
import Button from "@/features/shared/components/Button";
import Icon from "@/features/shared/components/Icon";
import { apiFetch } from "@/lib/apiFetch";
import { getOrCreateClientId } from "@/lib/cookie";
import { CreateCloudPostRequest, CreateCloudPostResponse } from "@cloudication/shared-types/cloud-post";
import PermissionModal from "@/features/shared/components/PermissionModal";

interface PostFormViewProps {
  imageToken: string;
  imageUrl?: string;
  onBack: () => void;
  onSubmit: () => void;
}

const PostFormView = ({ imageToken, imageUrl, onBack, onSubmit }: PostFormViewProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("位置情報を取得できません（非対応）");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setError(null);
        setIsPermissionModalOpen(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        if (err.code === err.PERMISSION_DENIED) {
          setIsPermissionModalOpen(true);
        }
        setError("位置情報の取得に失敗しました。設定を確認してください。");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const handleSubmit = async () => {
    if (!content.trim() || !imageToken) return;
    if (!coords) {
      setError("位置情報を取得中です。しばらくお待ちください。");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const clientId = getOrCreateClientId();
      
      await apiFetch<CreateCloudPostResponse, CreateCloudPostRequest>("/api/cloud-posts", {
        method: "POST",
        body: {
          content,
          image_token: imageToken,
          lat: coords.lat,
          lng: coords.lng,
          client_id: clientId,
        },
      });

      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "投稿に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <PermissionModal 
        isOpen={isPermissionModalOpen} 
        onClose={() => setIsPermissionModalOpen(false)} 
        type="location"
        onRetry={requestLocation}
      />
      {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Captured" 
            className="w-auto h-64 aspect-auto object-cover mask-cloud"
          />
      )}

      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 280))}
            placeholder="この雲、なんて言うんだろう？"
            className="w-full h-32 bg-invert/5 border border-invert/10 rounded-[32px] p-6 text-base text-invert placeholder:text-invert/20 focus:outline-none focus:border-brand/40 transition-all resize-none leading-relaxed"
          />
          <div className="absolute bottom-4 right-6 pointer-events-none">
            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${content.length > 200 ? 'bg-alert/12 text-alert' : 'bg-invert/5 text-invert/40'}`}>
              {content.length}/280
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-alert/8 p-3 rounded-2xl flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
            <Icon name="not_enough_clouds" size={14} className="text-alert shrink-0" />
            <p className="text-alert text-[10px] font-bold">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={onBack}
            className="flex-1 h-14 rounded-2xl font-bold text-invert/60 bg-invert/5"
            label="戻る"
            disabled={isSubmitting}
          />
          <Button
            onClick={handleSubmit}
            label={isSubmitting ? "送信中..." : "世界に流す"}
            icon="post"
            className="flex-2 h-14 rounded-2xl font-bold bg-brand text-surface shadow-lg shadow-brand/20 active:scale-95 transition-all"
            disabled={isSubmitting || !content.trim()}
          />
        </div>
      </div>
    </div>
  );
};

export default PostFormView;
