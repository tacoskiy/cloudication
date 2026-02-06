"use client";

import { useState, useEffect, useCallback } from "react";

export type PermissionStatus = "granted" | "denied" | "prompt" | "loading";

export const usePermissionStatuses = () => {
  const [cameraStatus, setCameraStatus] = useState<PermissionStatus>("loading");
  const [locationStatus, setLocationStatus] = useState<PermissionStatus>("loading");

  const updateStatuses = useCallback(async () => {
    // Location check
    try {
      const locationRes = await navigator.permissions.query({ name: "geolocation" });
      setLocationStatus(locationRes.state);
      
      locationRes.onchange = () => {
        setLocationStatus(locationRes.state);
      };
    } catch (err) {
      console.error("Failed to query location permission:", err);
      setLocationStatus("prompt");
    }

    // Camera check
    try {
      // Some browsers (like Safari) might not support 'camera' in query
      const cameraRes = await navigator.permissions.query({ name: "camera" as PermissionName });
      setCameraStatus(cameraRes.state);

      cameraRes.onchange = () => {
        setCameraStatus(cameraRes.state);
      };
    } catch (err) {
      console.error("Failed to query camera permission:", err);
      // Fallback: we might need to actually try to access the camera or just assume prompt
      setCameraStatus("prompt");
    }
  }, []);

  useEffect(() => {
    updateStatuses();

    // Re-check on window focus (user might have changed settings in another tab/native settings)
    window.addEventListener("focus", updateStatuses);
    return () => window.removeEventListener("focus", updateStatuses);
  }, [updateStatuses]);

  return { cameraStatus, locationStatus, refresh: updateStatuses };
};
