import type { ImageModerateResult } from "@cloudication/shared-types/image-moderate";

const CLOUD_RATIO_THRESHOLD = 0.3;

type Input = {
  cloudRatio: number;
  skyRatio: number;
  hasPerson: boolean;
  isAdult: boolean;
  isGory: boolean;
};

export function moderateImage(input: Input): ImageModerateResult {
  const reasons: string[] = [];
  const suggestions: string[] = [];

  if (input.isAdult || input.isGory) {
    return {
      status: "rejected",
      reasons: ["不適切な内容の可能性があります"],
      suggestions: ["空や雲を撮影してください"],
      metrics: { cloudRatio: input.cloudRatio, skyRatio: input.skyRatio, hasPerson: input.hasPerson },
    };
  }

  if (input.cloudRatio < CLOUD_RATIO_THRESHOLD && input.skyRatio < CLOUD_RATIO_THRESHOLD) {
    return {
      status: "rejected",
      reasons: ["空や雲が十分に写っていません"],
      suggestions: ["空や雲が主になる構図で撮影してください"],
      metrics: { cloudRatio: input.cloudRatio, skyRatio: input.skyRatio, hasPerson: input.hasPerson },
    };
  }

  if (input.hasPerson) {
    reasons.push("人物が写っている可能性があります");
    suggestions.push("人物が写らない構図で撮影してください");
    suggestions.push("そのまま投稿することも可能です");
  }

  return {
    status: reasons.length > 0 ? "accepted_with_warning" : "accepted",
    reasons,
    suggestions,
    metrics: { cloudRatio: input.cloudRatio, skyRatio: input.skyRatio, hasPerson: input.hasPerson },
  };
}
