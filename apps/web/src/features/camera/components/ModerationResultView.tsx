import Button from "@/features/shared/components/Button";
import Icon from "@/features/shared/components/Icon";
import type { ImageModerateResponse } from "@cloudication/shared-types/image-moderate";

interface ModerationResultViewProps {
  result: ImageModerateResponse | null;
  onClose: () => void;
  onSwitchToPost: () => void;
}

const ModerationResultView = ({
  result,
  onClose,
  onSwitchToPost,
}: ModerationResultViewProps) => {
  if (!result) return null;

  return (
    <>
      {result.status === "rejected" && (
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-[32px] bg-alert/12 flex items-center justify-center">
            <Icon
              name="not_enough_clouds"
              size={40}
              className="text-alert"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-alert uppercase">
              投稿できない写真です！
            </h2>
            <p className="text-sm text-invert/60 font-medium leading-relaxed">
              {result.reasons.join(" / ")}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {result.suggestions.map((s) => (
              <p
                key={s}
                className="rounded-full bg-alert/8 px-4 py-1.5 text-xs font-bold text-alert border border-alert/10"
              >
                {s}
              </p>
            ))}
          </div>

          <Button
            onClick={onClose}
            icon="camera"
            className="w-full h-auto py-6 rounded-[24px]! bg-alert text-surface font-bold text-lg"
            label="撮り直す"
          />
        </div>
      )}


      {result.status === "accepted_with_warning" && (
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-[32px] bg-warning/12 flex items-center justify-center">
            <Icon name="face" size={40} className="text-warning" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-warning uppercase">
              ちょっと待って！
            </h2>
            <p className="text-sm text-invert/60 font-medium leading-relaxed">
              {result.reasons.join(" / ")}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {result.suggestions.map((s) => (
              <p
                key={s}
                className="rounded-full bg-warning/8 px-4 py-1.5 text-xs font-bold text-warning border border-warning/10"
              >
                {s}
              </p>
            ))}
          </div>

          <div className="flex w-full gap-3">
            <Button
              onClick={onClose}
              icon="camera"
              className="flex-2 py-6 whitespace-nowrap rounded-[24px]! bg-surface-muted text-invert/40 font-bold"
              label="撮り直す"
            />
            <Button
              onClick={onSwitchToPost}
              icon="post"
              className="flex-3 py-6 whitespace-nowrap rounded-[24px]! bg-warning text-surface font-bold text-lg"
              label="投稿する"
            />
          </div>
        </div>
      )}


      {result.status === "accepted" && (
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-[40px] bg-brand/12 flex items-center justify-center animate-pulse">
            <Icon name="post" size={40} className="text-brand" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-brand">
              素晴らしい空ですね！
            </h2>
            <p className="text-sm text-invert/60 font-medium leading-relaxed">
              名前をつけて投稿できます
            </p>
          </div>

          <Button
            onClick={onSwitchToPost}
            icon="cloudication"
            className="w-full py-6 rounded-xl bg-brand text-surface font-bold text-lg shadow-lg shadow-brand/20"
            label="投稿を作成"
          />
        </div>
      )}

    </>
  );
};

export default ModerationResultView;
