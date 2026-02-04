export type AnalysisStatus = "accepted" | "accepted_with_warning" | "rejected";

export interface AnalysisResponse {
  status: AnalysisStatus;
  message: string;
  reasons: string[];
  suggestions: string[];
  image_token: string | null;
  preview_url: string | null;
  analysis: {
    cloud_ratio: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const analyzeImage = async (imageBlob: Blob): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append("image", imageBlob, "capture.jpg");

  const response = await fetch(`${API_URL}/api/images/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "解析に失敗しました");
  }

  return response.json();
};
