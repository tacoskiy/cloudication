import { CloudPost } from "@cloudication/shared-types/cloud-post";

export const MOCK_POSTS: CloudPost[] = [
  // --- 絶景・地方セクション ---
  {
    id: "mock-fuji",
    content: "富士山頂から。雲海が足元に広がり、まるで天界にいるような神々しい景色です。一生の思い出になりました。",
    image_url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1000&auto=format&fit=crop",
    lat: 35.3606,
    lng: 138.7274,
    expires_at: null,
    likes_count: 452,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-hokkaido",
    content: "美瑛のパッチワークの路。広い空にぽっかりと浮かぶ白い雲が、北海道らしい開放感を演出しています。",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop",
    lat: 43.5901,
    lng: 142.4566,
    expires_at: null,
    likes_count: 231,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-okinawa",
    content: "宮古島のブルーチャージ。積乱雲が夏本番を感じさせます。海の色とのコントラストが最高！",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
    lat: 24.8055,
    lng: 125.2762,
    expires_at: null,
    likes_count: 312,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-yakushima",
    content: "屋久島の原生林を抜けた先。湿り気を帯びた厚い雲が、神秘的な島の雰囲気を醸し出しています。",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop",
    lat: 30.3447,
    lng: 130.5126,
    expires_at: null,
    likes_count: 156,
    created_at: new Date().toISOString(),
  },

  // --- 都心密集セクション (渋谷周辺で重なり検知をテスト) ---
  {
    id: "mock-shibuya-1",
    content: "渋谷スクランブル交差点。都会の喧騒と、その上に広がる真っ白な入道雲。不思議な対比です。",
    image_url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1000&auto=format&fit=crop",
    lat: 35.6595,
    lng: 139.7005,
    expires_at: null,
    likes_count: 89,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-shibuya-2",
    content: "MIYASHITA PARKの屋上から。ビル群の向こう側に沈む夕日と、オレンジ色に染まる巻雲が綺麗。",
    image_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000&auto=format&fit=crop",
    lat: 35.6605, // 非常に近い
    lng: 139.7015,
    expires_at: null,
    likes_count: 45,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-shibuya-3",
    content: "ハチ公像近くで見上げた空。うろこ雲が空一面に広がっていて、本格的な秋の訪れを感じました。",
    image_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop",
    lat: 35.6590, // 重なる距離
    lng: 139.7000,
    expires_at: null,
    likes_count: 23,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-shibuya-4",
    content: "セルリアンタワー方面。高い建物が雲を切り取っているような、面白い構図になりました。",
    image_url: "https://images.unsplash.com/photo-1444464666168-49d633b867ad?q=80&w=1000&auto=format&fit=crop",
    lat: 35.6585, // 重なる距離
    lng: 139.6990,
    expires_at: null,
    likes_count: 67,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-shinjuku",
    content: "東京都庁の展望台から。新宿のビル群が、厚い雲の隙間から差し込む光（天使のはしご）に照らされています。",
    image_url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1000&auto=format&fit=crop",
    lat: 35.6896,
    lng: 139.6921,
    expires_at: null,
    likes_count: 198,
    created_at: new Date().toISOString(),
  }
];
