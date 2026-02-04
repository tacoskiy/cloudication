"use client";

import { useEffect, useRef, useState } from "react";

import Button from "../common/Button";

import { useCameraContext } from "@/contexts/useCameraContext";
import { analyzeImage, AnalysisResponse } from "@/lib/api";

const CameraView = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shutterRef = useRef<HTMLDivElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const camera = useCameraContext();

  useEffect(() => {
    if (videoRef.current) {
      camera.attachCamera(videoRef);
    }

    return () => {
      camera.detachCamera(videoRef);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const capture = async () => {
    if (!videoRef.current || isAnalyzing) return;
    
    // 1. キャプチャを実行
    camera.capture(videoRef);
    playShutter();

    // 2. プレビューが表示される前にキャンバスからBlobを生成して解析に投げる
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    const blob = dataURLtoBlob(dataUrl);

    // 3. 解析開始
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeImage(blob);
      setAnalysisResult(result);
      if (result.status === "rejected") {
        setAnalysisError(result.message);
      }
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "解析に失敗しました");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const playShutter = () => {
    const el = shutterRef.current;
    if (!el) return;

    el.animate([{ opacity: 0 }, { opacity: 1, offset: 0.4 }, { opacity: 0 }], {
      duration: 200,
      easing: "ease-out",
      fill: "none",
    });
  };

  return (
    <div className="w-full h-[80vh] p-3 bg-surface/24 rounded-[48px] overflow-clip relative flex flex-col justify-end gap-3">
      <div
        ref={shutterRef}
        className="pointer-events-none absolute inset-0 bg-black z-10 opacity-0"
      />
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover absolute top-0 left-0 z-0 transition-all duration-100"
      ></video>

      {/* ステータス表示 */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 w-full px-6">
        {camera.error && (
          <p className="text-red-600 text-sm text-center bg-surface w-fit px-4 py-3 rounded-full shadow-lg">
            {camera.error}
          </p>
        )}
        {isAnalyzing && (
          <div className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full shadow-lg animate-pulse">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-bold">解析中...</span>
          </div>
        )}
        {analysisError && (
          <div className="bg-red-500 text-white px-6 py-4 rounded-3xl shadow-lg max-w-sm">
            <p className="text-sm font-bold mb-1">エラー: {analysisError}</p>
            {analysisResult?.suggestions && (
              <ul className="text-xs opacity-90 list-disc list-inside">
                {analysisResult.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        {analysisResult?.status === "accepted_with_warning" && !isAnalyzing && (
          <div className="bg-amber-500 text-white px-6 py-4 rounded-3xl shadow-lg max-w-sm">
            <p className="text-sm font-bold mb-1">注意: {analysisResult.message}</p>
            <ul className="text-xs opacity-90 list-disc list-inside">
              {analysisResult.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="w-full flex gap-3 relative z-2">
        <Button
          onClick={() => {
            camera.setCapturedImage(null);
            setAnalysisResult(null);
            setAnalysisError(null);
          }}
          icon="x"
          className="button-white-overlay w-auto h-20 aspect-square"
          disabled={isAnalyzing}
        />
        <Button
          onClick={capture}
          icon={isAnalyzing ? undefined : "camera"}
          label={isAnalyzing ? "解析中..." : "写真を撮る"}
          className="relative z-1 font-bold w-full h-20"
          disabled={isAnalyzing || !!camera.capturedImage}
        />
      </div>

      {camera.capturedImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={camera.capturedImage}
          alt="captured"
          className={`absolute inset-0 w-full h-full object-cover z-1 transition-opacity duration-300 ${
            analysisResult?.status === "rejected" ? "opacity-40 grayscale" : "opacity-100"
          }`}
        />
      )}
    </div>
  );
};

export default CameraView;
