import { useState } from "react";

const useCamera = () => {
  const [isCameraAttached, setCameraAttached] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const attachCamera = async (videoRef: React.RefObject<HTMLVideoElement | null>) => {
    if (isCameraAttached) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraAttached(true);
        setError(null);
      }
    } catch (err) {
      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
            setError("カメラ権限が拒否されています");
            break;
          case "NotFoundError":
            setError("カメラが見つかりません");
            break;
          default:
            setError("カメラの起動に失敗しました");
        }
      }
    }
  };

  const detachCamera = async (videoRef: React.RefObject<HTMLVideoElement | null>) => {
    const video = videoRef.current;
    if (!video || !video.srcObject) return;

    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());

    video.srcObject = null;
    setCameraAttached(false);
  };

  const capture = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
    if (!videoRef.current || videoRef.current.videoWidth === 0) return;

    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      setCapturedImage(dataUrl);
    }
  };

  return {
    isCameraAttached,
    error,
    capturedImage,
    attachCamera,
    detachCamera,
    capture,
  };
};

export default useCamera;