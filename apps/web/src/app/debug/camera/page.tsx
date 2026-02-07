"use client";

import { useState } from "react";
import ModerateResultModal from "@/features/camera/components/ModerateResultModal";
import type { ImageModerateResponse } from "@cloudication/shared-types/image-moderate";
import Button from "@/features/shared/components/Button";

export default function CameraDebugPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<ImageModerateResponse | null>(null);

  const openModal = (status: ImageModerateResponse["status"]) => {
    const mockResult: ImageModerateResponse = {
      status,
      reasons: status === "rejected" ? ["雲が見当たりません"] : [],
      suggestions: status === "rejected" ? ["もっと雲を映してみてください"] : ["このまま投稿しましょう！"],
      image_token: "debug-token",
      preview_url: "https://images.unsplash.com/photo-1534088568595-a066f77cbc3d?q=80&w=1000&auto=format&fit=crop",
    };
    setResult(mockResult);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-surface p-6 flex flex-col items-center justify-center gap-6">
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-invert">Camera Debug</h1>
        <p className="text-sm text-invert/40 text-balance">
          モーダルのモバイル表示検証用ページ
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          onClick={() => openModal("accepted")}
          label="成功 (投稿へ)"
          className="bg-brand text-surface h-14"
        />
        <Button
          onClick={() => openModal("rejected")}
          label="失敗 (警告あり)"
          className="bg-alert text-surface h-14"
        />
        <Button
          onClick={() => openModal("accepted_with_warning")}
          label="注意付き成功"
          className="bg-warning text-surface h-14"
        />
      </div>

      <ModerateResultModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        result={result}
      />
    </div>
  );
}
