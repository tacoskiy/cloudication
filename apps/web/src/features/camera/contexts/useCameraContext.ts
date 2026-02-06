import { createContext, useContext } from "react";
import type { UseCameraReturn } from "@/features/camera";

export const CameraContext = createContext<UseCameraReturn | null>(null);

export const useCameraContext = (): UseCameraReturn => {
  const ctx = useContext(CameraContext);
  if (!ctx) {
    throw new Error("useCameraContext must be used within CameraProvider");
  }
  return ctx;
};