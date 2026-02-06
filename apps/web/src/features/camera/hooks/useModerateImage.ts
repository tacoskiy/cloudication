import { useState } from "react";

import { apiFetch } from "@/lib/apiFetch";
import { ImageModerateResponse } from "@cloudication/shared-types/image-moderate";

const useModerateImage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageModerateResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const moderateImage = async (image: Blob) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("image", image, "capture.jpg");

      const result = await apiFetch<ImageModerateResponse>("/api/image-moderate", {
        method: "POST",
        body: formData,
      });

      setAnalysisResult(result);
      if (result.status === "rejected") {
        setAnalysisError(result.reasons.join(", "));
      }
    } catch (err: any) {
      setAnalysisError(err.message || "解析に失敗しました");
      if (err.status === "rejected") {
        setAnalysisResult(err);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    analysisResult,
    analysisError,
    moderateImage,
  };
};

export default useModerateImage;