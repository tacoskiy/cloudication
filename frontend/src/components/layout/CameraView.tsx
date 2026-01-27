"use client";

import { useEffect, useRef } from "react";

import Button from "../common/Button";

import { useCameraContext } from "@/contexts/useCameraContext";

const CameraView = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shutterRef = useRef<HTMLDivElement>(null);

  const camera = useCameraContext();

  useEffect(() => {
    if (!videoRef.current) return;

    camera.attachCamera(videoRef);
  }, [camera]);

  const capture = () => {
    if (!videoRef.current) return;
    camera.capture(videoRef);
    playShutter();
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
    <div className="w-full h-[80vh] p-3 bg-bg-surface/24 rounded-[48px] overflow-clip relative flex flex-col justify-end gap-3">
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

      {camera.error && (
        <p className="text-red-600 text-sm text-center bg-bg-surface w-fit px-4 py-3 rounded-full -translate-1/2 absolute top-24 left-1/2">
          {camera.error}
        </p>
      )}

      <div className="w-full flex gap-3 relative z-2">
        <Button
          onClick={() => {camera.setCapturedImage(null)}}
          icon="x"
          className="button-white-overlay w-auto h-20 aspect-square"
        />
        <Button
          onClick={capture}
          icon="camera"
          label="写真を撮る"
          className="relative z-1 font-bold w-full h-20"
        />
      </div>

      {camera.capturedImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={camera.capturedImage}
          alt="captured"
          className="absolute inset-0 w-full h-full object-cover z-1"
        />
      )}
    </div>
  );
};

export default CameraView;
