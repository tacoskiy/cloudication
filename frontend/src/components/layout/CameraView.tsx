"use client";

import { useEffect, useRef } from "react";

import Button from "../common/Button";

import { useCameraContext } from "@/hooks/camera/useCameraContext";

const CameraView = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const camera = useCameraContext();

  useEffect(() => {
    camera.attachCamera(videoRef);
  }, [camera])

  return (
    <div className="w-full h-[80vh] p-3 bg-bg-overlay rounded-[48px] overflow-clip relative flex flex-col justify-end gap-3">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover absolute top-0 left-0 z-0"
      ></video>
      {camera.error && <p className="text-red-600 text-sm text-center bg-bg w-fit px-4 py-3 rounded-full -translate-1/2 absolute top-24 left-1/2">{camera.error}</p>}

      <div className="w-full flex gap-3">
        <Button onClick={() => camera.capture(videoRef)} icon="x" className="bg-bg-overlay relative z-1 font-bold w-auto h-20 aspect-square"/>
        <Button onClick={() => camera.capture(videoRef)} icon="camera" label="写真を撮る" className="relative z-1 font-bold w-full h-20"/>
      </div>
    </div>
  );
};

export default CameraView;
