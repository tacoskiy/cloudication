"use client";

import { useRef } from "react";

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
    <div style={{ padding: 24 }}>
      <h1>画像アップロード（仮）</h1>

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