"use client";

import { useEffect, useState, useRef } from "react";
import Map, { Marker, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

type Location = {
  latitude: number;
  longitude: number;
};

const FALLBACK_LOCATION: Location = {
  latitude: 35.6812,
  longitude: 139.7671,
};

export default function MapView() {
  const [location, setLocation] = useState<Location | null>(null);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocation(FALLBACK_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => {
        setLocation(FALLBACK_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
      }
    );
  }, []);

  // 🔑 位置が確定するまで Map を描画しない
  if (!location) {
    return <div className="h-[50vh]" />;
  }

  return (
    <div className="relative w-full h-[80vh] rounded-4xl overflow-hidden">
      <Map
        ref={mapRef}
        initialViewState={{
          ...location,
          zoom: 14,
        }}
        mapStyle="mapbox://styles/tacoskiy/cml3kbgaa000o01sx18mgawxv"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        reuseMaps
        maxZoom={20}
        minZoom={10}
      >
        <Marker {...location} anchor="bottom">
          <button
            aria-label="現在地"
            className="w-4 h-4 rounded-full bg-blue-500 shadow"
          />
        </Marker>
      </Map>
    </div>
  );
}
