export type ImageModerateStatus = 
  | "accepted"
  | "accepted_with_warning"
  | "rejected";

export enum ImageModerateReasonCode {
  NO_IMAGE = "NO_IMAGE",
  INAPPROPRIATE_CONTENT = "INAPPROPRIATE_CONTENT",
  NO_CLOUD_WITH_PERSON = "NO_CLOUD_WITH_PERSON",
  INSUFFICIENT_CLOUD = "INSUFFICIENT_CLOUD",
  PERSON_DETECTED = "PERSON_DETECTED",
  UPLOAD_FAILED = "UPLOAD_FAILED",
  ANALYSIS_FAILED = "ANALYSIS_FAILED",
}

export type ImageModerateMetrics = {
  cloudRatio: number;
  hasPerson: boolean;
};

export type ImageModerateResult = {
  status: ImageModerateStatus;
  reasons: string[];
  suggestions: string[];
  metrics?: ImageModerateMetrics;
};

export type ImageModerateResponse = ImageModerateResult & {
  image_token?: string;
  preview_url?: string;
};