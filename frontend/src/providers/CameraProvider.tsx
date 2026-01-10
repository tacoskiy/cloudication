"use client";

import { createContext } from "react";
import useCamera from "../hooks/useCamera";

export const CameraContext =
  createContext<ReturnType<typeof useCamera> | null>(null);

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
