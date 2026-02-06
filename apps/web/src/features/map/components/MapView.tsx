"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Map, { Marker, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { apiFetch } from "@/lib/apiFetch";
import { CloudPost } from "@cloudication/shared-types/cloud-post";
import PostDetailModal from "@/features/posts/components/PostDetailModal";
import PermissionModal from "@/features/shared/components/PermissionModal";
import Button from "@/features/shared/components/Button";
import PostMarker from "./PostMarker";

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
  const [posts, setPosts] = useState<CloudPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const mapRef = useRef<MapRef>(null);
  const router = useRouter();

  const requestLocation = async (force = false) => {
    if (!navigator.geolocation) {
      setLocation(FALLBACK_LOCATION);
      return;
    }

    if (!force) {
      try {
        const status = await navigator.permissions.query({ name: "geolocation" });
        if (status.state !== "granted") {
          setIsPermissionModalOpen(true);
          setLocation(FALLBACK_LOCATION);
          return;
        }
      } catch {
        // Fallback for browsers that don't support query
      }
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setLocation(newCoords);
        setIsPermissionModalOpen(false);

        // マップを現在地に飛ばす
        mapRef.current?.flyTo({
          center: [newCoords.longitude, newCoords.latitude],
          zoom: 14,
          duration: 2000,
          essential: true
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setIsPermissionModalOpen(true);
        }
        setLocation(FALLBACK_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
      }
    );
  };

  useEffect(() => {
    // 投稿一覧を取得
    const fetchPosts = async () => {
      try {
        const data = await apiFetch<CloudPost[]>("/api/cloud-posts");
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts for map:", err);
      }
    };
    fetchPosts();
    requestLocation();
  }, []);

  // 🔑 位置が確定するまで Map を描画しない
  if (!location) {
    return <div className="h-[50vh]" />;
  }

  return (
    <>
      <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        type="location"
        onRetry={() => requestLocation(true)}
      />
      <div className="relative w-full h-[80vh] rounded-4xl overflow-hidden shadow-2xl border border-white/10">
        <Map
          ref={mapRef}
          initialViewState={{
            ...location,
            zoom: 14,
          }}
          mapStyle="mapbox://styles/tacoskiy/cml3kbgaa000o01sx18mgawxv"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          reuseMaps
          attributionControl={false}
          maxZoom={20}
          minZoom={10}
        >
          {/* 現在地マーカー */}
          <Marker {...location} anchor="center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping" />
              <div className="relative w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
            </div>
          </Marker>

          {/* 投稿マーカー（サムネイル） */}
          {posts.map((post) => (
            <PostMarker
              key={post.id}
              post={post}
              onClick={setSelectedPostId}
            />
          ))}
        </Map>

        {/* 撮影ボタン (フローティング) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-full max-w-[280px] px-6">
          <Button
            onClick={() => router.push("/camera")}
            icon="camera"
            label="雲をキャッチする"
            className="w-full h-16 bg-brand-accent text-invert font-bold text-lg shadow-[0_8px_32px_rgba(145,203,62,0.4)] hover:scale-105 active:scale-95 transition-all rounded-2xl border-4 border-white/20"
          />
        </div>
      </div>

      {/* ポスト詳細モーダル */}
      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </>
  );
}
