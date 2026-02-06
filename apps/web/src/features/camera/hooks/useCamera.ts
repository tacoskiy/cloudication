"use client";

import { useState, useRef, useCallback } from "react";

const useCamera = () => {
  const [isCameraAttached, setCameraAttached] = useState<boolean>(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // レンダリングサイクルに関係なく、常に最新のストリームを参照できるようにRefを使用
  const streamRef = useRef<MediaStream | null>(null);
  const shouldBeActiveRef = useRef<boolean>(false);

  const getPermissionStatus = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: "camera" as PermissionName });
      return result.state; // 'granted', 'denied', 'prompt'
    } catch {
      return "prompt";
    }
  }, []);

  const attachCamera = useCallback(async (
    videoRef: React.RefObject<HTMLVideoElement | null>,
    force = false
  ) => {
    shouldBeActiveRef.current = true;

    // すでに指定されたvideoRefに現在のストリームがセットされている場合は何もしない
    if (videoRef.current?.srcObject === streamRef.current && streamRef.current) {
      setCameraAttached(true);
      return;
    }

    // 自動実行時は granted の場合のみ実行する
    if (!force && !streamRef.current) {
      const status = await getPermissionStatus();
      if (status !== "granted") {
        if (status === "denied") setIsPermissionDenied(true);
        return;
      }
    }

    try {
      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 },
          },
          audio: false,
        });

        // 非同期処理の間にデタッチ（アンマウント）されていたら即座に停止する
        if (!shouldBeActiveRef.current) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        await videoRef.current.play();
        setCameraAttached(true);
        setIsPermissionDenied(false);
        setError(null);
      }
    } catch (err) {
      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
            setError("カメラ権限が拒否されています");
            setIsPermissionDenied(true);
            break;
          case "NotFoundError":
            setError("カメラが見つかりません");
            break;
          default:
            setError("カメラの起動に失敗しました");
        }
      }
    }
  }, [getPermissionStatus]);

  const detachCamera = useCallback(async (
    videoRef: React.RefObject<HTMLVideoElement | null>,
    stopStream = false
  ) => {
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (stopStream) {
      shouldBeActiveRef.current = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCameraAttached(false);
    }
  }, []);

  const capture = useCallback((videoRef: React.RefObject<HTMLVideoElement | null>) => {
    if (!videoRef.current || videoRef.current.videoWidth === 0) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    
    // クロップサイズを400x400に固定
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // 中央を計算
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    if (ctx) {
      ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      setCapturedImage(dataUrl);
    }
  }, []);

  return {
    isCameraAttached,
    isPermissionDenied,
    getPermissionStatus,
    error,
    capturedImage,
    setCapturedImage,
    attachCamera,
    detachCamera,
    capture,
  };
};

export default useCamera;
export type UseCameraReturn = ReturnType<typeof useCamera>;
