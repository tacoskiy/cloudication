"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type PermissionStatus = "granted" | "denied" | "prompt" | "loading";

export const usePermissionStatuses = () => {
  const [cameraStatus, setCameraStatus] = useState<PermissionStatus>("loading");
  const [locationStatus, setLocationStatus] = useState<PermissionStatus>("loading");

  const isUpdatingRef = useRef(false);
  const [isUpdatingState, setIsUpdatingState] = useState(false);

  const updateStatuses = useCallback(async () => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;
    setIsUpdatingState(true);
    
    // Location check
    try {
      const locationRes = await navigator.permissions.query({ name: "geolocation" });
      setLocationStatus(locationRes.state);
      
      locationRes.onchange = () => {
        setLocationStatus(locationRes.state);
      };
    } catch (err) {
      console.error("Failed to query location permission:", err);
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
    }
    
    isUpdatingRef.current = false;
    setIsUpdatingState(false);
  }, []);

  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      await updateStatuses();
      return true;
    } catch (err) {
      console.error("Camera permission request failed:", err);
      setCameraStatus("denied");
      return false;
    }
  }, [updateStatuses]);

  const requestLocationPermission = useCallback(async () => {
    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      await updateStatuses();
      return true;
    } catch (err: any) {
      console.error("Location permission request failed:", err);
      // code 1 is PERMISSION_DENIED
      if (err.code === 1) {
        setLocationStatus("denied");
      }
      return false;
    }
  }, [updateStatuses]);

  useEffect(() => {
    updateStatuses();

    const handleFocus = () => {
      // Focus can happen when returning from system dialogs
      updateStatuses();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [updateStatuses]);

  return {
    cameraStatus,
    locationStatus,
    refresh: updateStatuses,
    requestCameraPermission,
    requestLocationPermission,
    isLoading: cameraStatus === "loading" || locationStatus === "loading" || isUpdatingState
  };
};
