import Button from "@/components/common/Button";
import Icon from "@/components/common/Icon";
import { ImageModerateResponse } from "@cloudication/shared-types/image-moderate";

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
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-2xl bg-alert/12 p-4">
            <Icon
              name="not_enough_clouds"
              size={24}
              className="h-12 w-12 text-alert"
            />
          </div>

          <h2 className="text-center text-lg font-bold text-alert">
            {result.reasons.join(" / ")}
          </h2>

          <div className="flex flex-col items-start gap-2">
            {result.suggestions.map((s) => (
              <p
                key={s}
                className="rounded-3xl bg-alert/12 px-4 py-2 text-sm font-medium text-alert"
              >
                {s}
              </p>
            ))}
          </div>

          <Button
            onClick={onClose}
            icon="camera"
            className="w-full rounded-xl bg-alert py-6 font-bold"
            label="撮り直す"
          />
        </div>
      )}

      {result.status === "accepted_with_warning" && (
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-2xl bg-warning/12 p-4">
            <Icon name="face" size={24} className="h-12 w-12 text-warning" />
          </div>

          <h2 className="text-center text-lg font-bold text-warning">
            {result.reasons.join(" / ")}
          </h2>

          <div className="flex flex-col items-start gap-2">
            {result.suggestions.map((s) => (
              <p
                key={s}
                className="rounded-3xl bg-warning/12 px-4 py-2 text-sm font-medium text-warning"
              >
                {s}
              </p>
            ))}
          </div>

          <div className="flex w-full gap-2">
            <Button
              onClick={onSwitchToPost}
              icon="post"
              className="w-full rounded-xl bg-warning/12 py-6 font-bold text-warning"
              label="投稿する"
            />
            <Button
              onClick={onClose}
              icon="camera"
              className="w-full rounded-xl bg-warning py-6 font-bold text-surface"
              label="撮り直す"
            />
          </div>
        </div>
      )}

      {result.status === "accepted" && (
        <div className="flex flex-col gap-6">
          <h2 className="text-center text-lg font-bold text-invert">
            投稿できます
          </h2>

          <Button
            onClick={onSwitchToPost}
            icon="post"
            className="w-full rounded-xl py-6 font-bold bg-brand text-surface"
            label="投稿する"
          />
        </div>
      )}
    </>
  );
};

export default ModerationResultView;
