"use client";

import { useState, useEffect } from "react";
import Button from "@/features/shared/components/Button";
import Icon from "@/features/shared/components/Icon";
import { apiFetch } from "@/lib/apiFetch";
import { getOrCreateClientId } from "@/lib/cookie";
import { CreateCloudPostRequest, CreateCloudPostResponse } from "@cloudication/shared-types/cloud-post";
import PermissionModal from "@/features/shared/components/PermissionModal";
import { useRouter } from "next/navigation";


const PLACEHOLDERS = [
  // 名前・見立て
  "この雲、何に見える？",
  "ふわふわな、わたあめみたい",
  "空を飛ぶクジラを発見！",
  "ソフトクリーム、食べたくなっちゃった",

  // 今の気持ち
  "今の気分は、こんな感じ",
  "見上げたら、少し元気が出た",
  "のんびり、空を眺めていたいな",
  "今日の空は、特別きれいだね",

  // 大喜利・ネタ
  "新種の未確認浮遊物体…？",
  "ここだけの話、実はあそこに宝が…",
  "空からの、ひそひそ話",
  "自由すぎる、雲のカタチ",
];


interface PostFormViewProps {
  imageToken: string;
  imageUrl?: string;
  onBack: () => void;
  onSubmit: () => void;
}

const PostFormView = ({ imageToken, imageUrl, onBack, onSubmit }: PostFormViewProps) => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [placeholder] = useState(() => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);


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
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("コメントを入力してください");
      return;
    }
    if (trimmedContent.length > 28) {
      setError("コメントは28文字以内で入力してください");
      return;
    }
    if (!imageToken) return;

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
          content: trimmedContent,
          image_token: imageToken,
          lat: coords.lat,
          lng: coords.lng,
          client_id: clientId,
        },
      });

      onSubmit();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "投稿に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        type="location"
        onRetry={requestLocation}
      />

      <div className="py-2 flex justify-center">
        <h2 className="text-md font-medium text-invert/40">雲にコメントをつけよう</h2>
      </div>

      {imageUrl && (
        <div className="relative group h-fit">
          <img
            src={imageUrl}
            alt="Captured"
            className="w-full aspect-4/3 max-h-64 object-cover mask-cloud bg-surface-muted"
          />
        </div>
      )}


      <div className="flex flex-col gap-2">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 28))}
            placeholder={placeholder}
            className="w-full h-32 bg-invert/5 border border-invert/10 rounded-[24px] p-6 text-base text-invert placeholder:text-invert/20 focus:outline-none focus:border-brand/40 transition-all resize-none leading-relaxed"
          />
          <div className="absolute bottom-0 right-0 px-4 py-6 pointer-events-none">
            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${content.length > 28 ? 'bg-alert/12 text-alert' : 'bg-invert/5 text-invert/40'}`}>
              {content.length}/28
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-alert/8 p-3 rounded-2xl flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
            <Icon name="not_enough_clouds" size={14} className="text-alert shrink-0" />
            <p className="text-alert text-[10px] font-bold">{error}</p>
          </div>
        )}
        <Button
          onClick={handleSubmit}
          label={isSubmitting ? "送信中..." : "世界に流す"}
          icon="cloudication"
          className="w-full h-auto py-6 rounded-[24px]! font-bold bg-brand text-surface shadow-lg shadow-brand/20 active:scale-95 transition-all"
          disabled={isSubmitting || !content.trim()}
        />

      </div>
    </div>
  );
};

export default PostFormView;
