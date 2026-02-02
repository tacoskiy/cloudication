// CloudPost definitions based on backend/src/routes/cloudPosts.ts

export interface CloudPost {
  id: string;
  content: string;
  image_url: string;
  lat: number | null;
  lng: number | null;
  expires_at: string | Date | null;
  likes_count: number;
}

export interface CreateCloudPostRequest {
  image_token: string;
  content: string;
  lat: number;
  lng: number;
  client_id: string;
}

export interface CreateCloudPostResponse {
  post_id: string;
  image_url: string;
  expires_at: string | null;
}
