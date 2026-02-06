"use client";

import { Marker } from "react-map-gl/mapbox";
import { CloudPost } from "@cloudication/shared-types/cloud-post";

interface PostMarkerProps {
  post: CloudPost;
  onClick: (postId: string) => void;
}

const PostMarker = ({ post, onClick }: PostMarkerProps) => {
  if (post.lat === null || post.lng === null) return null;

  return (
    <Marker
      latitude={post.lat}
      longitude={post.lng}
      anchor="bottom"
    >
      <div
        className="group relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
        onClick={() => onClick(post.id)}
      >
        {/* 雲型マーカー枠 (SVG) */}
        <div className="relative w-16 h-[63px] transition-transform duration-300 group-hover:scale-120 group-hover:-translate-y-2 drop-shadow-2xl">
          <svg width="364" height="360" viewBox="0 0 364 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
            <path d="M194.963 0C263.773 0 319.556 55.7823 319.556 124.593C319.556 126.032 320.308 127.367 321.533 128.123C347.019 143.87 364 172.046 364 204.223C364 253.598 323.975 293.622 274.604 293.628L190 293.629C185.582 293.629 182 297.211 182 301.629V353.223C182 358.693 175.28 361.31 171.58 357.281L115.73 296.452C113.725 294.268 110.974 292.928 108.035 292.537C47.0517 284.439 3.7869e-05 232.234 0 169.037C0.000110938 111.153 39.4534 62.517 92.9505 48.5062C95.6121 47.8092 97.9987 46.3062 99.775 44.2051C122.598 17.2091 156.759 2.29115e-05 194.963 0Z" fill="white" />
          </svg>
          {/* サムネイル画像（既存の cloud-mask を使用） */}
          <div className="absolute top-[6%] left-[8%] right-[8%] bottom-[25%] overflow-hidden mask-cloud">
            <img
              src={post.image_url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* ホバー時の簡易表示 */}
        <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 whitespace-nowrap">
            <p className="text-[10px] text-white font-bold leading-tight">
              {post.content.length > 15 ? post.content.slice(0, 15) + "..." : post.content}
            </p>
          </div>
        </div>
      </div>
    </Marker>
  );
};

export default PostMarker;
