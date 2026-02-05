import Button from "@/components/common/Button";
import Icon from "@/components/common/Icon";
import { ImageModerateResponse } from "@cloudication/shared-types/image-moderate";

interface ModerateResultModalProps {
  result: ImageModerateResponse | null;
  onClose: () => void;
  isOpen: boolean;
}

const ModerateResultModal = ({
  result,
  onClose,
  isOpen,
}: ModerateResultModalProps) => {
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-opacity duration-300
        ${isOpen ? "opacity-100 bg-black/50" : "pointer-events-none opacity-0"}
      `}
    >
      <article
        className={`
          w-full max-w-sm rounded-3xl bg-white p-4
          transition-all duration-300 ease-out
          ${isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2"}
        `}
      >
        {!result && null}

        {result?.status === "rejected" && (
          <div className="flex flex-col items-center gap-6">
            <div className="p-4 rounded-2xl bg-alert/12">
              <Icon name="not_enough_clouds" size={24} className="text-alert w-12 h-12"/>
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

        {result?.status === "accepted_with_warning" && (
          <div className="flex flex-col items-center gap-6">
            <div className="p-4 rounded-2xl bg-warning/12">
              <Icon name="face" size={24} className="text-warning w-12 h-12"/>
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
            <div className="flex gap-2 w-full">
            <Button
              onClick={onClose}
              icon="post"
              className="w-full rounded-xl bg-warning/12 py-6 text-warning font-bold"
              label="投稿する"
            />
            <Button
              onClick={onClose}
              icon="camera"
              className="w-full rounded-xl bg-warning py-6 font-bold"
              label="撮り直す"
            />
            </div>
          </div>
        )}

        {result?.status === "accepted" && (
          <h2 className="text-center text-lg font-bold">
            投稿できます
          </h2>
        )}
      </article>
    </div>
  );
};

export default ModerateResultModal;
