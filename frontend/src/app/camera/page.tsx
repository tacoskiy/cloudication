"use client";

import { useRef } from "react";

/**
 * NOTE:
 * 画像アップロードによる解析検証用ページ
 * CameraView は一瞬で再実装可能なため、こちらを正として採用
 */

export default function CameraPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:8000/images/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("analyze result:", data);
    } catch (err) {
      console.error("upload error:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-lg font-bold mb-4">画像アップロード（検証用）</h1>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
      />
    </div>
  );
}
