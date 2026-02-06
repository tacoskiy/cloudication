"use client";

import { useCamera } from "@/features/camera";
import { CameraContext } from "@/features/camera/contexts/useCameraContext";

export const CameraProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const camera = useCamera();

  return (
    <CameraContext.Provider value={camera}>
      {children}
    </CameraContext.Provider>
  );
};
