export interface ToggleLikeRequest {
  client_id: string;
}

export interface ToggleLikeResponse {
  liked: boolean;
  likes_count: number;
}
