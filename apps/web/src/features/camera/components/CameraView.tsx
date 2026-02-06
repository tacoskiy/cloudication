"use client";

import { useEffect, useRef, useState } from "react";

import Button from "@/components/common/Button";

import { useCameraContext } from "@/contexts/useCameraContext";
import { apiFetch } from "@/lib/apiFetch";
import { ImageModerateResponse } from "@cloudication/shared-types/image-moderate";
import ModerateResultModal from "./ModerateResultModal";
import PermissionModal from "./PermissionModal";

const CameraView = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shutterRef = useRef<HTMLDivElement>(null);
  const [isModerating, setIsModerating] = useState(false);
  const [moderateResult, setModerateResult] = useState<ImageModerateResponse | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  const camera = useCameraContext();

  useEffect(() => {
    const checkAndAttach = async () => {
      const status = await camera.getPermissionStatus?.();
      if (status === "granted") {
        await camera.attachCamera(videoRef);
        playFadeIn();
      } else {
        setIsPermissionModalOpen(true);
      }
    };
    checkAndAttach();

    const handleVisibility = () => {
      if (document.hidden) {
        camera.detachCamera(videoRef);
      } else {
        camera.attachCamera(videoRef).then(() => playFadeIn());
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      camera.detachCamera(videoRef, true); // unmount時はストリームを完全に停止
    };
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

  const playShutter = () => {
    const el = shutterRef.current;
    if (!el) return;

    el.animate([{ opacity: 0 }, { opacity: 1, offset: 0.4 }, { opacity: 0 }], {
      duration: 200,
      easing: "ease-out",
      fill: "none",
    });
  };

  const playFadeIn = () => {
    const el = shutterRef.current;
    if (!el) return;

    el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 600,
      easing: "ease-out",
      fill: "forwards",
    });
  };

  const capture = async () => {
    if (!videoRef.current || isModerating) return;

    // 1. キャプチャを実行
    camera.capture(videoRef);
    playShutter();

    // 2. プレビューが表示される前にキャンバスからBlobを生成して解析に投げる
    const canvas = document.createElement("canvas");
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const vWidth = videoRef.current.videoWidth;
    const vHeight = videoRef.current.videoHeight;
    const sx = (vWidth - size) / 2;
    const sy = (vHeight - size) / 2;

    if (ctx) {
      ctx.drawImage(videoRef.current, sx, sy, size, size, 0, 0, size, size);
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
    }
  };

  const resetCapture = () => {
    camera.setCapturedImage(null);
    setIsResultModalOpen(false);
  };

  return (
    <div className="w-full h-[80vh] p-3 bg-surface/24 rounded-[48px] overflow-clip relative flex flex-col justify-end gap-3">
      <ModerateResultModal result={moderateResult!} onClose={resetCapture} isOpen={isResultModalOpen} />
      <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        type="camera"
        onRetry={() => camera.attachCamera(videoRef, true)}
      />
      <div
        ref={shutterRef}
        className="pointer-events-none absolute inset-0 bg-black z-10 opacity-100"
      />
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover absolute top-0 left-0 z-0 transition-all duration-100"
      ></video>

      {/* クロップガイド (雲型のスポットライトビネット) */}
      {!camera.capturedImage && !isModerating && (
        <div className="absolute inset-0 z-1 bg-black/60 mask-cloud-hole pointer-events-none" />
      )}

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
          className={`absolute inset-0 w-full h-full object-cover z-1 transition-opacity duration-300 ${moderateResult?.status === "rejected" ? "opacity-40 grayscale" : "opacity-100"
            }`}
        />
      )}
    </div>
  );
};

export default CameraView;
