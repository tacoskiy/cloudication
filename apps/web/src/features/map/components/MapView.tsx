"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Map, { Marker, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { apiFetch } from "@/lib/apiFetch";
import { getOrCreateClientId } from "@/lib/cookie";
import type { CloudPost } from "@cloudication/shared-types/cloud-post";
import PostDetailModal from "@/features/posts/components/PostDetailModal";
import PermissionModal from "@/features/shared/components/PermissionModal";
import SystemPermissionModal from "@/features/shared/components/SystemPermissionModal";
import Button from "@/features/shared/components/Button";
import PostMarker from "./PostMarker";
import { MOCK_POSTS } from "../constants/mockPosts";


type Location = {
  latitude: number;
  longitude: number;
};

const FALLBACK_LOCATION: Location = {
  latitude: 35.6812,
  longitude: 139.7671,
};

const OVERLAP_THRESHOLD = 48;

export default function MapView() {
  const [location, setLocation] = useState<Location | null>(null);
  const [posts, setPosts] = useState<CloudPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [overlappingPostIds, setOverlappingPostIds] = useState<Set<string>>(new Set());
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isSystemDenied, setIsSystemDenied] = useState(false);
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
        if (status.state === "denied") {
          setIsSystemDenied(true);
          setIsPermissionModalOpen(true);
          setLocation(FALLBACK_LOCATION);
          return;
        }
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
        if (err.code === 1) { // 1 is PERMISSION_DENIED
          setIsSystemDenied(true);
        }
        setIsPermissionModalOpen(true);
        setLocation(FALLBACK_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
      }
    );
  };

  const updateOverlaps = () => {
    const map = mapRef.current?.getMap();
    if (!map || posts.length === 0) return;

    const overlaps = new Set<string>();
    const pixelCoords = posts.map(post => {
      if (post.lat === null || post.lng === null) return null;
      // Mapbox の raw instance から投影座標を取得
      const point = map.project([post.lng, post.lat]);
      return { id: post.id, x: point.x, y: point.y, lat: post.lat };
    }).filter((p): p is NonNullable<typeof p> => p !== null);

    // 距離の閾値 (ピクセル)
    const THRESHOLD = OVERLAP_THRESHOLD;

    for (let i = 0; i < pixelCoords.length; i++) {
      for (let j = i + 1; j < pixelCoords.length; j++) {
        const p1 = pixelCoords[i];
        const p2 = pixelCoords[j];

        const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

        if (dist < THRESHOLD) {
          overlaps.add(p1.id);
          overlaps.add(p2.id);
        }
      }
    }
    setOverlappingPostIds(new Set(overlaps));
  };

  useEffect(() => {
    // 投稿一覧を取得
    const fetchPosts = async () => {
      try {
        const clientId = getOrCreateClientId();
        const data = await apiFetch<CloudPost[]>(`/api/cloud-posts?client_id=${clientId}`);
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts for map, using mock data:", err);
        setPosts(MOCK_POSTS);
      }
    };
    fetchPosts();
    requestLocation();
  }, []);

  const handleMarkerClick = (post: CloudPost) => {
    if (overlappingPostIds.has(post.id)) {
      const map = mapRef.current?.getMap();
      if (!map) return;

      const currentZoom = map.getZoom();
      const point1 = map.project([post.lng!, post.lat!]);

      let maxTargetZoom = currentZoom;

      posts.forEach((p) => {
        if (p.id === post.id || p.lat === null || p.lng === null) return;
        const point2 = map.project([p.lng, p.lat]);
        const dist = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));

        if (dist < OVERLAP_THRESHOLD && dist > 0) {
          // dist * 2^(zoom_diff) = THRESHOLD
          // 2^(zoom_diff) = THRESHOLD / dist
          // zoom_diff = log2(THRESHOLD / dist)
          const requiredZoom = currentZoom + Math.log2(OVERLAP_THRESHOLD / dist);
          if (requiredZoom > maxTargetZoom) {
            maxTargetZoom = requiredZoom;
          }
        }
      });

      // 段階的（+2）ではなく、計算されたズーム + バッファ（+0.5）で一気にズーム
      // 最大ズームを20に制限
      const finalZoom = Math.min(Math.max(maxTargetZoom + 0.5, currentZoom + 1), 20);

      mapRef.current?.flyTo({
        center: [post.lng!, post.lat!],
        zoom: finalZoom,
        duration: 800,
        essential: true
      });
    } else {
      setSelectedPostId(post.id);
    }
  };

  // posts が更新されたら重なりを計算
  useEffect(() => {
    updateOverlaps();
  }, [posts]);



  // 🔑 位置が確定するまで Map を描画しない
  if (!location) {
    return <div className="h-[50vh]" />;
  }

  return (
    <>
      {isSystemDenied ? (
        <SystemPermissionModal
          isOpen={isPermissionModalOpen}
          onClose={() => setIsPermissionModalOpen(false)}
          type="location"
        />
      ) : (
        <PermissionModal
          isOpen={isPermissionModalOpen}
          onClose={() => setIsPermissionModalOpen(false)}
          type="location"
          onRetry={() => requestLocation(true)}
        />
      )}
      <div className="relative w-full h-[80vh] rounded-[48px] overflow-clip border border-surface/24">
        {/* Guide Dialog */}
        {!selectedPostId && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 px-6 py-3 bg-invert/64 backdrop-blur-xl rounded-full border border-surface/12 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700 ease-out pointer-events-none">
            <p className="text-surface font-bold text-[11px] tracking-widest whitespace-nowrap">
              気になる雲をタップ
            </p>
          </div>
        )}

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
          maxZoom={30}
          minZoom={4}
          dragRotate={false}
          pitchWithRotate={false}
          touchPitch={false}
          onLoad={updateOverlaps}
          onMove={updateOverlaps}
          onZoom={updateOverlaps}
          style={{
            width: "100%",
            height: "100%",
          }}
        >

          {/* 現在地マーカー */}
          <Marker {...location} anchor="center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-8 h-8 bg-brand/20 rounded-full animate-ping" />
              <div className="relative w-4 h-4 rounded-full bg-brand border-2 border-white shadow-lg" />
            </div>
          </Marker>

          {/* 投稿マーカー（サムネイル） */}
          {posts.map((post) => (
            <PostMarker
              key={post.id}
              post={post}
              onClick={() => handleMarkerClick(post)}
              isOverlapping={overlappingPostIds.has(post.id)}
              shouldDelay={posts.length > 1}
            />
          ))}


        </Map>

        {/* 撮影ボタン (フローティング) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-full p-3 bg-linear-to-b from-transparent to-surface">
          <Button
            onClick={() => router.push("/camera")}
            icon="camera"
            label="いい雲見つけた？"
            className="relative z-1 font-bold w-full h-20 bg-brand-accent text-surface"
          />
        </div>
      </div>

      {/* ポスト詳細モーダル */}
      <PostDetailModal
        postId={selectedPostId || ""}
        onClose={() => setSelectedPostId(null)}
      />
    </>

  );
}
