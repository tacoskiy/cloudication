import { useContext } from "react";
import { CameraContext } from "./CameraProvider";

export const useCameraContext = () => {
  const ctx = useContext(CameraContext);
  if (!ctx) {
    throw new Error("useCameraContext must be used within CameraProvider");
  }
  return ctx;
};