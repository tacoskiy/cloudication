"use client";

import { useEffect, useRef, useState } from "react";

import Button from "@/components/common/Button";

import { useCameraContext } from "@/contexts/useCameraContext";
import { apiFetch } from "@/lib/apiFetch";
import { ImageModerateResponse } from "@cloudication/shared-types/image-moderate";
import ModerateResultModal from "./ModerateResultModal";

const CameraView = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shutterRef = useRef<HTMLDivElement>(null);
  const [isModerating, setIsModerating] = useState(false);
  const [moderateResult, setModerateResult] = useState<ImageModerateResponse | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

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
    if (!videoRef.current || isModerating) return;
    
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
    setIsModerating(true);
    setModerateResult(null);
    setIsResultModalOpen(false);

    try {
      const formData = new FormData();
      formData.append("image", blob, "capture.jpg");

      const result = await apiFetch<ImageModerateResponse>("/api/image-moderate", {
        method: "POST",
        body: formData,
      });

      setModerateResult(result);
      setIsResultModalOpen(true);
    } catch (err: any) {
    } finally {
      setIsModerating(false);
    }
  };

  const resetCapture = () => {
    camera.setCapturedImage(null);
    setIsResultModalOpen(false);
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
      <ModerateResultModal result={moderateResult!} onClose={resetCapture} isOpen={isResultModalOpen} />
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

      <div className="w-full flex gap-3 relative z-2">
        <Button
          onClick={resetCapture}
          icon="x"
          className="button-white-overlay w-auto h-20 aspect-square"
          disabled={isModerating}
        />

        <Button
          onClick={capture}
          icon={isModerating ? undefined : "camera"}
          label={isModerating ? "解析中..." : "写真を撮る"}
          className="relative z-1 font-bold w-full h-20 bg-brand-accent"
          disabled={isModerating || !!camera.capturedImage}
        />
      </div>

      {camera.capturedImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={camera.capturedImage}
          alt="captured"
          className={`absolute inset-0 w-full h-full object-cover z-1 transition-opacity duration-300 ${
            moderateResult?.status === "rejected" ? "opacity-40 grayscale" : "opacity-100"
          }`}
        />
      )}
    </div>
  );
};

export default CameraView;
