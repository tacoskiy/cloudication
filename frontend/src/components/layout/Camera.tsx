"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
          setError(null);
        }
      } catch (err) {
        setError("カメラの起動に失敗しました。権限を確認してください");
        console.error(err);
      }
    };

    startCamera();
  }, []);

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      // 配列の先頭に新しい画像を追加
      setImages((prev) => [dataUrl, ...prev]);
    }
  };

  return (
    <section>
      {!isStreaming && <p>カメラが接続されていません</p>}
      <div className="w-full h-180 bg-brand-secondary rounded-4xl overflow-clip">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        ></video>
        {error && <p className="text-red-600">{error}</p>}
        <button
          onClick={takePhoto}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-gray-300 rounded-full active:scale-90 transition-transform shadow-lg"
          aria-label="Take photo"
        />
      </div>
      <div>
        <h3 className="text-lg font-bold mb-3">撮影済み ({images.length}枚)</h3>
        {images.length === 0 ? (
          <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
            写真はまだありません
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, index) => (
              <div key={index} className="relative group aspect-square">
                <Image
                  src={img}
                  alt={`Captured photo ${index}`}
                  fill
                  className="object-cover rounded-lg border shadow-sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Camera;
