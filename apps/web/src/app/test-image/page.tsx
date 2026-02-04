"use client";

import { useRef, useState } from "react";

type AnalyzeResult =
  | { status: "success"; message?: string; preview_url: string }
  | { status: "warning"; message: string; preview_url: string }
  | {
      status: "rejected";
      reason_code: string;
      message: string;
      suggestions?: string[];
    };

export default function CameraPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);

    /* =========================
       ❗ クライアント側バリデーション
    ========================= */
    if (!file.type.startsWith("image/")) {
      setError("画像ファイルを選択してください。");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("画像サイズは10MB以下にしてください。");
      return;
    }

    const formData = new FormData();

    // ❗ filename を必ず指定
    formData.append("image", file, file.name);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/images/analyze", {
        method: "POST",
        body: formData,
      });

      const data: AnalyzeResult = await res.json();
      console.log("analyze result:", data);

      if (!res.ok) {
        setResult(data);
        return;
      }

      setResult(data);
    } catch (err) {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-lg font-bold">画像アップロード（検証用）</h1>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        capture="environment"
        onChange={handleChange}
      />

      {loading && <p className="text-sm text-gray-500">解析中...</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="border rounded p-4 text-sm space-y-2">
          <p>
            <strong>Status:</strong> {result.status}
          </p>

          {"message" in result && result.message && (
            <p>{result.message}</p>
          )}

          {"suggestions" in result && result.suggestions && (
            <ul className="list-disc pl-5">
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}

          {"preview_url" in result && (
            <img
              src={result.preview_url}
              alt="preview"
              className="max-w-xs rounded"
            />
          )}
        </div>
      )}
    </div>
  );
}
