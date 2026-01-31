"use client";

import useCamera from "@/hooks/useCamera";
import { CameraContext } from "@/contexts/useCameraContext";

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
